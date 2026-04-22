import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import HomeSection from './components/home/HomeSection';
import ObjectivesSection from './components/objectives/ObjectivesSection';
import TheorySection from './components/theory/TheorySection';
import AnalysisSection from './components/analysis/AnalysisSection';
import RocketMathSimulator from './components/simulators/RocketMathSimulator';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="min-h-screen bg-rl-dark flex flex-col font-sans">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 mt-16 p-6">
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-[80vh]">
          {activeSection === 'home' && <HomeSection />}
          {activeSection === 'objectives' && <ObjectivesSection />}
          {activeSection === 'theory' && <TheorySection />}
          {activeSection === 'analysis' && <AnalysisSection />}
          {activeSection === 'sim-rocket-math' && <RocketMathSimulator />}
        </div>
      </main>
    </div>
  );
}

export default App;
