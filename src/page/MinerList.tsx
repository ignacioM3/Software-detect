import React, {  useState } from 'react';
import {
    FaArrowLeft,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaServer,
    FaInfoCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


import LoadingSpinner from '../components/styles/LoadingSpinner';
import { Minners } from '../types';
import { EditMinerForm } from '../components/minner/EdittMinerForm';
import useGlobal from '../hooks/useGlobal';
import flashy from '@pablotheblink/flashyjs';
import { AddMinerForm } from '../components/minner/AddMinerForm';

export function MinersList() {
  
    const [searchTerm, setSearchTerm] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const minersPerPage = 5;
    const navigate = useNavigate();
    const {minerSelected, loadingMiner, setMinerSelected} = useGlobal()
    

   
    

    const filteredMiners = minerSelected.filter(miner =>
        miner.name.toLocaleLowerCase().includes(searchTerm.toLowerCase())
        || miner.idModel.toLocaleLowerCase().includes(searchTerm.toLowerCase())
    )
    const indexOfLasMinner = currentPage * minersPerPage;
    const indexOfFirstMiner = indexOfLasMinner - minersPerPage;
    const currentMiners = filteredMiners.slice(indexOfFirstMiner, indexOfLasMinner)

    const totalPages = Math.ceil(filteredMiners.length / minersPerPage);

    const handleMinerUpdated = (updatedMiner: Minners) => {
        setMinerSelected(prevMiners => 
            prevMiners.map(miner => 
                miner._id === updatedMiner._id ? updatedMiner : miner
            )
        );
    };

    const handleDeleteMiner = async (minerId: string) => {
        try {
            const res = await window.electronAPI.deleteMiner(minerId);
            if(res.ok){
                  setMinerSelected(prevMiners => prevMiners.filter(miner => miner._id !== minerId));
            setShowDeleteConfirm(null);
            flashy.success('Minero eliminado correctamente')
            }else{
                flashy.error('Error al eliminar el minero')
            }
          
        } catch (error) {
            console.error('Error al eliminar el minero:', error);
        }
    }

    if (loadingMiner) {
        return (
            <div className='flex items-center justify-center min-h-screen flex-col gap-5'>
                <h1 className='text-center font-bold text-white text-xl'>Cargando mineros...</h1>
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6">
            <div className="flex items-center gap-3 pl-10">
                <div className="bg-indigo-600 p-3 rounded-md">
                    <FaServer className="text-2xl" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Miners</h1>
                    <p className="text-gray-400 text-sm">Listado de mineros registrados</p>
                </div>
            </div>
            <div className="w-full print:hidden pl-10 my-5">
                <button
                    className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
                    onClick={() => navigate(-1)}
                >
                    <FaArrowLeft />
                    Volver
                </button>
            </div>
            <div className="max-w-6xl mx-auto">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
                    {/* Cabecera */}
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                                    <FaServer className="text-white" />
                                    Gestión de Mineros
                                </h1>
                                <p className="text-blue-100 mt-1">
                                    Administra tu lista de mineros ASIC
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar mineros..."
                                        className="pl-10 pr-4 py-2 rounded-lg bg-blue-500/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <FaSearch className="absolute left-3 top-3 text-blue-200" />
                                </div>

                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 py-2 px-4 rounded-lg flex items-center gap-2 font-medium transition-colors"
                                >
                                    <FaPlus />
                                    <span>Nuevo Minero</span>
                                </button>
                            </div>
                        </div>
                    </div>



                    {/* Formulario para agregar nuevo minero */}
                           {isAdding && <AddMinerForm setIsAdding={setIsAdding} />} 

                    {/* Listado de mineros */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-750">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Minero
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        ID Modelo
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Reportes
                                    </th>

                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                    
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {currentMiners.length > 0 ? (
                                    currentMiners.map(miner => (
                                        <React.Fragment key={`miner-${miner._id}`}>
                                            <tr className="hover:bg-gray-750">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-900 rounded-full flex items-center justify-center text-indigo-400">
                                                            <FaServer />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-white">{miner.name}</div>

                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-200">{miner.name}</div>
                                                </td>
                                                <td className="px-10 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-200">{miner.reports.length}</div>
                                                </td>



                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                        type='button'
                                                            onClick={() => navigate(`/miner/${miner._id}`)}
                                                            className="text-blue-400 hover:text-blue-300 cursor-pointer p-2 bg-blue-900/30 rounded-lg"
                                                            title="Ver detalles"
                                                        >
                                                            <FaInfoCircle />
                                                        </button>
                                                        <button

                                                            className="text-blue-400 hover:text-blue-300 cursor-pointer p-2 bg-blue-900/30 rounded-lg"
                                                            title="Editar"
                                                            onClick={() => setEditingId(miner._id)}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={(() => setShowDeleteConfirm(miner._id))}
                                                            className="text-red-400 hover:text-red-300 cursor-pointer p-2 bg-red-900/30 rounded-lg"
                                                            title="Eliminar"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    
                                                  <button className='bg-gray-500 text-white p-2 rounded-md cursor-pointer hover:bg-gray-600 transition-colors'>Seleccionar</button>
                                                </td>
                                            </tr>

                                            {/* Modo de edición */}
                                            {editingId === miner._id && (
                                                <tr>
                                                    <td colSpan={7}>
                                                        <EditMinerForm
                                                        setEditingId={setEditingId}
                                                        miner={miner}
                                                        onMinerUpdated={handleMinerUpdated}
                                                        />
                                                    </td>
                                                </tr>
                                            )} 


                                            {showDeleteConfirm === miner._id && (
                                                <tr className="bg-red-900/20">
                                                    <td colSpan={7} className="px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-red-300">
                                                                ¿Estás seguro de que deseas eliminar el minero {miner.name}?
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <button
                                                                    className="cursor-pointer px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700"
                                                                  onClick={() => setShowDeleteConfirm(null)}
                                                                >
                                                                    Cancelar
                                                                </button>
                                                                <button
                                                                    className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                                      onClick={() => handleDeleteMiner(miner._id)}
                                                                >
                                                                    Eliminar Minero
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center">
                                            <div className="text-gray-500">
                                                {searchTerm ? (
                                                    <p>No se encontraron mineros que coincidan con "{searchTerm}"</p>
                                                ) : (
                                                    <p>No hay mineros registrados</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pie de tabla */}
                    <div className="bg-gray-750 px-6 py-4 border-t border-gray-700">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-400">
                                Total <span className="font-medium text-white">{minerSelected.length}</span>{' '}
                                mineros
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    className="px-3 py-1 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>
                                <span className="text-sm text-gray-400"> Página {currentPage} de {totalPages}</span>
                                <button
                                    className="px-3 py-1 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Pie de página */}
                <footer className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>Sistema de monitoreo ASIC v1.0.0 • Última actualización: Hoy 17:42</p>
                    <p className="mt-2">Estado: <span className="text-green-500">Todos los sistemas operativos</span></p>
                </footer>
            </div>
        </div>
    );
}