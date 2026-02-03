import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">
              ARD<span className="text-wood-500">Interiér</span>
            </span>
            <p className="mt-4 text-sm max-w-xs">
              Váš partner pre kvalitný nábytok na mieru v Bratislave a okolí. 
              Tradičné remeslo, moderný dizajn.
            </p>
          </div>
          
          <div>
            <h5 className="text-white font-bold mb-4">Rýchle odkazy</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-wood-400 transition-colors">Služby</a></li>
              <li><a href="#gallery" className="hover:text-wood-400 transition-colors">Galéria</a></li>
              <li><a href="#about" className="hover:text-wood-400 transition-colors">O nás</a></li>
              <li><a href="#contact" className="hover:text-wood-400 transition-colors">Kontakt</a></li>
            </ul>
          </div>

          <div>
             <h5 className="text-white font-bold mb-4">Sledujte nás</h5>
             <div className="flex space-x-4">
               <a href="#" className="text-stone-400 hover:text-white transition-colors">
                 <Facebook size={24} />
                 <span className="sr-only">Facebook</span>
               </a>
               <a href="#" className="text-stone-400 hover:text-white transition-colors">
                 <Instagram size={24} />
                 <span className="sr-only">Instagram</span>
               </a>
             </div>
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} ARD Interiér. Všetky práva vyhradené.</p>
          <p className="mt-2 md:mt-0">Vytvorené pre demonštračné účely.</p>
        </div>
      </div>
    </footer>
  );
};