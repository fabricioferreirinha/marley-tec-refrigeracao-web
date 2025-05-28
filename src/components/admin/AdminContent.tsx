
import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

interface Settings {
  businessHours: string;
  emergencyService: boolean;
  serviceRadius: string;
  specializations: string[];
}

const AdminContent = () => {
  const [settings, setSettings] = useState<Settings>({
    businessHours: 'Segunda a Sexta: 8h às 18h | Sábado: 8h às 12h',
    emergencyService: true,
    serviceRadius: '30km de Maricá',
    specializations: [
      'Ar-condicionado Split',
      'Geladeiras e Freezers',
      'Máquinas de Lavar',
      'Câmaras Frigoríficas'
    ]
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações salvas com sucesso!');
    }, 1000);
  };

  const handleSpecializationChange = (index: number, value: string) => {
    const newSpecializations = [...settings.specializations];
    newSpecializations[index] = value;
    setSettings(prev => ({ ...prev, specializations: newSpecializations }));
  };

  const addSpecialization = () => {
    setSettings(prev => ({
      ...prev,
      specializations: [...prev.specializations, '']
    }));
  };

  const removeSpecialization = (index: number) => {
    setSettings(prev => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-gray-900">Configurações Gerais</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário de Funcionamento
          </label>
          <input
            type="text"
            value={settings.businessHours}
            onChange={(e) => setSettings(prev => ({ ...prev, businessHours: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Raio de Atendimento
          </label>
          <input
            type="text"
            value={settings.serviceRadius}
            onChange={(e) => setSettings(prev => ({ ...prev, serviceRadius: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emergency"
              checked={settings.emergencyService}
              onChange={(e) => setSettings(prev => ({ ...prev, emergencyService: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="emergency" className="ml-2 text-sm font-medium text-gray-700">
              Atendimento de emergência
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Especializações
          </label>
          <div className="space-y-2">
            {settings.specializations.map((spec, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => handleSpecializationChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeSpecialization(index)}
                  className="text-red-600 hover:text-red-800 px-2 py-1"
                >
                  Remover
                </button>
              </div>
            ))}
            <button
              onClick={addSpecialization}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Adicionar especialização
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
