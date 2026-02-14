import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Send, ChevronDown } from 'lucide-react';

interface Country {
  code: string;
  prefix: string;
  placeholder: string;
}

const countries: Country[] = [
  { code: 'SK', prefix: '+421', placeholder: '9xx xxx xxx' },
  { code: 'CZ', prefix: '+420', placeholder: '7xx xxx xxx' },
  { code: 'AT', prefix: '+43', placeholder: '6xx xxx xxxx' },
  { code: 'HU', prefix: '+36', placeholder: '20 xxx xxxx' },
];

export const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phoneSuffix: '',
    email: '',
    message: ''
  });

  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  const [errors, setErrors] = useState({
    phone: '',
    email: ''
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCountryDropdownOpen]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Odstráni medzery
    const cleanNumber = phone.replace(/\s/g, '');
    // Základná validácia: musí obsahovať iba čísla a mať dĺžku aspoň 9 znakov
    return /^\d{9,12}$/.test(cleanNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Povolí len čísla a medzery
    if (/^[\d\s]*$/.test(val)) {
      setFormData(prev => ({ ...prev, phoneSuffix: val }));
      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = validatePhone(formData.phoneSuffix);
    
    const newErrors = {
      email: isEmailValid ? '' : 'Zadajte platnú emailovú adresu.',
      phone: isPhoneValid ? '' : `Zadajte číslo v správnom formáte (${selectedCountry.placeholder}).`
    };

    setErrors(newErrors);

    if (!isEmailValid || !isPhoneValid) {
      return;
    }

    // Prepare form data with full phone number
    const fullPhoneNumber = `${selectedCountry.prefix} ${formData.phoneSuffix.replace(/\s/g, '')}`;
    
    try {
      const response = await fetch('/api/send-contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhoneNumber,
          message: formData.message
        })
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus('success');
        // Reset form but keep country
        setFormData({ name: '', phoneSuffix: '', email: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 3000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-wood-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Info Side */}
          <div>
            <h2 className="text-wood-600 font-semibold tracking-wide uppercase text-sm mb-2">Kontaktujte nás</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-stone-850 mb-6">Máte predstavu? <br/>Zrealizujeme ju.</h3>
            <p className="text-stone-600 mb-10 text-lg leading-relaxed">
              Napíšte nám alebo zavolajte. Radi si s vami dohodneme nezáväznú konzultáciu a zameranie priamo u vás.
            </p>

            <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-wood-100 p-3 rounded-xl text-wood-700">
                  <Phone size={24} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-stone-800">Telefón</h4>
                  <p className="text-stone-600 mt-1 font-medium"><a href="tel:+421917925011" className="hover:text-wood-600 transition-colors">+421 917 925 011</a></p>
                  <p className="text-sm text-stone-400 mt-1">Po-Pi: 8:00 - 17:00</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-wood-100 p-3 rounded-xl text-wood-700">
                  <Mail size={24} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-stone-800">Email</h4>
                  <a href="mailto:info@ardinterier.sk" className="text-stone-600 mt-1 hover:text-wood-600 transition-colors">info@ardinterier.sk</a>
                  <p className="text-sm text-stone-400 mt-1">Odpovedáme do 24 hodín</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-wood-100 p-3 rounded-xl text-wood-700">
                  <MapPin size={24} />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-stone-800">Adresa dielne</h4>
                  <p className="text-stone-600 mt-1">Priemyselná ulica 123<br/>821 09 Bratislava</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-stone-100">
            <h4 className="text-2xl font-bold text-stone-800 mb-6">Nezáväzný dopyt</h4>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-stone-700 mb-2">Meno a Priezvisko</label>
                <input 
                  type="text" 
                  id="name" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ján Novák"
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-wood-500 focus:border-wood-500 outline-none transition-all shadow-sm" 
                />
              </div>

              {/* Phone Field with Country Selector */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-stone-700 mb-2">Telefón</label>
                <div className={`relative flex rounded-lg shadow-sm border transition-all focus-within:ring-2 focus-within:ring-wood-500 focus-within:border-wood-500 ${errors.phone ? 'border-red-500' : 'border-stone-300'}`}>
                  
                  {/* Custom Country Selector Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="h-full py-3 px-3 bg-stone-50 rounded-l-lg border-r border-stone-300 flex items-center gap-1 hover:bg-stone-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-wood-500 focus:ring-inset"
                      aria-label="Select country"
                      aria-expanded={isCountryDropdownOpen}
                    >
                      <span className="text-stone-900 font-medium text-sm">{selectedCountry.prefix}</span>
                      <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-stone-300 rounded-lg shadow-lg z-20 min-w-[120px]">
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-wood-50 transition-colors ${
                              selectedCountry.code === country.code ? 'bg-wood-100 font-semibold' : ''
                            }`}
                          >
                            <span className="text-stone-900">{country.code}</span>
                            <span className="text-stone-500 text-xs ml-auto">{country.prefix}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <input 
                    type="tel" 
                    id="phone" 
                    required 
                    value={formData.phoneSuffix}
                    onChange={handlePhoneChange}
                    placeholder={selectedCountry.placeholder}
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-r-lg bg-white text-stone-900 placeholder-stone-400 border-none focus:ring-0 outline-none" 
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-600 font-medium animate-pulse">{errors.phone}</p>}
              </div>
              
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-stone-700 mb-2">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value});
                    if(errors.email) setErrors({...errors, email: ''});
                  }}
                  placeholder="vas@email.sk"
                  className={`w-full px-4 py-3 rounded-lg border bg-white text-stone-900 placeholder-stone-400 outline-none transition-all shadow-sm focus:ring-2 focus:ring-wood-500 focus:border-wood-500 ${errors.email ? 'border-red-500' : 'border-stone-300'}`} 
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 font-medium animate-pulse">{errors.email}</p>}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-stone-700 mb-2">Správa</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  required 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Dobrý deň, mám záujem o cenovú ponuku na..."
                  className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:ring-2 focus:ring-wood-500 focus:border-wood-500 outline-none transition-all shadow-sm resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={formStatus !== 'idle'}
                className={`w-full flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wood-500 disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:transform-none ${
                  formStatus === 'success' ? 'bg-green-600' : formStatus === 'error' ? 'bg-red-600' : 'bg-wood-600 hover:bg-wood-700'
                }`}
              >
                {formStatus === 'success' ? 'Odoslané ✓' : formStatus === 'error' ? 'Chyba - skúste neskôr' : (
                  <>
                    Odoslať nezáväzný dopyt <Send className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};