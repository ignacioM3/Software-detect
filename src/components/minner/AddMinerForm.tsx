
import React from 'react';
import { FaSave, FaServer } from 'react-icons/fa';
import { MinerCreateForm } from '../../types';
import { useForm } from 'react-hook-form';
import flashy from '@pablotheblink/flashyjs';
import useGlobal from '../../hooks/useGlobal';

interface AddMinerProps {
  setIsAdding: (isAdding: boolean) => void;
}

export const AddMinerForm = React.memo(({ setIsAdding }: AddMinerProps) => {
  const initialValues = {
    name: "",
    idModel: ""
  }
  const { currentClient, setMinerSelected } = useGlobal()
  const { handleSubmit, formState: { errors }, register, reset } = useForm({
    defaultValues: initialValues
  })

  const handleCreateMiner = async (formState: MinerCreateForm) => {
    if (!currentClient?._id) {
      flashy.error("No hay cliente seleccionado");
      return;
    }
    const newMiner = {
      ...formState,
      reports: [],
      _id: crypto.randomUUID(),
      clientId: currentClient._id
    }

    const res = await window.electronAPI.saveMiner(newMiner)
    if (res.ok) {
      reset(initialValues);
      flashy.success("Minero agregado correctamente");
      setIsAdding(false)
      setMinerSelected(prevMiner => [...prevMiner, newMiner])

    } else {
      flashy.error("error al agregar cliente")
    }

  }
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1 rounded-2xl my-4 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaServer className="text-blue-400" />
            Agregando Minero
          </h2>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit(handleCreateMiner)}
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
                {...register("name", {
                  required: "El nombre es obligatorio"
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
                {...register("idModel")}
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>



          </div>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border cursor-pointer border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"

              className="px-4 py-2 bg-blue-600 cursor-pointer rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              Crear Minero
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});