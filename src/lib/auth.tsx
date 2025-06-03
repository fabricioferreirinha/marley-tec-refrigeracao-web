"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  userRole: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  isAdmin: boolean
  refreshUserRole: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [lastToastEvent, setLastToastEvent] = useState<string | null>(null)

  // Inicializar cliente Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const isAdmin = userRole === 'ADMIN'
  
  // Log quando o isAdmin muda
  useEffect(() => {
    console.log(`🔐 [AuthContext] isAdmin atualizado:`, isAdmin, `(userRole: ${userRole})`)
  }, [isAdmin, userRole])

  // Buscar o role do usuário no banco
  const fetchUserRole = async (userId: string) => {
    try {
      console.log(`🔍 [AuthContext] Buscando role para usuário: ${userId}`)
      const response = await fetch(`/api/users/${userId}/role`)
      if (response.ok) {
        const data = await response.json()
        console.log(`✅ [AuthContext] Role recebido:`, data.role)
        setUserRole(data.role)
        return data.role
      } else {
        console.error(`❌ [AuthContext] Erro na resposta da API:`, response.status, response.statusText)
      }
    } catch (error) {
      console.error('❌ [AuthContext] Erro ao buscar role do usuário:', error)
    }
    return null
  }

  // Criar usuário automaticamente se não existir
  const ensureUserExists = async (user: User) => {
    try {
      console.log(`🔍 [AuthContext] Verificando se usuário existe: ${user.email} (ID: ${user.id})`)
      
      // Primeiro tentar buscar o role (que também verifica se existe)
      const roleResponse = await fetch(`/api/users/${user.id}/role`)
      console.log(`📡 [AuthContext] Response da API role: ${roleResponse.status}`)
      
      if (roleResponse.ok) {
        const data = await roleResponse.json()
        console.log(`✅ [AuthContext] Usuário já existe com role:`, data.role)
        setUserRole(data.role)
        return data.role
      }
      
      // Se chegou aqui, provavelmente o usuário não existe na tabela
      console.log(`🆕 [AuthContext] Usuário não existe na tabela, criando...`)
      console.log(`📝 [AuthContext] Dados do usuário:`, {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'
      })
      
      const createResponse = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
        }),
      })

      console.log(`📡 [AuthContext] Response da criação: ${createResponse.status}`)
      
      if (createResponse.ok) {
        const userData = await createResponse.json()
        console.log(`✅ [AuthContext] Usuário criado com sucesso:`, userData.user?.role || 'undefined')
        const newRole = userData.user?.role || 'USER'
        setUserRole(newRole)
        return newRole
      } else {
        const errorText = await createResponse.text()
        console.error(`❌ [AuthContext] Erro ao criar usuário:`, createResponse.status, errorText)
        
        // Se deu erro 409 (usuário já exists), tentar buscar novamente
        if (createResponse.status === 409) {
          console.log(`♻️ [AuthContext] Usuário já existe, tentando buscar role novamente...`)
          return await fetchUserRole(user.id)
        }
        
        // Tentar buscar novamente como fallback
        return await fetchUserRole(user.id)
      }
    } catch (error) {
      console.error('❌ [AuthContext] Erro ao verificar/criar usuário:', error)
      // Fallback para buscar role
      return await fetchUserRole(user.id)
    }
  }

  const refreshUserRole = async () => {
    if (user) {
      await ensureUserExists(user)
    }
  }

  useEffect(() => {
    // Verificar se há uma sessão ativa
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Erro ao obter sessão:', error.message)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await ensureUserExists(session.user)
          }
        }
      } catch (error) {
        console.error('Erro inesperado ao obter sessão:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Usar ensureUserExists para criar usuário se não existir
          await ensureUserExists(session.user)
        } else {
          setUserRole(null)
        }
        
        setLoading(false)

        // Só mostrar toast para eventos reais de login/logout, não para mudanças internas
        if (event === 'SIGNED_IN' && lastToastEvent !== 'SIGNED_IN') {
          toast.success('Login realizado com sucesso!')
          setLastToastEvent('SIGNED_IN')
        } else if (event === 'SIGNED_OUT' && lastToastEvent !== 'SIGNED_OUT') {
          toast.success('Logout realizado com sucesso!')
          setLastToastEvent('SIGNED_OUT')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      // Registrar no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || '',
          }
        }
      })

      if (error) {
        console.error('Erro no cadastro:', error.message)
        
        let errorMessage = 'Erro ao criar conta. Tente novamente.'
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado.'
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.'
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido.'
        }
        
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        // Criar perfil do usuário no banco de dados
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: data.user.id,
              email: data.user.email,
              name: name || data.user.email?.split('@')[0],
            }),
          })

          if (!response.ok) {
            console.error('Erro ao criar perfil do usuário')
          }
        } catch (profileError) {
          console.error('Erro ao criar perfil:', profileError)
        }

        toast.success('Conta criada com sucesso! Verifique seu email para confirmar.')
      }

      return { success: true }
    } catch (error) {
      console.error('Erro inesperado no cadastro:', error)
      return { 
        success: false, 
        error: 'Erro inesperado. Tente novamente mais tarde.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Erro no login:', error.message)
        
        let errorMessage = 'Erro ao fazer login. Tente novamente.'
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos.'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.'
        }
        
        return { success: false, error: errorMessage }
      }

      return { success: true }
    } catch (error) {
      console.error('Erro inesperado no login:', error)
      return { 
        success: false, 
        error: 'Erro inesperado. Tente novamente mais tarde.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro no logout:', error.message)
        toast.error('Erro ao fazer logout')
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error)
      toast.error('Erro inesperado ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    isAdmin,
    refreshUserRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 