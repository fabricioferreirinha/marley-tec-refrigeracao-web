
import React, { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface SiteContent {
  logo: string;
  heroImage: string;
  aboutImage: string;
  whatsappNumber: string;
  address: string;
  googleProfile: string;
  companyName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
}

const AdminMedia = () => {
  const [content, setContent] = useState<SiteContent>({
    logo: '',
    heroImage: '',
    aboutImage: '',
    whatsappNumber: '5521999999999',
    address: 'Maricá - RJ',
    googleProfile: 'https://g.co/kgs/3p9v632',
    companyName: 'Marley-Tec Refrigeração',
    heroTitle: 'Marley-Tec Refrigeração',
    heroSubtitle: 'Especialistas em refrigeração e climatização em Maricá-RJ',
    aboutText: 'Com mais de 10 anos de experiência no mercado, a Marley-Tec é especializada em manutenção e instalação de equipamentos de refrigeração e climatização.'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedContent = localStorage.getItem('site_content');
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('site_content', JSON.stringify(content));
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Conteúdo salvo com sucesso!');
    }, 1000);
  };

  const handleChange = (field: keyof SiteContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleChange(name as keyof SiteContent, value);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Gerenciar Conteúdo e Mídia</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Imagens do Site */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-4">Imagens do Site</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageUpload
              label="Logo da Empresa"
              currentImages={content.logo ? [content.logo] : []}
              onImagesSelect={(urls) => handleChange('logo', urls[0] || '')}
              multiple={false}
            />
            <ImageUpload
              label="Imagem Principal (Hero)"
              currentImages={content.heroImage ? [content.heroImage] : []}
              onImagesSelect={(urls) => handleChange('heroImage', urls[0] || '')}
              multiple={false}
            />
            <ImageUpload
              label="Imagem Sobre Nós"
              currentImages={content.aboutImage ? [content.aboutImage] : []}
              onImagesSelect={(urls) => handleChange('aboutImage', urls[0] || '')}
              multiple={false}
            />
          </div>
        </div>

        {/* Informações da Empresa */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-4">Informações da Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                name="companyName"
                value={content.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número do WhatsApp
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={content.whatsappNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5521999999999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={content.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perfil do Google
              </label>
              <input
                type="url"
                name="googleProfile"
                value={content.googleProfile}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Textos do Site */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-4">Textos do Site</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título Principal (Hero)
              </label>
              <input
                type="text"
                name="heroTitle"
                value={content.heroTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtítulo (Hero)
              </label>
              <input
                type="text"
                name="heroSubtitle"
                value={content.heroSubtitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Sobre a Empresa
              </label>
              <textarea
                name="aboutText"
                value={content.aboutText}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMedia;
