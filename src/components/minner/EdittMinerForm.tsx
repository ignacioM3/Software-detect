
import React from 'react';
import { FaSave, FaServer } from 'react-icons/fa';
import { MinerCreateForm, Minners } from '../../types';
import { useForm } from 'react-hook-form';
import flashy from '@pablotheblink/flashyjs';

interface EditMinerFormProps {
  setEditingId: (id: string | null) => void;
  miner: Minners;
  onMinerUpdated: (updatedMiner: Minners) => void;
}

export const EditMinerForm = React.memo(({ setEditingId, miner, onMinerUpdated }: EditMinerFormProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const initialValues = React.useMemo(() => ({
    name: miner.name || '',
    idModel: miner.idModel || ''
  }), [miner.name, miner.idModel]);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  })

  const handleEditMiner = async (formData: MinerCreateForm) => {
    if (isSubmitting) return; // Evitar múltiples envíos
    
    setIsSubmitting(true);
    const updateMiner = {
      ...formData,
      _id: miner._id
    }
    
    try {
      const res = await window.electronAPI.updateMiner(updateMiner);
      if (res.ok) {
        
        const updatedMiner = {
          ...miner,
          ...formData
        };
        onMinerUpdated(updatedMiner);
        setEditingId(null);
        
       
        flashy.success('Minero actualizado correctamente', {
          duration: 3000,
          position: 'top-right'
        });
      } else {
        flashy.error('Error al actualizar el minero', {
          duration: 4000,
          position: 'top-right'
        });
        console.error("Error al actualizar el minero");
      }
    } catch (error) {
      flashy.error('Error de conexión al actualizar el minero', {
        duration: 4000,
        position: 'top-right'
      });
      console.error("Error al actualizar el minero:", error);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1 rounded-2xl my-4 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaServer className="text-blue-400" />
            Editar Minero
          </h2>
        </div>

        <form 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit(handleEditMiner)}
          >
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                <FaServer className="text-blue-400" />
                Nombre del minero * {errors.name && <span className="text-red-500 font-bold uppercase ml-2">{errors.name.message}</span>}
              </label>
              <input
                type="text"
                id="name"
                {...register('name', {
                  required: 'El nombre es obligatorio'
                })}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>



          </div>
          <div className="space-y-4">


            <div className="flex flex-col">
              <label className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                <FaServer className="text-blue-400" />
                ID Modelo
              </label>
              <input
                type="text"
                id="model"
                {...register('idModel')}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>



          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-4 py-2 border cursor-pointer border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});