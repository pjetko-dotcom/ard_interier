import React, { Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';

// Lazy load components
const Services = lazy(() => import('./components/Services').then(m => ({ default: m.Services })));
const Realizations = lazy(() => import('./components/Realizations').then(m => ({ default: m.Realizations })));
const About = lazy(() => import('./components/About').then(m => ({ default: m.About })));
const Gallery = lazy(() => import('./components/Gallery').then(m => ({ default: m.Gallery })));
const References = lazy(() => import('./components/References').then(m => ({ default: m.References })));
const Contact = lazy(() => import('./components/Contact').then(m => ({ default: m.Contact })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

// Loading component
const LoadingComponent: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-100">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wood-600"></div>
      <p className="mt-4 text-stone-600">Načítavanie...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Suspense fallback={<div className="min-h-screen bg-stone-100" />}>
          <Services />
        </Suspense>
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <Realizations />
        </Suspense>
        <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
          <About />
        </Suspense>
        <Suspense fallback={<div className="min-h-screen bg-stone-100" />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <References />
        </Suspense>
        <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
          <Contact />
        </Suspense>
        <Suspense fallback={<div className="min-h-screen bg-stone-800" />}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}

export default App;