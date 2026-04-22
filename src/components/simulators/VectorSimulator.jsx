import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';

const VectorSimulator = () => {
  const [vectorA, setVectorA] = useState({ x: 5, y: 0, z: 0 });
  const [vectorB, setVectorB] = useState({ x: 0, y: 5, z: 0 });
  const [resultados, setResultados] = useState({
    suma: { x: 0, y: 0, z: 0 },
    dot: 0,
    magA: 0,
    magB: 0,
    anguloDeg: 0,
    normA: { x: 0, y: 0, z: 0 },
    normB: { x: 0, y: 0, z: 0 }
  });

  useEffect(() => {
    const magnitud = (v) => Math.sqrt(v.x**2 + v.y**2 + v.z**2);
    const normalizar = (v) => {
      const mag = magnitud(v);
      if (mag === 0) return { x: 0, y: 0, z: 0 };
      return { x: v.x/mag, y: v.y/mag, z: v.z/mag };
    };

    const suma = {
      x: vectorA.x + vectorB.x,
      y: vectorA.y + vectorB.y,
      z: vectorA.z + vectorB.z
    };

    const dot = vectorA.x * vectorB.x + vectorA.y * vectorB.y + vectorA.z * vectorB.z;
    const magA = magnitud(vectorA);
    const magB = magnitud(vectorB);
    
    let anguloDeg = 0;
    if (magA > 0 && magB > 0) {
      let cosAngulo = dot / (magA * magB);
      cosAngulo = Math.max(-1.0, Math.min(1.0, cosAngulo));
      anguloDeg = (Math.acos(cosAngulo) * 180) / Math.PI;
    }

    setResultados({
      suma,
      dot,
      magA,
      magB,
      anguloDeg,
      normA: normalizar(vectorA),
      normB: normalizar(vectorB)
    });

  }, [vectorA, vectorB]);

  const handleChange = (setter, axis, value) => {
    setter(prev => ({ ...prev, [axis]: parseFloat(value) || 0 }));
  };

  const formatearVector = (v) => `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="glass-panel p-8">
        <div className="flex items-center gap-3 mb-6">
          <Crosshair className="text-purple-400 w-8 h-8" />
          <h2 className="text-3xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(167, 139, 250, 0.7)' }}>
            Operaciones Vectoriales en 3D
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl text-rl-blue mb-3 font-semibold">Vector A</h3>
              <div className="flex gap-4">
                {['x', 'y', 'z'].map(axis => (
                  <div key={`a-${axis}`} className="flex flex-col">
                    <label className="text-gray-400 text-sm mb-1 uppercase">{axis}</label>
                    <input 
                      type="number" 
                      value={vectorA[axis]}
                      onChange={(e) => handleChange(setVectorA, axis, e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-24 focus:outline-none focus:border-rl-blue transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl text-rl-orange mb-3 font-semibold">Vector B</h3>
              <div className="flex gap-4">
                {['x', 'y', 'z'].map(axis => (
                  <div key={`b-${axis}`} className="flex flex-col">
                    <label className="text-gray-400 text-sm mb-1 uppercase">{axis}</label>
                    <input 
                      type="number" 
                      value={vectorB[axis]}
                      onChange={(e) => handleChange(setVectorB, axis, e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-white w-24 focus:outline-none focus:border-rl-orange transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-black/40 rounded-xl p-6 border border-white/10 text-gray-300 font-mono space-y-4">
            <h3 className="text-xl text-white mb-2 font-sans font-semibold text-center">Visualización y Resultados</h3>
            
            {/* SVG Canvas para Vectores (Vista XY) */}
            <div className="relative w-full max-w-[200px] aspect-square mx-auto bg-gray-900/50 border border-white/20 rounded-md overflow-hidden mb-4">
              <svg viewBox="-20 -20 40 40" className="absolute inset-0 w-full h-full overflow-visible">
                {/* Cuadrícula */}
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                </pattern>
                <rect x="-20" y="-20" width="40" height="40" fill="url(#grid)" />
                
                {/* Ejes */}
                <line x1="-20" y1="0" x2="20" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                <line x1="0" y1="-20" x2="0" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />

                {/* Vector A */}
                <motion.line 
                  x1="0" y1="0" 
                  x2={vectorA.x} y2={-vectorA.y} 
                  stroke="#00BFFF" 
                  strokeWidth="0.8" 
                  markerEnd="url(#arrow-a)"
                  animate={{ x2: vectorA.x, y2: -vectorA.y }}
                />

                {/* Vector B */}
                <motion.line 
                  x1="0" y1="0" 
                  x2={vectorB.x} y2={-vectorB.y} 
                  stroke="#FF8C00" 
                  strokeWidth="0.8" 
                  markerEnd="url(#arrow-b)"
                  animate={{ x2: vectorB.x, y2: -vectorB.y }}
                />

                {/* Vector Suma */}
                <motion.line 
                  x1="0" y1="0" 
                  x2={resultados.suma.x} y2={-resultados.suma.y} 
                  stroke="#a78bfa" 
                  strokeWidth="0.8" 
                  strokeDasharray="1,1"
                  markerEnd="url(#arrow-sum)"
                  animate={{ x2: resultados.suma.x, y2: -resultados.suma.y }}
                />

                <defs>
                  <marker id="arrow-a" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#00BFFF" />
                  </marker>
                  <marker id="arrow-b" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#FF8C00" />
                  </marker>
                  <marker id="arrow-sum" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#a78bfa" />
                  </marker>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 p-2 rounded">
                <p className="text-purple-400 font-bold mb-1">Suma (A + B)</p>
                <p>{formatearVector(resultados.suma)}</p>
              </div>

              <div className="bg-white/5 p-2 rounded">
                <p className="text-green-400 font-bold mb-1">P. Punto (A · B)</p>
                <p>{resultados.dot.toFixed(4)}</p>
              </div>

              <div className="bg-white/5 p-2 rounded col-span-2">
                <p className="text-pink-400 font-bold mb-1">Ángulo entre A y B</p>
                <p>{resultados.anguloDeg.toFixed(2)}° <span className="text-gray-400 ml-2">
                  {resultados.anguloDeg < 90 && "→ Similares"}
                  {resultados.anguloDeg > 90 && "→ Opuestos"}
                  {resultados.anguloDeg === 90 && "→ Perpendiculares"}
                </span></p>
              </div>

              <div className="bg-white/5 p-2 rounded col-span-2 flex justify-between">
                <div>
                  <p className="text-rl-blue font-bold mb-1">Norm A | {resultados.magA.toFixed(1)}</p>
                  <p>{formatearVector(resultados.normA)}</p>
                </div>
                <div className="text-right">
                  <p className="text-rl-orange font-bold mb-1">Norm B | {resultados.magB.toFixed(1)}</p>
                  <p>{formatearVector(resultados.normB)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VectorSimulator;
