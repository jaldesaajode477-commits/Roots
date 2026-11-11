import React, { useState, useEffect } from 'react';
import { Header, AppPage } from './components/Header';
import { HomePage } from './components/HomePage';
import { FullMenuSection } from './components/FullMenuSection';
import { TableReservationPage } from './components/TableReservationPage';
import { LoyaltyClub } from './components/LoyaltyClub';
import { LocationSection } from './components/LocationSection';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { StaffPortal } from './components/StaffPortal';
import { AdminPortal } from './components/AdminPortal';
import { RiderPortal } from './components/RiderPortal';
import { AuthModal } from './components/AuthModal';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { MenuItem } from './data/menuData';
import { Bike, Flame, Sparkles, ChefHat, CheckCircle2 } from 'lucide-react';

function MainApp() {
  const { currentUser, activeClientOrder } = useRestaurant();
  const [currentPage, setCurrentPage] = useState<AppPage>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as AppPage;
      if (['home', 'menu', 'reservations', 'loyalty', 'location', 'staff_portal', 'admin_portal', 'rider_portal'].includes(hash)) {
        return hash;
      }
    }
    return 'home';
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authRoleChoice, setAuthRoleChoice] = useState<'staff' | 'admin'>('staff');

  // Sync meal bag: once an order has been delivered/completed, ensure the meal bag is cleared!
  useEffect(() => {
    if (activeClientOrder && activeClientOrder.status === 'completed' && cartItems.length > 0) {
      setCartItems([]);
    }
  }, [activeClientOrder?.status, cartItems.length]);

  // Sync hash with currentPage
  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppPage;
      if (['home', 'menu', 'reservations', 'loyalty', 'location', 'staff_portal', 'admin_portal', 'rider_portal'].includes(hash)) {
        setCurrentPage(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenAuth = (role: 'staff' | 'admin' = 'staff') => {
    setAuthRoleChoice(role);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (targetPage?: 'staff_portal' | 'admin_portal') => {
    if (targetPage) {
      navigateTo(targetPage);
    }
  };

  const handleAddToCartFromMenu = (menuItem: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === menuItem.id);
      if (existing) {
        return prev.map((i) => (i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          customization: menuItem.swahiliName,
          category: menuItem.category,
        },
      ];
    });
  };

  const handleQuickAddToCart = (item: { id: string; name: string; price: number; customization?: string; category?: string }) => {
    const newItem: CartItem = {
      id: `${item.id}-${Date.now()}`,
      name: item.name,
      price: item.price,
      quantity: 1,
      customization: item.customization || 'Hearth Selection',
      category: item.category || 'featured',
    };

    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === newItem.name && i.customization === newItem.customization);
      if (existing) {
        return prev.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, newItem];
    });

    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // If in staff or admin portal view, render dedicated operational experience
  if (currentPage === 'staff_portal') {
    return (
      <StaffPortal
        onBackToSite={() => navigateTo('home')}
        onSwitchToAdmin={() => navigateTo('admin_portal')}
      />
    );
  }

  if (currentPage === 'admin_portal') {
    return (
      <AdminPortal
        onBackToSite={() => navigateTo('home')}
        onSwitchToStaff={() => navigateTo('staff_portal')}
      />
    );
  }

  if (currentPage === 'rider_portal') {
    return (
      <RiderPortal
        onBackToSite={() => navigateTo('home')}
        onSwitchToStaff={() => navigateTo('staff_portal')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] selection:bg-[#8B5A2B] selection:text-[#F5F2EB] flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Header
        currentPage={currentPage}
        onNavigate={navigateTo}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={handleOpenAuth}
      />

      {/* DEDICATED PAGE VIEWS */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onAddToCart={handleQuickAddToCart}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentPage === 'menu' && (
          <FullMenuSection
            onSelectItemForCart={handleAddToCartFromMenu}
            onOpenReservation={() => navigateTo('reservations')}
          />
        )}

        {currentPage === 'reservations' && (
          <TableReservationPage />
        )}

        {currentPage === 'loyalty' && (
          <LoyaltyClub />
        )}

        {currentPage === 'location' && (
          <LocationSection />
        )}
      </main>

      {/* Real-time Order Tracking Persistent Floating Pill */}
      {activeClientOrder && activeClientOrder.status !== 'completed' && activeClientOrder.status !== 'cancelled' && (
        <aside aria-label="Real-time order tracking" className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-40 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 bg-[#3E2723] text-[#F5F2EB] rounded-2xl shadow-2xl border-2 border-[#8B5A2B] hover:scale-102 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {activeClientOrder.status === 'en_route' ? (
                  <Bike className="w-5 h-5 text-[#8B5A2B] animate-bounce" />
                ) : activeClientOrder.status === 'preparing' ? (
                  <Flame className="w-5 h-5 text-[#8B5A2B] animate-pulse" />
                ) : activeClientOrder.status === 'ready' ? (
                  <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                ) : (
                  <ChefHat className="w-5 h-5 text-[#D7CCC8]" />
                )}
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#8B5A2B] animate-ping" />
              </div>

              <div className="text-left text-xs">
                <div className="flex items-center gap-1.5 font-mono font-bold">
                  <span className="text-[#D7CCC8]">Order {activeClientOrder.orderCode}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.2 bg-[#8B5A2B] text-[#F5F2EB] rounded">
                    {activeClientOrder.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-[#D7CCC8]/90 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {activeClientOrder.status === 'received' && 'Ticket received at Arcadia Mall hearth'}
                  {activeClientOrder.status === 'preparing' && 'Simmering over acacia firewood'}
                  {activeClientOrder.status === 'ready' && 'Plated & ready for dispatch'}
                  {activeClientOrder.status === 'en_route' && `Dispatched with ${activeClientOrder.assignedRiderName || 'Boda'}!`}
                </p>
              </div>
            </div>
            
            <span className="text-xs font-bold text-[#8B5A2B] group-hover:translate-x-0.5 transition-transform shrink-0">
              Track &rarr;
            </span>
          </button>
        </aside>
      )}

      {/* Footer */}
      <Footer />

      {/* Staff & Admin Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialRole={authRoleChoice}
      />

      {/* Meal Bag & Real-time Delivery / Pickup Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <MainApp />
    </RestaurantProvider>
  );
}
