import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, CheckCircle2, Share2, Sparkles, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRestaurant } from '../context/RestaurantContext';

export const TableReservationPage: React.FC = () => {
  const { addReservation } = useRestaurant();
  const [step, setStep] = useState<'form' | 'confirmed'>('form');
  const [zone, setZone] = useState<'terrace' | 'hearth' | 'private'>('terrace');
  const [guests, setGuests] = useState<number>(4);
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('13:00');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [reservationCode, setReservationCode] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const newRes = addReservation({
      guestName: name,
      phone,
      email,
      date,
      time: timeSlot,
      guests,
      zone: zone === 'private' ? 'kraal' : zone,
      specialRequests: specialNotes,
      isVIP: guests >= 6,
    });

    setReservationCode(newRes.code);
    setStep('confirmed');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5A2B', '#3E2723', '#D7CCC8'],
    });
  };

  const [copiedLink, setCopiedLink] = useState(false);

  const getWhatsAppShareUrl = () => {
    const text = encodeURIComponent(
      `Karibu! I reserved our table at Roots and Pots Traditional Bistro (Arcadia Mall, Greenpark, Athi River).\nDate: ${date} at ${timeSlot}\nGuests: ${guests}\nRef: ${reservationCode}`
    );
    return `https://wa.me/?text=${text}`;
  };

  const handleCopyBooking = () => {
    const summary = `Table Reservation at Roots and Pots Bistro (Arcadia Mall, Athi River)\nDate: ${date} at ${timeSlot}\nGuests: ${guests} (${zone})\nBooking Ref: ${reservationCode}\nGuest: ${name} (${phone})`;
    navigator.clipboard?.writeText(summary);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B5A2B]">
            Arcadia Mall · Athi River
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2723] font-serif tracking-tight mt-1">
            Reserve Your Hearth Table
          </h1>
          <p className="mt-2 text-sm text-[#5D4037] leading-relaxed">
            Experience woodfire goat choma and traditional claypot comfort food with family and friends at our welcoming bistro sanctuary.
          </p>
        </div>

        {/* Main Reservation Card */}
        <div className="bg-[#D7CCC8]/40 border border-[#D7CCC8] rounded-3xl p-6 sm:p-10 shadow-lg">
          
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Seating Zone Selection */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#795548] mb-3">
                  1. Select Dining Atmosphere
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setZone('terrace')}
                    className={`rounded-2xl text-left border transition-all cursor-pointer overflow-hidden ${
                      zone === 'terrace'
                        ? 'bg-white border-[#8B5A2B] text-[#3E2723] shadow-md ring-2 ring-[#8B5A2B]'
                        : 'bg-white/60 border-[#D7CCC8] text-[#5D4037] hover:bg-white'
                    }`}
                  >
                    <div className="h-28 w-full overflow-hidden bg-black/5 relative">
                      <img
                        src="/src/assets/images/arcadia_terrace_patio_1794114620985.jpg"
                        alt="Savanna Terrace"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/ambiance_bistro_interior_1792635389767.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-3 font-bold text-white text-sm font-serif">Savanna Terrace</div>
                    </div>
                    <div className="p-3 text-xs text-[#795548]">Breezy outdoor patio with savanna sunsets</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setZone('hearth')}
                    className={`rounded-2xl text-left border transition-all cursor-pointer overflow-hidden ${
                      zone === 'hearth'
                        ? 'bg-white border-[#8B5A2B] text-[#3E2723] shadow-md ring-2 ring-[#8B5A2B]'
                        : 'bg-white/60 border-[#D7CCC8] text-[#5D4037] hover:bg-white'
                    }`}
                  >
                    <div className="h-28 w-full overflow-hidden bg-black/5 relative">
                      <img
                        src="/src/assets/images/ambiance_bistro_interior_1792635389767.jpg"
                        alt="Hearth Dining Hall"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/arcadia_terrace_patio_1794114620985.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-3 font-bold text-white text-sm font-serif">Hearth Dining Hall</div>
                    </div>
                    <div className="p-3 text-xs text-[#795548]">Warm indoor view of our charcoal jiko</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setZone('private')}
                    className={`rounded-2xl text-left border transition-all cursor-pointer overflow-hidden ${
                      zone === 'private'
                        ? 'bg-white border-[#8B5A2B] text-[#3E2723] shadow-md ring-2 ring-[#8B5A2B]'
                        : 'bg-white/60 border-[#D7CCC8] text-[#5D4037] hover:bg-white'
                    }`}
                  >
                    <div className="h-28 w-full overflow-hidden bg-black/5 relative">
                      <img
                        src="/src/assets/images/hero_african_claypot_feast_1792635387927.jpg"
                        alt="Family Kraal"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/ambiance_bistro_interior_1792635389767.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-3 font-bold text-white text-sm font-serif">Family Kraal</div>
                    </div>
                    <div className="p-3 text-xs text-[#795548]">Private cozy booth for celebratory feasts</div>
                  </button>
                </div>
              </div>

              {/* Date, Time & Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1.5 font-mono">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1.5 font-mono">Dining Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                  >
                    <option value="12:00">12:00 PM (Lunch Service)</option>
                    <option value="13:00">1:00 PM (Lunch Service)</option>
                    <option value="14:00">2:00 PM (Late Lunch)</option>
                    <option value="17:30">5:30 PM (Early Dinner)</option>
                    <option value="19:00">7:00 PM (Prime Evening)</option>
                    <option value="20:30">8:30 PM (Late Dinner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1.5 font-mono">Party Size</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1.5">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wanjiku Odhiambo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1.5">Kenyan Phone (M-Pesa / SMS)</label>
                  <input
                    type="tel"
                    required
                    placeholder="0712 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5D4037] mb-1.5">Special Dietary Notes or Occasion (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Birthday feast, extra kachumbari pre-order, high chair needed"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer active:scale-98"
                >
                  Confirm Table Reservation
                </button>
              </div>

              <div className="text-center text-xs text-[#795548] flex items-center justify-center gap-2">
                <span>Free reservation · Instant confirmation voucher · Tel: 0118 547 574</span>
              </div>
            </form>
          ) : (
            /* Confirmation Card */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#2E7D32]/15 text-[#2E7D32] flex items-center justify-center mx-auto border border-[#2E7D32]/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B5A2B]">
                  Karibu Sana! Reservation Confirmed
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#3E2723] font-serif mt-1">
                  We Await You at Roots & Pots
                </h2>
                <p className="text-xs text-[#5D4037] mt-1">
                  Your table at Arcadia Mall, Greenpark off Mombasa Road has been secured.
                </p>
              </div>

              <div className="bg-white border border-[#D7CCC8] rounded-2xl p-6 text-left space-y-3 text-xs max-w-lg mx-auto shadow-sm">
                <div className="flex justify-between border-b border-[#D7CCC8] pb-2">
                  <span className="text-[#795548]">Booking Reference:</span>
                  <span className="font-mono font-bold text-[#8B5A2B] text-base">{reservationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#795548]">Guest Name:</span>
                  <span className="font-bold text-[#3E2723]">{name} ({phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#795548]">Date & Time:</span>
                  <span className="font-bold text-[#3E2723]">{date} at {timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#795548]">Atmosphere & Guests:</span>
                  <span className="font-bold text-[#3E2723]">{guests} Guests · {zone.toUpperCase()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#D7CCC8]">
                  <span className="text-[#795548]">Address:</span>
                  <span className="text-[#3E2723] font-medium">Arcadia Mall, Greenpark, off Mombasa Rd, Athi River</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <a
                  href={getWhatsAppShareUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm no-underline text-center"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyBooking}
                  className="flex-1 py-3 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-xs transition-colors cursor-pointer border border-[#8B5A2B] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Details'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
