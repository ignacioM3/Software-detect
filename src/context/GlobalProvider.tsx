import React, { createContext, useEffect, useState } from 'react';
import { Client, clientSchema, Minners, minnerSchema } from '../types';
import flashy from '@pablotheblink/flashyjs';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../routes/app-routes';


interface GlobalContextType {
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>;
    loading: boolean
    currentClient?: Client;
    setCurrentClient: React.Dispatch<React.SetStateAction<Client | undefined>>
    minerSelected: Minners[]
    setMinerSelected: React.Dispatch<React.SetStateAction<Minners[]>>
    loadingMiner: boolean;
}

const GlobalContext = createContext<GlobalContextType>({
    currentClient: undefined,
    setCurrentClient: () => { },
    clients: [],
    setClients: () => { },
    loading: true,
    minerSelected: [],
    setMinerSelected: () => {},
    loadingMiner: true
})


const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentClient, setCurrentClient] = useState<Client | undefined>(undefined);
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMiner, setLoadingMiner] = useState(true)
    const [minerSelected, setMinerSelected] = useState<Minners[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await window.electronAPI.getClients();
                clientSchema.array().parse(response);
                setClients(response)
            } catch (error) {
                flashy.error('Error al cargar clientes');
            } finally {
                setLoading(false)
            }
        }
        fetchClients();
    }, [])

    useEffect(() => {
        const fetchMinners = async () => {
            try {
                setLoadingMiner(true)
                if (!currentClient?._id) {
                    // Solo redirigir si no estamos en la página de inicio
                    const currentPath = window.location.pathname;
                    if (currentPath !== AppRoutes.home.route()) {
                        navigate(AppRoutes.menuList.route())
                    }
                    return
                }
                const data = await window.electronAPI.getMinersByIdClient(currentClient._id);
                minnerSchema.array().parse(data);
                setMinerSelected(data);

            } catch (error) {
                console.error('Error al cargar clientes:', error);
            } finally {
                setLoadingMiner(false)
            }
        }
        fetchMinners()
    }, [currentClient])
    return (
        <GlobalContext.Provider
            value={
                {
                    currentClient,
                    setCurrentClient,
                    clients,
                    setClients,
                    loading,
                    minerSelected,
                    setMinerSelected,
                    loadingMiner
                }
            }
        >
            {children}
        </GlobalContext.Provider>
    )
}

export {
    GlobalProvider
}

export default GlobalContext