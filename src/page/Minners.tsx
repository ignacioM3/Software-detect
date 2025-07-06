import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaServer, 
  FaThermometerHalf, 
  FaTachometerAlt, 
  FaPlug, 
  FaClock, 
  FaChartLine, 
  FaSyncAlt,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';
import { GiMiner } from 'react-icons/gi';
import { MdMemory, MdOutlinePowerSettingsNew } from 'react-icons/md';
import { RiCpuLine } from 'react-icons/ri';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import LoadingSpinner from '../components/styles/LoadingSpinner';


// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function RigDetailsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rig, setRig] = useState({
    id: 'rig-001',
    name: 'Rig Principal',
    status: 'active',
    location: 'Sala de servidores A',
    model: 'Antminer S19 Pro',
    power: 3250,
    hashRate: 110,
    temperature: 68,
    chips: 189,
    uptime: '15 días 8h',
    lastActive: 'Hace 2 minutos',
    efficiency: 29.5,
    algorithm: 'SHA-256',
    voltage: 220,
    frequency: 650,
    fanSpeed: 4200,
    pool: 'stratum+tcp://btc.pool.com:3333',
    errors: 3,
    warnings: 12
  });
  
  const [activeTab, setActiveTab] = useState('stats');
  const [chartData, setChartData] = useState(null);
  const [chipData, setChipData] = useState([]);

  // Datos simulados para gráficos
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      // Datos para gráficos
      const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      
      const tempData = Array.from({ length: 24 }, () => 
        Math.floor(Math.random() * 10) + 65
      );
      
      const hashData = Array.from({ length: 24 }, () => 
        Math.floor(Math.random() * 10) + 105
      );
      
      const powerData = Array.from({ length: 24 }, () => 
        Math.floor(Math.random() * 200) + 3100
      );
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: tempData,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.5)',
            tension: 0.4,
          },
          {
            label: 'Hash Rate (TH/s)',
            data: hashData,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            tension: 0.4,
          },
          {
            label: 'Consumo (W)',
            data: powerData,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.4,
          },
        ],
      });
      
      // Datos simulados para chips
      const chips = Array.from({ length: 20 }, (_, i) => ({
        id: `chip-${i + 1}`,
        status: i % 20 === 0 ? 'error' : i % 5 === 0 ? 'warning' : 'active',
        temperature: Math.floor(Math.random() * 15) + 60,
        hashRate: (Math.random() * 2 + 5.5).toFixed(2),
        voltage: (Math.random() * 0.2 + 0.65).toFixed(2),
        errors: Math.floor(Math.random() * 3),
      }));
      
      setChipData(chips);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col gap-5">
        <h1 className="text-center font-bold text-white text-xl">Cargando detalles del rig...</h1>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-xl">
                <FaServer className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{rig.name}</h1>
                <p className="text-gray-400 text-sm">Detalles y monitoreo del rig minero</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                rig.status === 'active' ? 'bg-green-500 animate-pulse' : 
                rig.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span>
                {rig.status === 'active' ? 'Operativo' : 
                 rig.status === 'warning' ? 'Advertencia' : 'Inactivo'}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <FaSyncAlt />
              </button>
              <button className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                <MdOutlinePowerSettingsNew />
              </button>
            </div>
          </div>
        </div>
        
        {/* Información principal del rig */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <GiMiner className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Modelo</p>
                  <p className="font-medium">{rig.model}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <FaTachometerAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Hash Rate</p>
                  <p className="font-medium">{rig.hashRate} TH/s</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-amber-600 p-2 rounded-lg">
                  <FaThermometerHalf className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Temperatura</p>
                  <p className="font-medium">{rig.temperature}°C</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <FaPlug className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Consumo</p>
                  <p className="font-medium">{rig.power}W</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-lg">
                  <RiCpuLine className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Chips</p>
                  <p className="font-medium">{rig.chips}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-cyan-600 p-2 rounded-lg">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tiempo activo</p>
                  <p className="font-medium">{rig.uptime}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-1 rounded-2xl">
            <div className="bg-gray-900/90 backdrop-blur-sm h-full rounded-2xl p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-indigo-300" />
                Estado del sistema
              </h3>
              
              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Eficiencia</span>
                  <span className="font-bold">{rig.efficiency} J/TH</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Algoritmo</span>
                  <span className="font-bold">{rig.algorithm}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Voltaje</span>
                  <span className="font-bold">{rig.voltage}V</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Frecuencia</span>
                  <span className="font-bold">{rig.frequency}MHz</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-800">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-red-500">
                    <FaExclamationTriangle />
                    <span>{rig.errors} errores</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-500">
                    <FaExclamationTriangle />
                    <span>{rig.warnings} advertencias</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pestañas de navegación */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'stats' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Estadísticas
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'chips' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('chips')}
          >
            Chips
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'config' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('config')}
          >
            Configuración
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'history' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Historial
          </button>
        </div>
        
        {/* Contenido de pestañas */}
        {activeTab === 'stats' && (
          <div className="mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Rendimiento en las últimas 24 horas</h3>
              {chartData ? (
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: '#e5e7eb'
                        }
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#9ca3af'
                        }
                      },
                      y: {
                        grid: {
                          color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                          color: '#9ca3af'
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  Cargando datos del gráfico...
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-1 rounded-2xl">
                <div className="bg-gray-900/90 backdrop-blur-sm h-full rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Eficiencia energética</h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold">{rig.efficiency}</span>
                    <span className="text-gray-400">J/TH</span>
                  </div>
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-green-500"
                      style={{ width: `${(29.5 / 40) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>0</span>
                    <span>20</span>
                    <span>40</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    {rig.efficiency < 30 
                      ? 'Excelente eficiencia energética' 
                      : rig.efficiency < 35 
                        ? 'Buena eficiencia' 
                        : 'Eficiencia por debajo del promedio'}
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-1 rounded-2xl">
                <div className="bg-gray-900/90 backdrop-blur-sm h-full rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Temperatura promedio</h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold">{rig.temperature}</span>
                    <span className="text-gray-400">°C</span>
                  </div>
                  <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-amber-500"
                      style={{ width: `${(rig.temperature / 100) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-400">
                    <span>0°</span>
                    <span>50°</span>
                    <span>100°</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">
                    {rig.temperature < 70 
                      ? 'Temperatura dentro de parámetros normales' 
                      : rig.temperature < 80 
                        ? 'Temperatura elevada - Monitorear' 
                        : 'Temperatura crítica - Tomar acción'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'chips' && (
          <div className="mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Chips del rig</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Normal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Advertencia</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Error</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {chipData.map(chip => (
                  <div 
                    key={chip.id}
                    className={`p-1 rounded-xl ${
                      chip.status === 'active' ? 'bg-green-600/20' :
                      chip.status === 'warning' ? 'bg-yellow-600/20' : 'bg-red-600/20'
                    }`}
                  >
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{chip.id}</h4>
                          <div className={`text-xs ${
                            chip.status === 'active' ? 'text-green-400' :
                            chip.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {chip.status === 'active' ? 'Normal' : 
                             chip.status === 'warning' ? 'Advertencia' : 'Error'}
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          chip.status === 'active' ? 'bg-green-500' :
                          chip.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Temp:</span>
                          <span>{chip.temperature}°C</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Hash:</span>
                          <span>{chip.hashRate} TH/s</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Volt:</span>
                          <span>{chip.voltage}V</span>
                        </div>
                        {chip.errors > 0 && (
                          <div className="text-xs text-red-400 flex items-center gap-1">
                            <FaExclamationTriangle />
                            <span>{chip.errors} error(es)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-1 rounded-2xl">
              <div className="bg-gray-900/90 backdrop-blur-sm h-full rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Resumen de chips</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-500">
                      {chipData.filter(c => c.status === 'active').length}
                    </div>
                    <div className="text-gray-400 text-sm">Chips normales</div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-500">
                      {chipData.filter(c => c.status === 'warning').length}
                    </div>
                    <div className="text-gray-400 text-sm">Con advertencias</div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-red-500">
                      {chipData.filter(c => c.status === 'error').length}
                    </div>
                    <div className="text-gray-400 text-sm">Con errores</div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-xl">
                    <div className="text-2xl font-bold">
                      {chipData.reduce((sum, chip) => sum + parseFloat(chip.hashRate), 0).toFixed(2)}
                    </div>
                    <div className="text-gray-400 text-sm">TH/s total</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Chips con problemas</h4>
                  <div className="space-y-3">
                    {chipData
                      .filter(c => c.status !== 'active')
                      .map(chip => (
                        <div 
                          key={chip.id} 
                          className="flex justify-between items-center bg-gray-800 p-3 rounded-lg"
                        >
                          <div>
                            <div className="font-medium">{chip.id}</div>
                            <div className={`text-xs ${
                              chip.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {chip.status === 'warning' ? 'Advertencia' : 'Error crítico'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">{chip.temperature}°C</div>
                            <div className="text-xs text-gray-400">
                              {chip.errors} error(es)
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'config' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-6">Configuración del rig</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-gray-300">Configuración general</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nombre del rig</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={rig.name}
                      onChange={(e) => setRig({...rig, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Ubicación</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={rig.location}
                      onChange={(e) => setRig({...rig, location: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Pool de minería</label>
                    <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={rig.pool}
                      onChange={(e) => setRig({...rig, pool: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-gray-300">Configuración avanzada</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Frecuencia (MHz)</label>
                    <input
                      type="number"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={rig.frequency}
                      onChange={(e) => setRig({...rig, frequency: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Voltaje (V)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={rig.voltage}
                      onChange={(e) => setRig({...rig, voltage: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Velocidad de ventiladores (RPM)</label>
                    <input
                      type="number"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={rig.fanSpeed}
                      onChange={(e) => setRig({...rig, fanSpeed: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Guardar cambios
              </button>
            </div>
          </div>
        )}
        
        {/* Pie de página */}
        <footer className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Sistema de monitoreo ASIC v1.0.0 • Última actualización: Hoy 16:28</p>
          <p className="mt-2">Estado: <span className="text-green-500">Todos los sistemas operativos</span></p>
        </footer>
      </div>
    </div>
  );
}