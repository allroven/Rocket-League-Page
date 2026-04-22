import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Cpu, Box, CircleDashed } from 'lucide-react';

export default function HomeSection() {
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
      <motion.div variants={itemVariants} className="text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-600 tracking-tight">
          Rocket League
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-light max-w-3xl mx-auto leading-relaxed">
          La matemática y la física determinística detrás del competitivo
        </p>
      </motion.div>

      {/* Main Description */}
      <motion.div variants={itemVariants} className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-slate-700/50 shadow-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Gamepad2 size={120} />
        </div>
        <div className="relative z-10 space-y-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Gamepad2 className="text-blue-400" />
            Descripción del Videojuego
          </h2>
          <p className="text-lg leading-relaxed text-slate-300">
            Rocket League es un videojuego de deportes desarrollado por Psyonix, que combina elementos del fútbol con vehículos impulsados por cohetes en un entorno tridimensional. El objetivo principal del juego es anotar goles golpeando una pelota de gran tamaño utilizando automóviles que pueden desplazarse, saltar, girar y acelerar dentro de una arena cerrada.
          </p>
          <p className="text-lg leading-relaxed text-slate-300">
            El videojuego se desarrolla en un espacio tridimensional donde los objetos (vehículos, pelota y escenario) se mueven de acuerdo con principios matemáticos y geométricos, tales como sistemas de coordenadas, vectores de dirección, ángulos, trayectorias y detección de colisiones. Además, el juego incorpora conceptos de física básica, como velocidad, aceleración y rebotes, para simular movimientos realistas.
          </p>
          <p className="text-lg leading-relaxed text-slate-300 bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
            Debido a estas características, Rocket League representa un ejemplo adecuado para analizar la aplicación de la matemática y la lógica de programación en el desarrollo de videojuegos, permitiendo comprender cómo los conceptos geométricos son fundamentales para la interacción entre los elementos del juego.
          </p>
        </div>
      </motion.div>

      {/* Media Section: Image and Video */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl relative aspect-video group">
          <img 
            src="https://cdn2.unrealengine.com/rocket-league-free-to-play-1920x1080-60b701297588.jpg" 
            alt="Rocket League Gameplay" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex items-end p-6">
            <h3 className="text-xl font-bold text-white text-shadow">Visuales del Juego</h3>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl relative aspect-video bg-slate-900">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/SgSX3gOrj60?autoplay=0" 
            title="Rocket League Trailer" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>

      {/* Grid Features */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* PhysX */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl hover:shadow-emerald-500/10 transition-shadow">
          <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Cpu size={32} className="text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">El Motor Físico</h3>
          <p className="text-slate-400 leading-relaxed">
            <strong className="text-emerald-300">PhysX Personalizado:</strong> Es único porque opera de manera determinística. Esto significa que, si se aplican exactamente las mismas fuerzas en el mismo microsegundo, el resultado será siempre idéntico, lo cual es vital para el juego competitivo.
          </p>
        </motion.div>

        {/* Hitboxes */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl hover:shadow-blue-500/10 transition-shadow">
          <div className="bg-blue-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <Box size={32} className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Modelado del Vehículo</h3>
          <div className="space-y-3 text-slate-400 leading-relaxed text-sm">
            <p>
              Aunque los autos se ven diferentes visualmente, el motor físico los simplifica para realizar cálculos rápidos:
            </p>
            <p>
              <strong className="text-blue-300">Cajas Orientadas (OBB):</strong> El motor no calcula cada detalle del chasis, sino que utiliza una "caja de colisión" invisible.
            </p>
            <p>
              <strong className="text-blue-300">Interacción Matemática:</strong> Cuando el balón toca el auto, el motor calcula el punto de contacto y el vector normal de la cara de la caja para determinar la dirección del rebote.
            </p>
          </div>
        </motion.div>

        {/* The Ball */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-xl hover:shadow-pink-500/10 transition-shadow">
          <div className="bg-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
            <CircleDashed size={32} className="text-pink-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Dinámica de la Esfera</h3>
          <div className="space-y-3 text-slate-400 leading-relaxed text-sm">
            <p>
              El balón es el elemento más complejo del motor:
            </p>
            <p>
              <strong className="text-pink-300">Magnus Effect (Simulado):</strong> El motor calcula la rotación (spin) del balón. Si el balón gira mientras vuela, su trayectoria se altera ligeramente, permitiendo tiros con curva.
            </p>
            <p>
              <strong className="text-pink-300">Coeficiente de Restitución:</strong> Es la variable matemática que define qué tanta energía se pierde en un choque. Se ajusta para que el balón se sienta "pesado" pero elástico.
            </p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
