import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Phone, 
  Utensils, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  ChefHat, 
  Bike, 
  Receipt, 
  ShieldCheck, 
  ArrowLeft,
  Calendar,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Printer,
  MessageSquare,
  Check,
  ChevronRight,
  Info,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  AlertTriangle,
  Radio,
  MapPin,
  Flame,
  UserCheck,
  Send,
  Trash2,
  Copy
} from 'lucide-react';
import { 
  useRestaurant, 
  Reservation, 
  OrderRecord, 
  DiningZone, 
  DeliveryRider, 
  OrderStatus 
} from '../context/RestaurantContext';
import confetti from 'canvas-confetti';

interface Props {
  onBackToSite: () => void;
  onSwitchToAdmin: () => void;
}

export const StaffPortal: React.FC<Props> = ({ onBackToSite, onSwitchToAdmin }) => {
  const {
    currentUser,
    reservations,
    updateReservationStatus,
    addReservation,
    orders,
    updateOrderStatus,
    assignRiderToOrder,
    confirmDeliveryByRider,
    generateRiderNotification,
    riders,
    addRider,
    updateRiderStatus,
    deleteRider,
    todaySalesTotal,
    todayOrdersCount,
    todayReservationsCount,
  } = useRestaurant();

  // Tab State: reservations, all_orders, kitchen (KDS), riders, sales
  const [activeTab, setActiveTab] = useState<'reservations' | 'all_orders' | 'kitchen' | 'riders' | 'sales'>('all_orders');
  
  // Filters and Search
  const [resFilter, setResFilter] = useState<'all' | 'confirmed' | 'seated' | 'completed'>('all');
  const [orderFilter, setOrderFilter] = useState<'all' | 'dine_in' | 'delivery' | 'pickup' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dedicated Detail Views Navigation
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedTableChoice, setSelectedTableChoice] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Modals
  const [isAddResModalOpen, setIsAddResModalOpen] = useState(false);
  const [isAddRiderModalOpen, setIsAddRiderModalOpen] = useState(false);
  const [showPrintChit, setShowPrintChit] = useState(false);
  const [showPrintOrderSlip, setShowPrintOrderSlip] = useState(false);

  // Automated Dispatch Call Simulator Modal State
  const [callModal, setCallModal] = useState<{
    isOpen: boolean;
    orderId: string | null;
    targetRider: DeliveryRider | null;
    standbyRider: DeliveryRider | null;
    stage: 'dialing' | 'connected' | 'missed' | 'escalating' | 'escalated_connected';
    timer: number;
    log: string[];
  }>({
    isOpen: false,
    orderId: null,
    targetRider: null,
    standbyRider: null,
    stage: 'dialing',
    timer: 0,
    log: [],
  });

  // Walk-in Reservation Form State
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinGuests, setWalkinGuests] = useState(2);
  const [walkinZone, setWalkinZone] = useState<DiningZone>('terrace');
  const [walkinTime, setWalkinTime] = useState('14:00');
  const [walkinTable, setWalkinTable] = useState('T-01');

  // New Rider Form State
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderBike, setNewRiderBike] = useState('');
  const [newRiderBase, setNewRiderBase] = useState('Arcadia Mall Stage');
  const [newRiderNationalId, setNewRiderNationalId] = useState('');
  const [newRiderEmergency, setNewRiderEmergency] = useState('');

  // Filtered lists
  const filteredReservations = reservations.filter((r) => {
    const matchesFilter = resFilter === 'all' || r.status === resFilter;
    const matchesQuery = 
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const filteredOrders = orders.filter((o) => {
    let matchesFilter = true;
    if (orderFilter === 'dine_in') matchesFilter = o.orderType === 'dine_in';
    else if (orderFilter === 'delivery') matchesFilter = o.orderType === 'delivery';
    else if (orderFilter === 'pickup') matchesFilter = o.orderType === 'pickup';
    else if (orderFilter === 'active') matchesFilter = o.status !== 'completed' && o.status !== 'cancelled';
    else if (orderFilter === 'completed') matchesFilter = o.status === 'completed';

    const matchesQuery = 
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery) ||
      o.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.deliveryAddress && o.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.tableNumber && o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesQuery;
  });

  const activeKitchenOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

  const selectedBooking = reservations.find((r) => r.id === selectedBookingId);
  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  // Call timer simulation effect
  useEffect(() => {
    let interval: any;
    if (callModal.isOpen && (callModal.stage === 'dialing' || callModal.stage === 'escalating')) {
      interval = setInterval(() => {
        setCallModal((prev) => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callModal.isOpen, callModal.stage]);

  // Handlers for Bookings
  const handleOpenBookingDetails = (id: string) => {
    const booking = reservations.find((r) => r.id === id);
    if (booking) {
      setSelectedBookingId(id);
      setSelectedOrderId(null);
      setSelectedTableChoice(booking.tableAssigned || 'T-01');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSeatGuest = (id: string, table?: string) => {
    updateReservationStatus(id, 'seated', table || 'T-01');
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 }, colors: ['#8B5A2B', '#3E2723'] });
  };

  const handleCompleteReservation = (id: string) => {
    updateReservationStatus(id, 'completed');
  };

  const handleCancelReservation = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateReservationStatus(id, 'cancelled');
    }
  };

  const handleReassignTable = (id: string, newTable: string) => {
    updateReservationStatus(id, selectedBooking?.status || 'confirmed', newTable);
    setSelectedTableChoice(newTable);
    confetti({ particleCount: 20, spread: 40, colors: ['#8B5A2B'] });
  };

  const handleCreateWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone) return;

    const newRes = addReservation({
      guestName: walkinName,
      phone: walkinPhone,
      date: new Date().toISOString().split('T')[0],
      time: walkinTime,
      guests: walkinGuests,
      zone: walkinZone,
      tableAssigned: walkinTable,
      specialRequests: 'Walk-in seated by floor staff',
      isVIP: false,
    });

    setIsAddResModalOpen(false);
    setWalkinName('');
    setWalkinPhone('');
    confetti({ particleCount: 40, spread: 60, colors: ['#8B5A2B', '#3E2723'] });
    setSelectedBookingId(newRes.id);
  };

  // Handlers for Orders
  const handleOpenOrderDetails = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      setSelectedOrderId(id);
      setSelectedBookingId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Automated Dispatch Call Workflow Trigger
  const handleInitiateRiderDispatch = (orderId: string, preselectedRiderId?: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const availableRiders = riders.filter((r) => r.status === 'available');
    const primary = preselectedRiderId 
      ? riders.find((r) => r.id === preselectedRiderId) || availableRiders[0] || riders[0]
      : availableRiders[0] || riders[0];

    const standby = riders.find((r) => r.id !== primary?.id && r.status === 'available') || riders.find((r) => r.id !== primary?.id) || riders[1];

    setCallModal({
      isOpen: true,
      orderId,
      targetRider: primary,
      standbyRider: standby,
      stage: 'dialing',
      timer: 1,
      log: [
        `[${new Date().toLocaleTimeString()}] Dispatch call initiated to ${primary.name} (${primary.phone})...`,
        `[${new Date().toLocaleTimeString()}] Ringing Boda terminal KMDF / Athi corridor...`,
      ],
    });
  };

  const handleRiderAcceptsCall = () => {
    if (!callModal.orderId || !callModal.targetRider) return;

    assignRiderToOrder(callModal.orderId, callModal.targetRider.id, 'confirmed');

    setCallModal((prev) => ({
      ...prev,
      stage: 'connected',
      log: [
        ...prev.log,
        `[${new Date().toLocaleTimeString()}] Call answered by ${prev.targetRider?.name}!`,
        `[${new Date().toLocaleTimeString()}] Rider voice confirmed: "Niko hapa Arcadia Gate, nachukua order mara moja!"`,
        `[${new Date().toLocaleTimeString()}] Order marked EN ROUTE and assigned to ${prev.targetRider?.name}.`,
      ],
    }));

    confetti({ particleCount: 40, spread: 60, colors: ['#2E7D32', '#8B5A2B'] });
  };

  const handleRiderMissesCallFailover = () => {
    if (!callModal.orderId || !callModal.standbyRider) return;

    const missedName = callModal.targetRider?.name || 'Primary Rider';
    const standby = callModal.standbyRider;

    setCallModal((prev) => ({
      ...prev,
      stage: 'escalating',
      timer: 1,
      log: [
        ...prev.log,
        `[${new Date().toLocaleTimeString()}] ALERT: Call to ${missedName} NOT PICKED (No Answer / Busy)!`,
        `[${new Date().toLocaleTimeString()}] SYSTEM FAILOVER: Escalating automated dispatch call to standby rider: ${standby.name} (${standby.phone})...`,
        `[${new Date().toLocaleTimeString()}] Ringing standby rider ${standby.name}...`,
      ],
    }));

    // Standby rider automatically connects after 2 seconds
    setTimeout(() => {
      assignRiderToOrder(callModal.orderId!, standby.id, 'escalated');
      setCallModal((prev) => ({
        ...prev,
        stage: 'escalated_connected',
        targetRider: standby,
        log: [
          ...prev.log,
          `[${new Date().toLocaleTimeString()}] Standby rider ${standby.name} picked up & confirmed pickup!`,
          `[${new Date().toLocaleTimeString()}] Order successfully reassigned and dispatched with ${standby.name} (${standby.bikeReg})!`,
        ],
      }));
      confetti({ particleCount: 40, spread: 60, colors: ['#8B5A2B', '#3E2723'] });
    }, 2200);
  };

  const handleCreateRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiderName || !newRiderPhone || !newRiderBike) return;

    addRider({
      name: newRiderName,
      phone: newRiderPhone,
      bikeReg: newRiderBike,
      status: 'available',
      baseLocation: newRiderBase,
      nationalId: newRiderNationalId,
      emergencyContact: newRiderEmergency,
    });

    setIsAddRiderModalOpen(false);
    setNewRiderName('');
    setNewRiderPhone('');
    setNewRiderBike('');
    setNewRiderNationalId('');
    setNewRiderEmergency('');
    confetti({ particleCount: 30, spread: 50, colors: ['#8B5A2B'] });
  };

  const handleDirectAssignRider = () => {
    if (!callModal.orderId || !callModal.targetRider) return;
    assignRiderToOrder(callModal.orderId, callModal.targetRider.id, 'confirmed');
    setCallModal((prev) => ({
      ...prev,
      stage: 'connected',
      log: [
        ...prev.log,
        `[${new Date().toLocaleTimeString()}] Direct dispatch confirmed for ${prev.targetRider?.name} (${prev.targetRider?.bikeReg}).`,
        `[${new Date().toLocaleTimeString()}] Status updated to EN ROUTE. Handover confirmed.`,
      ],
    }));
    confetti({ particleCount: 35, spread: 50, colors: ['#2E7D32', '#8B5A2B'] });
  };

  const renderAutomatedDispatchModal = () => {
    if (!callModal.isOpen) return null;
    const whatsappNotice = callModal.targetRider && callModal.orderId
      ? generateRiderNotification(callModal.targetRider.id, callModal.orderId, 'whatsapp')
      : null;
    const smsNotice = callModal.targetRider && callModal.orderId
      ? generateRiderNotification(callModal.targetRider.id, callModal.orderId, 'sms')
      : null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in">
        <div className="w-full max-w-lg bg-[#F5F2EB] border-2 border-[#8B5A2B] rounded-3xl p-6 shadow-2xl text-[#3E2723] space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#D7CCC8]">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#8B5A2B] animate-pulse" />
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                Automated Boda Dispatch Calling Center
              </h3>
            </div>
            <button
              onClick={() => setCallModal((prev) => ({ ...prev, isOpen: false }))}
              className="text-[#795548] hover:text-[#3E2723] cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Select Rider to Call / Dispatch */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#D7CCC8] space-y-1.5">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#795548] flex items-center justify-between">
              <span>Select Rider to Dispatch</span>
              <span className="text-[#8B5A2B]">Fleet Size: {riders.length} Riders</span>
            </label>
            <select
              value={callModal.targetRider?.id || ''}
              onChange={(e) => {
                const r = riders.find((x) => x.id === e.target.value);
                if (r) {
                  const standby = riders.find((x) => x.id !== r.id && x.status === 'available') || riders.find((x) => x.id !== r.id);
                  setCallModal((prev) => ({
                    ...prev,
                    targetRider: r,
                    standbyRider: standby || null,
                    timer: 1,
                    log: [
                      ...prev.log,
                      `[${new Date().toLocaleTimeString()}] Switched dispatch call to ${r.name} (${r.phone})...`,
                    ],
                  }));
                }
              }}
              className="w-full p-2 bg-[#F5F2EB] border border-[#D7CCC8] rounded-xl text-xs font-semibold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
            >
              {riders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.bikeReg}) — {r.status.toUpperCase()} ({r.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Call Radar Animation & Rider Info */}
          <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] text-center space-y-2.5 relative overflow-hidden shadow-xs">
            
            {/* Pulsing indicator */}
            <div className="relative mx-auto w-14 h-14 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                callModal.stage === 'dialing' ? 'bg-[#8B5A2B]' :
                callModal.stage === 'escalating' ? 'bg-[#C62828]' : 'bg-[#2E7D32]'
              }`} />
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md ${
                callModal.stage === 'dialing' ? 'bg-[#8B5A2B]' :
                callModal.stage === 'escalating' ? 'bg-[#C62828]' : 'bg-[#2E7D32]'
              }`}>
                {callModal.stage === 'dialing' && <PhoneCall className="w-5 h-5 animate-pulse" />}
                {callModal.stage === 'escalating' && <PhoneForwarded className="w-5 h-5 animate-bounce" />}
                {(callModal.stage === 'connected' || callModal.stage === 'escalated_connected') && (
                  <CheckCircle2 className="w-5 h-5" />
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B5A2B] block">
                {callModal.stage === 'dialing' && `DIALING PRIMARY RIDER · 00:${callModal.timer < 10 ? '0' : ''}${callModal.timer}`}
                {callModal.stage === 'connected' && 'CALL CONNECTED · RIDER CONFIRMED'}
                {callModal.stage === 'escalating' && 'FAILOVER ALERT · DIALING STANDBY RIDER...'}
                {callModal.stage === 'escalated_connected' && 'STANDBY RIDER CONNECTED & DISPATCHED'}
              </span>
              <h4 className="text-lg font-bold font-serif text-[#3E2723] mt-0.5">
                {callModal.targetRider?.name}
              </h4>
              <p className="text-xs font-mono text-[#5D4037]">
                {callModal.targetRider?.phone} · {callModal.targetRider?.bikeReg}
              </p>
              <p className="text-[11px] text-[#795548]">
                Base: {callModal.targetRider?.baseLocation}
              </p>
            </div>

            {/* Failover Alert Banner */}
            {callModal.stage === 'escalating' && (
              <div className="p-3 bg-[#FFEBEE] border border-[#EF9A9A] rounded-xl text-xs text-[#C62828] font-semibold text-left flex items-start gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>FAILOVER TRIGGERED:</strong> Primary rider did not pick up. Calling next standby rider automatically...
                </div>
              </div>
            )}
          </div>

          {/* Quick Notification Links: WhatsApp & SMS */}
          {whatsappNotice && smsNotice && (
            <div className="bg-white p-3 rounded-2xl border border-[#D7CCC8] space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#795548] block">
                Dispatch Notification to Rider ({callModal.targetRider?.name})
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={whatsappNotice.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>Send WhatsApp Notice</span>
                </a>

                <a
                  href={smsNotice.url}
                  className="flex-1 py-2 px-3 bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span>Send SMS Notice</span>
                </a>
              </div>
            </div>
          )}

          {/* Real-time Call Activity Log */}
          <div className="bg-[#EBE4DD] p-2.5 rounded-2xl border border-[#D7CCC8] text-[11px] font-mono text-[#5D4037] space-y-1 max-h-24 overflow-y-auto">
            {callModal.log.map((line, idx) => (
              <p key={idx} className={line.includes('ALERT') ? 'text-[#C62828] font-bold' : line.includes('answered') || line.includes('confirmed') ? 'text-[#2E7D32] font-bold' : ''}>
                {line}
              </p>
            ))}
          </div>

          {/* Interactive Simulation Controls */}
          {callModal.stage === 'dialing' && (
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleRiderAcceptsCall}
                  className="py-2.5 px-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Rider Answers & Accepts</span>
                </button>

                <button
                  type="button"
                  onClick={handleRiderMissesCallFailover}
                  className="py-2.5 px-3 bg-[#C62828] hover:bg-[#B71C1C] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Miss Call (Failover)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDirectAssignRider}
                className="w-full py-2 bg-[#8B5A2B]/15 hover:bg-[#8B5A2B]/25 text-[#8B5A2B] border border-[#8B5A2B]/40 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Instant Assign & Dispatch (Skip Audio Simulation)
              </button>
            </div>
          )}

          {(callModal.stage === 'connected' || callModal.stage === 'escalated_connected') && (
            <button
              type="button"
              onClick={() => setCallModal((prev) => ({ ...prev, isOpen: false }))}
              className="w-full py-2.5 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-xs cursor-pointer shadow-md"
            >
              Done · Return to Orders
            </button>
          )}

        </div>
      </div>
    );
  };

  const renderAddRiderModal = () => {
    if (!isAddRiderModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
        <div className="w-full max-w-md bg-[#F5F2EB] border border-[#D7CCC8] rounded-3xl p-6 shadow-2xl text-[#3E2723] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D7CCC8]">
            <div className="flex items-center gap-2">
              <Bike className="w-5 h-5 text-[#8B5A2B]" />
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                Register New Boda Rider
              </h3>
            </div>
            <button
              onClick={() => setIsAddRiderModalOpen(false)}
              className="text-[#795548] hover:text-[#3E2723] cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateRider} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#5D4037] mb-1 font-semibold">Rider Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dennis Mutua"
                value={newRiderName}
                onChange={(e) => setNewRiderName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#5D4037] mb-1 font-semibold">Phone (Direct Calls / WhatsApp)</label>
                <input
                  type="tel"
                  required
                  placeholder="07XX XXX XXX"
                  value={newRiderPhone}
                  onChange={(e) => setNewRiderPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block text-[#5D4037] mb-1 font-semibold">Motorbike Reg No.</label>
                <input
                  type="text"
                  required
                  placeholder="KMDF 123Z (Boxer 150)"
                  value={newRiderBike}
                  onChange={(e) => setNewRiderBike(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#5D4037] mb-1 font-semibold">National ID / Driving License</label>
                <input
                  type="text"
                  placeholder="e.g. 33891024"
                  value={newRiderNationalId}
                  onChange={(e) => setNewRiderNationalId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block text-[#5D4037] mb-1 font-semibold">Base Location / Stage</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arcadia Mall Stage"
                  value={newRiderBase}
                  onChange={(e) => setNewRiderBase(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#5D4037] mb-1 font-semibold">Emergency Contact Phone</label>
              <input
                type="tel"
                placeholder="07XX XXX XXX"
                value={newRiderEmergency}
                onChange={(e) => setNewRiderEmergency(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-xs transition-all mt-4 cursor-pointer shadow-md"
            >
              Register Rider to Fleet
            </button>
          </form>
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW A: DEDICATED FULL-PAGE ORDER DETAIL DOSSIER
  // =========================================================================
  if (selectedOrder) {
    const isDineIn = selectedOrder.orderType === 'dine_in';
    const isDelivery = selectedOrder.orderType === 'delivery';
    const isPickup = selectedOrder.orderType === 'pickup';

    return (
      <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] pb-16 selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#D7CCC8] px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={() => setSelectedOrderId(null)}
              className="px-3.5 py-2 rounded-xl bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5A2B]" />
              <span>Back to All Orders</span>
            </button>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#795548]">Order Dossier:</span>
              <strong className="text-[#8B5A2B] bg-white px-2 py-0.5 rounded border border-[#D7CCC8]">
                {selectedOrder.orderCode}
              </strong>
            </div>

            <button
              onClick={() => setShowPrintOrderSlip(true)}
              className="px-3 py-2 bg-white hover:bg-[#D7CCC8]/50 text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span className="hidden sm:inline">Print Kitchen Slip</span>
            </button>
          </div>
        </header>

        {/* Order Detail Body */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          
          {/* Status & Fulfillment Banner */}
          <div className="bg-[#D7CCC8]/40 border border-[#D7CCC8] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#3E2723]">
                  {selectedOrder.customerName}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isDineIn ? 'bg-[#3E2723] text-[#F5F2EB]' : isDelivery ? 'bg-[#8B5A2B] text-[#F5F2EB]' : 'bg-[#D7CCC8] text-[#3E2723]'
                }`}>
                  {isDineIn ? `Table ${selectedOrder.tableNumber || 'Dine-In'}` : isDelivery ? 'Doorstep Delivery' : 'Counter Pickup'}
                </span>
              </div>
              <p className="text-xs text-[#5D4037]">
                Order Reference <strong className="font-mono text-[#8B5A2B]">{selectedOrder.orderCode}</strong> · Placed at {selectedOrder.createdAt}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${
                  selectedOrder.status === 'received'
                    ? 'bg-[#C62828]/15 text-[#C62828] border-[#C62828]/40'
                    : selectedOrder.status === 'preparing'
                    ? 'bg-[#8B5A2B]/15 text-[#8B5A2B] border-[#8B5A2B]/40 animate-pulse'
                    : selectedOrder.status === 'ready'
                    ? 'bg-[#2E7D32]/15 text-[#2E7D32] border-[#2E7D32]/40'
                    : selectedOrder.status === 'en_route'
                    ? 'bg-[#1565C0]/15 text-[#1565C0] border-[#1565C0]/40'
                    : 'bg-[#5D4037]/15 text-[#5D4037] border-[#5D4037]/40'
                }`}
              >
                ● Status: {selectedOrder.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* 2-Column Layout: Order Details & Breakdown (Left) + Floor & Dispatch Actions (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Full Order Breakdown (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Items Card */}
              <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3E2723] flex items-center justify-between border-b border-[#D7CCC8] pb-3">
                  <span className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#8B5A2B]" />
                    <span>Dishes & Culinary Preparations ({selectedOrder.items.length})</span>
                  </span>
                  <span className="font-mono text-xs text-[#795548]">Kshs {selectedOrder.subtotal}</span>
                </h3>

                <div className="space-y-3 divide-y divide-[#D7CCC8]/60">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-2.5 flex items-start justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#8B5A2B] bg-white px-2 py-0.5 rounded border border-[#D7CCC8]">
                            {item.quantity}×
                          </span>
                          <span className="font-bold text-sm text-[#3E2723]">{item.name}</span>
                        </div>
                        {item.customization && (
                          <p className="text-[11px] text-[#8B5A2B] italic pl-8 font-medium">
                            Notes: {item.customization}
                          </p>
                        )}
                      </div>

                      <div className="text-right font-mono">
                        <span className="font-bold text-sm text-[#3E2723]">
                          Kshs {(item.price * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#795548] block">
                          ({item.quantity} @ {item.price})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Delivery Fee Breakdown */}
                <div className="pt-4 border-t border-[#D7CCC8] space-y-1.5 text-xs text-[#5D4037]">
                  <div className="flex justify-between">
                    <span>Kitchen Subtotal:</span>
                    <span className="font-mono font-bold text-[#3E2723]">Kshs {selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fulfillment / Boda Delivery Fee:</span>
                    <span className="font-mono font-bold text-[#2E7D32]">
                      {selectedOrder.deliveryFee === 0 ? 'FREE / Dine-In' : `Kshs ${selectedOrder.deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#3E2723] pt-2 border-t border-[#D7CCC8]">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base text-[#8B5A2B]">
                      Kshs {selectedOrder.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details & Receipt Verification */}
              <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3E2723] flex items-center gap-2 border-b border-[#D7CCC8] pb-3">
                  <Receipt className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Payment Method & Reconciliation</span>
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Payment Mode</span>
                    <strong className="text-sm font-bold text-[#3E2723] mt-0.5 block">
                      {selectedOrder.paymentMethod === 'mpesa' ? 'Lipa na M-Pesa' : 'Cash on Delivery / Counter'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Transaction Reference</span>
                    <strong className="text-sm font-mono font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded border border-[#D7CCC8] inline-block mt-0.5">
                      {selectedOrder.mpesaReceipt || 'Cash Till Receipt'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Payment Status</span>
                    <span className="text-xs font-bold text-[#2E7D32] bg-[#2E7D32]/15 px-2 py-0.5 rounded inline-block mt-0.5">
                      ✓ Verified at Arcadia Mall Till
                    </span>
                  </div>

                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Loyalty Points Earned</span>
                    <strong className="text-xs font-mono font-bold text-[#8B5A2B] mt-0.5 block">
                      +{Math.floor(selectedOrder.total / 50)} Klabu Points
                    </strong>
                  </div>
                </div>
              </div>

              {/* Customer Contact Card */}
              <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3E2723] flex items-center gap-2 border-b border-[#D7CCC8] pb-3">
                  <Phone className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Customer Contact & Delivery Address</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <strong className="text-base font-bold text-[#3E2723] block">{selectedOrder.customerName}</strong>
                    <span className="text-sm font-mono text-[#5D4037]">{selectedOrder.customerPhone}</span>
                    {selectedOrder.deliveryAddress && (
                      <p className="text-xs text-[#795548] mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#8B5A2B]" />
                        <span>{selectedOrder.deliveryAddress}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedOrder.customerPhone}`}
                      className="px-3 py-2 bg-white hover:bg-[#D7CCC8]/60 text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8B5A2B]" />
                      <span>Call Diner</span>
                    </a>

                    <a
                      href={`https://wa.me/254${selectedOrder.customerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                        `Jambo ${selectedOrder.customerName}! Your order ${selectedOrder.orderCode} at Roots & Pots, Arcadia Mall is currently ${selectedOrder.status.replace('_', ' ')}. Karibu sana!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Floor & Dispatch Stepper (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Interactive KDS Stepper Action Panel */}
              <div className="bg-[#D7CCC8]/50 border border-[#D7CCC8] rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3E2723] flex items-center gap-2 border-b border-[#D7CCC8] pb-3">
                  <Flame className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Real-Time Kitchen Actions</span>
                </h3>

                <p className="text-xs text-[#5D4037] leading-relaxed">
                  Actions taken here update the client's screen in real-time. Clients will only see that food is simmering when you click "Fire Stew & Grill", and only see delivery once dispatched.
                </p>

                <div className="space-y-3">
                  {selectedOrder.status === 'received' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'preparing');
                        confetti({ particleCount: 30, spread: 50, colors: ['#8B5A2B'] });
                      }}
                      className="w-full py-3.5 px-4 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Fire Stew & Grill (Start Cooking)</span>
                    </button>
                  )}

                  {selectedOrder.status === 'preparing' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'ready');
                        confetti({ particleCount: 30, spread: 50, colors: ['#2E7D32'] });
                      }}
                      className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Ready at Pass</span>
                    </button>
                  )}

                  {selectedOrder.status === 'ready' && isDelivery && (
                    <button
                      onClick={() => handleInitiateRiderDispatch(selectedOrder.id)}
                      className="w-full py-3.5 px-4 bg-[#1565C0] hover:bg-[#0D47A1] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Assign Rider & Initiate Dispatch Call</span>
                    </button>
                  )}

                  {selectedOrder.status === 'ready' && !isDelivery && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'completed');
                        confetti({ particleCount: 40, spread: 60, colors: ['#8B5A2B', '#2E7D32'] });
                      }}
                      className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isDineIn ? `Serve Table ${selectedOrder.tableNumber}` : 'Handover to Customer'}</span>
                    </button>
                  )}

                  {selectedOrder.status === 'en_route' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'completed');
                        confetti({ particleCount: 40, spread: 60, colors: ['#2E7D32'] });
                      }}
                      className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm Delivered to Doorstep</span>
                    </button>
                  )}

                  {selectedOrder.status === 'completed' && (
                    <div className="p-3 bg-white rounded-xl text-center text-xs text-[#2E7D32] font-bold border border-[#2E7D32]/40">
                      ✓ Order Completed & Logged in Shift Sales
                    </div>
                  )}
                </div>

                {/* Assigned Rider Box (for Deliveries) */}
                {isDelivery && (
                  <div className="pt-4 border-t border-[#D7CCC8] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#3E2723] uppercase font-mono flex items-center gap-1.5">
                        <Bike className="w-4 h-4 text-[#8B5A2B]" />
                        <span>Delivery Rider Assigned</span>
                      </span>
                      {selectedOrder.assignedRiderName && (
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono uppercase ${
                          selectedOrder.riderTransitStage === 'delivered'
                            ? 'bg-[#2E7D32]/15 text-[#2E7D32]'
                            : selectedOrder.riderTransitStage === 'arrived_at_gate'
                            ? 'bg-[#6A1B9A]/15 text-[#6A1B9A]'
                            : selectedOrder.riderTransitStage === 'picked_up'
                            ? 'bg-[#1565C0]/15 text-[#1565C0]'
                            : 'bg-[#8B5A2B]/15 text-[#8B5A2B]'
                        }`}>
                          ● {selectedOrder.riderTransitStage ? selectedOrder.riderTransitStage.replace(/_/g, ' ') : 'Assigned'}
                        </span>
                      )}
                    </div>

                    {selectedOrder.assignedRiderName ? (
                      <div className="p-3.5 bg-white rounded-xl border border-[#D7CCC8] space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="text-sm font-bold text-[#3E2723] block">
                              {selectedOrder.assignedRiderName}
                            </strong>
                            <span className="text-xs text-[#795548] font-mono">
                              {selectedOrder.assignedRiderBike}
                            </span>
                          </div>
                          <span className="text-xs font-mono text-[#8B5A2B] font-bold">
                            {selectedOrder.assignedRiderPhone}
                          </span>
                        </div>

                        {/* WhatsApp & SMS dispatch notification buttons */}
                        {selectedOrder.assignedRiderId && (
                          <div className="flex items-center gap-2 pt-2 border-t border-[#D7CCC8]/60">
                            <a
                              href={generateRiderNotification(selectedOrder.assignedRiderId, selectedOrder.id, 'whatsapp').url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5 fill-white" />
                              <span>WhatsApp Notice</span>
                            </a>

                            <a
                              href={generateRiderNotification(selectedOrder.assignedRiderId, selectedOrder.id, 'sms').url}
                              className="flex-1 py-1.5 px-2.5 bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5 text-[#8B5A2B]" />
                              <span>SMS Notice</span>
                            </a>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleInitiateRiderDispatch(selectedOrder.id, selectedOrder.assignedRiderId)}
                            className="flex-1 py-1.5 bg-[#D7CCC8]/50 hover:bg-[#D7CCC8] text-[#3E2723] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          >
                            Reassign / Call Again
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-white/70 rounded-xl border border-[#D7CCC8] text-xs text-[#795548] flex items-center justify-between">
                        <span>No rider assigned yet.</span>
                        <button
                          onClick={() => handleInitiateRiderDispatch(selectedOrder.id)}
                          className="px-3.5 py-1.5 bg-[#1565C0] text-white rounded-xl font-bold text-xs hover:bg-[#0D47A1] cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Dispatch Rider</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Print Chit & Cancel Trigger */}
                <div className="pt-3 border-t border-[#D7CCC8] flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => setShowPrintOrderSlip(true)}
                    className="text-[#8B5A2B] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Kitchen Chit</span>
                  </button>

                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this order?')) {
                          updateOrderStatus(selectedOrder.id, 'cancelled');
                        }
                      }}
                      className="text-[#C62828] hover:underline font-semibold cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>

        </main>

        {/* PRINTABLE ORDER SLIP MODAL */}
        {showPrintOrderSlip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm bg-white border border-[#D7CCC8] rounded-2xl p-6 shadow-2xl text-[#3E2723] font-mono text-xs space-y-4">
              <div className="text-center border-b border-dashed border-[#D7CCC8] pb-3">
                <span className="font-serif text-base font-bold block text-[#3E2723]">
                  ROOTS & POTS
                </span>
                <span className="text-[10px] text-[#795548] uppercase tracking-wider block">
                  Arcadia Mall · Athi River
                </span>
                <span className="text-[11px] font-bold text-[#8B5A2B] mt-1 block">
                  KITCHEN ORDER SLIP // {selectedOrder.orderCode}
                </span>
              </div>

              <div className="space-y-1.5 border-b border-dashed border-[#D7CCC8] pb-3 text-[11px]">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <strong className="text-right">{selectedOrder.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <strong className="capitalize">{selectedOrder.orderType} {selectedOrder.tableNumber ? `(Table ${selectedOrder.tableNumber})` : ''}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Time Placed:</span>
                  <span>{selectedOrder.createdAt}</span>
                </div>
                {selectedOrder.deliveryAddress && (
                  <div className="flex justify-between">
                    <span>Address:</span>
                    <span className="text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="space-y-1.5 border-b border-dashed border-[#D7CCC8] pb-3 text-xs">
                {selectedOrder.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{i.quantity}x {i.name}</span>
                    <span>{i.price * i.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-1 border-t border-dashed border-[#D7CCC8]">
                  <span>Total Amount:</span>
                  <span>Kshs {selectedOrder.total}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-3 font-sans">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-[#8B5A2B] text-[#F5F2EB] font-bold rounded-xl text-xs hover:bg-[#70461F] transition-all cursor-pointer text-center"
                >
                  Print Chit
                </button>
                <button
                  onClick={() => setShowPrintOrderSlip(false)}
                  className="px-4 py-2 bg-[#D7CCC8]/60 text-[#3E2723] font-semibold rounded-xl text-xs hover:bg-[#D7CCC8] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Render Automated Dispatch Calling & Add Rider Modals inside Order Dossier */}
        {renderAutomatedDispatchModal()}
        {renderAddRiderModal()}

      </div>
    );
  }

  // =========================================================================
  // VIEW B: DEDICATED FULL-PAGE BOOKING DETAIL VIEW (Preserved from prior step)
  // =========================================================================
  if (selectedBooking) {
    const isSeated = selectedBooking.status === 'seated';
    const isCompleted = selectedBooking.status === 'completed';
    const isCancelled = selectedBooking.status === 'cancelled';

    return (
      <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] pb-16 selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#D7CCC8] px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={() => setSelectedBookingId(null)}
              className="px-3.5 py-2 rounded-xl bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5A2B]" />
              <span>Back to All Bookings</span>
            </button>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#795548]">Booking Dossier:</span>
              <strong className="text-[#8B5A2B] bg-white px-2 py-0.5 rounded border border-[#D7CCC8]">
                {selectedBooking.code}
              </strong>
            </div>

            <button
              onClick={() => setShowPrintChit(true)}
              className="px-3 py-2 bg-white hover:bg-[#D7CCC8]/50 text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span className="hidden sm:inline">Print Table Chit</span>
            </button>
          </div>
        </header>

        {/* Booking Detail Dossier Body */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          
          {/* Status Banner */}
          <div className="bg-[#D7CCC8]/40 border border-[#D7CCC8] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl sm:text-3xl font-bold font-serif text-[#3E2723]">
                  {selectedBooking.guestName}
                </span>
                {selectedBooking.isVIP && (
                  <span className="text-xs font-bold bg-[#8B5A2B] text-[#F5F2EB] px-2 py-0.5 rounded-full shadow-xs">
                    VIP DINER
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5D4037]">
                Reference <span className="font-mono font-bold text-[#8B5A2B]">{selectedBooking.code}</span> · Created on {selectedBooking.createdAt}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs ${
                  selectedBooking.status === 'seated'
                    ? 'bg-[#2E7D32]/15 text-[#2E7D32] border-[#2E7D32]/40'
                    : selectedBooking.status === 'confirmed'
                    ? 'bg-[#1565C0]/15 text-[#1565C0] border-[#1565C0]/40'
                    : selectedBooking.status === 'completed'
                    ? 'bg-[#5D4037]/15 text-[#5D4037] border-[#5D4037]/40'
                    : 'bg-[#C62828]/15 text-[#C62828] border-[#C62828]/40'
                }`}
              >
                ● Current Status: {selectedBooking.status}
              </span>
            </div>
          </div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 space-y-6">
              
              {/* Timing & Placement Card */}
              <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3E2723] flex items-center gap-2 border-b border-[#D7CCC8] pb-3">
                  <Calendar className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Reservation Schedule & Table Assignment</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Date</span>
                    <strong className="text-sm font-bold text-[#3E2723] font-mono mt-0.5 block">
                      {selectedBooking.date}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Arrival Time</span>
                    <strong className="text-sm font-bold text-[#3E2723] font-mono mt-0.5 block">
                      {selectedBooking.time}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Party Size</span>
                    <strong className="text-sm font-bold text-[#3E2723] mt-0.5 block">
                      {selectedBooking.guests} Guests
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Atmosphere Zone</span>
                    <strong className="text-sm font-bold text-[#3E2723] mt-0.5 block capitalize">
                      {selectedBooking.zone === 'terrace'
                        ? 'Garden Terrace Patio'
                        : selectedBooking.zone === 'hearth'
                        ? 'The Hearth Dining Hall'
                        : 'Private Kraal Suite'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Assigned Table</span>
                    <strong className="text-sm font-bold font-mono text-[#8B5A2B] bg-white px-2 py-1 rounded border border-[#D7CCC8] inline-block mt-0.5">
                      {selectedBooking.tableAssigned || 'T-01'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Duration Estimate</span>
                    <strong className="text-sm font-bold text-[#3E2723] mt-0.5 block">
                      ~90 Minutes
                    </strong>
                  </div>
                </div>
              </div>

              {/* Guest Profile & Direct WhatsApp Contact */}
              <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3E2723] flex items-center gap-2 border-b border-[#D7CCC8] pb-3">
                  <Phone className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Guest Contact & Communications</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[#795548] text-[11px] block font-mono uppercase">Direct Phone</span>
                    <span className="text-base font-bold text-[#3E2723] font-mono">
                      {selectedBooking.phone}
                    </span>
                    <span className="text-xs text-[#5D4037] block mt-0.5">
                      SMS & Call routing active via Safaricom Athi River
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${selectedBooking.phone}`}
                      className="px-3 py-2 bg-white hover:bg-[#D7CCC8]/60 text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#8B5A2B]" />
                      <span>Call Diner</span>
                    </a>

                    <a
                      href={`https://wa.me/254${selectedBooking.phone.replace(/^0/, '')}?text=${encodeURIComponent(
                        `Jambo ${selectedBooking.guestName}! Your table ${selectedBooking.tableAssigned || 'T-01'} at Roots & Pots, Arcadia Mall Greenpark is prepared and ready. Karibu sana!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span>WhatsApp Diner</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Culinary & Floor Notes */}
              <div className="bg-[#D7CCC8]/35 border border-[#D7CCC8] rounded-3xl p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3E2723] flex items-center gap-2 border-b border-[#D7CCC8] pb-3">
                  <Utensils className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Special Culinary & Dietary Requests</span>
                </h3>

                <div className="bg-white p-4 rounded-2xl border border-[#D7CCC8] text-xs text-[#3E2723] leading-relaxed">
                  <p className="italic">
                    “{selectedBooking.specialRequests || 'No dietary restrictions recorded. Standard Roots & Pots dining experience.'}”
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Actions */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-[#D7CCC8]/50 border border-[#D7CCC8] rounded-3xl p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-bold font-serif uppercase tracking-wider text-[#3E2723] flex items-center gap-2 border-b border-[#D7CCC8] pb-3">
                  <Sparkles className="w-4 h-4 text-[#8B5A2B]" />
                  <span>Interactive Floor Actions</span>
                </h3>

                <div className="space-y-3">
                  {!isSeated && !isCompleted && !isCancelled && (
                    <button
                      onClick={() => handleSeatGuest(selectedBooking.id, selectedTableChoice)}
                      className="w-full py-3.5 px-4 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Seat Guests at {selectedTableChoice || 'Table'}</span>
                    </button>
                  )}

                  {isSeated && (
                    <button
                      onClick={() => handleCompleteReservation(selectedBooking.id)}
                      className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Meal Completed & Clear Table</span>
                    </button>
                  )}

                  {isCompleted && (
                    <div className="p-3 bg-[#E0E0E0] rounded-xl text-center text-xs text-[#5D4037] font-semibold">
                      This dining session is completed and logged into audit history.
                    </div>
                  )}
                </div>

                {!isCompleted && !isCancelled && (
                  <div className="pt-3 border-t border-[#D7CCC8] space-y-2">
                    <label className="block text-xs font-bold text-[#3E2723]">
                      Reassign Table Number:
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTableChoice}
                        onChange={(e) => setSelectedTableChoice(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-xs font-mono font-bold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                      >
                        <optgroup label="Garden Terrace Patio">
                          <option value="T-01">T-01 (Terrace Pergola - 4p)</option>
                          <option value="T-02">T-02 (Terrace Garden - 2p)</option>
                          <option value="T-03">T-03 (Terrace Fountain - 6p)</option>
                          <option value="T-04">T-04 (Terrace Lantern - 4p)</option>
                          <option value="T-05">T-05 (Terrace Sunset - 8p)</option>
                        </optgroup>
                        <optgroup label="The Hearth Dining Hall">
                          <option value="H-01">H-01 (Beside Woodfire Hearth - 4p)</option>
                          <option value="H-02">H-02 (Central Hall - 6p)</option>
                          <option value="H-03">H-03 (Clay Pot View - 4p)</option>
                          <option value="H-04">H-04 (Hearth Booth - 2p)</option>
                        </optgroup>
                        <optgroup label="Private Kraal Suites">
                          <option value="VIP-01">VIP-01 (Serengeti Suite - 12p)</option>
                          <option value="VIP-02">VIP-02 (Tsavo Boardroom - 10p)</option>
                        </optgroup>
                      </select>

                      <button
                        onClick={() => handleReassignTable(selectedBooking.id, selectedTableChoice)}
                        className="px-3.5 py-2 bg-[#3E2723] hover:bg-[#251714] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-[#D7CCC8] flex items-center justify-between gap-3 text-xs">
                  <button
                    onClick={() => setShowPrintChit(true)}
                    className="text-[#8B5A2B] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Kitchen Chit</span>
                  </button>

                  {!isCancelled && !isCompleted && (
                    <button
                      onClick={() => handleCancelReservation(selectedBooking.id)}
                      className="text-[#C62828] hover:underline font-semibold cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>

        </main>

        {showPrintChit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm bg-white border border-[#D7CCC8] rounded-2xl p-6 shadow-2xl text-[#3E2723] font-mono text-xs space-y-4">
              <div className="text-center border-b border-dashed border-[#D7CCC8] pb-3">
                <span className="font-serif text-base font-bold block text-[#3E2723]">
                  ROOTS & POTS
                </span>
                <span className="text-[10px] text-[#795548] uppercase tracking-wider block">
                  Arcadia Mall · Athi River
                </span>
                <span className="text-[11px] font-bold text-[#8B5A2B] mt-1 block">
                  DINING TABLE CHIT // {selectedBooking.code}
                </span>
              </div>

              <div className="space-y-1.5 border-b border-dashed border-[#D7CCC8] pb-3 text-[11px]">
                <div className="flex justify-between">
                  <span>Guest:</span>
                  <strong className="text-right">{selectedBooking.guestName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Table Assigned:</span>
                  <strong className="text-[#8B5A2B] text-xs">{selectedBooking.tableAssigned || 'T-01'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Party:</span>
                  <strong>{selectedBooking.guests} Diners</strong>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span>{selectedBooking.date} @ {selectedBooking.time}</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-3 font-sans">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-[#8B5A2B] text-[#F5F2EB] font-bold rounded-xl text-xs hover:bg-[#70461F] transition-all cursor-pointer text-center"
                >
                  Print Slip
                </button>
                <button
                  onClick={() => setShowPrintChit(false)}
                  className="px-4 py-2 bg-[#D7CCC8]/60 text-[#3E2723] font-semibold rounded-xl text-xs hover:bg-[#D7CCC8] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // VIEW C: MAIN STAFF CONSOLE (TABS: ALL ORDERS, BOOKINGS, KITCHEN KDS, RIDERS, SALES)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] pb-16 selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
      
      {/* Top Staff App Header */}
      <header className="sticky top-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#D7CCC8] px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-[#D7CCC8]/50 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5A2B]" />
              <span>Back to Bistro</span>
            </button>

            <div className="h-5 w-px bg-[#D7CCC8] hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                <h1 className="text-sm sm:text-base font-bold font-serif text-[#3E2723] tracking-tight">
                  Roots & Pots · Floor, Kitchen & Boda Dispatch
                </h1>
              </div>
              <p className="text-[11px] text-[#795548] font-mono">
                Arcadia Mall, Athi River · Shift: {currentUser?.name || 'Achieng Odhiambo'} ({currentUser?.title || 'Floor Lead'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onSwitchToAdmin}
              className="px-3.5 py-2 bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span>Switch to Admin</span>
            </button>

            <button
              onClick={() => setIsAddResModalOpen(true)}
              className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>New Walk-In Booking</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Shift Snapshot Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="p-4 bg-[#D7CCC8]/40 rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              All Orders Today
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-serif text-[#3E2723] tabular-nums">
                {orders.length}
              </span>
              <span className="text-xs text-[#2E7D32] font-semibold">Table + Delivery</span>
            </div>
          </div>

          <div className="p-4 bg-[#D7CCC8]/40 rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              Active In Kitchen (KDS)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-serif text-[#8B5A2B] tabular-nums">
                {activeKitchenOrders.length}
              </span>
              <span className="text-xs text-[#8B5A2B] font-semibold">Cooking / Expo</span>
            </div>
          </div>

          <div className="p-4 bg-[#D7CCC8]/40 rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              Boda Fleet Available
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-serif text-[#2E7D32] tabular-nums">
                {riders.filter((r) => r.status === 'available').length} / {riders.length}
              </span>
              <span className="text-xs text-[#2E7D32] font-semibold">Ready to Roll</span>
            </div>
          </div>

          <div className="p-4 bg-[#D7CCC8]/40 rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[11px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              Shift Gross Revenue
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-serif text-[#3E2723] tabular-nums">
                Kshs {todaySalesTotal.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Tab Controls: ALL ORDERS, RESERVATIONS, KITCHEN KDS, RIDERS, SALES */}
        <div className="flex items-center gap-2 border-b border-[#D7CCC8] pb-3 overflow-x-auto no-scrollbar">
          
          <button
            onClick={() => setActiveTab('all_orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'all_orders'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>All Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('kitchen')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'kitchen'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Live Kitchen KDS ({activeKitchenOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('riders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'riders'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Boda Riders & Dispatch ({riders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Bookings & Tables ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'sales'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Till Reconciliation</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ALL ORDERS (Kitchen + Table + Delivery + Pickup) */}
        {/* ========================================================================= */}
        {activeTab === 'all_orders' && (
          <div className="space-y-4">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#D7CCC8]/35 p-3 rounded-2xl border border-[#D7CCC8]">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(['all', 'dine_in', 'delivery', 'pickup', 'active', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                      orderFilter === filter
                        ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-xs'
                        : 'text-[#5D4037] hover:bg-[#D7CCC8]/70 hover:text-[#3E2723]'
                    }`}
                  >
                    {filter === 'all'
                      ? 'All Orders'
                      : filter === 'dine_in'
                      ? 'Dine-In Tables'
                      : filter === 'delivery'
                      ? 'Doorstep Delivery'
                      : filter === 'pickup'
                      ? 'Takeaway Pickup'
                      : filter === 'active'
                      ? 'Active Kitchen'
                      : 'Completed'}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#795548] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search order ref, table, or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-8 pr-3 py-1.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            {/* Hint Notice */}
            <div className="flex items-center gap-2 text-xs text-[#795548] px-1">
              <Info className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span>Click on any order row or "Explore Details" to view all items, payment status, assign riders, or trigger live kitchen steps.</span>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#D7CCC8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#D7CCC8]/40 border-b border-[#D7CCC8] text-[#5D4037] font-mono uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order Code</th>
                      <th className="py-3 px-4">Customer & Location</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4">Amount & Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D7CCC8]/50">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#795548]">
                          No orders found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() => handleOpenOrderDetails(order.id)}
                          className="hover:bg-[#D7CCC8]/20 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#8B5A2B] block">
                              {order.orderCode}
                            </span>
                            <span className="text-[11px] text-[#795548] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {order.createdAt}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-bold text-[#3E2723] text-sm group-hover:text-[#8B5A2B] transition-colors block">
                              {order.customerName}
                            </span>
                            <span className="text-[#795548] text-[11px] font-mono block">
                              {order.customerPhone}
                            </span>
                            {order.deliveryAddress && (
                              <p className="text-[10px] text-[#5D4037] truncate max-w-xs mt-0.5">
                                {order.deliveryAddress}
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="capitalize font-bold text-[#3E2723] block">
                              {order.orderType === 'dine_in' ? `Table ${order.tableNumber || 'Dine-In'}` : order.orderType === 'delivery' ? 'Doorstep Delivery' : 'Pickup'}
                            </span>
                            {order.assignedRiderName && (
                              <div className="mt-0.5 space-y-0.5">
                                <span className="text-[10px] text-[#2E7D32] font-semibold flex items-center gap-1">
                                  <Bike className="w-3 h-3" />
                                  {order.assignedRiderName}
                                </span>
                                {order.riderTransitStage && (
                                  <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded inline-block ${
                                    order.riderTransitStage === 'delivered'
                                      ? 'bg-[#2E7D32]/20 text-[#2E7D32]'
                                      : order.riderTransitStage === 'arrived_at_gate'
                                      ? 'bg-[#6A1B9A]/15 text-[#6A1B9A]'
                                      : order.riderTransitStage === 'picked_up'
                                      ? 'bg-[#1565C0]/15 text-[#1565C0]'
                                      : 'bg-[#8B5A2B]/15 text-[#8B5A2B]'
                                  }`}>
                                    ● {order.riderTransitStage.replace(/_/g, ' ')}
                                  </span>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-[#5D4037] max-w-xs truncate">
                            {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <strong className="text-sm font-mono text-[#3E2723] block">
                              Kshs {order.total.toLocaleString()}
                            </strong>
                            <span className="text-[10px] text-[#795548] uppercase font-mono">
                              {order.paymentMethod === 'mpesa' ? 'Lipa na M-Pesa' : 'Cash'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                order.status === 'received'
                                  ? 'bg-[#C62828]/15 text-[#C62828] border-[#C62828]/40'
                                  : order.status === 'preparing'
                                  ? 'bg-[#8B5A2B]/15 text-[#8B5A2B] border-[#8B5A2B]/40 animate-pulse'
                                  : order.status === 'ready'
                                  ? 'bg-[#2E7D32]/15 text-[#2E7D32] border-[#2E7D32]/40'
                                  : order.status === 'en_route'
                                  ? 'bg-[#1565C0]/15 text-[#1565C0] border-[#1565C0]/40'
                                  : 'bg-[#5D4037]/15 text-[#5D4037] border-[#5D4037]/40'
                              }`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleOpenOrderDetails(order.id)}
                              className="px-3 py-1 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer ml-auto"
                            >
                              <span>Explore Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LIVE KITCHEN KDS TICKETS */}
        {/* ========================================================================= */}
        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-serif text-[#3E2723]">
                  Live Kitchen Order Display (KDS)
                </h2>
                <p className="text-xs text-[#5D4037]">
                  Real-time kitchen tickets undergoing cooking over firewood embers and clay pots.
                </p>
              </div>

              <div className="text-xs text-[#795548] font-mono bg-white px-3 py-1.5 rounded-xl border border-[#D7CCC8]">
                Active Cooking Tickets: <strong className="text-[#8B5A2B]">{activeKitchenOrders.length}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeKitchenOrders.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-[#D7CCC8] text-[#795548]">
                  <ChefHat className="w-10 h-10 mx-auto mb-2 text-[#8B5A2B]" />
                  <p className="font-semibold text-[#3E2723]">All cooking tickets cleared!</p>
                  <p className="text-xs text-[#795548]">New orders placed online or tableside will appear here.</p>
                </div>
              ) : (
                activeKitchenOrders.map((order) => (
                  <div
                    key={order.id}
                    onClick={() => handleOpenOrderDetails(order.id)}
                    className="bg-white rounded-2xl border border-[#D7CCC8] p-5 shadow-sm flex flex-col justify-between hover:border-[#8B5A2B] transition-all cursor-pointer group"
                  >
                    <div>
                      {/* Ticket Header */}
                      <div className="flex items-center justify-between border-b border-[#D7CCC8] pb-3 mb-3">
                        <div>
                          <span className="font-mono font-bold text-[#3E2723] text-base group-hover:text-[#8B5A2B] transition-colors">
                            {order.orderCode}
                          </span>
                          <span className="text-[11px] text-[#795548] block">
                            {order.orderType === 'dine_in'
                              ? `Table: ${order.tableNumber || 'Dining Hall'}`
                              : order.orderType === 'delivery'
                              ? 'Doorstep Delivery'
                              : 'Takeaway Pickup'}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'received'
                              ? 'bg-[#C62828]/15 text-[#C62828] border border-[#C62828]/40'
                              : order.status === 'preparing'
                              ? 'bg-[#8B5A2B]/15 text-[#8B5A2B] border border-[#8B5A2B]/40 animate-pulse'
                              : order.status === 'ready'
                              ? 'bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/40'
                              : 'bg-[#1565C0]/15 text-[#1565C0] border border-[#1565C0]/40'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Customer Details */}
                      <div className="text-xs text-[#5D4037] mb-3">
                        <strong className="text-[#3E2723] block">{order.customerName}</strong>
                        <span>{order.customerPhone}</span>
                        {order.deliveryAddress && (
                          <p className="text-[11px] text-[#795548] mt-0.5 line-clamp-1">
                            Dest: {order.deliveryAddress}
                          </p>
                        )}
                      </div>

                      {/* Items List */}
                      <div className="space-y-2 py-2 border-t border-[#D7CCC8] mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start justify-between text-xs">
                            <div>
                              <span className="font-bold text-[#3E2723] mr-1.5">{item.quantity}×</span>
                              <span className="text-[#5D4037]">{item.name}</span>
                              {item.customization && (
                                <span className="text-[10px] text-[#8B5A2B] block italic font-semibold">
                                  {item.customization}
                                </span>
                              )}
                            </div>
                            <span className="text-[#795548] font-mono tabular-nums font-semibold">
                              {item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stepper Button */}
                    <div className="pt-3 border-t border-[#D7CCC8] flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <div className="text-xs">
                        <span className="text-[#795548]">Total: </span>
                        <strong className="text-[#8B5A2B] font-mono font-bold">
                          Kshs {order.total}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'received' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="px-3 py-1.5 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Fire Stew & Grill
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="px-3 py-1.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Mark Ready
                          </button>
                        )}

                        {order.status === 'ready' && order.orderType === 'delivery' && (
                          <button
                            onClick={() => handleInitiateRiderDispatch(order.id)}
                            className="px-3 py-1.5 bg-[#1565C0] hover:bg-[#0D47A1] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Dispatch Rider</span>
                          </button>
                        )}

                        {order.status === 'ready' && order.orderType !== 'delivery' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="px-3 py-1.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Serve Table
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BODA RIDERS TAB & AUTOMATED DISPATCH CALLING */}
        {/* ========================================================================= */}
        {activeTab === 'riders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-serif text-[#3E2723]">
                  Registered Boda Delivery Fleet
                </h2>
                <p className="text-xs text-[#5D4037]">
                  Dispatch saved riders, simulate automated dispatch calls, and handle no-answer failover alerts.
                </p>
              </div>

              <button
                onClick={() => setIsAddRiderModalOpen(true)}
                className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Register New Rider</span>
              </button>
            </div>

            {/* Riders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {riders.map((rider) => {
                const isAvailable = rider.status === 'available';
                const isOnDelivery = rider.status === 'on_delivery';

                return (
                  <div
                    key={rider.id}
                    className="p-5 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isAvailable
                            ? 'bg-[#2E7D32]/15 text-[#2E7D32] border-[#2E7D32]/40'
                            : isOnDelivery
                            ? 'bg-[#1565C0]/15 text-[#1565C0] border-[#1565C0]/40 animate-pulse'
                            : 'bg-[#795548]/15 text-[#795548] border-[#795548]/40'
                        }`}>
                          ● {rider.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#8B5A2B]">
                          ★ {rider.rating}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-[#3E2723]">{rider.name}</h4>
                      <p className="text-xs font-mono text-[#5D4037] font-semibold">{rider.phone}</p>
                      <p className="text-xs text-[#795548] mt-1 font-mono">{rider.bikeReg}</p>
                      
                      <div className="mt-3 pt-2 border-t border-[#D7CCC8]/60 text-[11px] text-[#795548] space-y-1">
                        <p>Base: <strong className="text-[#3E2723]">{rider.baseLocation}</strong></p>
                        {rider.nationalId && <p>ID / DL: <strong className="font-mono text-[#3E2723]">{rider.nationalId}</strong></p>}
                        <p>Completed Trips: <strong className="text-[#3E2723]">{rider.completedDeliveries}</strong></p>
                        {rider.currentOrderId && (
                          <p className="text-[#1565C0] font-mono font-semibold">
                            En Route: {rider.currentOrderId}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#D7CCC8]/60 flex items-center justify-between gap-1.5">
                      <a
                        href={`tel:${rider.phone}`}
                        className="p-2 bg-[#F5F2EB] hover:bg-[#D7CCC8] text-[#3E2723] rounded-xl text-xs font-semibold border border-[#D7CCC8] transition-colors"
                        title="Direct Phone Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#8B5A2B]" />
                      </a>

                      <a
                        href={`https://wa.me/254${rider.phone.replace(/[\s\-()]/g, '').replace(/^0/, '')}?text=${encodeURIComponent(
                          `Jambo ${rider.name}! Roots & Pots Bistro dispatch checking in. Are you stationed at ${rider.baseLocation} ready for deliveries?`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1b7e3e] border border-[#25D366]/40 rounded-xl text-xs font-semibold transition-colors"
                        title="Direct WhatsApp Message"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      </a>

                      <button
                        onClick={() => {
                          const nextStatus = isAvailable ? 'offline' : 'available';
                          updateRiderStatus(rider.id, nextStatus);
                        }}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                          isAvailable
                            ? 'bg-[#D7CCC8]/50 hover:bg-[#D7CCC8] text-[#3E2723] border-[#BCAAA4]'
                            : 'bg-[#2E7D32]/15 hover:bg-[#2E7D32]/25 text-[#2E7D32] border-[#2E7D32]/40'
                        }`}
                      >
                        {isAvailable ? 'Set Offline' : 'Set Available'}
                      </button>

                      {riders.length > 2 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove ${rider.name} from active fleet?`)) {
                              deleteRider(rider.id);
                            }
                          }}
                          className="p-2 text-[#C62828] hover:bg-[#FFEBEE] rounded-xl transition-colors cursor-pointer"
                          title="Remove Rider"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rider Dispatch Automation Guide */}
            <div className="p-5 bg-white rounded-3xl border border-[#D7CCC8] space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider font-mono">
                <Radio className="w-4 h-4 text-[#8B5A2B]" />
                <span>Simulated Automated Dispatch Call & Failover Architecture</span>
              </div>
              <p className="text-xs text-[#5D4037] leading-relaxed">
                When you click <strong>"Assign Rider & Initiate Dispatch Call"</strong> on any delivery order:
                Roots & Pots dials the primary available rider. If the rider answers, the order is locked and marked <em>En Route</em>.
                If the call is missed / not picked within the ringing window, the dispatch system automatically raises an <strong>ALERT</strong> and seamlessly escalates the call to the next standby rider!
              </p>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RESERVATIONS & TABLES */}
        {/* ========================================================================= */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#D7CCC8]/35 p-3 rounded-2xl border border-[#D7CCC8]">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {(['all', 'confirmed', 'seated', 'completed'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setResFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                      resFilter === filter
                        ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-xs'
                        : 'text-[#5D4037] hover:bg-[#D7CCC8]/70 hover:text-[#3E2723]'
                    }`}
                  >
                    {filter === 'all' ? 'All Bookings' : filter}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#795548] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search guest name or ref..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-60 pl-8 pr-3 py-1.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            {/* Reservations List Table */}
            <div className="bg-white rounded-2xl border border-[#D7CCC8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#D7CCC8]/40 border-b border-[#D7CCC8] text-[#5D4037] font-mono uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Ref & Time</th>
                      <th className="py-3 px-4">Guest Details</th>
                      <th className="py-3 px-4">Party & Zone</th>
                      <th className="py-3 px-4">Assigned Table</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D7CCC8]/50">
                    {filteredReservations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#795548]">
                          No reservations found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredReservations.map((res) => (
                        <tr 
                          key={res.id} 
                          onClick={() => handleOpenBookingDetails(res.id)}
                          className="hover:bg-[#D7CCC8]/20 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#8B5A2B] block">
                              {res.code}
                            </span>
                            <span className="text-[11px] text-[#795548] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {res.time} · {res.date}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#3E2723] text-sm group-hover:text-[#8B5A2B] transition-colors">
                                {res.guestName}
                              </span>
                              {res.isVIP && (
                                <span className="text-[9px] font-bold bg-[#8B5A2B] text-[#F5F2EB] px-1.5 py-0.5 rounded">
                                  VIP
                                </span>
                              )}
                            </div>
                            <span className="text-[#795548] text-[11px] block mt-0.5 font-mono">
                              {res.phone}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-bold text-[#3E2723]">{res.guests} Guests</span>
                            <span className="text-[11px] text-[#795548] block capitalize">
                              {res.zone === 'terrace' ? 'Garden Terrace' : res.zone === 'hearth' ? 'Hearth Hall' : 'Private Kraal'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-bold text-[#3E2723] bg-[#D7CCC8]/50 px-2 py-1 rounded border border-[#BCAAA4]">
                              {res.tableAssigned || 'T-01'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                res.status === 'seated'
                                  ? 'bg-[#2E7D32]/15 text-[#2E7D32] border-[#2E7D32]/40'
                                  : res.status === 'confirmed'
                                  ? 'bg-[#1565C0]/15 text-[#1565C0] border-[#1565C0]/40'
                                  : res.status === 'completed'
                                  ? 'bg-[#5D4037]/15 text-[#5D4037] border-[#5D4037]/40'
                                  : 'bg-[#C62828]/15 text-[#C62828] border-[#C62828]/40'
                              }`}
                            >
                              {res.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleOpenBookingDetails(res.id)}
                              className="px-3 py-1 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer ml-auto"
                            >
                              <span>Details & Actions</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SHIFT SALES & TILL */}
        {/* ========================================================================= */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold font-serif text-[#3E2723]">
                  Shift Sales & Till Reconciliation
                </h2>
                <p className="text-xs text-[#5D4037]">
                  Live transactions recorded via Lipa na M-Pesa Till 8945201 & Cash at Arcadia Mall.
                </p>
              </div>

              <div className="px-4 py-2 bg-white border border-[#D7CCC8] rounded-xl text-xs font-mono shadow-xs">
                Lipa na M-Pesa Till: <strong className="text-[#2E7D32]">8945201</strong>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#D7CCC8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#D7CCC8]/40 border-b border-[#D7CCC8] text-[#5D4037] font-mono uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Order Ref</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Order Type</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4">Payment & Receipt</th>
                      <th className="py-3 px-4 text-right">Amount (Kshs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D7CCC8]/50">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#D7CCC8]/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#8B5A2B]">
                          {o.orderCode}
                          <span className="text-[10px] text-[#795548] block font-sans">
                            {o.createdAt}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-[#3E2723] block">{o.customerName}</strong>
                          <span className="text-[#795548] text-[11px] font-mono">{o.customerPhone}</span>
                        </td>
                        <td className="py-3 px-4 capitalize text-[#5D4037]">
                          {o.orderType.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-[#5D4037] max-w-xs truncate">
                          {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize font-semibold text-[#3E2723] block">
                            {o.paymentMethod === 'mpesa' ? 'Lipa na M-Pesa' : 'Cash on Delivery'}
                          </span>
                          {o.mpesaReceipt && (
                            <span className="font-mono text-[10px] text-[#2E7D32]">
                              Ref: {o.mpesaReceipt}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#3E2723] tabular-nums">
                          Kshs {o.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Automated Calling & Add Rider Modals */}
      {renderAutomatedDispatchModal()}
      {renderAddRiderModal()}

    </div>
  );
};
