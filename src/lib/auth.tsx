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
  renewSession?: () => void
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
  const [initialized, setInitialized] = useState(false)
  const [hasShownInitialLogin, setHasShownInitialLogin] = useState(false)
  
  // Sistema de timeout para sessão administrativa
  const [lastActivity, setLastActivity] = useState<number>(Date.now())
  const [sessionWarningShown, setSessionWarningShown] = useState(false)
  
  // Configurações de timeout (em minutos)
  const ADMIN_SESSION_TIMEOUT = 30 // 30 minutos
  const WARNING_TIME = 25 // Aviso aos 25 minutos

  // Inicializar cliente Supabase
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const isAdmin = userRole === 'ADMIN'
  
  // Função para renovar atividade
  const renewActivity = () => {
    setLastActivity(Date.now())
    setSessionWarningShown(false)
  }
  
  // Função para logout forçado por timeout
  const forceLogout = async () => {
    toast.error('Sessão expirada por segurança. Faça login novamente.')
    await signOut()
  }
  
  // Log quando o isAdmin muda - apenas em páginas admin
  useEffect(() => {
    const isAdminPage = window.location.pathname.startsWith('/admin')
    if (isAdminPage && initialized) {
      console.log(`🔐 [AuthContext] isAdmin atualizado:`, isAdmin, `(userRole: ${userRole})`)
    }
  }, [isAdmin, userRole, initialized])

  // Sistema de monitoramento de atividade e timeout para administradores
  useEffect(() => {
    if (!isAdmin || !user) return

    // Eventos que renovam a atividade
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      renewActivity()
    }

    // Adicionar listeners de atividade
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Timer para verificar timeout
    const interval = setInterval(() => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivity
      const minutesSinceActivity = timeSinceActivity / (1000 * 60)

      // Mostrar aviso aos 25 minutos
      if (minutesSinceActivity >= WARNING_TIME && !sessionWarningShown) {
        setSessionWarningShown(true)
        toast.warning(
          `Sua sessão expirará em ${ADMIN_SESSION_TIMEOUT - WARNING_TIME} minutos. Clique em qualquer lugar para renovar.`,
          {
            duration: 10000,
            action: {
              label: 'Renovar',
              onClick: renewActivity
            }
          }
        )
      }

      // Forçar logout aos 30 minutos
      if (minutesSinceActivity >= ADMIN_SESSION_TIMEOUT) {
        forceLogout()
      }
    }, 60000) // Verificar a cada minuto

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      clearInterval(interval)
    }
  }, [isAdmin, user, lastActivity, sessionWarningShown])

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
        setUserRole(null)
      }
    } catch (error) {
      console.error('❌ [AuthContext] Erro ao buscar role do usuário:', error)
      setUserRole(null)
    }
    return null
  }

  // Criar usuário automaticamente se não existir - apenas quando necessário
  const ensureUserExists = async (user: User) => {
    // Só executar se estiver em uma página que precisa de autenticação
    const isAdminPage = window.location.pathname.startsWith('/admin')
    if (!isAdminPage) {
      return null
    }

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
        // Se deu erro 409 (usuário já exists), tentar buscar novamente
        if (createResponse.status === 409) {
          console.log(`♻️ [AuthContext] Usuário já existe, tentando buscar role novamente...`)
          return await fetchUserRole(user.id)
        }
        
        console.error(`❌ [AuthContext] Erro ao criar usuário:`, createResponse.status)
        setUserRole(null)
        return null
      }
    } catch (error) {
      console.error('❌ [AuthContext] Erro ao verificar/criar usuário:', error)
      setUserRole(null)
      return null
    }
  }

  const refreshUserRole = async () => {
    if (user) {
      await ensureUserExists(user)
    }
  }

  // Função para renovar sessão manualmente
  const renewSession = () => {
    renewActivity()
    toast.success('Sessão renovada com sucesso!')
  }

  useEffect(() => {
    let mounted = true
    
    // Verificar se há uma sessão ativa
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Erro ao obter sessão:', error.message)
        } else if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          
          // Só verificar role se tiver usuário e estiver em página que precisa
          if (session?.user) {
            const isAdminPage = window.location.pathname.startsWith('/admin')
            if (isAdminPage) {
              await ensureUserExists(session.user)
            }
          } else {
            setUserRole(null)
          }
        }
      } catch (error) {
        console.error('Erro inesperado ao obter sessão:', error)
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    getSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        // Só logar eventos em páginas admin
        const isAdminPage = window.location.pathname.startsWith('/admin')
        if (isAdminPage) {
          console.log('Auth state changed:', event, session?.user?.email)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (session?.user) {
          // Só verificar role se estiver em página que precisa
          if (isAdminPage) {
            await ensureUserExists(session.user)
          }
        } else {
          setUserRole(null)
        }

        // Controle muito restrito de toasts - apenas para ações deliberadas do usuário
        if (event === 'SIGNED_IN' && !hasShownInitialLogin) {
          // Só mostrar se for um login deliberado (não sessão inicial)
          if (initialized) {
            toast.success('Login realizado com sucesso!')
            setLastToastEvent('SIGNED_IN')
          }
          setHasShownInitialLogin(true)
        } else if (event === 'SIGNED_OUT') {
          toast.success('Logout realizado com sucesso!')
          setLastToastEvent('SIGNED_OUT')
          setHasShownInitialLogin(false)
        }
        
        // Resetar flags para outros eventos
        if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          // Estes eventos não devem gerar toasts
          setLastToastEvent(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
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
            full_name: name,
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.')
      }

      return { success: true }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return { success: false, error: 'Erro interno do servidor' }
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
        let errorMessage = 'Erro no login'
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Confirme seu email antes de fazer login'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos'
        }
        
        return { success: false, error: errorMessage }
      }

      if (data.user) {
        // Aguardar um pouco para garantir que o contexto seja atualizado
        await new Promise(resolve => setTimeout(resolve, 500))
        return { success: true }
      }

      return { success: false, error: 'Erro desconhecido no login' }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: 'Erro interno do servidor' }
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
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    isAdmin,
    refreshUserRole,
    renewSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
} 