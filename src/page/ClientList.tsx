import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUser, FaArrowLeft } from 'react-icons/fa';
import { MdPersonSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AddClientForm } from '../components/client/AddClientForm';
import { EditClientForm } from '../components/client/EditClientForm';
import { Client } from '../types';
import LoadingSpinner from '../components/styles/LoadingSpinner';
import flashy from '@pablotheblink/flashyjs';
import useGlobal from '../hooks/useGlobal';
import { AppRoutes } from '../routes/app-routes';


export function ClientList() {
    const navigate = useNavigate()
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const clientsPerPage = 5;

    const {setCurrentClient} = useGlobal()
    const {clients, setClients, loading} = useGlobal()

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
    const handleDeleteClient = async (clientId: string) => {
        try {
            const res = await window.electronAPI.deleteClient(clientId);
            if (res.ok) {
                setClients(prev => prev.filter(client => client._id !== clientId));
                setShowDeleteConfirm(null);
                flashy.success('Cliente eliminado correctamente')
            } else {
                flashy.error(`Error al eliminar el cliente: ${res.error || 'error desconocido'}`);
            }
        } catch (error) {
            console.error('Error al eliminar el cliente:', error);
        }
    }

    const handleSelectClient = (client: Client) => {
        setCurrentClient(client)
        navigate(AppRoutes.clientMiners.route())
    }   


    if (loading) return (
        <div className='flex items-center justify-center min-h-screen flex-col gap-5'>
            <h1 className='text-center font-bold text-white text-xl'>Cargando...</h1>
            <LoadingSpinner />
        </div>
    )
    return (
        <div className=" min-h-screen p-4 sm:p-6">
            <div className="flex items-center gap-3 pl-10">
                <div className="bg-indigo-600 p-3 rounded-md">
                    <MdPersonSearch className="text-2xl" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Clientes</h1>
                    <p className="text-gray-400 text-sm">Seleccione el cliente para trabajar</p>
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
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                    <FaUser className="text-white" />
                                    Gestión de Clientes
                                </h1>
                                <p className="text-blue-100 mt-1">
                                    Administra tu lista de clientes
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Buscar clientes..."
                                        className="pl-10 pr-4 py-2 rounded-lg bg-blue-500/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <FaSearch className="absolute left-3 top-3 text-blue-200" />
                                </div>

                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-white text-blue-600 cursor-pointer hover:bg-blue-50 py-2 px-4 rounded-lg flex items-center gap-2 font-medium transition-colors"
                                >
                                    <FaPlus />
                                    <span>Nuevo Cliente</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Formulario para agregar nuevo cliente */}
                    {isAdding && <AddClientForm setIsAdding={setIsAdding}/>}

                    {/* Listado de clientes */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cliente
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dirreción
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contacto
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mineros
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                                    </th>

                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentClients.length > 0 ? (
                                    currentClients.map(client => (
                                        <React.Fragment key={client._id}>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                            <FaUser />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{client.address ? client.address : <span className='text-gray-500'>- - - </span>}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{client.number ? client.number : <span className='text-gray-500'> - - -</span>}</div>
                                                    <div className="text-sm text-gray-500">{client.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{client.minners?.length}</div>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingId(client._id)}
                                                            className="text-blue-600 hover:text-blue-900 cursor-pointer text-xl"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(client._id)}
                                                            className="text-red-600 hover:text-red-900 cursor-pointer text-xl"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button 
                                                        onClick={() => handleSelectClient(client)}
                                                        className='bg-gray-500 text-white p-2 rounded-md cursor-pointer hover:bg-gray-600 transition-colors'
                                                        >
                                                        Seleccionar
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Modo de edición */}
                                            {editingId === client._id && <EditClientForm setEditingId={setEditingId} client={client}/>}

                                            {/* Confirmación de eliminación */}
                                            {showDeleteConfirm === client._id && (
                                                <tr className="bg-red-50">
                                                    <td colSpan={6} className="px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-red-700">
                                                                ¿Estás seguro de que deseas eliminar a {client.name}?
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <button
                                                                    onClick={() => setShowDeleteConfirm(null)}
                                                                    className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                                <button
                                                                    className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                                                    onClick={() => handleDeleteClient(client._id)}
                                                                >
                                                                    Eliminar Cliente
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
                                        <td colSpan={6} className="px-6 py-8 text-center">
                                            <div className="text-gray-500">
                                                {searchTerm ? (
                                                    <p>No se encontraron clientes que coincidan con "{searchTerm}"</p>
                                                ) : (
                                                    <p>No hay clientes registrados</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pie de tabla */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-gray-700">
                                Total <span className="font-medium">{filteredClients.length}</span>{' '}
                                clientes
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </button>
                                <span className="text-sm text-gray-700"> Página {currentPage} de {totalPages}</span>
                                <button
                                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
