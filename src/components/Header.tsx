import React, { useState } from 'react';
import { ShoppingBag, Menu as MenuIcon, X, MapPin, Phone, ShieldCheck, UserCheck, LogOut, ChevronDown, Bike } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export type AppPage = 'home' | 'menu' | 'reservations' | 'loyalty' | 'location' | 'staff_portal' | 'admin_portal' | 'rider_portal';

interface Props {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: (role?: 'staff' | 'admin') => void;
}

export const Header: React.FC<Props> = ({
  currentPage,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenAuth,
}) => {
  const { currentUser, logout } = useRestaurant();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { id: AppPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Digital Menu (28)' },
    { id: 'reservations', label: 'Table Booking' },
    { id: 'loyalty', label: 'Loyalty Club' },
    { id: 'location', label: 'Arcadia Mall' },
  ];

  const handleLinkClick = (page: AppPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#D7CCC8] transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Zone 1: Brand Wordmark with Official Emblem */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3.5 group whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            <img
              src="/assets/aistudio/image_75e986cd.png"
              alt="Roots and Pots Traditional Bistro Emblem"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('/public/assets/aistudio/image_75e986cd.png')) {
                  target.src = '/public/assets/aistudio/image_75e986cd.png';
                }
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain group-hover:scale-105 transition-transform filter drop-shadow-sm"
            />
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#3E2723] font-serif group-hover:text-[#8B5A2B] transition-colors block leading-tight">
                Roots & Pots
              </span>
              <span className="text-[10px] text-[#795548] tracking-widest block font-sans uppercase font-medium">
                Traditional Bistro · Athi River
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-[#5D4037]">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`py-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer relative ${
                    isActive
                      ? 'text-[#8B5A2B] font-bold'
                      : 'hover:text-[#3E2723]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#8B5A2B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Staff/Admin Auth + Meal Bag Cart + Primary Reserve CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Staff / Admin Access Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border cursor-pointer ${
                    currentUser.role === 'admin'
                      ? 'bg-[#D7CCC8] hover:bg-[#C7B8B3] text-[#3E2723] border-[#BCAAA4]'
                      : 'bg-[#8B5A2B]/15 hover:bg-[#8B5A2B]/25 text-[#8B5A2B] border-[#8B5A2B]/40'
                  }`}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#3E2723]" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  )}
                  <span className="hidden sm:inline font-bold">
                    {currentUser.role === 'admin' ? 'Admin Portal' : 'Staff Portal'}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#F5F2EB] border border-[#D7CCC8] rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-[#D7CCC8] mb-1">
                      <p className="text-xs font-bold text-[#3E2723] truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-[#795548] truncate">{currentUser.title}</p>
                    </div>

                    <button
                      onClick={() => handleLinkClick(currentUser.role === 'admin' ? 'admin_portal' : 'staff_portal')}
                      className="w-full text-left px-3 py-2 text-xs text-[#3E2723] hover:bg-[#D7CCC8]/60 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-medium"
                    >
                      {currentUser.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B]" /> : <UserCheck className="w-3.5 h-3.5 text-[#8B5A2B]" />}
                      <span>Open Workspace</span>
                    </button>

                    <button
                      onClick={() => handleLinkClick('rider_portal')}
                      className="w-full text-left px-3 py-2 text-xs text-[#3E2723] hover:bg-[#D7CCC8]/60 rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Bike className="w-3.5 h-3.5 text-[#8B5A2B]" />
                      <span>Rider Delivery App</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-[#B71C1C] hover:bg-[#FFEBEE] rounded-lg transition-colors flex items-center gap-2 cursor-pointer mt-1 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('staff')}
                  className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium text-[#5D4037] hover:text-[#3E2723] bg-[#D7CCC8]/50 hover:bg-[#D7CCC8] border border-[#BCAAA4] transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Staff & Management Access"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span className="hidden sm:inline">Portal Login</span>
                </button>

                <button
                  onClick={() => handleLinkClick('rider_portal')}
                  className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    currentPage === 'rider_portal'
                      ? 'bg-[#8B5A2B] text-[#F5F2EB] border-[#8B5A2B]'
                      : 'bg-[#D7CCC8]/50 hover:bg-[#D7CCC8] text-[#3E2723] border-[#BCAAA4]'
                  }`}
                  title="Open Dedicated Rider Delivery App"
                >
                  <Bike className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span className="hidden sm:inline font-bold">Rider App</span>
                </button>
              </div>
            )}

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl bg-[#D7CCC8]/50 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] transition-all cursor-pointer flex items-center gap-2"
              aria-label="View Meal Bag"
            >
              <ShoppingBag className="w-4 h-4 text-[#8B5A2B]" />
              <span className="hidden sm:inline text-xs font-semibold">Meal Bag</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#8B5A2B] text-[#F5F2EB] text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleLinkClick('reservations')}
              className="px-4 py-2 sm:py-2.5 text-xs font-bold text-[#F5F2EB] bg-[#8B5A2B] hover:bg-[#70461F] rounded-xl transition-all shadow-md shadow-[#8B5A2B]/20 whitespace-nowrap shrink-0 cursor-pointer active:scale-98"
            >
              Reserve Table
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#5D4037] hover:text-[#3E2723] cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F5F2EB] border-b border-[#D7CCC8] px-4 pt-3 pb-6 space-y-2">
          <nav className="flex flex-col space-y-1 text-sm font-medium text-[#5D4037]">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#8B5A2B] text-[#F5F2EB] font-bold'
                      : 'hover:bg-[#D7CCC8]/60 hover:text-[#3E2723]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Mobile Portal Link */}
            <button
              onClick={() => {
                if (currentUser) {
                  handleLinkClick(currentUser.role === 'admin' ? 'admin_portal' : 'staff_portal');
                } else {
                  setMobileMenuOpen(false);
                  onOpenAuth('staff');
                }
              }}
              className="text-left py-2 px-3 rounded-lg text-[#8B5A2B] hover:bg-[#D7CCC8]/60 flex items-center gap-2 cursor-pointer font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-[#8B5A2B]" />
              <span>{currentUser ? `${currentUser.role.toUpperCase()} Workspace` : 'Staff & Manager Portal'}</span>
            </button>

            {/* Mobile Rider Terminal Link */}
            <button
              onClick={() => handleLinkClick('rider_portal')}
              className="text-left py-2 px-3 rounded-lg text-[#3E2723] hover:bg-[#D7CCC8]/60 flex items-center gap-2 cursor-pointer font-semibold"
            >
              <Bike className="w-4 h-4 text-[#8B5A2B]" />
              <span>Boda Rider Delivery Terminal</span>
            </button>
          </nav>
          
          <div className="pt-3 border-t border-[#D7CCC8] flex flex-col gap-2">
            <a 
              href="tel:0118547574" 
              className="text-xs text-[#8B5A2B] flex items-center gap-2 py-1 font-semibold"
            >
              <Phone className="w-4 h-4" />
              <span>Direct Hearth Line: 0118 547 574</span>
            </a>
            <p className="text-xs text-[#795548] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span>Arcadia Mall, Greenpark, Athi River</span>
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
