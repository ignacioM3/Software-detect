import { Link } from 'react-router-dom';
import {
    FaCog,
    FaHistory,
    FaInfoCircle,
    FaServer,
    FaPowerOff
} from 'react-icons/fa';
import { GoFileSymlinkFile } from "react-icons/go";
import { MdOutlineDashboard } from 'react-icons/md';
import { useState } from 'react';
import { AppRoutes } from '../routes/app-routes';

const options = [
    {
        title: 'Iniciar Escaneo de Chips',
        description: 'Monitoreos de chips en tiempo real.',
        path: AppRoutes.clientList.route(),
        icon: <FaCog className="text-blue-500" />,
        color: "from-blue-500 to-blue-600"
    },
    {
        title: 'Historial de análisis',
        description: 'Revisar los analisis pasados y reportes generados.',
        path: '/addMinner',
        icon: <FaHistory className="text-amber-500" />,
        color: "from-amber-500 to-amber-600"
    },
    {
        title: 'Clientes ',
        description: 'Revisa y edita los clientes.',
        path: '/dispositivos',
        icon: <FaServer className="text-purple-500" />,
        color: "from-purple-500 to-purple-600"
    },
    {
        title: 'Importar Archivos',
        description: 'Agregar archivos de información de chips',
        path: '/minners',
        icon: <GoFileSymlinkFile className="text-green-500" />,
        color: "from-green-500 to-green-600"
    },
    {
        title: 'Acerca de',
        description: 'Información de la app y del desarrollador.',
        path: AppRoutes.aboutMe.route(),
        icon: <FaInfoCircle className="text-rose-500" />,
        color: "from-rose-500 to-rose-600"
    }
];

export function MenuList() {
    const [activeSystem, setActiveSystem] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-3 rounded-xl">
                            <MdOutlineDashboard className="text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Panel de Control ASIC</h1>
                            <p className="text-gray-400 text-sm">Monitor de ciclos y rendimiento de chips</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${activeSystem ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span>Sistema {activeSystem ? 'Activo' : 'Inactivo'}</span>
                        </div>

                        <button
                            onClick={() => setActiveSystem(!activeSystem)}
                            className={`p-2 rounded-lg flex items-center gap-2 ${activeSystem ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
                        >
                            <FaPowerOff />
                            <span className="hidden sm:inline">Salir</span>
                        </button>
                    </div>
                </header>

                {/* Options Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {options.map((opt) => (
                        <Link
                            key={opt.title}
                            to={opt.path}
                            className="block group"
                        >
                            <div className={`bg-gradient-to-br ${opt.color} p-1 rounded-2xl transition-all duration-300 group-hover:opacity-90 group-hover:-translate-y-1`}>
                                <div className="bg-gray-900/90 backdrop-blur-sm h-full rounded-2xl p-6 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-gray-800 p-3 rounded-xl">
                                            {opt.icon}
                                        </div>

                                    </div>

                                    <h2 className="text-xl font-semibold mb-2">{opt.title}</h2>
                                    <p className="text-gray-400 text-sm mb-4">{opt.description}</p>

                                    <div className="mt-auto flex justify-between items-center">
                                        <span className="text-xs text-gray-500">Haz clic para acceder</span>
                                        <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Footer */}
                <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>Sistema de monitoreo ASIC v1.0.0 • Última actualización: Hoy 14:28</p>
                    <p className="mt-2">Estado: <span className="text-green-500">Todos los sistemas operativos</span></p>
                </footer>
            </div>
        </div>
    );
}