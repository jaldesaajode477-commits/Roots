import React from 'react';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#EBE4DD] text-[#3E2723] pt-14 pb-12 border-t border-[#D7CCC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Ethos */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/image_75e986cd.png"
                alt="Roots and Pots Emblem"
                className="w-10 h-10 object-contain drop-shadow-xs"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('/public/assets/aistudio/image_75e986cd.png')) {
                    target.src = '/public/assets/aistudio/image_75e986cd.png';
                  }
                }}
              />
              <div>
                <span className="text-xl font-black tracking-tight text-[#3E2723] font-serif uppercase block leading-tight">
                  Roots & Pots
                </span>
                <p className="text-[10px] text-[#8B5A2B] font-bold uppercase tracking-wider font-mono">
                  Traditional Bistro · Athi River
                </p>
              </div>
            </div>
            <p className="text-xs text-[#5D4037] max-w-sm leading-relaxed">
              Authentic Kenyan comfort dining cooked over natural firewood and simmered inside earthenware terracotta pots. Sourcing sustainably from smallholders in Machakos, Athi River basin, and Lake Victoria.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider font-mono">Explore Dining</h4>
            <ul className="space-y-2 text-xs text-[#5D4037]">
              <li>
                <a href="#menu" className="hover:text-[#8B5A2B] transition-colors font-medium">Traditional Menu & Combos</a>
              </li>
              <li>
                <a href="#reservations" className="hover:text-[#8B5A2B] transition-colors font-medium">Table Booking Concierge</a>
              </li>
              <li>
                <a href="#loyalty" className="hover:text-[#8B5A2B] transition-colors font-medium">Klabu ya Chungu Loyalty</a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#8B5A2B] transition-colors font-medium">Arcadia Mall Greenpark</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[#3E2723] uppercase tracking-wider font-mono">Arcadia Mall Bistro</h4>
            <div className="space-y-2 text-xs text-[#5D4037]">
              <p>Greenpark, off Mombasa Road, Athi River</p>
              <p>Open Daily: 10:00 AM – 10:30 PM</p>
              <p>Tel: <a href="tel:0118547574" className="text-[#8B5A2B] font-bold hover:underline">0118 547 574</a></p>
              <p>Email: <a href="mailto:rootsandports@gmail.com" className="hover:underline">rootsandports@gmail.com</a></p>
            </div>
          </div>

        </div>

        {/* Quiet Bottom Strip */}
        <div className="pt-8 border-t border-[#D7CCC8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#795548]">
          <p>© {new Date().getFullYear()} Roots and Pots Traditional Bistro. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Arcadia Mall, Athi River, Kenya</span>
            <span aria-hidden="true">·</span>
            <span>M-Pesa Till: 8945201</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
