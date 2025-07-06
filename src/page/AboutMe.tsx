
import { Link, useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaGithub, FaLinkedin, FaEnvelope, FaArrowLeft, FaWhatsapp } from 'react-icons/fa';
import { AppRoutes } from '../routes/app-routes';

export function AboutMe() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Encabezado */}
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-3 rounded-xl">
                        <FaInfoCircle className="text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">Acerca de</h1>
                        <p className="text-gray-400 text-sm">Información de la app y del desarrollador</p>
                    </div>
                </div>
                <div className="w-full print:hidden my-5">
                    <button
                        className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-gray-300 transition-colors"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                        Volver
                    </button>
                </div>


                {/* Contenido principal */}
                <div className="grid gap-8">
                    {/* Información de la aplicación */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-1 rounded-2xl">
                        <div className="bg-gray-900/90 backdrop-blur-sm h-full rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4 text-blue-300">Panel de Control ASIC</h2>

                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="bg-gray-800 p-2 rounded-lg mr-4">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Versión</h3>
                                        <p className="text-gray-400">1.0.0</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-gray-800 p-2 rounded-lg mr-4">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Última actualización</h3>
                                        <p className="text-gray-400">10 de Julio, 2025</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-gray-800 p-2 rounded-lg mr-4">
                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Descripción</h3>
                                        <p className="text-gray-400">
                                            Sistema avanzado para monitoreo y análisis de chips ASIC en tiempo real.
                                            Permite gestionar clientes, realizar escaneos, generar reportes de dipositivos.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-800">
                                <h3 className="font-medium mb-3">Características principales</h3>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        <span>Monitoreo en chips</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        <span>Análisis histórico detallado</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        <span>Gestión de clientes</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                                        <span>Importación de datos</span>
                                    </li>
                                 
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Información del desarrollador */}
                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-1 rounded-2xl">
                        <div className="bg-gray-900/90 backdrop-blur-sm h-full rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4 text-purple-300">Desarrollador</h2>

                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <div className="bg-gray-800 p-1 rounded-xl">
                                    <div className="bg-gray-900 w-24 h-24 rounded-xl flex items-center justify-center">
                                        <div className="bg-purple-900/50 rounded-full w-16 h-16 flex items-center justify-center">
                                            <span className="text-2xl font-bold">DC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold">Ignacio Marquez</h3>
                                    <p className="text-gray-400 mb-4">Desarrolador de Software & Aplicaciones web</p>

                                    <p className="mb-4">
                                        Desarrollador con más de 3 años de experiencia creando soluciones para la
                                        industria de minería, modelos de negocios y empresas. 
                                        Especializado principalmente en el desarrollo de aplicaciones web.
                                    </p>

                                    <div className="flex flex-wrap gap-3 mt-6">
                                        <a
                                            href="https://github.com/ignacioM3"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg"
                                        >
                                            <FaGithub className="text-purple-400" />
                                            <span>GitHub</span>
                                        </a>

                                        <a
                                            href="https://www.linkedin.com/in/marquez-ignacio/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg"
                                        >
                                            <FaLinkedin className="text-purple-400" />
                                            <span>LinkedIn</span>
                                        </a>

                                        <a
                                            href="http://wa.me/5491136176964" target="__blak"
                                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg"
                                        >
                                            <FaWhatsapp className="text-purple-400" />
                                            <span>Mensaje</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Créditos y licencia */}
                    <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-1 rounded-2xl">
                        <div className="bg-gray-900/90 backdrop-blur-sm h-full rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4 text-rose-300">Licencia y Términos</h2>

                            <div className="space-y-4">
                                <p>
                                    Este software es propiedad de ASIC Monitor Solutions y está protegido
                                    por leyes de derechos de autor internacionales.
                                </p>

                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <p className="text-sm text-gray-400">
                                        © 2025 ASIC Monitor Solutions. Todos los derechos reservados. <br />
                                        El uso no autorizado de este software está estrictamente prohibido. <br />
                                        Versión de licencia: Professional v1.2
                                    </p>
                                </div>

                                <p>
                                    Para consultas sobre licencias empresariales o soporte técnico, por favor
                                    contacte a nuestro equipo de ventas en
                                    <span className="text-rose-300"> ventas@asicmonitor.com</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pie de página */}
                <footer className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>Sistema de monitoreo ASIC v1.2.0 • Última actualización: Hoy 15:42</p>
                    <p className="mt-2">Estado: <span className="text-green-500">Sistema estable</span></p>
                </footer>
            </div>
        </div>
    );
}