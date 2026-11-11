import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Bike, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Phone,
  Flame,
  ChefHat,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRestaurant, OrderRecord } from '../context/RestaurantContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customization?: string;
  category?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

const DELIVERY_ZONES = [
  { id: 'arcadia_pickup', name: 'Arcadia Mall Pickup (In-Store)', fee: 0, time: '20 mins' },
  { id: 'greenpark', name: 'Greenpark Estate (Doorstep)', fee: 100, time: '25-35 mins' },
  { id: 'athi_river_town', name: 'Athi River Town & Greatwall', fee: 150, time: '30-40 mins' },
  { id: 'syokimau_sabaki', name: 'Syokimau & Sabaki', fee: 200, time: '35-45 mins' },
  { id: 'kitengela', name: 'Kitengela Interchange', fee: 250, time: '40-50 mins' },
  { id: 'daystar', name: 'Daystar & Lukenya Corridor', fee: 300, time: '45-60 mins' },
];

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { addOrder, activeClientOrder, clearActiveClientOrder } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'cart' | 'tracking'>(() => activeClientOrder ? 'tracking' : 'cart');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedZone, setSelectedZone] = useState<string>('greenpark');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cod'>('mpesa');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentZone = DELIVERY_ZONES.find((z) => z.id === (orderType === 'pickup' ? 'arcadia_pickup' : selectedZone)) || DELIVERY_ZONES[1];
  const itemsSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'pickup' ? 0 : currentZone.fee;
  const grandTotal = itemsSubtotal + deliveryFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || items.length === 0) return;

    setIsSubmitting(true);

    const newOrder = addOrder({
      customerName,
      customerPhone,
      deliveryAddress: orderType === 'delivery' ? (deliveryAddress ? `${deliveryAddress} (${currentZone.name})` : currentZone.name) : 'Arcadia Mall Counter Pickup',
      orderType: orderType === 'delivery' ? 'delivery' : 'pickup',
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        customization: i.customization,
      })),
      subtotal: itemsSubtotal,
      deliveryFee,
      total: grandTotal,
      paymentMethod: paymentMethod === 'mpesa' ? 'mpesa' : 'cash',
      mpesaReceipt: paymentMethod === 'mpesa' ? `QJL${Math.floor(10000 + Math.random() * 90000)}X` : undefined,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onClearCart();
      setActiveTab('tracking');
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5A2B', '#3E2723', '#D7CCC8'],
      });
    }, 600);
  };

  // Determine active status stage from REAL order in context
  const getStepProgress = (status: OrderRecord['status']) => {
    switch (status) {
      case 'received': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'en_route': return 4;
      case 'completed': return 5;
      default: return 1;
    }
  };

  const currentStep = activeClientOrder ? getStepProgress(activeClientOrder.status) : 1;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#F5F2EB] border-l border-[#D7CCC8] h-full flex flex-col text-[#3E2723] shadow-2xl relative selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
        
        {/* Header with Navigation Tabs if Active Order exists */}
        <div className="p-4 sm:p-5 border-b border-[#D7CCC8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8B5A2B]" />
            <div>
              <h3 className="font-bold text-base text-[#3E2723] font-serif leading-tight">
                Roots & Pots Bistro
              </h3>
              <span className="text-[10px] text-[#795548] font-mono">Arcadia Mall Hearth</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && activeTab === 'cart' && (
              <button
                type="button"
                onClick={onClearCart}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C62828]/10 hover:bg-[#C62828]/20 text-[#C62828] text-xs font-semibold border border-[#C62828]/30 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Clear all dishes from meal bag"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Bag</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#795548] hover:text-[#3E2723] hover:bg-[#D7CCC8]/50 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher: Meal Bag vs Real-Time Kitchen Tracker */}
        {activeClientOrder && (
          <div className="px-5 pt-3 pb-1 border-b border-[#D7CCC8]/60 flex items-center gap-2 bg-[#EBE4DD]">
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'cart'
                  ? 'bg-white text-[#3E2723] shadow-xs'
                  : 'text-[#795548] hover:text-[#3E2723]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span>Meal Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'tracking'
                  ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-xs'
                  : 'text-[#795548] hover:text-[#3E2723]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Order ({activeClientOrder.orderCode})</span>
            </button>
          </div>
        )}

        {/* BODY TAB 1: MEAL BAG & CHECKOUT */}
        {activeTab === 'cart' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
            
            {/* Fulfillment Type Toggle */}
            <div className="grid grid-cols-2 p-1 bg-[#D7CCC8]/40 rounded-xl border border-[#D7CCC8]">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-xs'
                    : 'text-[#5D4037] hover:text-[#3E2723]'
                }`}
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Doorstep Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-xs'
                    : 'text-[#5D4037] hover:text-[#3E2723]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Arcadia Mall Pickup</span>
              </button>
            </div>

            {/* Cart Items List */}
            {items.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-10 h-10 text-[#8B5A2B] mx-auto" />
                <p className="text-sm font-semibold text-[#3E2723]">Your meal bag is empty</p>
                <p className="text-xs text-[#795548]">
                  Select traditional combos or artisan claypot specialties from our menu to begin.
                </p>
                {activeClientOrder && (
                  <button
                    onClick={() => setActiveTab('tracking')}
                    className="mt-3 px-4 py-2 bg-[#8B5A2B] text-[#F5F2EB] rounded-xl text-xs font-bold hover:bg-[#70461F] cursor-pointer"
                  >
                    View Active Order {activeClientOrder.orderCode} &rarr;
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#D7CCC8]">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#795548] font-bold">
                    Dishes in Meal Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
                  </span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs font-semibold text-[#C62828] hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Meal Bag</span>
                  </button>
                </div>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-[#D7CCC8] flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#3E2723] truncate">{item.name}</h4>
                      {item.customization && (
                        <p className="text-[11px] text-[#8B5A2B] truncate font-medium">{item.customization}</p>
                      )}
                      <p className="text-xs font-mono font-semibold text-[#5D4037] mt-1 tabular-nums">
                        Kshs {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#F5F2EB] rounded-lg border border-[#D7CCC8]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 hover:text-[#8B5A2B] text-[#795548] cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-[#3E2723] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 hover:text-[#8B5A2B] text-[#795548] cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-[#795548] hover:text-[#C62828] cursor-pointer transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Delivery Zone & Contact Details (Only when items exist) */}
            {items.length > 0 && (
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4 pt-3 border-t border-[#D7CCC8]">
                
                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-xs font-bold text-[#5D4037] mb-1">
                      Delivery Destination & Zone
                    </label>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                    >
                      {DELIVERY_ZONES.filter((z) => z.id !== 'arcadia_pickup').map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} (+Kshs {zone.fee}) · ~{zone.time}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#5D4037] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wanjiku"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5D4037] mb-1">Phone (M-Pesa)</label>
                    <input
                      type="tel"
                      required
                      placeholder="07XX XXX XXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                    />
                  </div>
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <label className="block text-xs font-bold text-[#5D4037] mb-1">Specific Estate / House / Court</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acacia Court, Villa 14B"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#5D4037] mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                        paymentMethod === 'mpesa'
                          ? 'bg-[#2E7D32]/15 border-[#2E7D32] text-[#2E7D32] font-bold'
                          : 'bg-white border-[#D7CCC8] text-[#5D4037]'
                      }`}
                    >
                      <span>Lipa na M-Pesa</span>
                      <span className="block text-[10px] text-[#795548] font-normal">Till: 8945201</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-[#8B5A2B]/15 border-[#8B5A2B] text-[#8B5A2B] font-bold'
                          : 'bg-white border-[#D7CCC8] text-[#5D4037]'
                      }`}
                    >
                      <span>Cash on Delivery</span>
                      <span className="block text-[10px] text-[#795548] font-normal">Pay Rider / Counter</span>
                    </button>
                  </div>
                </div>

              </form>
            )}

          </div>
        )}

        {/* BODY TAB 2: REAL-TIME CLIENT ORDER TRACKING (100% Synced with Staff KDS & Dispatch) */}
        {activeTab === 'tracking' && activeClientOrder && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {/* Real Status Badge Banner */}
            <div className="text-center space-y-2 bg-white p-5 rounded-2xl border border-[#D7CCC8] shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#8B5A2B]/15 text-[#8B5A2B] flex items-center justify-center mx-auto border border-[#8B5A2B]/40">
                {activeClientOrder.status === 'en_route' ? (
                  <Bike className="w-6 h-6 animate-bounce" />
                ) : activeClientOrder.status === 'preparing' ? (
                  <Flame className="w-6 h-6 animate-pulse" />
                ) : activeClientOrder.status === 'ready' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#2E7D32]" />
                ) : (
                  <ChefHat className="w-6 h-6" />
                )}
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B5A2B]">
                  LIVE HEARTH STATUS // ARCADIA MALL
                </span>
                <h4 className="text-xl font-bold font-serif text-[#3E2723] mt-0.5">
                  {activeClientOrder.status === 'received' && '1. Ticket Received in Kitchen'}
                  {activeClientOrder.status === 'preparing' && '2. Fired Up & Simmering on Hearth'}
                  {activeClientOrder.status === 'ready' && '3. Cooked & Plated at Pass'}
                  {activeClientOrder.status === 'en_route' && '4. Dispatched with Rider!'}
                  {activeClientOrder.status === 'completed' && '5. Delivered & Completed'}
                </h4>
                <p className="text-xs text-[#5D4037] font-mono mt-1">
                  Order Code: <strong className="text-[#8B5A2B]">{activeClientOrder.orderCode}</strong> · {activeClientOrder.customerName}
                </p>
              </div>
            </div>

            {/* REAL-TIME KITCHEN SYNCHRONIZATION NOTICE */}
            <div className="p-3 bg-[#EBE4DD] rounded-xl border border-[#D7CCC8] text-xs text-[#5D4037] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#3E2723]">
                <Clock className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>Synchronized with Kitchen Lead Console:</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                {activeClientOrder.status === 'received' && (
                  'Your order has been queued at the Arcadia Mall kitchen. When staff presses "Fire Stew & Grill", this screen will instantly reflect the woodfire simmering process.'
                )}
                {activeClientOrder.status === 'preparing' && (
                  'The chef has actively fired up the acacia firewood station. Your clay pot stews and mbuzi choma cuts are currently sizzling over 280°C embers.'
                )}
                {activeClientOrder.status === 'ready' && (
                  'Food has finished cooking, garnished with fresh kachumbari, and packaged into thermal containers at the dispatch desk.'
                )}
                {activeClientOrder.status === 'en_route' && (
                  `Boda rider ${activeClientOrder.assignedRiderName || 'Boda'} has picked up your meal box from Arcadia Mall and is en route to ${activeClientOrder.deliveryAddress}!`
                )}
                {activeClientOrder.status === 'completed' && (
                  'Meal has been successfully delivered and handed over. Karibu sana & enjoy your authentic Kenyan comfort food!'
                )}
              </p>
            </div>

            {/* Stepper Display */}
            <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] space-y-4 shadow-xs">
              <h5 className="text-xs font-bold text-[#3E2723] uppercase font-mono border-b border-[#D7CCC8] pb-2">
                Order Lifecycle Steps
              </h5>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${currentStep >= 1 ? 'bg-[#2E7D32]' : 'bg-[#D7CCC8]'}`} />
                  <div>
                    <strong className={currentStep === 1 ? 'text-[#8B5A2B]' : 'text-[#3E2723]'}>
                      1. Order Logged & Till Verified
                    </strong>
                    <span className="block text-[11px] text-[#795548]">
                      {activeClientOrder.paymentMethod === 'mpesa' ? `Lipa na M-Pesa (${activeClientOrder.mpesaReceipt || 'Verified'})` : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${currentStep >= 2 ? 'bg-[#2E7D32]' : 'bg-[#D7CCC8]'}`} />
                  <div>
                    <strong className={currentStep === 2 ? 'text-[#8B5A2B]' : 'text-[#3E2723]'}>
                      2. Fired on Woodfire & Clay Pot
                    </strong>
                    <span className="block text-[11px] text-[#795548]">
                      Triggered by staff: "Fire Stew & Grill"
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${currentStep >= 3 ? 'bg-[#2E7D32]' : 'bg-[#D7CCC8]'}`} />
                  <div>
                    <strong className={currentStep === 3 ? 'text-[#8B5A2B]' : 'text-[#3E2723]'}>
                      3. Plated & Checked at Arcadia Pass
                    </strong>
                    <span className="block text-[11px] text-[#795548]">
                      Quality inspected by Head Chef James Omondi
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${currentStep >= 4 ? 'bg-[#2E7D32]' : 'bg-[#D7CCC8]'}`} />
                  <div>
                    <strong className={currentStep === 4 ? 'text-[#8B5A2B]' : 'text-[#3E2723]'}>
                      4. Dispatched to Destination
                    </strong>
                    {activeClientOrder.assignedRiderName ? (
                      <span className="block text-[11px] text-[#2E7D32] font-semibold">
                        Assigned to {activeClientOrder.assignedRiderName} ({activeClientOrder.assignedRiderBike})
                      </span>
                    ) : (
                      <span className="block text-[11px] text-[#795548]">
                        Awaiting rider call confirmation
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`w-3.5 h-3.5 rounded-full mt-0.5 shrink-0 ${currentStep >= 5 ? 'bg-[#2E7D32]' : 'bg-[#D7CCC8]'}`} />
                  <div>
                    <strong className={currentStep === 5 ? 'text-[#8B5A2B]' : 'text-[#3E2723]'}>
                      5. Completed & Enjoyed
                    </strong>
                    <span className="block text-[11px] text-[#795548]">
                      Earned {Math.floor(activeClientOrder.total / 50)} Klabu ya Chungu loyalty points
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rider Calling Card (if dispatched) */}
            {activeClientOrder.assignedRiderName && (
              <div className="p-4 bg-white rounded-2xl border border-[#2E7D32]/40 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-[#2E7D32]" />
                    <span>Your Dedicated Courier</span>
                  </span>
                  <span className="text-[10px] bg-[#2E7D32]/15 text-[#2E7D32] px-2 py-0.5 rounded font-bold">
                    Dispatched
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h6 className="font-bold text-sm text-[#3E2723]">{activeClientOrder.assignedRiderName}</h6>
                    <p className="text-xs text-[#795548] font-mono">{activeClientOrder.assignedRiderBike}</p>
                  </div>

                  {activeClientOrder.assignedRiderPhone && (
                    <a
                      href={`tel:${activeClientOrder.assignedRiderPhone}`}
                      className="px-3 py-1.5 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Rider</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Order Items Summary */}
            <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] space-y-2 text-xs shadow-xs">
              <span className="font-bold text-[#3E2723] block border-b border-[#D7CCC8] pb-1.5 uppercase font-mono">
                Order Items ({activeClientOrder.items.length})
              </span>
              <div className="space-y-1.5 divide-y divide-[#D7CCC8]/40">
                {activeClientOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between pt-1.5">
                    <div>
                      <span className="font-bold text-[#3E2723]">{item.quantity}× {item.name}</span>
                      {item.customization && (
                        <span className="text-[10px] text-[#8B5A2B] block italic">{item.customization}</span>
                      )}
                    </div>
                    <span className="font-mono text-[#5D4037]">Kshs {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#D7CCC8] flex justify-between font-bold text-sm text-[#3E2723]">
                <span>Total Paid:</span>
                <span className="text-[#8B5A2B] font-mono">Kshs {activeClientOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {activeClientOrder.status === 'completed' && (
              <div className="p-4 bg-[#2E7D32]/10 border-2 border-[#2E7D32] rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#2E7D32]">
                  Order #{activeClientOrder.orderCode} Delivered!
                </h4>
                <p className="text-xs text-[#5D4037]">
                  Your dishes have been handed over. The meal bag has been synchronized and cleared for your next feast.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    clearActiveClientOrder();
                    onClearCart();
                    setActiveTab('cart');
                  }}
                  className="w-full py-2.5 px-4 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start New Order & Clear Bag</span>
                </button>
              </div>
            )}

            <button
              onClick={() => {
                if (activeClientOrder.status === 'completed') {
                  clearActiveClientOrder();
                  onClearCart();
                }
                setActiveTab('cart');
              }}
              className="w-full py-3 bg-white hover:bg-[#D7CCC8]/50 text-[#3E2723] font-bold rounded-xl text-xs border border-[#D7CCC8] transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {activeClientOrder.status === 'completed' ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span>Start a Fresh Meal Bag</span>
                </>
              ) : (
                <span>Order Additional Items</span>
              )}
            </button>

          </div>
        )}

        {/* Cart Checkout Footer (Only when in Cart Tab and items exist) */}
        {activeTab === 'cart' && items.length > 0 && (
          <div className="p-5 border-t border-[#D7CCC8] bg-[#EBE4DD] space-y-3">
            <div className="space-y-1.5 text-xs text-[#5D4037]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-[#3E2723]">Kshs {itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment Fee:</span>
                <span className="font-mono text-[#2E7D32] font-bold">
                  {deliveryFee === 0 ? 'FREE (Pickup)' : `Kshs ${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#3E2723] pt-1 border-t border-[#D7CCC8]">
                <span>Total Amount:</span>
                <span className="font-mono text-base text-[#8B5A2B]">Kshs {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Transmitting Ticket to Kitchen...</span>
              ) : (
                <>
                  <span>Confirm & Send to Kitchen</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
