import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { Card } from "../components/Card";
import { AppRoutes } from "../routes/app-routes";



export  function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
     
      <div className="mb-10 text-center">
        <img src="/electron-vite.svg" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">ASIC Detect</h1>
        <p className="text-gray-400 mt-2">Herramienta de análisis y monitoreo de mineros ASIC</p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        <Card title="Monitoreo" description="Ver estado en tiempo real" />
        <Card title="Historial" description="Revisar ciclos pasados" />
        <Card title="Configuración" description="Ajustes y preferencias" />
      </div>
      <Link to={AppRoutes.menuList.route()} className="bg-gray-400 p-2 rounded-md mt-5 cursor-pointer hover:bg-gray-600 transition-colors w-[150px] text-center">Empezar</Link>

      <p className="text-gray-600 text-sm mt-12 flex items-center  gap-2">Versión 1.0.0 - <a href="https://www.linkedin.com/in/marquez-ignacio/" target="_blank" className="flex items-center gap-2 font-mono cursor-pointer text-gray-400 hover:text-gray-500">Ignacio Dev <FaLinkedin  /></a></p>
    </div>
  )
}
