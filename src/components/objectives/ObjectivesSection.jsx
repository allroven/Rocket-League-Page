import React from 'react';
import { motion } from 'framer-motion';
import { Target, ListChecks, BrainCircuit, Code, Compass } from 'lucide-react';

export default function ObjectivesSection() {
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

  const specificObjectives = [
    {
      icon: <Compass className="text-blue-400" size={32} />,
      title: "Reconocer Conceptos Matemáticos",
      text: "Reconocer los principales conceptos geométricos y matemáticos presentes en Rocket League, tales como sistemas de coordenadas, vectores, ángulos, movimientos y colisiones.",
      gradient: "from-blue-900/50 to-blue-800/30",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <BrainCircuit className="text-emerald-400" size={32} />,
      title: "Analizar la Relación Práctica",
      text: "Analizar la relación entre la matemática y la informática en el funcionamiento del videojuego, específicamente en el movimiento e interacción de los objetos dentro del entorno del juego.",
      gradient: "from-emerald-900/50 to-emerald-800/30",
      borderColor: "border-emerald-500/30"
    },
    {
      icon: <Code className="text-pink-400" size={32} />,
      title: "Aplicar la Lógica de Programación",
      text: "Aplicar la lógica de programación para representar algunos de estos conceptos geométricos mediante la creación de algoritmos y fragmentos de código en PSeInt y/o Python.",
      gradient: "from-pink-900/50 to-pink-800/30",
      borderColor: "border-pink-500/30"
    },
    {
      icon: <Target className="text-yellow-400" size={32} />,
      title: "Desarrollar Habilidades Cognitivas",
      text: "Desarrollar habilidades de razonamiento lógico y pensamiento computacional a partir de la simulación de situaciones presentes en el videojuego.",
      gradient: "from-yellow-900/50 to-yellow-800/30",
      borderColor: "border-yellow-500/30"
    }
  ];

  return (
    <motion.div 
      className="space-y-12 text-slate-200"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 tracking-tight flex items-center justify-center gap-4">
          <Target className="text-orange-500" size={48} />
          Objetivos del Proyecto
        </h1>
        <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
          Fundamentos académicos detrás del análisis del motor físico de Rocket League.
        </p>
      </motion.div>

      {/* Objetivo General */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-orange-500/30 shadow-[0_0_40px_rgba(249,115,22,0.1)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Target size={160} />
        </div>
        <div className="relative z-10 space-y-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-widest text-sm flex items-center gap-2 mb-2">
             OBJETIVO GENERAL
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-slate-200 font-medium">
            Comprender la aplicación de conceptos geométricos y matemáticos en el desarrollo de videojuegos, mediante el análisis del videojuego Rocket League y la representación de dichos conceptos a través de algoritmos y programación básica utilizando herramientas como PSeInt y Python.
          </p>
        </div>
      </motion.div>

      {/* Objetivos Específicos Grid */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center gap-3">
          <ListChecks className="text-slate-400" size={28} />
          <h2 className="text-2xl font-bold text-white">Objetivos Específicos</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {specificObjectives.map((obj, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants} 
              className={`bg-gradient-to-br ${obj.gradient} p-8 rounded-3xl border ${obj.borderColor} shadow-lg hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-start gap-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl shrink-0">
                  {obj.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    <span className="text-slate-400 mr-2">{idx + 1}.</span> 
                    {obj.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {obj.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
