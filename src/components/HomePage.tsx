import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Utensils, 
  Calendar, 
  ArrowRight, 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Star,
  Users,
  Compass,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  ChevronDown
} from 'lucide-react';
import { AppPage } from './Header';
import { useRestaurant } from '../context/RestaurantContext';
import confetti from 'canvas-confetti';

interface Props {
  onNavigate: (page: AppPage) => void;
  onAddToCart: (item: { id: string; name: string; price: number; customization?: string; category?: string }) => void;
  onOpenAuth: (role?: 'staff' | 'admin') => void;
}

const SIGNATURE_CHAPTERS = [
  {
    id: 'choma',
    chapter: 'ACT III · SCENE 01',
    categoryName: 'OPEN HEARTH',
    title: 'Highlands Mbuzi Choma',
    swahili: 'Mbuzi wa Kuchoma na Ugali wa Wimbi',
    price: 850,
    image: '/src/assets/images/dish_mbuzi_choma_ugali_1792635389333.jpg',
    description: 'Prime savanna goat cutlets seared slowly over glowing acacia embers with sea salt crystals, paired with stone-ground brown millet ugali, wild sautéed managu, and fresh tomato kachumbari.',
    provenance: 'Athi River Pastoral Ranches · Acacia Charcoal Hearth',
    notes: 'Charred crispy bark, exceptionally tender heart, served sizzling hot.'
  },
  {
    id: 'tilapia',
    chapter: 'ACT III · SCENE 02',
    categoryName: 'FRESHWATER HARVEST',
    title: 'Lake Victoria Whole Tilapia',
    swahili: 'Ngege wa Ziwa Victoria na Mrenda',
    price: 750,
    image: '/src/assets/images/food_lake_tilapia_splash_1792636520467.jpg',
    description: 'Crisp whole Lake Victoria tilapia scored and pan-seared to golden perfection, served with white cornmeal ugali, slippery savory mrenda greens, and rich coconut-tamarind reduction.',
    provenance: 'Fresh Daily Lakeside Catch · Simmered in Coastal Coconut',
    notes: 'Wild caught, flash-crisped in seasoned sunflower oil, succulent flakes.'
  },
  {
    id: 'claypot',
    chapter: 'ACT III · SCENE 03',
    categoryName: 'ANCESTRAL EARTHENWARE',
    title: 'Claypot Heritage Beef Stew',
    swahili: 'Nyungu ya Nyama ya Jadi',
    price: 650,
    image: '/src/assets/images/food_claypot_stew_steam_1792636521301.jpg',
    description: 'Tender beef chunks slow-braised for two and a half hours in an authentic porous clay pot with caramelized sweet onions, wild garden coriander, and rich marrow broth.',
    provenance: 'Hand-Molded Earthenware · 100% Firewood Simmer',
    notes: 'Steamed in its own juices, infused with mineral clay depth.'
  },
  {
    id: 'swahili',
    chapter: 'ACT III · SCENE 04',
    categoryName: 'SWAHILI SPICE & HERBS',
    title: 'Fragrant Beef Pilau & Chapati',
    swahili: 'Pilau ya Nyama na Chapati za Kusukuma',
    price: 550,
    image: '/src/assets/images/food_swahili_pilau_beef_1792637971903.jpg',
    description: 'Long-grain aged rice toasted with cinnamon bark, cracked cardamom pods, cumin, and tender spiced beef cuts, accompanied by flaky Swahili layered chapatis.',
    provenance: 'Old Town Spicery Tradition · Hand-Rolled Layers',
    notes: 'Warm aromatics, whole roasted spices, golden ghee layering.'
  },
];

export const HomePage: React.FC<Props> = ({ onNavigate, onAddToCart, onOpenAuth }) => {
  const { addReservation } = useRestaurant();
  const [activeChapter, setActiveChapter] = useState(0);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Quick Concierge Bar state
  const [partySize, setPartySize] = useState(4);
  const [bookDate, setBookDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [bookTime, setBookTime] = useState('19:00');
  const [bookZone, setBookZone] = useState<'terrace' | 'hearth' | 'kraal'>('terrace');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingSuccessCode, setBookingSuccessCode] = useState<string | null>(null);

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) {
      onNavigate('reservations');
      return;
    }

    const newRes = addReservation({
      guestName,
      phone: guestPhone,
      date: bookDate,
      time: bookTime,
      guests: partySize,
      zone: bookZone,
      specialRequests: 'Booked via Instant Sanctuary Concierge',
      isVIP: partySize >= 6,
    });

    setBookingSuccessCode(newRes.code);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5A2B', '#3E2723', '#D7CCC8'],
    });
  };

  const handleOrderChapter = (dish: typeof SIGNATURE_CHAPTERS[0]) => {
    onAddToCart({
      id: dish.id,
      name: dish.title,
      price: dish.price,
      customization: `${dish.swahili} · Hearth Fresh`,
      category: 'featured',
    });
    setAddedItem(dish.id);
    confetti({ particleCount: 35, spread: 50, colors: ['#8B5A2B', '#3E2723'] });
    setTimeout(() => setAddedItem(null), 2000);
  };

  const currentDish = SIGNATURE_CHAPTERS[activeChapter];

  return (
    <div className="relative min-h-screen bg-[#F5F2EB] text-[#3E2723] selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
      
      {/* ========================================================================= */}
      {/* ARCADIA SANCTUARY (DOMINANT FULL-VIEWPORT HERO VISTA) */}
      {/* The photograph takes all/majority of the viewport so the whole restaurant is visible */}
      {/* ========================================================================= */}
      <section 
        id="scene-sanctuary" 
        className="relative min-h-[96vh] lg:min-h-screen flex flex-col justify-between overflow-hidden"
      >
        {/* Full-bleed Architectural Restaurant Ambiance Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/arcadia_terrace_patio_1794114620985.jpg"
            alt="Roots and Pots Restaurant Dining Sanctuary at Arcadia Mall Greenpark Athi River"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('ambiance_bistro_interior')) {
                target.src = '/src/assets/images/ambiance_bistro_interior_1792635389767.jpg';
              }
            }}
            className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Subtle cinematic gradient overlay: ensures typography pops while the restaurant remains vivid */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/95 via-[#3E2723]/45 to-[#3E2723]/30" />
          {/* Soft dissolve gradient at bottom to seamlessly melt into Act II without hard horizontal borders */}
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#F5F2EB] via-[#F5F2EB]/60 to-transparent pointer-events-none" />
        </div>

        {/* Top Header Badge & Tagline overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 w-full">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#F5F2EB]/95 backdrop-blur-md border border-[#D7CCC8] shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8B5A2B] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#3E2723] font-bold">
              Arcadia Mall, Greenpark · Athi River
            </span>
            <span className="text-[#8B5A2B] font-semibold text-xs">|</span>
            <span className="text-[11px] text-[#8B5A2B] font-serif font-bold">Authentic Claypot & Embers Bistro</span>
          </div>
        </div>

        {/* Center Editorial Title & Narrative */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D7CCC8] block">
              ACT I · ARCADIA OPENING VISTA
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif tracking-tight text-[#F5F2EB] leading-[1.05] drop-shadow-md">
              Where Ancestral Hearth Meets Contemporary Elegance.
            </h1>
            <p className="text-base sm:text-xl text-[#D7CCC8] italic font-serif max-w-2xl">
              “Chakula halisi cha jadi, kilichopikwa kwenye vyungu vya udongo na kuni za mshikaki.”
            </p>
            <p className="text-xs sm:text-sm text-[#F5F2EB]/90 font-sans leading-relaxed max-w-xl">
              Step onto our breezy open-air terrace patio nestled in the rolling greenery of Greenpark, Athi River. Savour woodfire simmered bone marrow stews, succulent savanna mbuzi choma, and whole Lake Victoria freshwater harvest.
            </p>

            {/* Quick Hero Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('reservations')}
                className="px-6 py-3.5 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-[#8B5A2B]/40 flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Table Now</span>
              </button>

              <button
                onClick={() => onNavigate('menu')}
                className="px-5 py-3.5 bg-[#F5F2EB]/95 hover:bg-[#F5F2EB] text-[#3E2723] font-bold rounded-xl text-xs sm:text-sm transition-all border border-[#D7CCC8] shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-[#8B5A2B]" />
                <span>Explore 28-Dish Menu</span>
              </button>

              <button
                onClick={() => {
                  document.getElementById('scene-chapters')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-3.5 bg-[#D7CCC8]/30 hover:bg-[#D7CCC8]/50 text-[#F5F2EB] font-semibold rounded-xl text-xs sm:text-sm backdrop-blur-md transition-all border border-[#F5F2EB]/30 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Signature Chapters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Docked Floating Concierge Bar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
          <div className="bg-[#F5F2EB]/95 backdrop-blur-md border border-[#D7CCC8] rounded-2xl p-4 sm:p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D7CCC8]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#8B5A2B]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#3E2723] font-mono">
                  Instant Table Concierge · Arcadia Mall Greenpark
                </span>
              </div>
              <span className="text-[11px] text-[#8B5A2B] font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#8B5A2B] animate-ping" />
                Patio & Hearth Tables Available
              </span>
            </div>

            {bookingSuccessCode ? (
              <div className="p-4 bg-[#D7CCC8]/50 border border-[#8B5A2B]/40 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#3E2723] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Table Confirmed at Roots & Pots!</span>
                </div>
                <p className="text-[#5D4037]">
                  Reservation Code: <strong className="font-mono text-[#3E2723] text-sm bg-white px-2 py-0.5 rounded border border-[#D7CCC8]">{bookingSuccessCode}</strong> for {guestName} ({partySize} Guests) on {bookDate} at {bookTime}.
                </p>
                <button
                  onClick={() => setBookingSuccessCode(null)}
                  className="text-[11px] text-[#8B5A2B] hover:underline font-bold pt-1 block cursor-pointer"
                >
                  Book another table &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuickBook} className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase text-[#795548] font-mono font-bold mb-1">Date</label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] font-mono focus:outline-none focus:border-[#8B5A2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#795548] font-mono font-bold mb-1">Time</label>
                    <select
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      className="w-full px-2.5 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] font-mono focus:outline-none focus:border-[#8B5A2B]"
                    >
                      <option value="12:30">12:30 PM (Lunch)</option>
                      <option value="13:30">01:30 PM (Lunch)</option>
                      <option value="18:30">06:30 PM (Sunset)</option>
                      <option value="19:30">07:30 PM (Dinner)</option>
                      <option value="20:30">08:30 PM (Late Dinner)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#795548] font-mono font-bold mb-1">Party</label>
                    <select
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full px-2.5 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] font-mono focus:outline-none focus:border-[#8B5A2B]"
                    >
                      <option value="2">2 Guests (Table for 2)</option>
                      <option value="4">4 Guests (Standard)</option>
                      <option value="6">6 Guests (Terrace)</option>
                      <option value="8">8 Guests (Feast)</option>
                      <option value="12">12+ Guests (Kraal Suite)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-[#795548] font-mono font-bold mb-1">Atmosphere</label>
                    <select
                      value={bookZone}
                      onChange={(e) => setBookZone(e.target.value as 'terrace' | 'hearth' | 'kraal')}
                      className="w-full px-2.5 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B] font-medium"
                    >
                      <option value="terrace">Garden Terrace Patio</option>
                      <option value="hearth">The Hearth Dining Hall</option>
                      <option value="kraal">Private Kraal Suite</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                  <input
                    type="text"
                    placeholder="Guest Name (e.g. Dr. Mutua)"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (07XX XXX XXX)"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-98"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F5F2EB]" />
                    <span>Confirm Table</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACT II: THE FOUR CULINARY CHAPTERS (PANORAMIC TASTING REEL) */}
      {/* Seamlessly flows without borders, interactive filmstrip presentation */}
      {/* ========================================================================= */}
      <section 
        id="scene-chapters"
        className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7CCC8]/40 border border-[#D7CCC8] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B5A2B]">
                ACT III · REPERTOIRE
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#3E2723] tracking-tight">
              The Four Culinary Chapters
            </h2>
            <p className="text-xs sm:text-sm text-[#5D4037] max-w-xl mt-1 leading-relaxed">
              Every dish is prepared to order using prime ingredients directly sourced from Athi River rangelands, Lake Victoria waters, and smallholder organic growers.
            </p>
          </div>

          <button
            onClick={() => onNavigate('menu')}
            className="text-xs font-bold text-[#8B5A2B] hover:text-[#3E2723] transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
          >
            <span>Explore Complete 28-Dish Menu</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Cinematic Chapter Selector Filmstrip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SIGNATURE_CHAPTERS.map((dish, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={dish.id}
                onClick={() => setActiveChapter(idx)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                  isActive
                    ? 'bg-[#D7CCC8] border-[#8B5A2B] shadow-lg scale-101'
                    : 'bg-[#D7CCC8]/35 border-[#D7CCC8]/60 text-[#5D4037] hover:bg-[#D7CCC8]/70 hover:text-[#3E2723]'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-mono tracking-wider font-bold block mb-1 ${isActive ? 'text-[#8B5A2B]' : 'text-[#795548]'}`}>
                    {dish.chapter}
                  </span>
                  <span className="text-sm sm:text-base font-bold font-serif text-[#3E2723] block leading-tight">
                    {dish.title}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#BCAAA4]/40">
                  <span className="text-xs font-mono text-[#8B5A2B] font-bold">
                    Kshs {dish.price}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5A2B]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Spotlight Showcase Filmstrip Card */}
        <div className="bg-[#D7CCC8]/40 rounded-3xl border border-[#D7CCC8] p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden border border-[#BCAAA4] shadow-md">
            <img
              src={currentDish.image}
              alt={currentDish.title}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('dish_mbuzi_choma_ugali')) {
                  target.src = '/src/assets/images/dish_mbuzi_choma_ugali_1792635389333.jpg';
                }
              }}
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute top-3 left-3 bg-[#3E2723]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[#F5F2EB] font-bold">
              {currentDish.provenance}
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-[#F5F2EB]/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-mono text-[#3E2723] font-semibold border border-[#D7CCC8]">
              {currentDish.notes}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#8B5A2B] font-bold">
              {currentDish.chapter} · {currentDish.categoryName}
            </span>
            <h3 className="text-2xl sm:text-4xl font-bold font-serif text-[#3E2723]">
              {currentDish.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#8B5A2B] italic font-serif">
              {currentDish.swahili}
            </p>

            <p className="text-sm text-[#5D4037] leading-relaxed">
              {currentDish.description}
            </p>

            <div className="pt-4 border-t border-[#D7CCC8] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#795548] block">Price per serving</span>
                <span className="text-2xl font-bold font-mono text-[#3E2723]">
                  Kshs {currentDish.price}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOrderChapter(currentDish)}
                  className="px-5 py-3 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedItem === currentDish.id ? 'Added to Meal Bag!' : 'Add to Order'}</span>
                </button>

                <button
                  onClick={() => onNavigate('reservations')}
                  className="px-5 py-3 bg-[#F5F2EB] hover:bg-white text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Book Table for This
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACT IV: THE THREE SANCTUARY ATMOSPHERES */}
      {/* Seamless continuation of the dining environment */}
      {/* ========================================================================= */}
      <section 
        id="scene-atmospheres"
        className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7CCC8]/40 border border-[#D7CCC8]">
            <Compass className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B5A2B]">
              ACT IV · SPATIAL PRESENCE
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#3E2723] tracking-tight">
            Three Distinct Atmospheres at Arcadia Mall
          </h2>
          <p className="text-xs sm:text-sm text-[#5D4037] leading-relaxed">
            Whether an open-air sunset date, a cozy gathering by firewood embers, or an executive family kraal banquet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#8B5A2B] transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8B5A2B]/15 text-[#8B5A2B] flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723]">Savanna Garden Terrace</h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Relaxed outdoor patio dining nestled in Greenpark greenery. Soft ambient hanging lanterns and cool evening breezes off the Machakos plains.
              </p>
            </div>
            <div className="pt-4 border-t border-[#D7CCC8] mt-6 flex items-center justify-between text-xs text-[#795548]">
              <span>Capacity: 48 Guests</span>
              <button
                onClick={() => onNavigate('reservations')}
                className="text-[#8B5A2B] hover:underline font-bold cursor-pointer"
              >
                Reserve Terrace &rarr;
              </button>
            </div>
          </div>

          <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#8B5A2B] transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8B5A2B]/15 text-[#8B5A2B] flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723]">The Hearth Dining Hall</h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Intimate dining room situated directly beside our open-hearth acacia embers and earthenware clay pot cooking stations. Rich aromas and warm stone textures.
              </p>
            </div>
            <div className="pt-4 border-t border-[#D7CCC8] mt-6 flex items-center justify-between text-xs text-[#795548]">
              <span>Capacity: 60 Guests</span>
              <button
                onClick={() => onNavigate('reservations')}
                className="text-[#8B5A2B] hover:underline font-bold cursor-pointer"
              >
                Reserve Hearth &rarr;
              </button>
            </div>
          </div>

          <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#8B5A2B] transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8B5A2B]/15 text-[#8B5A2B] flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold font-serif text-[#3E2723]">Private Kraal Suites</h3>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                Exclusive partitioned suites for corporate board dinners, family celebrations, and VIP banquets with personal sommelier and bespoke multi-course menus.
              </p>
            </div>
            <div className="pt-4 border-t border-[#D7CCC8] mt-6 flex items-center justify-between text-xs text-[#795548]">
              <span>Suites: 4 Rooms</span>
              <button
                onClick={() => onNavigate('reservations')}
                className="text-[#8B5A2B] hover:underline font-bold cursor-pointer"
              >
                Reserve Suite &rarr;
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ACT V: GUEST ACCLAIM & BACK-OF-HOUSE SYSTEMS */}
      {/* Fluidly concludes the canvas with real diner lore and operational controls */}
      {/* ========================================================================= */}
      <section 
        id="scene-lore"
        className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12"
      >
        <div className="space-y-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-[#D7CCC8]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7CCC8]/40 border border-[#D7CCC8] mb-1.5">
                <Star className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B5A2B]">
                  ACT V · GUEST ACCLAIM
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#3E2723] tracking-tight">
                Voices from Our Dining Room
              </h2>
            </div>

            <div className="flex items-center gap-1 text-[#8B5A2B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#8B5A2B]" />
              ))}
              <span className="text-xs font-mono text-[#3E2723] ml-2 font-bold">4.9 / 5.0 (240+ Diners)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-[#D7CCC8]/30 rounded-2xl border border-[#D7CCC8] space-y-3 shadow-xs">
              <p className="text-xs text-[#5D4037] italic leading-relaxed">
                “Finally, an authentic African restaurant that pairs uncompromising traditional recipes with 5-star ambiance. The bone marrow soup and brown millet ugali are extraordinary.”
              </p>
              <div className="pt-2 border-t border-[#D7CCC8] text-xs">
                <strong className="text-[#3E2723] block font-serif">Dr. Samuel Mutua</strong>
                <span className="text-[#795548] text-[11px]">Greenpark Resident & Regular Diner</span>
              </div>
            </div>

            <div className="p-6 bg-[#D7CCC8]/30 rounded-2xl border border-[#D7CCC8] space-y-3 shadow-xs">
              <p className="text-xs text-[#5D4037] italic leading-relaxed">
                “The Lake Victoria Tilapia with slippery mrenda took me straight back to Kisumu. Crisp skin, flaky sweet meat, and the chilled Ukwaju juice is the best in Athi River.”
              </p>
              <div className="pt-2 border-t border-[#D7CCC8] text-xs">
                <strong className="text-[#3E2723] block font-serif">Amina Hassan</strong>
                <span className="text-[#795548] text-[11px]">Nairobi Food & Culture Writer</span>
              </div>
            </div>

            <div className="p-6 bg-[#D7CCC8]/30 rounded-2xl border border-[#D7CCC8] space-y-3 shadow-xs">
              <p className="text-xs text-[#5D4037] italic leading-relaxed">
                “Hosted our engineering firm’s quarterly dinner in the Private Kraal suite. The 1kg goat choma platter and service was prompt, professional, and warmly welcoming.”
              </p>
              <div className="pt-2 border-t border-[#D7CCC8] text-xs">
                <strong className="text-[#3E2723] block font-serif">Arch. Peter Kamau</strong>
                <span className="text-[#795548] text-[11px]">Managing Principal, Kamau & Co.</span>
              </div>
            </div>

          </div>

        </div>

        {/* Back-of-House Systems Entry Callout */}
        <div className="bg-[#D7CCC8]/40 border border-[#D7CCC8] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-mono font-bold uppercase text-[#8B5A2B]">
              <ShieldCheck className="w-4 h-4 text-[#8B5A2B]" />
              <span>Back-of-House & Fleet Operations</span>
            </div>
            <h3 className="text-lg font-bold font-serif text-[#3E2723]">
              Staff Floor KDS & Executive Management Systems
            </h3>
            <p className="text-xs text-[#5D4037] max-w-xl">
              Floor staff and kitchen leads can manage table seatings, all dine-in and delivery orders, and rider auto-dispatch. Executive management can access live financial audits and inventory switches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAuth('staff')}
              className="px-5 py-3 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Floor Staff Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onOpenAuth('admin')}
              className="px-5 py-3 bg-[#F5F2EB] hover:bg-white text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span>General Manager Login</span>
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
