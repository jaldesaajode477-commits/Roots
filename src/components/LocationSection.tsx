import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Navigation, 
  ExternalLink, 
  MessageCircle, 
  Compass, 
  Car, 
  ShieldCheck, 
  Share2, 
  Check,
  Instagram,
  Facebook,
  Sparkles
} from 'lucide-react';

export const LocationSection: React.FC = () => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('0118 547 574');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  return (
    <section id="location" className="py-20 bg-[#F5F2EB] text-[#3E2723] border-b border-[#D7CCC8] selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B5A2B]/15 border border-[#8B5A2B]/30">
            <MapPin className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B5A2B] font-bold">
              ARCADIA MALL · GREENPARK ATHI RIVER
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold text-[#3E2723] font-serif tracking-tight">
            Visit the Hearth Sanctuary
          </h2>

          <p className="text-xs sm:text-base text-[#5D4037] leading-relaxed">
            Nestled in the lush open savanna of Greenpark Estate along Mombasa Road. Enjoy refreshing Athi breezes on our garden patio, private kraal feast suites, and authentic clay pot hospitality.
          </p>
        </div>

        {/* 2-Column Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Verified Location & Contact Dossier (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Arcadia Mall Exterior & Patio Photo */}
            <div className="relative w-full h-44 rounded-3xl overflow-hidden border border-[#D7CCC8] shadow-sm">
              <img
                src="/src/assets/images/arcadia_terrace_patio_1794114620985.jpg"
                alt="Roots and Pots Arcadia Mall Terrace Patio"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/src/assets/images/ambiance_bistro_interior_1792635389767.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D7CCC8] font-bold block">
                  Greenpark Estate · Arcadia Mall
                </span>
                <span className="text-sm font-bold font-serif block">
                  Savanna Garden Terrace & Patio
                </span>
              </div>
            </div>

            {/* Primary Address Card */}
            <div className="p-5 bg-white rounded-3xl border border-[#D7CCC8] shadow-xs space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#8B5A2B]/15 text-[#8B5A2B] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-sm font-bold text-[#3E2723] block">
                    Physical Address
                  </strong>
                  <p className="text-xs text-[#5D4037] mt-0.5 leading-relaxed">
                    Arcadia Mall, Ground & Terrace Level<br />
                    Greenpark Estate Main Gate, off Mombasa Road<br />
                    Athi River, Machakos County, Kenya
                  </p>
                  <span className="text-[10px] font-mono text-[#8B5A2B] font-bold block mt-1">
                    GPS Coordinates: -1.4524° S, 36.9832° E
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#D7CCC8]/60 flex items-center gap-2">
                <a
                  href="https://maps.google.com/?q=Arcadia+Mall+Greenpark+Mombasa+Road+Athi+River"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3 opacity-70 ml-0.5" />
                </a>

                <a
                  href="https://wa.me/254118547574?text=Jambo%20Roots%20and%20Pots%2C%20I%20would%20like%20directions%20to%20Arcadia%20Mall"
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                  title="WhatsApp Directions"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="p-5 bg-white rounded-3xl border border-[#D7CCC8] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#8B5A2B]" />
                  <strong className="text-xs font-bold text-[#3E2723] uppercase font-mono tracking-wider">
                    Operating Hours
                  </strong>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E7D32]/15 text-[#2E7D32]">
                  Open 7 Days a Week
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#5D4037] divide-y divide-[#D7CCC8]/50 pt-1">
                <div className="flex justify-between py-1">
                  <span>Monday – Friday:</span>
                  <strong className="text-[#3E2723] font-mono">10:00 AM – 10:30 PM</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Saturday & Sunday:</span>
                  <strong className="text-[#3E2723] font-mono">10:00 AM – 11:00 PM</strong>
                </div>
                <div className="flex justify-between py-1 text-[11px] text-[#795548]">
                  <span>Hearth Lunch Rush:</span>
                  <span>12:00 PM – 2:30 PM</span>
                </div>
                <div className="flex justify-between py-1 text-[11px] text-[#795548]">
                  <span>Savanna Sunset Feasts:</span>
                  <span>6:30 PM – 10:00 PM</span>
                </div>
              </div>
            </div>

            {/* Direct Telephone & Inquiries Card */}
            <div className="p-5 bg-white rounded-3xl border border-[#D7CCC8] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#8B5A2B]" />
                  <strong className="text-xs font-bold text-[#3E2723] uppercase font-mono tracking-wider">
                    Direct Contact
                  </strong>
                </div>
                <button
                  onClick={handleCopyPhone}
                  className="text-[10px] text-[#8B5A2B] font-bold hover:underline cursor-pointer"
                >
                  {copiedPhone ? 'Copied 0118 547 574!' : 'Copy Number'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8]">
                  <div>
                    <span className="text-[10px] font-mono text-[#795548] block">Direct Reservations & Deliveries:</span>
                    <a href="tel:0118547574" className="font-mono font-bold text-sm text-[#3E2723] hover:text-[#8B5A2B]">
                      0118 547 574
                    </a>
                  </div>
                  <a
                    href="tel:0118547574"
                    className="p-2 bg-[#8B5A2B] text-white rounded-lg text-xs font-bold hover:bg-[#70461F]"
                  >
                    Call Now
                  </a>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8]">
                  <div>
                    <span className="text-[10px] font-mono text-[#795548] block">Official Email:</span>
                    <a href="mailto:rootsandports@gmail.com" className="font-mono text-xs text-[#3E2723] hover:text-[#8B5A2B]">
                      rootsandports@gmail.com
                    </a>
                  </div>
                  <a
                    href="mailto:rootsandports@gmail.com"
                    className="p-1.5 px-2 bg-white text-[#5D4037] border border-[#D7CCC8] rounded-lg text-[11px] font-semibold hover:bg-[#D7CCC8]"
                  >
                    Email
                  </a>
                </div>
              </div>

              {/* Verified Social Media Channels */}
              <div className="pt-2 border-t border-[#D7CCC8]/60 flex items-center justify-between text-xs">
                <span className="text-[#795548] font-mono text-[11px]">Follow Our Hearth:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#F5F2EB] hover:bg-[#D7CCC8] text-[#3E2723] border border-[#D7CCC8] transition-colors"
                    title="@rootsandpotske Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#F5F2EB] hover:bg-[#D7CCC8] text-[#3E2723] border border-[#D7CCC8] transition-colors"
                    title="Roots & Pots Facebook"
                  >
                    <Facebook className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  </a>
                  <a
                    href="https://wa.me/254118547574"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#25D366]/20 text-[#1b7e3e] border border-[#25D366]/40 transition-colors"
                    title="Direct WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Map & Turn-by-Turn Corridor Guide (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#D7CCC8] p-6 shadow-md space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#D7CCC8]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#795548] font-bold block">
                  Interactive Athi River Corridor Map
                </span>
                <h3 className="font-serif font-bold text-base text-[#3E2723] mt-0.5">
                  Arcadia Mall · Mombasa Road Junction
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#2E7D32]">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
                <span>Open for Dine-In & Deliveries</span>
              </div>
            </div>

            {/* Embedded Live OpenStreetMap / Interactive Satellite View */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-[#D7CCC8] shadow-inner bg-[#F5F2EB]">
              <iframe
                title="Roots and Pots Arcadia Mall Greenpark Athi River Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.9600%2C-1.4650%2C37.0050%2C-1.4400&layer=mapnik&marker=-1.4524%2C36.9832"
                className="w-full h-full border-0 filter saturate-90"
                loading="lazy"
              />

              {/* Floating Map Pin Overlay */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#D7CCC8] shadow-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#8B5A2B]" />
                <div className="text-[11px] leading-tight">
                  <strong className="text-[#3E2723] block">Roots & Pots Bistro</strong>
                  <span className="text-[#795548] font-mono">Arcadia Mall Level 1</span>
                </div>
              </div>

              <div className="absolute bottom-3 right-3">
                <a
                  href="https://maps.google.com/?q=Arcadia+Mall+Greenpark+Mombasa+Road+Athi+River"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-lg text-xs shadow-md flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Full Screen GPS</span>
                </a>
              </div>
            </div>

            {/* Corridor Travel Times & Turn-by-Turn Directions */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#795548] block">
                Estimated Driving Times & Route Guide
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#F5F2EB] rounded-2xl border border-[#D7CCC8] space-y-1">
                  <strong className="text-[#3E2723] block flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    <span>From Nairobi CBD</span>
                  </strong>
                  <span className="font-mono text-[#8B5A2B] font-bold block">25–35 Mins</span>
                  <p className="text-[11px] text-[#5D4037] leading-tight">
                    Via Expressway / Mombasa Road dual-carriageway direct to Greenpark exit.
                  </p>
                </div>

                <div className="p-3 bg-[#F5F2EB] rounded-2xl border border-[#D7CCC8] space-y-1">
                  <strong className="text-[#3E2723] block flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    <span>From Syokimau / SGR</span>
                  </strong>
                  <span className="font-mono text-[#8B5A2B] font-bold block">10–14 Mins</span>
                  <p className="text-[11px] text-[#5D4037] leading-tight">
                    Past Daystar junction, seamless slip-road onto Arcadia Mall entrance.
                  </p>
                </div>

                <div className="p-3 bg-[#F5F2EB] rounded-2xl border border-[#D7CCC8] space-y-1">
                  <strong className="text-[#3E2723] block flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    <span>From Kitengela / Machakos</span>
                  </strong>
                  <span className="font-mono text-[#8B5A2B] font-bold block">12–18 Mins</span>
                  <p className="text-[11px] text-[#5D4037] leading-tight">
                    Across Athi River bridge onto Greenpark access gate road.
                  </p>
                </div>
              </div>

              {/* Parking & Facility Amenities */}
              <div className="p-3 bg-white rounded-2xl border border-[#D7CCC8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5D4037]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>Ample Secure 120-Car Parking with 24/7 Greenpark Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Dedicated Boda Delivery Staging Hub</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
