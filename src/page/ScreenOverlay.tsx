import { useEffect, useState } from "react";
import { GoAlert } from "react-icons/go";
import { LuSquareDashedMousePointer } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Rnd } from "react-rnd";

// Declaración para TypeScript
declare global {
  interface Window {
    setOverlayMode?: (enabled: boolean) => void;
    sendMouseOverButtons?: (isOverButtons: boolean) => void;
    setSelectionMode?: (enabled: boolean) => void; // Nueva función
  }
}

export default function ScreenOverlay() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState({ 
    x: 100, 
    y: 100, 
    width: 300, 
    height: 200 
  });
  
  const navigate = useNavigate();

  // Activar/desactivar modo de selección
  useEffect(() => {
    if (window.setSelectionMode) {
      window.setSelectionMode(isSelecting);
    }
    
    return () => {
      if (window.setSelectionMode) {
        window.setSelectionMode(false);
      }
    };
  }, [isSelecting]);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleMouseEnter = () => {
    window.sendMouseOverButtons?.(true);
  };

  const handleMouseLeave = () => {
    window.sendMouseOverButtons?.(false);
  };

  useEffect(() => {
    if (window.setOverlayMode) {
      window.setOverlayMode(true);
    }
    return () => {
      if (window.setOverlayMode) {
        window.setOverlayMode(false);
      }
    };
  }, [isMinimized]);

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Cuadro seleccionable - IMPORTANTE: pointer-events-auto */}
      {isSelecting && (
        <div 
            onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="pointer-events-auto" style={{ zIndex: 10000 }}>
          <Rnd
            size={{ width: selectionRect.width, height: selectionRect.height }}
            position={{ x: selectionRect.x, y: selectionRect.y }}
            onDragStop={(e, d) => {
              setSelectionRect({ ...selectionRect, x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              setSelectionRect({
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: position.x,
                y: position.y,
              });
            }}
            bounds="window"
            style={{
              border: "2px solid #3b82f6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderRadius: "4px",
            }}
            enableResizing={{
              top: true,
              right: true,
              bottom: true,
              left: true,
              topRight: true,
              bottomRight: true,
              bottomLeft: true,
              topLeft: true,
            }}
            className="selection-box"
          />
        </div>
      )}

      {/* Panel de botones */}
      {!isMinimized ? (
        <div
          className="absolute top-5 right-5 flex flex-col gap-2 pointer-events-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          
          <button className="px-4 w-[150px] py-2 bg-green-600/80 hover:bg-green-700/90 text-white rounded-lg shadow-lg transition-all flex items-center gap-2 justify-center cursor-pointer backdrop-blur-sm">
            <GoAlert /> Iniciar
          </button>
          <button className="px-4 py-2 bg-orange-600/80 hover:bg-orange-700/90 text-white rounded-lg shadow-lg transition-all cursor-pointer backdrop-blur-sm">
            🌡️ Detener
          </button>
          <button
            onClick={() => {
              setIsSelecting(!isSelecting);
            }}
            className={`px-4 w-[150px] py-2 rounded-lg shadow-lg transition-all flex items-center gap-2 justify-center cursor-pointer backdrop-blur-sm ${
              isSelecting 
                ? "bg-red-600/80 hover:bg-red-700/90" 
                : "bg-blue-600/80 hover:bg-blue-700/90"
            }`}
          >
            <LuSquareDashedMousePointer /> 
            {isSelecting ? "Ocultar" : "Seleccionar"}
          </button>
          <button
            onClick={handleMinimize}
            className="px-4 py-2 bg-purple-600/80 hover:bg-purple-700/90 text-white rounded-lg shadow-lg transition-all cursor-pointer backdrop-blur-sm"
          >
            {isMinimized ? "👁️ Expandir" : "👁️ Minimizar"}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800/80 hover:bg-gray-900/90 text-white rounded-lg shadow-lg transition-all cursor-pointer backdrop-blur-sm"
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
            onClick={handleMinimize}
            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-700/90 text-white rounded-full shadow-lg transition-all cursor-pointer backdrop-blur-sm"
            title="Mostrar controles (H)"
          >
            👁️
          </button>
        </div>
      )}
    </div>
  );
}