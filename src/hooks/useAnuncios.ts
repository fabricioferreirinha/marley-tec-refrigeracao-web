import { useState } from 'react';
import { toast } from 'sonner';

interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  imagens: string[];
  status: 'ATIVO' | 'INATIVO' | 'ARQUIVADO';
  dataPublicacao: string;
  contato: string;
}

interface CreateAnuncioData {
  titulo: string;
  descricao: string;
  preco: number;
  imagens: string[];
  contato: string;
}

export function useAnuncios() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAnuncios = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/anuncios');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar anúncios');
      }

      setAnuncios(data);
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
      toast.error('Falha ao carregar anúncios');
    } finally {
      setIsLoading(false);
    }
  };

  const createAnuncio = async (data: CreateAnuncioData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/anuncios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar anúncio');
      }

      setAnuncios(prev => [result, ...prev]);
      toast.success('Anúncio criado com sucesso!');
      return result;
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      toast.error('Falha ao criar anúncio');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    anuncios,
    isLoading,
    fetchAnuncios,
    createAnuncio,
  };
} 