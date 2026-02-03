import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const navigation = [
  { name: 'Domov', href: '#home' },
  { name: 'Služby', href: '#services' },
  { name: 'Realizácie', href: '#realizations' },
  { name: 'O nás', href: '#about' },
  { name: 'Galéria', href: '#gallery' },
  { name: 'Referencie', href: '#references' },
  { name: 'Kontakt', href: '#contact' },
];

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#home" className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-wood-800' : 'text-wood-900 drop-shadow-sm'}`}>
              ARD<span className="text-wood-600">Interiér</span>
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-wood-600 ${
                  scrolled ? 'text-stone-700' : 'text-stone-900 bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:flex">
             <a href="#contact" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-wood-600 hover:bg-wood-700 transition-colors shadow-sm">
               <Phone className="w-4 h-4 mr-2" />
               Napíšte nám
             </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${scrolled ? 'text-stone-700' : 'text-stone-900 bg-white/50 backdrop-blur-sm'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-wood-100 animate-in slide-in-from-top-5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-wood-700 hover:bg-wood-50"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 px-4 py-3 bg-wood-600 text-white rounded-md font-medium"
            >
              Kontaktujte nás
            </a>
          </div>
        </div>
      )}
    </header>
  );
};