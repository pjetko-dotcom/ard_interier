import React from 'react';
import { references } from '../data/references';
import { Quote } from 'lucide-react';
import { getImageUrl } from '../utils';

export const References: React.FC = () => {
  return (
    <section id="references" className="py-20 bg-wood-900 text-white relative overflow-hidden">
      {/* Decorative texture */}
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: `url('${getImageUrl("/images/wood-pattern.png")}')`, backgroundSize: 'cover'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-wood-300 font-semibold tracking-wide uppercase text-sm mb-2">Referencie</h2>
          <h3 className="text-3xl md:text-4xl font-bold">Čo o nás hovoria klienti</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {references.map((ref) => (
            <div key={ref.id} className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <Quote className="text-wood-400 w-10 h-10 mb-4 opacity-80" />
              <p className="text-wood-50 italic mb-6 leading-relaxed">
                "{ref.text}"
              </p>
              <div className="border-t border-white/10 pt-4">
                <p className="font-bold text-lg">{ref.name}</p>
                <p className="text-sm text-wood-300">{ref.projectType}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};