import { useEffect, useState } from "react";
import { GoAlert } from "react-icons/go";
import { useNavigate } from "react-router-dom";

// Declaración para TypeScript
declare global {
  interface Window {
    setOverlayMode?: (enabled: boolean) => void;
    sendMouseOverButtons?: (isOverButtons: boolean) => void;
  }
}


export default function ScreenOverlay() {
  const [isMinimized, setIsMinimized] = useState(false)
  const navigate = useNavigate();

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }


  const handleMouseEnter = () => {
    if (window.sendMouseOverButtons) {
      window.sendMouseOverButtons(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.sendMouseOverButtons) {
      window.sendMouseOverButtons(false)
    }
  }

  useEffect(() => {
    // Activar modo overlay cuando el componente se monta
    if (window.setOverlayMode) {
      window.setOverlayMode(true)
    }
    return () => {
      // Desactivar modo overlay cuando el componente se desmonta
      if (window.setOverlayMode) {
        window.setOverlayMode(false)
      }
    }
  }, [isMinimized])

  return (
    <div 
      className="fixed top-0 right-0 z-[9999]"
  style={{ pointerEvents: 'none' }}
    >
      {!isMinimized ? (
        <div 
          className="absolute top-5 right-5 flex flex-col gap-2 pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="px-4 w-[150px] pointer-events-auto py-2 bg-green-600/80 hover:bg-green-700/90 text-white rounded-lg shadow-lg transition-all flex items-center gap-2 justify-center cursor-pointer backdrop-blur-sm"
          >
            <GoAlert /> Iniciar Escaneo
          </button>
          <button
            className="px-4 py-2 bg-orange-600/80 hover:bg-orange-700/90 text-white rounded-lg shadow-lg transition-all cursor-pointer backdrop-blur-sm"
          >
            🌡️ Detener
          </button>
          <button
            onClick={handleMinimize}
            className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700/90 text-white rounded-lg shadow-lg transition-all cursor-pointer backdrop-blur-sm"
          >
            {isMinimized ? '👁️ Expandir' : '👁️ Minimizar'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 pointer-events-auto bg-gray-800/80 hover:bg-gray-900/90 text-white rounded-lg shadow-lg transition-all cursor-pointer backdrop-blur-sm"
          >
            ❌ Cerrar 
          </button>
        </div>
      ) : (
        <div 
          className="absolute top-4 right-4 pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => handleMinimize()}
            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-700/90 text-white rounded-full shadow-lg transition-all cursor-pointer backdrop-blur-sm"
            title="Mostrar controles (H)"
          >
            👁️
          </button>
        </div>
      )}
    </div>
  )
}
