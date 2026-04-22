import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const MruSimulator = () => {
  const [posicion, setPosicion] = useState({ x: 0, y: 0, z: 0 });
  const [velocidad, setVelocidad] = useState({ x: 0, y: 1000, z: 0 });
  const [tiempo, setTiempo] = useState(2.5);
  const [resultado, setResultado] = useState({ x: 0, y: 0, z: 0 });
  const [gol, setGol] = useState(null);

  // Funciones para mapear coordenadas (campo de -4096 a 4096 en X, -5120 a 5120 en Y)
  // Lo mapearemos a un SVG de viewBox "0 0 100 120"
  const mapX = (x) => ((x + 4096) / 8192) * 100;
  const mapY = (y) => (1 - (y + 5120) / 10240) * 120; // Invertir Y para que positivo sea arriba

  useEffect(() => {
    // P_nueva = P_actual + v * t
    const newX = posicion.x + velocidad.x * tiempo;
    const newY = posicion.y + velocidad.y * tiempo;
    const newZ = posicion.z + velocidad.z * tiempo;
    
    setResultado({ x: newX, y: newY, z: newZ });

    // Verificación de gol
    if (newY >= 5120) {
      setGol("¡GOL para el equipo Azul! El balón superó el límite Y = 5120");
    } else if (newY <= -5120) {
      setGol("¡GOL para el equipo Naranja! El balón superó el límite Y = -5120");
    } else {
      setGol(null);
    }
  }, [posicion, velocidad, tiempo]);

  const handlePosChange = (axis, value) => {
    setPosicion(prev => ({ ...prev, [axis]: parseFloat(value) || 0 }));
  };

  const handleVelChange = (axis, value) => {
    setVelocidad(prev => ({ ...prev, [axis]: parseFloat(value) || 0 }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <Rocket className="text-rl-blue w-8 h-8" />
          <h2 className="text-3xl font-bold text-white text-shadow-neon">Simulador MRU</h2>
        </div>
        <p className="text-gray-300 mb-6 font-mono bg-white/5 p-3 rounded">
          Ecuación: P_nueva = P_actual + v * t
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl text-rl-blue mb-3 font-semibold">Posición Actual (P)</h3>
              <div className="flex gap-4">
                {['x', 'y', 'z'].map(axis => (
                  <div key={`p-${axis}`} className="flex flex-col">
                    <label className="text-gray-400 text-sm mb-1 uppercase">{axis}</label>
                    <input 
                      type="number" 
                      value={posicion[axis]}
                      onChange={(e) => handlePosChange(axis, e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-24 focus:outline-none focus:border-rl-blue transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl text-rl-orange mb-3 font-semibold">Velocidad (v)</h3>
              <div className="flex gap-4">
                {['x', 'y', 'z'].map(axis => (
                  <div key={`v-${axis}`} className="flex flex-col">
                    <label className="text-gray-400 text-sm mb-1 uppercase">{axis}</label>
                    <input 
                      type="number" 
                      value={velocidad[axis]}
                      onChange={(e) => handleVelChange(axis, e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-24 focus:outline-none focus:border-rl-orange transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl text-white mb-3 font-semibold flex justify-between">
                <span>Tiempo (t)</span>
                <span className="text-rl-blue">{tiempo} s</span>
              </h3>
              <input 
                type="range" 
                min="0" 
                max="60" 
                step="0.1"
                value={tiempo}
                onChange={(e) => setTiempo(parseFloat(e.target.value))}
                className="w-full accent-rl-blue"
              />
            </div>
          </div>

          <div className="bg-black/40 rounded-xl p-6 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-xl text-white mb-4 text-center">Visualización (Vista Superior XY)</h3>
            
            {/* Cancha SVG */}
            <div className="relative w-full max-w-[200px] aspect-[10/12] bg-green-900/30 border-2 border-white/20 rounded-md overflow-hidden mb-6">
              {/* Línea central */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/20"></div>
              {/* Círculo central */}
              <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              {/* Áreas de portería */}
              <div className="absolute top-0 left-1/2 w-16 h-8 border-2 border-t-0 border-white/20 -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-16 h-8 border-2 border-b-0 border-white/20 -translate-x-1/2"></div>
              
              <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full overflow-visible">
                {/* Trayectoria */}
                <motion.line 
                  x1={mapX(posicion.x)} 
                  y1={mapY(posicion.y)} 
                  x2={mapX(resultado.x)} 
                  y2={mapY(resultado.y)} 
                  stroke="rgba(0, 191, 255, 0.5)" 
                  strokeWidth="1" 
                  strokeDasharray="2,2"
                />
                
                {/* Posición Inicial */}
                <circle 
                  cx={mapX(posicion.x)} 
                  cy={mapY(posicion.y)} 
                  r="2" 
                  fill="#ffffff" 
                  className="shadow-neon"
                />

                {/* Posición Final */}
                <motion.circle 
                  cx={mapX(resultado.x)} 
                  cy={mapY(resultado.y)} 
                  r="3" 
                  fill="#FF8C00"
                  animate={{ cx: mapX(resultado.x), cy: mapY(resultado.y) }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </svg>
            </div>

            <div className="flex justify-center gap-4 text-sm font-mono text-shadow-neon mb-4">
              <span className="text-rl-blue">X: {resultado.x.toFixed(0)}</span>
              <span className="text-rl-orange">Y: {resultado.y.toFixed(0)}</span>
              <span className="text-gray-300">Z: {resultado.z.toFixed(0)}</span>
            </div>
            
            {gol && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-500/20 border border-green-500 text-green-400 p-2 rounded text-center text-sm font-bold w-full"
              >
                {gol}
              </motion.div>
            )}
            
            {!gol && (
              <div className="text-gray-500 text-xs text-center">
                Dentro del campo. Límite Y es ±5120. Límite X es ±4096.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MruSimulator;
