import React, { useState, useEffect, useRef } from 'react';
import { Vector3D } from '../../math/Vector3D';
import { Play, RotateCcw, AlertCircle, CheckCircle, Crosshair, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const FIELD_LIMIT = 5120;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;
const SCALE = CANVAS_HEIGHT / (FIELD_LIMIT * 2);

export default function RocketMathSimulator() {
  const canvasRef = useRef(null);
  
  // 'mru_libre', 'bounce_libre', 'tests'
  const [mode, setMode] = useState('bounce_libre');
  const [testSubmode, setTestSubmode] = useState('mru');
  const [logs, setLogs] = useState([]);
  
  // Interactive MRU
  const [freeMruV, setFreeMruV] = useState({ x: 0, y: 1500, z: 0 });
  const [freeMruT, setFreeMruT] = useState(5);
  
  // Test Cases State
  const [testMruPos, setTestMruPos] = useState({ x: 120, y: -350, z: 95 });
  const [testMruV, setTestMruV] = useState({ x: 10, y: 5, z: 8 });
  const [testMruT, setTestMruT] = useState(1);
  
  const [testBounceV, setTestBounceV] = useState({ x: 5, y: -3, z: 0 });
  const [testBounceN, setTestBounceN] = useState({ x: 0, y: 1, z: 0 });

  const [testVecA, setTestVecA] = useState({ x: 3, y: 4, z: 0 });
  const [testVecB, setTestVecB] = useState({ x: 1, y: 0, z: 0 });

  const [ballPos, setBallPos] = useState(new Vector3D(0, 0, 0));
  const [isAnimating, setIsAnimating] = useState(false);
  const [goalAlert, setGoalAlert] = useState(false);
  
  // We use this to stop the intervals/raf
  const animationRef = useRef(null);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: message, type }]);
  };

  const drawField = (ctx) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Background grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for(let i = 0; i < CANVAS_WIDTH; i += 20) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_HEIGHT); ctx.stroke();
    }
    for(let i = 0; i < CANVAS_HEIGHT; i += 20) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_WIDTH, i); ctx.stroke();
    }

    // Origin (Center)
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    // Field boundaries
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);

    // Goals
    ctx.fillStyle = '#ef4444'; // Orange/Red goal
    ctx.fillRect(CANVAS_WIDTH/2 - 60, 0, 120, 10);
    ctx.fillStyle = '#3b82f6'; // Blue goal
    ctx.fillRect(CANVAS_WIDTH/2 - 60, CANVAS_HEIGHT - 10, 120, 10);

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
    ctx.strokeStyle = '#475569';
    ctx.stroke();
    
    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(CANVAS_WIDTH, centerY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(centerX, 0); ctx.lineTo(centerX, CANVAS_HEIGHT); ctx.stroke();
  };

  const drawBall = (ctx, pos, scaleMultiplier = 1) => {
    const x = CANVAS_WIDTH / 2 + pos.x * SCALE * scaleMultiplier;
    const y = CANVAS_HEIGHT / 2 - pos.y * SCALE * scaleMultiplier;
    
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#10b981';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const drawVector = (ctx, start, vec, color, label, scaleMultiplier = 1) => {
    const sx = CANVAS_WIDTH / 2 + start.x * SCALE * scaleMultiplier;
    const sy = CANVAS_HEIGHT / 2 - start.y * SCALE * scaleMultiplier;
    const ex = sx + vec.x * SCALE * scaleMultiplier;
    const ey = sy - vec.y * SCALE * scaleMultiplier;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    const angle = Math.atan2(ey - sy, ex - sx);
    ctx.lineTo(ex - 10 * Math.cos(angle - Math.PI / 6), ey - 10 * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex - 10 * Math.cos(angle + Math.PI / 6), ey - 10 * Math.sin(angle + Math.PI / 6));
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.font = 'bold 14px monospace';
    ctx.fillText(label, ex + 5, ey - 5);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (mode === 'tests') {
        // Redraw tests statically
        drawField(ctx);
        if (testSubmode === 'mru') drawBall(ctx, ballPos, 50);
        else if (testSubmode === 'bounce' || testSubmode === 'vector') drawBall(ctx, new Vector3D(0,0,0));
    } else {
        // Interactive modes
        drawField(ctx);
        drawBall(ctx, ballPos, 1);
    }
  }, [ballPos, mode, testSubmode]);

  const clearAnimations = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      cancelAnimationFrame(animationRef.current);
    }
    setIsAnimating(false);
    setGoalAlert(false);
  };

  const resetCanvas = () => {
    clearAnimations();
    setBallPos(new Vector3D(0, 0, 0));
    setLogs([]);
  };

  // --- INTERACTIVE METHODS ---
  const startInteractiveMRU = () => {
    if (isAnimating) return;
    resetCanvas();
    
    const v = new Vector3D(parseFloat(freeMruV.x), parseFloat(freeMruV.y), parseFloat(freeMruV.z));
    const t = parseFloat(freeMruT);
    
    addLog(`[Libre] Iniciando MRU interactivo...`, 'info');
    addLog(`V₀ = ${v.toString()}`, 'data');
    addLog(`t = ${t}s`, 'data');

    let startTime = null;
    const p0 = new Vector3D(0,0,0);
    setBallPos(p0);
    setIsAnimating(true);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 1000;

      if (progress < t) {
        const currentPos = p0.add(v.multiplyScalar(progress));
        setBallPos(currentPos);
        
        if (Math.abs(currentPos.y) >= FIELD_LIMIT) {
          setGoalAlert(true);
          addLog(`¡GOL DETECTADO! Posición Y: ${currentPos.y.toFixed(2)}`, 'header');
          setIsAnimating(false);
          return;
        }
        animationRef.current = requestAnimationFrame(animate);
      } else {
        const finalPos = p0.add(v.multiplyScalar(t));
        setBallPos(finalPos);
        addLog(`P_f alcanzada = ${finalPos.toString()}`, 'success');
        setIsAnimating(false);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleCanvasClick = (e) => {
    if (mode !== 'bounce_libre' || isAnimating) return;
    resetCanvas();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const worldX = (clickX - CANVAS_WIDTH / 2) / SCALE;
    const worldY = -(clickY - CANVAS_HEIGHT / 2) / SCALE;

    const target = new Vector3D(worldX, worldY, 0);
    const p0 = new Vector3D(0, 0, 0);
    
    let v = target.subtract(p0).normalize().multiplyScalar(1500); 
    
    addLog(`[Libre] Disparo hacia ${target.toString()}`, 'info');
    addLog(`V_inicial = ${v.toString()}`, 'data');

    setIsAnimating(true);
    let currentPos = p0;
    
    animationRef.current = setInterval(() => {
      currentPos = currentPos.add(v.multiplyScalar(0.016)); 
      
      const fieldWidthWorld = CANVAS_WIDTH / (2 * SCALE);
      
      if (Math.abs(currentPos.x) >= fieldWidthWorld) {
        const normal = new Vector3D(currentPos.x > 0 ? -1 : 1, 0, 0);
        const r = v.reflect(normal);
        
        addLog(`Colisión en Pared X: ${currentPos.x.toFixed(2)}`, 'warning');
        addLog(`Normal N = ${normal.toString()}`, 'data');
        addLog(`Reflejo R = ${r.toString()}`, 'success');
        
        const ctx = canvasRef.current.getContext('2d');
        drawVector(ctx, currentPos, normal.multiplyScalar(1000), '#facc15', 'N');
        drawVector(ctx, currentPos, r, '#ec4899', 'R');
        
        v = r;
      }
      
      if (Math.abs(currentPos.y) >= FIELD_LIMIT) {
        clearInterval(animationRef.current);
        setIsAnimating(false);
        setGoalAlert(true);
        addLog(`¡GOL DETECTADO!`, 'header');
      }
      
      setBallPos(currentPos);
    }, 16);
  };

  // --- STATIC TEST METHODS ---
  const runTestMRU = () => {
    clearAnimations(); setLogs([]);
    const p0 = new Vector3D(Number(testMruPos.x), Number(testMruPos.y), Number(testMruPos.z));
    const v = new Vector3D(Number(testMruV.x), Number(testMruV.y), Number(testMruV.z));
    const t = Number(testMruT);

    addLog(`[TEST] Caso 1: MRU`, 'header');
    addLog(`P_actual = ${p0.toString()}`, 'data');
    addLog(`v = ${v.toString()}`, 'data');
    addLog(`t = ${t}`, 'data');
    
    const vt = v.multiplyScalar(t);
    const pf = p0.add(vt);

    addLog(`Resultado: P_nueva = ${pf.toString()}`, 'success');

    // Visual animation scaled up 50x
    let startTime = null;
    setBallPos(p0);
    setIsAnimating(true);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 1000;
      if (progress < t) {
        setBallPos(p0.add(v.multiplyScalar(progress)));
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setBallPos(pf);
        setIsAnimating(false);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const runTestBounce = () => {
    clearAnimations(); setLogs([]);
    const v = new Vector3D(Number(testBounceV.x), Number(testBounceV.y), Number(testBounceV.z));
    const n = new Vector3D(Number(testBounceN.x), Number(testBounceN.y), Number(testBounceN.z));

    addLog(`[TEST] Caso 2: Rebote Vectorial`, 'header');
    addLog(`V = ${v.toString()}`, 'data');
    addLog(`N = ${n.toString()}`, 'data');

    const r = v.reflect(n);
    addLog(`Resultado: R = ${r.toString()}`, 'success');

    const ctx = canvasRef.current.getContext('2d');
    drawField(ctx);
    const center = new Vector3D(0, 0, 0);
    drawBall(ctx, center);
    drawVector(ctx, center, v, '#3b82f6', 'V', 1000);
    drawVector(ctx, center, n, '#facc15', 'N', 1000);
    drawVector(ctx, center, r, '#ec4899', 'R', 1000);
  };

  const runTestVector = () => {
    clearAnimations(); setLogs([]);
    const a = new Vector3D(Number(testVecA.x), Number(testVecA.y), Number(testVecA.z));
    const b = new Vector3D(Number(testVecB.x), Number(testVecB.y), Number(testVecB.z));

    addLog(`[TEST] Caso 3: Operaciones Vectoriales`, 'header');
    addLog(`A = ${a.toString()}`, 'data');
    addLog(`B = ${b.toString()}`, 'data');

    const sum = a.add(b);
    const dot = a.dot(b);
    const mag = a.magnitude();
    const norm = a.normalize();

    addLog(`Suma = ${sum.toString()}`, 'success');
    addLog(`Producto punto = ${dot}`, 'success');
    addLog(`|A| = ${mag}`, 'success');
    addLog(`A normalizado = ${norm.toString()}`, 'success');

    const ctx = canvasRef.current.getContext('2d');
    drawField(ctx);
    const center = new Vector3D(0, 0, 0);
    drawBall(ctx, center);
    drawVector(ctx, center, a, '#10b981', 'A', 500);
    drawVector(ctx, center, b, '#3b82f6', 'B', 500);
    drawVector(ctx, center, sum, '#ec4899', 'A+B', 500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-slate-200">
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-2">
            <TerminalSquare size={24} className="text-blue-400"/>
            Motor Físico
          </h2>
          
          {/* Main Navigation */}
          <div className="flex gap-2 mb-6 bg-slate-900 p-1 rounded-xl">
            <button 
              onClick={() => { setMode('mru_libre'); resetCanvas(); }}
              className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${mode === 'mru_libre' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >MRU Libre</button>
            <button 
              onClick={() => { setMode('bounce_libre'); resetCanvas(); }}
              className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${mode === 'bounce_libre' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >Rebote Libre</button>
            <button 
              onClick={() => { setMode('tests'); setTestSubmode('mru'); resetCanvas(); }}
              className={`flex-1 py-2 px-2 rounded-lg text-sm font-medium transition-all ${mode === 'tests' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >Casos Prueba</button>
          </div>

          {/* MRU Libre Panel */}
          {mode === 'mru_libre' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <p className="text-xs text-slate-400 mb-2">Simula el MRU desplazándose por la cancha interactiva completa hacia la portería.</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-400">V.x</label>
                  <input type="number" value={freeMruV.x} onChange={e => setFreeMruV({...freeMruV, x: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">V.y</label>
                  <input type="number" value={freeMruV.y} onChange={e => setFreeMruV({...freeMruV, y: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                </div>
                <div>
                  <label className="text-xs text-slate-400">V.z</label>
                  <input type="number" value={freeMruV.z} onChange={e => setFreeMruV({...freeMruV, z: e.target.value})} className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400">Tiempo (t)</label>
                <input type="number" value={freeMruT} onChange={e => setFreeMruT(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={startInteractiveMRU} disabled={isAnimating} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Play size={18} /> Lanzar MRU</button>
                <button onClick={resetCanvas} className="px-4 bg-slate-700 hover:bg-slate-600 rounded-xl"><RotateCcw size={18} /></button>
              </div>
            </motion.div>
          )}

          {/* Rebote Libre Panel */}
          {mode === 'bounce_libre' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-pink-900/50 text-sm shadow-inner">
                <p className="flex items-center gap-2 mb-2 font-bold text-pink-400"><Crosshair size={18} /> Interactividad de Mouse</p>
                <p className="text-slate-300">Haz clic en cualquier parte del canvas a la derecha para disparar el balón hacia esa dirección. Calculará dinámicamente la reflexión en tiempo real al tocar las paredes usando <code>R = V - 2(V·N)N</code>.</p>
              </div>
              <button onClick={resetCanvas} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold flex items-center justify-center gap-2"><RotateCcw size={18} /> Reiniciar Posición</button>
            </motion.div>
          )}

          {/* Test Cases Panel */}
          {mode === 'tests' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex gap-1 mb-4 border-b border-slate-700 pb-2">
                <button onClick={() => {setTestSubmode('mru'); resetCanvas();}} className={`px-3 py-1 text-xs rounded ${testSubmode==='mru'?'bg-slate-700 text-white':'text-slate-400'}`}>1. MRU</button>
                <button onClick={() => {setTestSubmode('bounce'); resetCanvas();}} className={`px-3 py-1 text-xs rounded ${testSubmode==='bounce'?'bg-slate-700 text-white':'text-slate-400'}`}>2. Rebote</button>
                <button onClick={() => {setTestSubmode('vector'); resetCanvas();}} className={`px-3 py-1 text-xs rounded ${testSubmode==='vector'?'bg-slate-700 text-white':'text-slate-400'}`}>3. Op. Vectores</button>
              </div>

              {testSubmode === 'mru' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Valores fijos para validar Caso 1:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={testMruPos.x} onChange={e=>setTestMruPos({...testMruPos,x:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testMruPos.y} onChange={e=>setTestMruPos({...testMruPos,y:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testMruPos.z} onChange={e=>setTestMruPos({...testMruPos,z:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={testMruV.x} onChange={e=>setTestMruV({...testMruV,x:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testMruV.y} onChange={e=>setTestMruV({...testMruV,y:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testMruV.z} onChange={e=>setTestMruV({...testMruV,z:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                  </div>
                  <input type="number" value={testMruT} onChange={e=>setTestMruT(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                  <button onClick={runTestMRU} className="w-full bg-emerald-600 py-2 rounded-lg font-bold flex justify-center gap-2"><Play size={18}/> Evaluar</button>
                </div>
              )}

              {testSubmode === 'bounce' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Valores fijos para validar Caso 2:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={testBounceV.x} onChange={e=>setTestBounceV({...testBounceV,x:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testBounceV.y} onChange={e=>setTestBounceV({...testBounceV,y:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testBounceV.z} onChange={e=>setTestBounceV({...testBounceV,z:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={testBounceN.x} onChange={e=>setTestBounceN({...testBounceN,x:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testBounceN.y} onChange={e=>setTestBounceN({...testBounceN,y:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testBounceN.z} onChange={e=>setTestBounceN({...testBounceN,z:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                  </div>
                  <button onClick={runTestBounce} className="w-full bg-emerald-600 py-2 rounded-lg font-bold flex justify-center gap-2"><Play size={18}/> Evaluar</button>
                </div>
              )}

              {testSubmode === 'vector' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Valores fijos para validar Caso 3:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={testVecA.x} onChange={e=>setTestVecA({...testVecA,x:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testVecA.y} onChange={e=>setTestVecA({...testVecA,y:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testVecA.z} onChange={e=>setTestVecA({...testVecA,z:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={testVecB.x} onChange={e=>setTestVecB({...testVecB,x:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testVecB.y} onChange={e=>setTestVecB({...testVecB,y:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                    <input type="number" value={testVecB.z} onChange={e=>setTestVecB({...testVecB,z:e.target.value})} className="bg-slate-900 border border-slate-600 rounded px-2 py-1" />
                  </div>
                  <button onClick={runTestVector} className="w-full bg-emerald-600 py-2 rounded-lg font-bold flex justify-center gap-2"><Play size={18}/> Evaluar</button>
                </div>
              )}
            </motion.div>
          )}

        </div>

        {/* Consola Matemática */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-sm h-72 overflow-y-auto shadow-inner relative">
          <div className="sticky top-0 bg-slate-950 pb-2 border-b border-slate-800 mb-2 flex justify-between items-center z-10">
            <span className="text-emerald-400 font-bold">~/math_engine/logs</span>
            <span className="text-slate-500 text-xs">Modo: {mode.replace('_', ' ').toUpperCase()}</span>
          </div>
          <div className="space-y-1 mt-2">
            {logs.length === 0 && <span className="text-slate-600">Esperando ejecución...</span>}
            {logs.map((log, i) => (
              <div key={i} className={`flex items-start gap-2 ${
                log.type === 'header' ? 'text-yellow-400 font-bold mt-4 mb-2' : 
                log.type === 'success' ? 'text-emerald-400 font-bold' : 
                log.type === 'data' ? 'text-blue-300 ml-4' :
                log.type === 'warning' ? 'text-pink-400' :
                'text-slate-400'
              }`}>
                {log.type === 'success' && <CheckCircle size={14} className="mt-0.5 shrink-0" />}
                {log.type === 'header' && <AlertCircle size={14} className="mt-0.5 shrink-0" />}
                <span>{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="flex-1 flex justify-center items-center relative">
        <div className="relative rounded-2xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-[#0f172a]">
          <canvas 
            ref={canvasRef}
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT}
            onClick={handleCanvasClick}
            className={`transition-shadow duration-300 ${mode === 'bounce_libre' ? 'cursor-crosshair hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]' : ''}`}
          />
          
          {goalAlert && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
            >
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-8 rounded-3xl text-center shadow-[0_0_100px_rgba(234,179,8,0.4)] border-2 border-yellow-300/50">
                <AlertCircle size={64} className="mx-auto mb-4 text-yellow-100" />
                <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-2">¡GOL DETECTADO!</h1>
                <p className="text-yellow-100 font-mono">Límite longitudinal superado</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
