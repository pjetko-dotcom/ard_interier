import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils';

export const Realizations: React.FC = () => {
  // Static placeholders for featured section, distinct from Gallery
  const featured = [
    {
      id: 1,
      title: "Kompletný interiér domu",
      desc: "Záhorská Bystrica",
      img: "images/realization-featured-1.jpg"
    },
    {
      id: 2,
      title: "Dizajnová kuchyňa",
      desc: "Bratislava Centrum",
      img: "images/realization-featured-2.jpg"
    }
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    // Fallback image (another kitchen interior) if the main one fails
    img.src = getImageUrl("images/realization-featured-fallback.jpg");
  };

  // JSON-LD Schema for Featured Projects
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Vybrané projekty ARD Interiér",
    "itemListElement": featured.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": item.title,
        "description": `Realizácia: ${item.desc}`,
        "image": item.img,
        "author": {
          "@type": "Organization",
          "name": "ARD Interiér"
        }
      }
    }))
  };

  return (
    <section id="realizations" className="py-20 bg-white">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-wood-600 font-semibold tracking-wide uppercase text-sm mb-2">Realizácie</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-stone-850 mb-4">Vybrané projekty</h3>
            <p className="text-lg text-stone-600">
              Naša práca zahŕňa kompletné interiéry, moderné kuchyne, funkčné vstavané skrine a reprezentatívne kancelárske priestory. 
              Každý projekt je pre nás výzvou. Pozrite si ukážku našej precíznej práce,
              kde spájame funkčnosť s estetikou.
            </p>
          </div>
          <a href="#gallery" className="hidden md:flex items-center text-wood-600 font-medium hover:text-wood-800 transition-colors">
            Prejsť do galérie <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg aspect-[4/3]">
              <img
                src={getImageUrl(item.img)}
                alt={`Ukážka realizácie: ${item.title} - ${item.desc}`}
                onError={handleImageError}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8">
                <h4 className="text-2xl font-bold text-white mb-1">{item.title}</h4>
                <p className="text-wood-200 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
           <a href="#gallery" className="inline-flex items-center text-wood-600 font-medium hover:text-wood-800">
            Všetky realizácie <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};