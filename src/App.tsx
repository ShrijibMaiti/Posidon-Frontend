import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { ScanlineOverlay } from './components/ScanlineOverlay';
import { useStore } from './store';

export default function App() {
  const reducedMotion = useStore(state => state.reducedMotion);

  return (
    <Router>
      <MotionConfig transition={reducedMotion ? { duration: 0 } : undefined}>
        <div className="relative">
          <ScanlineOverlay />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </MotionConfig>
    </Router>
  );
}
