import React from 'react';
import { services } from '../data/services';
import { ChefHat, Maximize, Briefcase, Tv, Droplets, Users } from 'lucide-react';

// Map icon strings to components
const IconMap: Record<string, React.FC<any>> = {
  ChefHat,
  Maximize,
  Briefcase,
  Tv,
  Droplets,
  Users
};

export const Services: React.FC = () => {
  return (
    <section id="services" className="py-20 bg-wood-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-wood-600 font-semibold tracking-wide uppercase text-sm mb-2">Čo ponúkame</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-stone-850">Naše služby</h3>
          <p className="mt-4 max-w-2xl text-xl text-stone-600 mx-auto">
            Od inovatívneho návrhu po dokonalú realizáciu. Spájame tvorivý dizajn s bezchybným spracovaním.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = IconMap[service.iconName] || Briefcase;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-wood-100 group"
              >
                <div className="w-12 h-12 bg-wood-100 rounded-lg flex items-center justify-center mb-6 text-wood-600 group-hover:bg-wood-600 group-hover:text-white transition-colors">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h4 className="text-xl font-bold text-stone-800 mb-3">{service.title}</h4>
                <p className="text-stone-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};