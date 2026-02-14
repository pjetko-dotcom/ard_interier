import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={getImageUrl("/images/hero-bg.jpg")}
          alt="Moderný interiér obývačky - ukážka práce ARD Interiér"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left pt-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">
          Exkluzívne riešenia <br className="hidden sm:block" />
          <span className="text-wood-300">interiérov na mieru</span>
        </h1>
        <p className="mt-4 text-xl text-stone-100 max-w-2xl sm:mx-0 mx-auto drop-shadow-md mb-8 leading-relaxed">
          ARD Interier prináša originálne návrhy a precíznu realizáciu, ktoré premenia každý priestor na jedinečné miesto plné štýlu a funkčnosti.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
          <a
            href="#gallery"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-wood-900 bg-wood-400 hover:bg-wood-300 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Pozrieť realizácie
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-wood-900 transition-all shadow-lg"
          >
            Mám záujem o návrh
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};