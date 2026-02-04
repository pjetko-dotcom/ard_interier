import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid */}
          <div className="relative">
            <div className="aspect-[4/5] w-3/4 bg-wood-100 rounded-2xl overflow-hidden ml-auto">
              <img 
                src="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?auto=format&fit=crop&q=80&w=800" 
                alt="Detail precízne spracovaného dreveného nábytku od ARD Interiér" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-12 left-0 aspect-square w-1/2 bg-white p-2 rounded-2xl shadow-xl">
               <div className="w-full h-full rounded-xl overflow-hidden">
                 <img 
                  src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=600" 
                  alt="Pohľad do stolárskej dielne ARD Interiér" 
                  className="w-full h-full object-cover"
                 />
               </div>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-wood-600 font-semibold tracking-wide uppercase text-sm mb-2">O nás</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-stone-850 mb-6">Dizajn, ktorý premení váš priestor</h3>
            <p className="text-lg text-stone-600 mb-6 leading-relaxed">
              Firma <span className="font-bold text-wood-700">ARD Interiér</span> sa špecializuje na vytvorenie exkluzívnych interiérov na mieru. 
              Naš tím tvorí dizajnéri a architekti s vášňou pre priestor, detail a inovatívne riešenia. Veríme, že každý priestor má svoj potenciál.
            </p>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Od konzultácie a 3D vizualizácie až po finálu realizáciu. Vytvárame interiéry, ktoré nie len vyzerajú úžasne, 
              ale sú aj funkčné, pohodlné a odolné. Pracujeme s premietanou technikou a trvalo udržateľnými materiálmi.
            </p>

            <ul className="space-y-4">
              {[
                'Originálne návrhy podľa vášho štýlu',
                '3D vizualizácie pred realizáciou',
                'Profesionálny tím dizajnérov',
                'Komplexné riešenia od projektu po realizáciu'
              ].map((item, index) => (
                <li key={index} className="flex items-center text-stone-800">
                  <CheckCircle2 className="text-wood-600 mr-3 w-5 h-5" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};