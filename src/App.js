import React, { Suspense, lazy, useLayoutEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ClassicPortfolio from './pages/ClassicPortfolio';

const InteractivePortfolio = lazy(() => import('./interactive/InteractivePortfolio'));

const TITLES = {
  '/': 'Sushant Aryal',
  '/classic': 'Sushant Aryal | Portfolio',
  '/interactive': 'Sushant Aryal | Interactive Portfolio',
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.title = TITLES[pathname] || 'Sushant Aryal';
  }, [pathname]);
  return null;
}

function InteractiveLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <p className="font-mono text-accent text-sm tracking-[0.3em] uppercase">Loading level…</p>
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classic" element={<ClassicPortfolio />} />
        <Route
          path="/interactive"
          element={
            <Suspense fallback={<InteractiveLoading />}>
              <InteractivePortfolio />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
