import { Rnd } from "react-rnd";
import { useState } from "react";

export default function RndTestPage() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 300, height: 200 });

  return (
    <div className="w-screen h-screen bg-gray-100 relative">
      <Rnd
        size={{ width: size.width, height: size.height }}
        position={{ x: position.x, y: position.y }}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setSize({
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
          });
          setPosition(position);
        }}
        bounds="parent"
        className="border-2 border-blue-600 bg-white/60 backdrop-blur-md rounded-md shadow-md"
      >
        <div className="w-full h-full flex items-center justify-center p-2">
          <p className="text-sm text-gray-800 text-center">
            Arrastrá y redimensioná este cuadro 🔧
          </p>
        </div>
      </Rnd>
    </div>
  );
}
