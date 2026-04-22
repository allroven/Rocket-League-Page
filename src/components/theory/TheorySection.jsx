import React from 'react';
import { motion } from 'framer-motion';
import { Cuboid, Move3d, FastForward, ActivitySquare, BookOpen } from 'lucide-react';

export default function TheorySection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-12 text-slate-200"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 tracking-tight flex items-center justify-center gap-4">
          <BookOpen className="text-indigo-400" size={48} />
          Teoría Matemática
        </h1>
        <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
          Principales conceptos geométricos y matemáticos utilizados en el desarrollo de videojuegos.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* 3.1 Sistemas de coordenadas */}
        <motion.div variants={itemVariants} className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 border border-indigo-500/30 shadow-xl hover:shadow-indigo-500/20 transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-500/20 p-3 rounded-xl">
              <Cuboid className="text-indigo-400" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              3.1 Sistemas de coordenadas
            </h2>
          </div>
          <p className="text-slate-300 leading-relaxed">
            En un entorno tridimensional cada objeto se representa mediante un sistema de coordenadas cartesianas definido por los ejes <strong className="text-white">X, Y y Z</strong>. Esto permite ubicar con precisión cualquier elemento dentro del espacio virtual (Akenine-Möller et al., 2018).
          </p>
        </motion.div>

        {/* 3.2 Vectores y operaciones */}
        <motion.div variants={itemVariants} className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 border border-purple-500/30 shadow-xl hover:shadow-purple-500/20 transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-500/20 p-3 rounded-xl">
              <Move3d className="text-purple-400" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
              3.2 Vectores y operaciones
            </h2>
          </div>
          <p className="text-slate-300 leading-relaxed mb-4">
            Un vector en 3D se representa como: <code className="bg-slate-900 px-2 py-1 rounded text-purple-300 font-mono">v = (x, y, z)</code>
          </p>
          <p className="text-slate-300 mb-2">Entre las operaciones más utilizadas se encuentran:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 mb-4 ml-2">
            <li>Suma de vectores</li>
            <li>Producto punto</li>
            <li>Producto cruz</li>
            <li>Normalización</li>
          </ul>
          <p className="text-slate-300 leading-relaxed mb-4">
            El producto punto se define como: <br/>
            <code className="bg-slate-900 px-3 py-1.5 rounded text-purple-300 font-mono block mt-2 w-fit">A · B = |A| |B| cos(θ)</code>
          </p>
          <p className="text-slate-400 text-sm">
            Esta operación permite calcular el ángulo entre dos vectores y es utilizada en iluminación, colisiones y determinación de direcciones (Lengyel, 2012).
          </p>
        </motion.div>

        {/* 3.3 Movimiento y dinámica */}
        <motion.div variants={itemVariants} className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 border border-blue-500/30 shadow-xl hover:shadow-blue-500/20 transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-500/20 p-3 rounded-xl">
              <FastForward className="text-blue-400" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
              3.3 Movimiento y dinámica
            </h2>
          </div>
          <p className="text-slate-300 leading-relaxed mb-4">
            El movimiento rectilíneo uniforme puede modelarse mediante:
            <code className="bg-slate-900 px-3 py-1.5 rounded text-blue-300 font-mono block mt-2 w-fit">x = x₀ + v·t</code>
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            Mientras que el movimiento con aceleración constante se describe mediante:
            <code className="bg-slate-900 px-3 py-1.5 rounded text-blue-300 font-mono block mt-2 w-fit">v = v₀ + a·t</code>
          </p>
          <p className="text-slate-400 text-sm">
            Estas ecuaciones permiten simular desplazamientos realistas dentro del entorno del videojuego.
          </p>
        </motion.div>

        {/* 3.4 Cálculo de rebotes */}
        <motion.div variants={itemVariants} className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 border border-pink-500/30 shadow-xl hover:shadow-pink-500/20 transition-all group">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-pink-500/20 p-3 rounded-xl">
              <ActivitySquare className="text-pink-400" size={28} />
            </div>
            <h2 className="text-2xl font-bold text-white group-hover:text-pink-300 transition-colors">
              3.4 Cálculo de rebotes
            </h2>
          </div>
          <p className="text-slate-300 leading-relaxed mb-4">
            Cuando un objeto impacta contra una superficie, la nueva dirección del movimiento puede calcularse mediante la fórmula de reflexión:
            <code className="bg-slate-900 px-3 py-1.5 rounded text-pink-300 font-mono block mt-2 w-fit">R = V - 2(V · N)N</code>
          </p>
          <p className="text-slate-300 mb-2">Donde:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1 mb-4 ml-2">
            <li><strong className="text-white">V</strong> es el vector velocidad inicial.</li>
            <li><strong className="text-white">N</strong> es el vector normal de la superficie.</li>
            <li><strong className="text-white">R</strong> es el vector reflejado.</li>
          </ul>
          <p className="text-slate-400 text-sm">
            Esta fórmula es ampliamente utilizada en motores físicos para simular rebotes (Lengyel, 2012).
          </p>
        </motion.div>

      </div>

      {/* Librerías, algoritmos y herramientas matemáticas */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BookOpen size={160} />
        </div>
        <div className="relative z-10 space-y-4 max-w-5xl">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <ActivitySquare className="text-indigo-400" />
            Librerías, Algoritmos y Herramientas Matemáticas
          </h2>
          <p className="text-lg leading-relaxed text-slate-300">
            En la actualidad, el desarrollo de videojuegos se apoya en motores de alto rendimiento como <strong className="text-white">Unity y Unreal Engine</strong>. Estas plataformas no son solo entornos de diseño sino complejos sistemas matemáticos capaces de procesar en tiempo real la iluminación, las transformaciones geométricas y las físicas de la escena (Epic Games, 2023; Unity Technologies, 2023). 
          </p>
          <p className="text-lg leading-relaxed text-slate-300">
            Para la simulación de interacciones dinámicas se suelen integrar soluciones especializadas como <strong className="text-white">NVIDIA PhysX</strong>. Este motor físico utiliza modelos matemáticos deterministas para asegurar que los objetos reaccionen de forma coherente y predecible ante cualquier fuerza (NVIDIA, 2023). 
          </p>
          <p className="text-lg leading-relaxed text-slate-300 bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/20">
            El valor real de estas herramientas reside en sus <strong className="text-indigo-300">algoritmos optimizados</strong>. Estos están diseñados específicamente para resolver cálculos de colisiones, detección de intersecciones y aplicación de fuerzas de manera masiva garantizando que la simulación física no afecte la fluidez (tasa de frames) del juego.
          </p>
        </div>
      </motion.div>

    </motion.div>
  );
}
