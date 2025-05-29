import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const anuncios = await prisma.anuncio.findMany({
      where: {
        status: 'ATIVO'
      },
      orderBy: {
        dataPublicacao: 'desc'
      }
    });

    return NextResponse.json(anuncios);
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar anúncios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { titulo, descricao, preco, imagens, contato } = data;

    // Upload das imagens
    const imageUrls = await Promise.all(
      imagens.map((img: string) => uploadImage(img))
    );

    const anuncio = await prisma.anuncio.create({
      data: {
        titulo,
        descricao,
        preco,
        imagens: imageUrls,
        contato,
      },
    });

    return NextResponse.json(anuncio);
  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    return NextResponse.json(
      { error: 'Erro ao criar anúncio' },
      { status: 500 }
    );
  }
} 