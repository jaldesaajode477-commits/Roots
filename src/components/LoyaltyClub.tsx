import React, { useState } from 'react';
import { Award, Flame, Gift, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoyaltyClub: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [memberPoints, setMemberPoints] = useState(120);
  const [stamps, setStamps] = useState(3);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  const handleJoinOrCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setIsMember(true);
    setMemberPoints(150);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#8B5A2B', '#3E2723', '#D7CCC8'],
    });
  };

  const handleRedeem = (rewardName: string, cost: number) => {
    if (memberPoints < cost) return;
    setMemberPoints((prev) => prev - cost);
    const code = `RP-GIFT-${Math.floor(1000 + Math.random() * 9000)}`;
    setRedeemedCode(`${rewardName} (Voucher: ${code})`);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#8B5A2B', '#3E2723'],
    });
  };

  return (
    <section id="loyalty" className="py-20 bg-[#F5F2EB] text-[#3E2723] border-b border-[#D7CCC8] relative selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8B5A2B] mb-3">
            <Award className="w-4 h-4 text-[#8B5A2B]" />
            <span>Frequent Diner Loyalty Program</span>
            <span aria-hidden="true">·</span>
            <span>Klabu ya Chungu</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2723] font-serif tracking-tight">
            The Roots & Pots Hearth Club
          </h2>
          <p className="mt-4 text-base text-[#5D4037] leading-relaxed">
            Dine regularly at Arcadia Mall in Athi River or order doorstep deliveries to earn Pot Points, unlocked culinary perks, and complimentary heritage dishes.
          </p>
        </div>

        {/* 2-Column Loyalty Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Digital Member Pass / Join Form (6 cols) */}
          <div className="lg:col-span-6 bg-[#D7CCC8]/40 rounded-3xl p-6 sm:p-8 border border-[#D7CCC8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-[#8B5A2B] font-bold">
                  Digital Pass & Stamp Tracker
                </span>
                <span className="text-xs font-mono text-[#795548]">Athi River Chapter</span>
              </div>

              {/* Digital Pass Card */}
              <div 
                className="rounded-2xl p-6 relative overflow-hidden text-[#F5F2EB] shadow-lg border border-[#8B5A2B]/40 mb-6 bg-[#3E2723]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold font-serif tracking-tight">ROOTS & POTS</h4>
                    <p className="text-[10px] text-[#D7CCC8] uppercase font-bold tracking-wider">Hearth Dining Club</p>
                  </div>
                  <Flame className="w-8 h-8 text-[#8B5A2B]" />
                </div>

                <div className="space-y-1 mb-6">
                  <span className="text-[10px] text-[#D7CCC8]/80 uppercase block">Member Tier</span>
                  <div className="text-xl font-bold font-serif text-[#F5F2EB] flex items-center gap-2">
                    <span>{memberPoints >= 250 ? 'Chui (Leopard Tier)' : 'Mwanzo (Starter Tier)'}</span>
                    <span className="text-xs font-mono font-normal text-[#D7CCC8]">
                      {memberPoints} Pot Points
                    </span>
                  </div>
                </div>

                {/* 6-Meal Stamp Tracker */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#D7CCC8] mb-2 font-medium">
                    <span>Loyalty Stamp Progress:</span>
                    <span>{stamps} of 6 Meals (Next: Free Bone Soup)</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className={`h-9 rounded-lg flex items-center justify-center border text-xs font-bold ${
                          i <= stamps
                            ? 'bg-[#8B5A2B] border-[#8B5A2B] text-[#F5F2EB] shadow-xs'
                            : 'bg-black/25 border-white/20 text-[#D7CCC8]/60'
                        }`}
                      >
                        {i <= stamps ? <Check className="w-4 h-4" /> : i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Member Sign-in / Join Form */}
              {!isMember ? (
                <form onSubmit={handleJoinOrCheck} className="space-y-3">
                  <label className="block text-xs font-bold text-[#5D4037]">
                    Enter your Safaricom M-Pesa Phone Number to Check or Join:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="0712 345 678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      Check / Join (+100 Pts)
                    </button>
                  </div>
                  <p className="text-[11px] text-[#795548]">
                    Sign up today and instantly receive 100 welcome Pot Points towards your first reward.
                  </p>
                </form>
              ) : (
                <div className="p-3.5 bg-white rounded-xl border border-[#D7CCC8] text-xs text-[#3E2723] flex items-center justify-between shadow-xs">
                  <span>Welcome back, <strong>{phoneNumber || 'Diner'}</strong>!</span>
                  <button
                    onClick={() => { setIsMember(false); setPhoneNumber(''); setRedeemedCode(null); }}
                    className="text-[#8B5A2B] font-bold hover:underline cursor-pointer"
                  >
                    Switch Account
                  </button>
                </div>
              )}
            </div>

            {/* Redeemed Code Notification */}
            {redeemedCode && (
              <div className="mt-4 p-3 bg-[#2E7D32]/15 border border-[#2E7D32]/40 rounded-xl text-xs text-[#2E7D32]">
                <strong>Reward Unlocked!</strong> Present this voucher to your waiter at Arcadia Mall:
                <div className="font-mono font-bold text-[#3E2723] mt-1 text-sm">{redeemedCode}</div>
              </div>
            )}
          </div>

          {/* Right Column: Tiers & Redeemable Rewards (6 cols) */}
          <div className="lg:col-span-6 bg-[#D7CCC8]/40 rounded-3xl p-6 sm:p-8 border border-[#D7CCC8] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8B5A2B] font-bold mb-3">
                <Gift className="w-4 h-4 text-[#8B5A2B]" />
                <span>Redeemable Culinary Perks</span>
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] font-serif mb-4">
                Spend Points on Signature Bites
              </h3>

              <div className="space-y-3">
                
                {/* Reward 1 */}
                <div className="p-3 bg-white rounded-xl border border-[#D7CCC8] flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/images/food_mahamri_chai_pour_1792636522226.jpg"
                      alt="Swahili Mahamri"
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#D7CCC8]"
                      onError={(e) => {
                        e.currentTarget.src = '/src/assets/images/dish_mbuzi_choma_ugali_1792635389333.jpg';
                      }}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-[#3E2723]">Swahili Mahamri Basket (4 pcs)</h5>
                      <p className="text-[11px] text-[#5D4037]">Cardamom-scented fluffy coconut pastries</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-[#8B5A2B] block tabular-nums">50 Pts</span>
                    <button
                      onClick={() => handleRedeem('Swahili Mahamri Basket', 50)}
                      disabled={memberPoints < 50}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg mt-1 cursor-pointer transition-colors ${
                        memberPoints >= 50
                          ? 'bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB]'
                          : 'bg-[#D7CCC8] text-[#795548] cursor-not-allowed'
                      }`}
                    >
                      Redeem
                    </button>
                  </div>
                </div>

                {/* Reward 2 */}
                <div className="p-3 bg-white rounded-xl border border-[#D7CCC8] flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/images/food_bone_soup_marrow_1792637970477.jpg"
                      alt="Traditional Bone Soup"
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#D7CCC8]"
                      onError={(e) => {
                        e.currentTarget.src = '/src/assets/images/dish_mbuzi_choma_ugali_1792635389333.jpg';
                      }}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-[#3E2723]">Traditional Bone Soup Starter</h5>
                      <p className="text-[11px] text-[#5D4037]">Rich bone marrow broth with wild herbs & pepper</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-[#8B5A2B] block tabular-nums">100 Pts</span>
                    <button
                      onClick={() => handleRedeem('Traditional Bone Soup', 100)}
                      disabled={memberPoints < 100}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg mt-1 cursor-pointer transition-colors ${
                        memberPoints >= 100
                          ? 'bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB]'
                          : 'bg-[#D7CCC8] text-[#795548] cursor-not-allowed'
                      }`}
                    >
                      Redeem
                    </button>
                  </div>
                </div>

                {/* Reward 3 */}
                <div className="p-3 bg-white rounded-xl border border-[#D7CCC8] flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src="/src/assets/images/food_tamarind_ukwaju_drink_1792637971583.jpg"
                      alt="Tamarind Ukwaju"
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#D7CCC8]"
                      onError={(e) => {
                        e.currentTarget.src = '/src/assets/images/dish_mbuzi_choma_ugali_1792635389333.jpg';
                      }}
                    />
                    <div>
                      <h5 className="text-xs font-bold text-[#3E2723]">1L Artisanal Tamarind Juice (Ukwaju)</h5>
                      <p className="text-[11px] text-[#5D4037]">Pressed natural tamarind infused with cloves</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-[#8B5A2B] block tabular-nums">180 Pts</span>
                    <button
                      onClick={() => handleRedeem('1L Tamarind Juice', 180)}
                      disabled={memberPoints < 180}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg mt-1 cursor-pointer transition-colors ${
                        memberPoints >= 180
                          ? 'bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB]'
                          : 'bg-[#D7CCC8] text-[#795548] cursor-not-allowed'
                      }`}
                    >
                      Redeem
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Tier Rules */}
            <div className="mt-6 pt-4 border-t border-[#D7CCC8] grid grid-cols-3 gap-2 text-center text-[10px] text-[#5D4037]">
              <div className="p-2 bg-white rounded-lg border border-[#D7CCC8]">
                <span className="font-bold text-[#3E2723] block">Mwanzo</span>
                <span>0 - 250 Pts</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#D7CCC8]">
                <span className="font-bold text-[#8B5A2B] block">Chui Tier</span>
                <span>250 - 750 Pts</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#D7CCC8]">
                <span className="font-bold text-[#3E2723] block">Simba VIP</span>
                <span>750+ Pts</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
