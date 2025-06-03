import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // No-op for server component
          },
          remove(name: string, options: any) {
            // No-op for server component
          },
        },
      }
    )

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo fornecido' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = `${Date.now()}_${file.name}`
    const filePath = `uploads/${fileName}`

    const { data, error } = await supabase.storage
      .from('classified-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        duplex: 'half',
      })

    if (error) {
      console.error('Erro no upload:', error)
      return NextResponse.json(
        { error: 'Erro no upload do arquivo' },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = supabase.storage
      .from('classified-images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      message: 'Upload realizado com sucesso',
      url: publicUrlData.publicUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            // No-op for server component
          },
          remove(name: string, options: any) {
            // No-op for server component
          },
        },
      }
    )

    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json(
        { error: 'Nome do arquivo não fornecido' },
        { status: 400 }
      )
    }

    // Remover arquivo do Supabase Storage
    const { error } = await supabase.storage
      .from('classified-images')
      .remove([fileName])

    if (error) {
      console.error('Erro ao remover arquivo:', error)
      return NextResponse.json(
        { error: 'Erro ao remover imagem' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Imagem removida com sucesso'
    })

  } catch (error) {
    console.error('Erro ao remover imagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 