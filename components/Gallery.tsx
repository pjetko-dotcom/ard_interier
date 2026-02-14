import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { realizations } from '../data/realizations';
import { ChevronLeft, ChevronRight, X, ZoomIn, LayoutGrid, Home, Building2 } from 'lucide-react';
import { getImageUrl } from '../utils';

type FilterType = 'all' | 'residential' | 'commercial';

export const Gallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  // Filter Logic
  const filteredItems = activeFilter === 'all' 
    ? realizations 
    : realizations.filter(item => item.categoryKey === activeFilter);

  // Reset carousel when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  // Swipe state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Responsive items per page
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused || lightboxIndex !== null) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, lightboxIndex, filteredItems.length]); // Add filteredItems.length dependency

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  // Swipe Handlers
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Helper to get visible items (circular buffer)
  const getVisibleItems = () => {
    if (filteredItems.length === 0) return [];
    
    // If we have fewer items than itemsPerPage, just return what we have
    if (filteredItems.length <= itemsPerPage) return filteredItems;

    const items = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % filteredItems.length;
      items.push(filteredItems[index]);
    }
    return items;
  };

    // Helper for image fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      const img = e.target as HTMLImageElement;
      img.src = getImageUrl('images/realization-featured-fallback.jpg');
  };

  // JSON-LD Schema Generation for SEO
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Galéria realizácií ARD Interiér",
    "description": "Portfólio našich realizácií kuchýň na mieru, vstavaných skríň a komerčných priestorov.",
    "itemListElement": realizations.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": item.title,
        "image": item.image,
        "description": `Realizácia kategórie ${item.category} v lokalite ${item.location || 'Bratislava'}`,
        "genre": item.category,
        "creator": {
          "@type": "Organization",
          "name": "ARD Interiér"
        }
      }
    }))
  };

  return (
    <section id="gallery" className="py-20 bg-stone-100 overflow-hidden relative select-none">
       {/* Inject JSON-LD Schema */}
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <h2 className="text-wood-600 font-semibold tracking-wide uppercase text-sm mb-2">Portfólio</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-stone-850 mb-8">Naše realizácie</h3>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'all' 
                  ? 'bg-wood-600 text-white shadow-lg' 
                  : 'bg-white text-stone-600 hover:bg-wood-100'
              }`}
            >
              <LayoutGrid size={16} className="mr-2" /> Všetko
            </button>
            <button 
              onClick={() => setActiveFilter('residential')}
              className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'residential' 
                  ? 'bg-wood-600 text-white shadow-lg' 
                  : 'bg-white text-stone-600 hover:bg-wood-100'
              }`}
            >
              <Home size={16} className="mr-2" /> Bytový dizajn
            </button>
            <button 
              onClick={() => setActiveFilter('commercial')}
              className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === 'commercial' 
                  ? 'bg-wood-600 text-white shadow-lg' 
                  : 'bg-white text-stone-600 hover:bg-wood-100'
              }`}
            >
              <Building2 size={16} className="mr-2" /> Kancelárie a verejné priestory
            </button>
          </div>
       </div>

      {/* Main Carousel Container */}
      <div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Navigation Buttons (Desktop) */}
        {filteredItems.length > itemsPerPage && (
          <>
            <button 
              onClick={prevSlide}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-12 h-12 bg-white text-wood-700 rounded-full shadow-lg items-center justify-center hover:bg-wood-50 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={nextSlide}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-12 h-12 bg-white text-wood-700 rounded-full shadow-lg items-center justify-center hover:bg-wood-50 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Swipe Area */}
        <div 
          className="flex gap-6 justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {getVisibleItems().map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`} // Use unique key combination
              className={`relative bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer transition-all duration-500 ease-in-out ${itemsPerPage === 1 ? 'w-full' : 'w-1/3'}`}
              onClick={() => setLightboxIndex(filteredItems.indexOf(item))}
            >
              <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                <img 
                  src={getImageUrl(item.image)}
                  alt={`Realizácia ARD Interiér: ${item.title} - ${item.category}`}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="text-white w-10 h-10" />
              </div>
              <div className="p-4 border-t border-stone-100">
                <h4 className="font-bold text-lg text-stone-800">{item.title}</h4>
                <p className="text-wood-600 text-sm">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        {filteredItems.length > itemsPerPage && (
          <div className="flex justify-center mt-8 gap-2">
            {filteredItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentIndex(idx); setIsPaused(true); }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-wood-600' : 'w-2 bg-wood-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
          >
            <X size={40} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length); }}
            className="absolute left-4 text-white/70 hover:text-white p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={48} />
          </button>

          <div className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
            <img 
              src={getImageUrl(filteredItems[lightboxIndex].image)}
              onError={handleImageError}
              alt={`Realizácia ARD Interiér: ${filteredItems[lightboxIndex].title} - ${filteredItems[lightboxIndex].category}`}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-sm shadow-2xl"
            />
            <div className="mt-4 text-center text-white">
              <h3 className="text-2xl font-bold">{filteredItems[lightboxIndex].title}</h3>
              <p className="text-wood-300">{filteredItems[lightboxIndex].location}</p>
            </div>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev! + 1) % filteredItems.length); }}
            className="absolute right-4 text-white/70 hover:text-white p-2 bg-black/20 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}
    </section>
  );
};