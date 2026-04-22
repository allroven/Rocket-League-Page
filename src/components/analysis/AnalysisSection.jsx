import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Calculator, Map, MoveRight, Box, ActivitySquare, ArrowDownToDot, Rotate3d, Play, Car
} from 'lucide-react';

export default function AnalysisSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // 1. Coordenadas
  const [coordX, setCoordX] = useState(120);
  const [coordY, setCoordY] = useState(-50);
  const [coordZ, setCoordZ] = useState(95);

  // 2. Vectores (MRU)
  const mruControls = useAnimation();
  const [mruVx, setMruVx] = useState(100);
  const [mruVy, setMruVy] = useState(-50);
  
  const playMRU = async () => {
    await mruControls.start({ x: 0, y: 0, transition: { duration: 0 } });
    await mruControls.start({ x: Number(mruVx), y: Number(mruVy), transition: { duration: 1, ease: "linear" } });
  };

  // 3. Colisiones OBB
  const [boxHit, setBoxHit] = useState(false);
  const handleObbMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 150; 
    const y = e.clientY - rect.top - 150;
    if (x > -50 && x < 50 && y > -50 && y < 50) setBoxHit(true);
    else setBoxHit(false);
  };

  // 4. Rebote Matemático
  const [incAngle, setIncAngle] = useState(45);
  const rad = (incAngle * Math.PI) / 180;
  const vX = Math.sin(rad) * 100;
  const vY = Math.cos(rad) * 100;
  const rX = Math.sin(rad) * 100;
  const rY = -Math.cos(rad) * 100;

  // 5. Gravedad
  const gravControls = useAnimation();
  const playGravity = async () => {
    await gravControls.start({ x: 0, y: 0, transition: { duration: 0 } });
    await gravControls.start({
      x: 200, 
      y: [0, -100, 0], 
      transition: { duration: 1.5, ease: "easeInOut", times: [0, 0.5, 1] }
    });
  };

  // 6. Rotación
  const [theta, setTheta] = useState(0);

  return (
    <motion.div className="space-y-12 text-slate-200" initial="hidden" animate="visible" variants={containerVariants}>
      
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 tracking-tight flex items-center justify-center gap-4">
          <Calculator className="text-teal-400" size={48} />
          Análisis Matemático
        </h1>
        <p className="text-xl text-slate-400 font-light max-w-3xl mx-auto">
          Análisis de la geometría y matemática presente en el videojuego Rocket League.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
        <p className="text-lg leading-relaxed text-slate-300">
          El videojuego Rocket League integra múltiples conceptos geométricos y matemáticos que permiten simular de forma coherente el movimiento, las colisiones y la interacción entre objetos en un entorno tridimensional. A continuación, se analizan los principales conceptos aplicados directamente dentro del juego.
        </p>
      </motion.div>

      <div className="space-y-12">
        
        {/* 1. Sistemas de coordenadas */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-teal-500/30 shadow-xl group">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
            <div className="bg-teal-500/20 p-3 rounded-xl"><Map className="text-teal-400" size={28} /></div>
            <h2 className="text-2xl font-bold text-white">1. Sistemas de coordenadas en el entorno tridimensional</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-300">Rocket League se desarrolla en un espacio tridimensional definido por un sistema de coordenadas cartesianas (X, Y, Z).</p>
              <ul className="list-disc list-inside text-slate-400 ml-4 space-y-1">
                <li><strong className="text-teal-300">Eje X:</strong> desplazamiento lateral.</li>
                <li><strong className="text-teal-300">Eje Y:</strong> desplazamiento longitudinal (hacia las porterías).</li>
                <li><strong className="text-teal-300">Eje Z:</strong> altura respecto al suelo.</li>
              </ul>
              <p className="text-slate-300">Cada objeto del juego posee una posición representada como <code className="text-white bg-slate-950 px-2 py-1 rounded">P = (x, y, z)</code>. Por ejemplo, si el balón se encuentra en:</p>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-teal-300 w-fit border border-slate-800">
                P = (120, -350, 95)
              </div>
              <ul className="list-disc list-inside text-slate-400 ml-4 space-y-1">
                <li>Está desplazado 120 unidades en el eje X.</li>
                <li>350 unidades en dirección negativa del eje Y.</li>
                <li>95 unidades por encima del suelo.</li>
              </ul>
              <div className="bg-teal-900/20 p-4 rounded-xl border border-teal-500/20 text-slate-300 text-sm">
                Cuando el valor en el eje Y sobrepasa el límite del campo el sistema detecta un gol. Esto demuestra cómo una comparación matemática entre coordenadas permite definir reglas fundamentales del juego.
              </div>
            </div>

            <div className="space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-teal-400 font-bold text-sm uppercase tracking-widest">Simulador de Coordenadas</p>
                <div>
                  <label className="text-slate-400 text-sm font-bold flex justify-between">Eje X <span>{coordX}</span></label>
                  <input type="range" min="-100" max="100" value={coordX} onChange={e=>setCoordX(e.target.value)} className="w-full accent-teal-500" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-bold flex justify-between">Eje Y <span>{coordY}</span></label>
                  <input type="range" min="-100" max="100" value={coordY} onChange={e=>setCoordY(e.target.value)} className="w-full accent-teal-500" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-bold flex justify-between">Eje Z <span>{coordZ}</span></label>
                  <input type="range" min="10" max="200" value={coordZ} onChange={e=>setCoordZ(e.target.value)} className="w-full accent-teal-500" />
                </div>
              </div>
              
              <div className="relative w-full h-48 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden mt-4">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                <div className="absolute w-full h-px bg-teal-500/50"></div>
                <div className="absolute h-full w-px bg-teal-500/50"></div>
                <div 
                  className="absolute bg-teal-400 rounded-full transition-all duration-75"
                  style={{
                    transform: `translate(${coordX}px, ${coordY}px)`, width: `${coordZ / 3}px`, height: `${coordZ / 3}px`,
                    boxShadow: `0 ${coordZ / 2}px ${coordZ / 2}px rgba(0,0,0,0.5)`
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. Movimiento mediante vectores */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-blue-500/30 shadow-xl group">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
            <div className="bg-blue-500/20 p-3 rounded-xl"><MoveRight className="text-blue-400" size={28} /></div>
            <h2 className="text-2xl font-bold text-white">2. Movimiento mediante vectores</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-300">El movimiento del balón y de los vehículos se calcula mediante vectores de velocidad. Si el balón tiene una velocidad:</p>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-blue-300 w-fit border border-slate-800">
                v = (10, 5, 8)
              </div>
              <ul className="list-disc list-inside text-slate-400 ml-4 space-y-1">
                <li>Movimiento de 10 unidades por segundo en X.</li>
                <li>5 unidades por segundo en Y.</li>
                <li>8 unidades por segundo en Z.</li>
              </ul>
              <p className="text-slate-300">La nueva posición del balón después de un intervalo de tiempo t se calcula como: <code className="text-white bg-slate-950 px-2 py-1 rounded">P_nueva = P_actual + v · t</code></p>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-slate-300 border border-slate-800 space-y-2">
                <p className="text-slate-500">/* Si transcurre 1 segundo */</p>
                <p>P_nueva = (120, -350, 95) + (10, 5, 8)</p>
                <p className="text-blue-400 font-bold">P_nueva = (130, -345, 103)</p>
              </div>
              <p className="text-slate-400 text-sm">Este cálculo ocurre continuamente en cada frame del juego, permitiendo que el movimiento sea fluido y coherente con el tiempo real.</p>
            </div>

            <div className="space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-blue-400 font-bold text-sm uppercase tracking-widest">Simulador Vectorial</p>
                <div>
                  <label className="text-slate-400 text-sm font-bold flex justify-between">V.x <span>{mruVx}</span></label>
                  <input type="range" min="-120" max="120" value={mruVx} onChange={e=>setMruVx(e.target.value)} className="w-full accent-blue-500" />
                </div>
                <div>
                  <label className="text-slate-400 text-sm font-bold flex justify-between">V.y <span>{mruVy}</span></label>
                  <input type="range" min="-120" max="120" value={mruVy} onChange={e=>setMruVy(e.target.value)} className="w-full accent-blue-500" />
                </div>
                <button onClick={playMRU} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex justify-center gap-2"><Play size={18}/> Animar Movimiento (1s)</button>
              </div>
              <div className="relative w-full h-48 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden mt-4">
                 <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                 <div className="absolute w-2 h-2 bg-slate-500 rounded-full" /> {/* Origen */}
                 <motion.div animate={mruControls} className="absolute bg-blue-500 w-6 h-6 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] border-2 border-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Detección de colisiones */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-orange-500/30 shadow-xl group">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
            <div className="bg-orange-500/20 p-3 rounded-xl"><Box className="text-orange-400" size={28} /></div>
            <h2 className="text-2xl font-bold text-white">3. Detección de colisiones con hitboxes (OBB)</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-slate-300">Aunque los vehículos tienen formas complejas, el motor físico los simplifica utilizando cajas orientadas conocidas como <strong className="text-orange-300">OBB (Oriented Bounding Boxes)</strong>.</p>
              <p className="text-slate-300">Cuando el balón impacta el vehículo:</p>
              <ol className="list-decimal list-inside text-slate-400 ml-4 space-y-2">
                <li>Se calcula el punto de contacto.</li>
                <li>Se obtiene el vector normal de la superficie impactada.</li>
                <li>Se aplica una operación matemática para determinar la nueva dirección del movimiento.</li>
              </ol>
              <div className="bg-orange-900/20 p-4 rounded-xl border border-orange-500/20 text-slate-300 text-sm">
                Esta simplificación reduce significativamente la carga computacional y permite realizar cálculos de colisión en tiempo real sin afectar el rendimiento del juego.
              </div>
            </div>

            <div className="space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 text-center">
               <p className="text-orange-400 font-bold text-sm uppercase tracking-widest text-left">Radar Interactivo OBB</p>
               <p className="text-slate-400 text-sm mb-4 text-left">Mueve tu cursor por el recuadro negro para interactuar como si fueras la pelota.</p>
               <div className="relative w-full h-64 bg-slate-950 rounded-xl border-2 border-slate-700 flex items-center justify-center overflow-hidden cursor-crosshair mx-auto" onMouseMove={handleObbMove} onMouseLeave={()=>setBoxHit(false)}>
                  <div className={`absolute transition-all duration-200 border-4 w-[100px] h-[100px] flex flex-col items-center justify-center font-mono font-bold ${boxHit ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'bg-orange-500/10 border-orange-500/50 text-orange-400'}`}>
                    <span>{boxHit ? '¡COLISIÓN!' : 'OBB Segura'}</span>
                  </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Cálculo matemático del rebote */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-pink-500/30 shadow-xl group">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
            <div className="bg-pink-500/20 p-3 rounded-xl"><ActivitySquare className="text-pink-400" size={28} /></div>
            <h2 className="text-2xl font-bold text-white">4. Cálculo matemático del rebote</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-300">Cuando el balón golpea una pared o un vehículo, se utiliza la fórmula de reflexión:</p>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-pink-400 font-bold w-fit border border-slate-800 text-lg">
                R = V − 2(V · N)N
              </div>
              <ul className="list-disc list-inside text-slate-400 ml-4 space-y-1">
                <li><strong className="text-white">V</strong> es el vector de velocidad inicial.</li>
                <li><strong className="text-white">N</strong> es el vector normal de la superficie.</li>
                <li><strong className="text-white">R</strong> es el vector reflejado.</li>
              </ul>
              
              <h3 className="text-lg font-bold text-white mt-6">Ejemplo paso a paso:</h3>
              <div className="bg-slate-950 p-6 rounded-xl font-mono text-slate-300 border border-slate-800 space-y-4 text-sm">
                <div><p className="text-slate-500">/* Si el balón se mueve con: */</p><p>V = (5, -3, 0)</p></div>
                <div><p className="text-slate-500">/* Y golpea una pared cuya normal es: */</p><p>N = (0, 1, 0)</p></div>
                <div><p className="text-slate-500">/* 1. Producto punto: */</p><p>V · N = (5)(0) + (-3)(1) + (0)(0)</p><p className="text-pink-300">V · N = -3</p></div>
                <div><p className="text-slate-500">/* 2. Se aplica la fórmula: */</p><p>R = (5, -3, 0) − 2(-3)(0, 1, 0)</p><p>R = (5, -3, 0) − (-6)(0, 1, 0)</p></div>
                <div><p className="text-slate-500">/* 3. Multiplicando: */</p><p>2(V · N)N = -6(0, 1, 0) = (0, -6, 0)</p></div>
                <div><p className="text-slate-500">/* 4. Finalmente: */</p><p>R = (5, -3, 0) − (0, -6, 0)</p><p className="text-pink-400 font-bold text-lg">R = (5, 3, 0)</p></div>
              </div>
              <p className="text-slate-400 text-sm">El componente en Y cambia de -3 a 3, invirtiendo la dirección simulando el rebote.</p>
            </div>

            <div className="space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-pink-400 font-bold text-sm uppercase tracking-widest">Simulador de Reflexión</p>
                <div>
                  <label className="text-slate-400 text-sm font-bold flex justify-between">Ángulo de Incidencia <span>{incAngle}°</span></label>
                  <input type="range" min="10" max="80" value={incAngle} onChange={e=>setIncAngle(e.target.value)} className="w-full accent-pink-500" />
                </div>
                <div className="font-mono text-sm space-y-2 text-slate-300">
                  <p>V = ({vX.toFixed(1)}, {-vY.toFixed(1)})</p>
                  <p className="text-pink-400 font-bold">R = ({rX.toFixed(1)}, {rY.toFixed(1)})</p>
                </div>
              </div>

              <div className="relative w-full h-64 bg-slate-900 rounded-xl border border-slate-700 flex items-end justify-center overflow-hidden pb-8 mt-4">
                <div className="absolute bottom-0 w-full h-8 bg-slate-600 border-t-4 border-slate-400"></div>
                <div className="absolute bottom-8 w-1 h-32 bg-yellow-400/50"></div>
                <svg className="absolute bottom-8 w-full h-full overflow-visible" style={{ transform: 'translateY(-100%)' }}>
                  <line x1="50%" y1="100%" x2={`calc(50% - ${vX}px)`} y2={`calc(100% - ${vY}px)`} stroke="#3b82f6" strokeWidth="4" markerEnd="url(#arrow-blue)" />
                  <line x1="50%" y1="100%" x2={`calc(50% + ${rX}px)`} y2={`calc(100% - ${rY}px)`} stroke="#ec4899" strokeWidth="4" markerEnd="url(#arrow-pink)" />
                  <defs>
                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" /></marker>
                    <marker id="arrow-pink" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ec4899" /></marker>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 5. Aceleración y Gravedad */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-indigo-500/30 shadow-xl group">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
            <div className="bg-indigo-500/20 p-3 rounded-xl"><ArrowDownToDot className="text-indigo-400" size={28} /></div>
            <h2 className="text-2xl font-bold text-white">5. Movimiento con aceleración y gravedad</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-300">El balón no solo posee velocidad constante, sino que también está sujeto a aceleración. La ecuación que describe este comportamiento es:</p>
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-indigo-300 w-fit border border-slate-800">
                v = v₀ + at
              </div>
              <p className="text-slate-300">
                En Rocket League, la gravedad actúa principalmente sobre el <strong className="text-indigo-300">eje Z</strong> reduciendo progresivamente la velocidad vertical del balón cuando este está en el aire. Esto explica por qué el balón describe trayectorias parabólicas durante los disparos elevados o los despejes largos.
              </p>
            </div>

            <div className="space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
               <div className="space-y-4">
                 <p className="text-indigo-400 font-bold text-sm uppercase tracking-widest">Simulador Cinemático</p>
                 <button onClick={playGravity} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-bold flex justify-center gap-2"><Play size={18}/> Lanzar Disparo Parabólico</button>
               </div>
               
               <div className="relative w-full h-48 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex items-end mt-4">
                 <div className="absolute bottom-0 w-full h-12 bg-emerald-900/50 border-t border-emerald-500/30"></div>
                 <motion.div animate={gravControls} className="absolute left-8 bottom-12 bg-white w-8 h-8 rounded-full shadow-lg border-2 border-indigo-200" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 6. Rotaciones */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-purple-500/30 shadow-xl group">
          <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
            <div className="bg-purple-500/20 p-3 rounded-xl"><Rotate3d className="text-purple-400" size={28} /></div>
            <h2 className="text-2xl font-bold text-white">6. Rotaciones y transformaciones espaciales</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-300">
                En Rocket League los vehículos no solo se trasladan, sino que también rotan continuamente sobre sus ejes para cambiar de dirección o realizar maniobras aéreas. Una rotación puede representarse mediante matrices de transformación.
              </p>
              <p className="text-slate-300">Una rotación alrededor del eje Z se representa como:</p>
              
              <div className="bg-slate-950 p-6 rounded-xl font-mono text-purple-300 w-fit border border-slate-800 text-center flex flex-col md:flex-row items-center gap-4">
                <div>Rz(θ) =</div>
                <div className="flex flex-col items-center justify-center border-l-2 border-r-2 border-purple-500/50 px-2 py-1 leading-loose tracking-wider">
                  <div>[ cosθ  -sinθ   0 ]</div>
                  <div>[ sinθ   cosθ   0 ]</div>
                  <div>[   0      0    1 ]</div>
                </div>
              </div>
              
              <p className="text-slate-300">Si un vector posición del automóvil es <code className="text-white bg-slate-950 px-2 py-1 rounded">P = (x, y, z)</code>, al aplicar la matriz de rotación se obtiene una nueva orientación en el espacio.</p>
              <ul className="list-disc list-inside text-slate-400 ml-4 space-y-1">
                <li>Gire sobre sí mismo.</li>
                <li>Cambie su orientación en el aire.</li>
                <li>Realice movimientos acrobáticos.</li>
              </ul>
              <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/20 text-slate-300 text-sm">
                En motores modernos estas rotaciones suelen implementarse mediante <strong className="text-purple-300">cuaterniones</strong> ya que evitan problemas como el “gimbal lock” y permiten interpolaciones suaves entre orientaciones.
              </div>
            </div>

            <div className="space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-purple-400 font-bold text-sm uppercase tracking-widest">Calculadora de Rotación</p>
                <div>
                  <label className="text-slate-400 text-sm font-bold flex justify-between">Ángulo θ (Yaw) <span>{theta}°</span></label>
                  <input type="range" min="0" max="360" value={theta} onChange={e=>setTheta(e.target.value)} className="w-full accent-purple-500" />
                </div>
                
                <div className="font-mono text-xs text-purple-300 flex justify-center py-4 bg-slate-900 rounded-xl mt-4">
                  <div className="flex flex-col items-center border-l-2 border-r-2 border-purple-500/50 px-2 tracking-widest leading-loose">
                    <div>[{Math.cos(theta*Math.PI/180).toFixed(2)}  {-Math.sin(theta*Math.PI/180).toFixed(2)}]</div>
                    <div>[{Math.sin(theta*Math.PI/180).toFixed(2)}   {Math.cos(theta*Math.PI/180).toFixed(2)}]</div>
                  </div>
                </div>
              </div>

              <div className="relative w-full h-48 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden mt-4">
                <div className="absolute w-full h-px bg-slate-700"></div>
                <div className="absolute h-full w-px bg-slate-700"></div>
                <div 
                  className="bg-purple-500/20 border-2 border-purple-500 w-24 h-12 rounded-lg flex items-center justify-center transition-all duration-75 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                  style={{ transform: `rotate(${theta}deg)` }}
                >
                  <Car className="text-purple-300" size={24} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
