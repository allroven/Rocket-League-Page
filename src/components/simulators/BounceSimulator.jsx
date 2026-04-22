import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

const BounceSimulator = () => {
  const [velocidad, setVelocidad] = useState({ x: 10, y: 20, z: -5 });
  const [normal, setNormal] = useState({ x: 0, y: -1, z: 0 }); // Pared frontal por defecto
  const [resultado, setResultado] = useState({ x: 0, y: 0, z: 0 });
  const [detalles, setDetalles] = useState({ dot: 0, magV: 0, magR: 0 });

  useEffect(() => {
    // Funciones matemáticas auxiliares
    const productoPunto = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
    const magnitud = (v) => Math.sqrt(v.x**2 + v.y**2 + v.z**2);
    const normalizar = (v) => {
      const mag = magnitud(v);
      if (mag === 0) return { x: 0, y: 0, z: 0 };
      return { x: v.x/mag, y: v.y/mag, z: v.z/mag };
    };

    const N = normalizar(normal);
    const dot = productoPunto(velocidad, N);
    
    // R = V - 2(V·N)N
    const rx = velocidad.x - 2 * dot * N.x;
    const ry = velocidad.y - 2 * dot * N.y;
    const rz = velocidad.z - 2 * dot * N.z;

    setResultado({ x: rx, y: ry, z: rz });
    setDetalles({
      dot: dot,
      magV: magnitud(velocidad),
      magR: magnitud({ x: rx, y: ry, z: rz })
    });
  }, [velocidad, normal]);

  const handleVelChange = (axis, value) => {
    setVelocidad(prev => ({ ...prev, [axis]: parseFloat(value) || 0 }));
  };

  const handleNormChange = (axis, value) => {
    setNormal(prev => ({ ...prev, [axis]: parseFloat(value) || 0 }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="text-rl-orange w-8 h-8" />
          <h2 className="text-3xl font-bold text-white text-shadow-neon-orange">Simulador de Rebote</h2>
        </div>
        <p className="text-gray-300 mb-6 font-mono bg-white/5 p-3 rounded">
          Fórmula: R = V - 2(V · N)N
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl text-rl-blue mb-3 font-semibold">Velocidad de Impacto (V)</h3>
              <div className="flex gap-4">
                {['x', 'y', 'z'].map(axis => (
                  <div key={`v-${axis}`} className="flex flex-col">
                    <label className="text-gray-400 text-sm mb-1 uppercase">{axis}</label>
                    <input 
                      type="number" 
                      value={velocidad[axis]}
                      onChange={(e) => handleVelChange(axis, e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-24 focus:outline-none focus:border-rl-blue transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl text-green-400 mb-3 font-semibold">Normal de Superficie (N)</h3>
              <p className="text-xs text-gray-500 mb-2">Pared lateral=(1,0,0) | Suelo=(0,0,1)</p>
              <div className="flex gap-4">
                {['x', 'y', 'z'].map(axis => (
                  <div key={`n-${axis}`} className="flex flex-col">
                    <label className="text-gray-400 text-sm mb-1 uppercase">{axis}</label>
                    <input 
                      type="number" 
                      value={normal[axis]}
                      onChange={(e) => handleNormChange(axis, e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-24 focus:outline-none focus:border-green-400 transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-black/40 rounded-xl p-6 border border-white/10 flex flex-col items-center justify-center">
            <h3 className="text-xl text-white mb-4 text-center">Visualización del Rebote (XY)</h3>

            {/* SVG Canvas para Rebote */}
            <div className="relative w-full max-w-[200px] aspect-square bg-gray-900/50 border border-white/20 rounded-md overflow-hidden mb-6">
              <svg viewBox="-50 -50 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                {/* Ejes */}
                <line x1="-50" y1="0" x2="50" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                {/* Normal (Pared) - Dibujamos una línea perpendicular a la normal */}
                {/* Si normal es (0, -1), la pared es horizontal. */}
                {/* Rotamos 90 grados la normal para sacar la pared */}
                <line 
                  x1={-normal.y * 50} 
                  y1={normal.x * 50} 
                  x2={normal.y * 50} 
                  y2={-normal.x * 50} 
                  stroke="#4ade80" 
                  strokeWidth="2" 
                />
                <line 
                  x1="0" 
                  y1="0" 
                  x2={normal.x * 15} 
                  y2={normal.y * 15} 
                  stroke="#4ade80" 
                  strokeWidth="1" 
                  strokeDasharray="2,2"
                />

                {/* Vector Velocidad de Impacto (V) - Entrante */}
                <line 
                  x1={-velocidad.x} 
                  y1={-velocidad.y} 
                  x2="0" 
                  y2="0" 
                  stroke="#00BFFF" 
                  strokeWidth="1.5" 
                  markerEnd="url(#arrow-v)"
                />

                {/* Vector Resultante (R) - Saliente */}
                <motion.line 
                  x1="0" 
                  y1="0" 
                  x2={resultado.x} 
                  y2={resultado.y} 
                  stroke="#FF8C00" 
                  strokeWidth="1.5" 
                  markerEnd="url(#arrow-r)"
                  animate={{ x2: resultado.x, y2: resultado.y }}
                  transition={{ type: "spring", stiffness: 100 }}
                />

                <defs>
                  <marker id="arrow-v" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#00BFFF" />
                  </marker>
                  <marker id="arrow-r" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF8C00" />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="flex justify-center gap-4 text-sm font-mono text-shadow-neon-orange mb-4">
              <span className="text-rl-orange">X: {resultado.x.toFixed(2)}</span>
              <span className="text-rl-orange">Y: {resultado.y.toFixed(2)}</span>
              <span className="text-rl-orange">Z: {resultado.z.toFixed(2)}</span>
            </div>
            
            <div className="w-full space-y-1 text-xs font-mono bg-black/50 p-3 rounded text-gray-300">
              <p>Producto Punto (V·N) = {detalles.dot.toFixed(4)}</p>
              <p>Magnitud Original |V| = {detalles.magV.toFixed(2)}</p>
              <p>Magnitud Resultante |R| = {detalles.magR.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BounceSimulator;
