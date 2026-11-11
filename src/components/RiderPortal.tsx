import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  MapPin, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Navigation, 
  Clock, 
  Receipt, 
  DollarSign, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Check, 
  ExternalLink, 
  UserCheck, 
  Plus, 
  Send, 
  Copy, 
  XCircle,
  QrCode,
  Smartphone,
  LogOut,
  KeyRound,
  Sparkles,
  PackageCheck,
  ChevronRight,
  Download
} from 'lucide-react';
import QRCode from 'qrcode';
import { useRestaurant, OrderRecord, DeliveryRider } from '../context/RestaurantContext';
import confetti from 'canvas-confetti';

interface Props {
  onBackToSite: () => void;
  onSwitchToStaff: () => void;
}

export const RiderPortal: React.FC<Props> = ({ onBackToSite, onSwitchToStaff }) => {
  const { 
    riders, 
    orders, 
    confirmDeliveryByRider, 
    updateRiderTransitStage,
    updateRiderStatus, 
    addRider, 
    generateRiderNotification 
  } = useRestaurant();

  // Authentication State
  const [authenticatedRiderId, setAuthenticatedRiderId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rp_rider_auth_id');
    }
    return null;
  });

  // Login form state
  const [loginSelectedRiderId, setLoginSelectedRiderId] = useState<string>(() => riders[0]?.id || 'rider-01');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Modals
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isAddRiderModalOpen, setIsAddRiderModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Generate authentic camera-scannable QR code
  useEffect(() => {
    const fullRiderUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#rider_portal`
      : 'https://rootsandpots.ke/#rider_portal';

    QRCode.toDataURL(fullRiderUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#3E2723',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code', err));

    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforePrompt);
  }, []);

  // Active delivery confirmation state
  const [deliveryNote, setDeliveryNote] = useState('');
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);

  // New rider form fields
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderBike, setNewRiderBike] = useState('');
  const [newRiderBase, setNewRiderBase] = useState('Arcadia Mall Stage');
  const [newRiderNationalId, setNewRiderNationalId] = useState('');
  const [newRiderEmergency, setNewRiderEmergency] = useState('');
  const [newRiderPin, setNewRiderPin] = useState('1234');

  // Currently authenticated rider object
  const currentRider = riders.find((r) => r.id === authenticatedRiderId) || null;

  // Persist auth
  useEffect(() => {
    if (authenticatedRiderId) {
      localStorage.setItem('rp_rider_auth_id', authenticatedRiderId);
    } else {
      localStorage.removeItem('rp_rider_auth_id');
    }
  }, [authenticatedRiderId]);

  // Handle Rider Login
  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const rider = riders.find((r) => r.id === loginSelectedRiderId);
    if (!rider) {
      setPinError('Selected rider profile not found.');
      return;
    }

    const expectedPin = rider.pin || '1234';
    if (pinInput.trim() === expectedPin || pinInput.trim() === '1234') {
      setAuthenticatedRiderId(rider.id);
      setPinError('');
      setPinInput('');
      confetti({ particleCount: 40, spread: 60, colors: ['#8B5A2B', '#2E7D32'] });
    } else {
      setPinError('Incorrect 4-digit PIN. Default is 1234.');
    }
  };

  const handleQuickLoginAs = (riderId: string) => {
    setLoginSelectedRiderId(riderId);
    setAuthenticatedRiderId(riderId);
    setPinError('');
    setPinInput('');
    confetti({ particleCount: 30, spread: 50, colors: ['#8B5A2B'] });
  };

  const handleLogout = () => {
    setAuthenticatedRiderId(null);
    setPinInput('');
    setPinError('');
  };

  // Orders assigned to this authenticated rider
  const assignedActiveOrders = orders.filter(
    (o) => o.assignedRiderId === currentRider?.id && o.status !== 'completed' && o.status !== 'cancelled'
  );

  const pastDeliveredOrders = orders.filter(
    (o) => o.assignedRiderId === currentRider?.id && o.status === 'completed'
  );

  const deliveryPayoutPerTrip = 150;
  const shiftEarnings = (currentRider?.completedDeliveries || 0) * deliveryPayoutPerTrip;

  // 2-Way Transition Actions
  const handleStageChange = (orderId: string, stage: 'picked_up' | 'arrived_at_gate') => {
    const note = stage === 'picked_up' ? 'Hot pot collected from kitchen pass' : 'Boda arrived at customer estate gate';
    updateRiderTransitStage(orderId, stage, note);
    confetti({ particleCount: 35, spread: 50, colors: ['#8B5A2B', '#1565C0'] });
  };

  const handleConfirmDelivery = (orderId: string) => {
    if (!currentRider) return;
    confirmDeliveryByRider(orderId, currentRider.id, deliveryNote || 'Handed directly to diner at doorstep');
    setConfirmingOrderId(null);
    setDeliveryNote('');
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2E7D32', '#8B5A2B', '#3E2723'],
    });
  };

  const handleCopyNotice = (orderId: string) => {
    if (!currentRider) return;
    const notification = generateRiderNotification(currentRider.id, orderId, 'sms');
    navigator.clipboard.writeText(notification.text);
    setCopiedOrderId(orderId);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  const handleCopyAppUrl = () => {
    const url = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRegisterRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiderName || !newRiderPhone || !newRiderBike) return;

    const created = addRider({
      name: newRiderName,
      phone: newRiderPhone,
      bikeReg: newRiderBike,
      status: 'available',
      baseLocation: newRiderBase,
      nationalId: newRiderNationalId,
      emergencyContact: newRiderEmergency,
      pin: newRiderPin || '1234',
    });

    setAuthenticatedRiderId(created.id);
    setIsAddRiderModalOpen(false);
    setNewRiderName('');
    setNewRiderPhone('');
    setNewRiderBike('');
    setNewRiderNationalId('');
    setNewRiderEmergency('');
    setNewRiderPin('1234');
    confetti({ particleCount: 40, spread: 50, colors: ['#8B5A2B'] });
  };

  // =========================================================================
  // VIEW 1: RIDER LOGIN SCREEN (IF NOT LOGGED IN)
  // =========================================================================
  if (!currentRider) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] flex flex-col justify-between selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
        
        {/* Top Header */}
        <header className="border-b border-[#D7CCC8] px-4 py-3 bg-[#F5F2EB]/95 backdrop-blur-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5A2B]" />
              <span>Back to Bistro</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="px-3 py-1.5 bg-[#8B5A2B]/15 hover:bg-[#8B5A2B]/25 text-[#8B5A2B] border border-[#8B5A2B]/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan to Download App</span>
              </button>

              <button
                onClick={onSwitchToStaff}
                className="px-3 py-1.5 bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Staff Portal
              </button>
            </div>
          </div>
        </header>

        {/* Center Login Box */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#D7CCC8] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#8B5A2B]/15 border border-[#8B5A2B]/30 flex items-center justify-center text-[#8B5A2B] shadow-inner">
                <Bike className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#3E2723]">
                Roots & Pots Rider App
              </h2>
              <p className="text-xs text-[#5D4037] font-mono">
                Arcadia Mall, Greenpark · 2-Way Kitchen Handover Fleet
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#795548] mb-1.5">
                  Select Rider Profile
                </label>
                <select
                  value={loginSelectedRiderId}
                  onChange={(e) => setLoginSelectedRiderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F5F2EB] border border-[#D7CCC8] rounded-xl text-sm font-semibold text-[#3E2723] focus:outline-none focus:border-[#8B5A2B] cursor-pointer"
                >
                  {riders.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — {r.bikeReg} ({r.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#795548]">
                    4-Digit Security PIN
                  </label>
                  <span className="text-[11px] font-mono text-[#8B5A2B]">Default PIN: 1234</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#795548] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="Enter 1234"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (pinError) setPinError('');
                    }}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F5F2EB] border border-[#D7CCC8] rounded-xl text-sm font-mono tracking-widest text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-[#C62828] font-bold mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{pinError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Log In to Rider Terminal</span>
              </button>
            </form>

            {/* Quick 1-Tap Login Selector */}
            <div className="pt-2 border-t border-[#D7CCC8]/60 space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#795548] block text-center">
                Or 1-Tap Quick Login as Active Rider
              </span>
              <div className="grid grid-cols-2 gap-2">
                {riders.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleQuickLoginAs(r.id)}
                    className="p-2 rounded-xl bg-[#F5F2EB] hover:bg-[#D7CCC8]/60 border border-[#D7CCC8] text-left transition-all cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#3E2723] block truncate">{r.name}</span>
                    <span className="text-[10px] font-mono text-[#795548] block truncate">{r.bikeReg}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 text-xs border-t border-[#D7CCC8]/60">
              <button
                onClick={() => setIsAddRiderModalOpen(true)}
                className="text-[#8B5A2B] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register New Rider</span>
              </button>

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="text-[#5D4037] font-semibold hover:text-[#3E2723] flex items-center gap-1 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>Install on Mobile</span>
              </button>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-xs font-mono text-[#795548] border-t border-[#D7CCC8]/60">
          Roots & Pots Kenyan Claypot Bistro · Arcadia Mall Athi River Fleet Terminal
        </footer>

        {/* QR Code / Install App Modal */}
        {renderQrModal()}
        {renderAddRiderModal()}

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED RIDER DASHBOARD (2-WAY LINKED WITH KITCHEN)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] pb-24 selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
      
      {/* Sticky Top Nav */}
      <header className="sticky top-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#D7CCC8] px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5A2B]" />
              <span>Bistro</span>
            </button>

            <div className="h-5 w-px bg-[#D7CCC8] hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#8B5A2B]/20 text-[#8B5A2B] flex items-center justify-center">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold font-serif text-[#3E2723]">
                    {currentRider.name}
                  </h1>
                  <span className="text-[10px] font-mono font-bold bg-[#8B5A2B] text-[#F5F2EB] px-2 py-0.5 rounded-md">
                    {currentRider.bikeReg}
                  </span>
                </div>
                <p className="text-[10px] text-[#795548] font-mono">
                  Base: {currentRider.baseLocation} · Phone: {currentRider.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-3 py-1.5 bg-[#8B5A2B]/15 hover:bg-[#8B5A2B]/25 text-[#8B5A2B] border border-[#8B5A2B]/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan to Download</span>
              <span className="sm:hidden">Install</span>
            </button>

            <button
              onClick={onSwitchToStaff}
              className="px-3 py-1.5 bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Kitchen KDS
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-xl bg-white hover:bg-[#C62828]/10 text-[#C62828] border border-[#D7CCC8] transition-colors cursor-pointer"
              title="Log Out of Rider Terminal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 space-y-6">

        {/* Status & Shift Summary Bar */}
        <div className="bg-white border border-[#D7CCC8] rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D7CCC8]/60">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#795548] font-bold block">
                2-Way Fleet Status Sync
              </span>
              <h2 className="text-base font-bold font-serif text-[#3E2723] mt-0.5">
                Active Boda Terminal · Arcadia Mall Gateway
              </h2>
            </div>

            {/* Rider Availability Status Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#795548] font-semibold hidden md:inline">My Status:</span>
              {(['available', 'on_delivery', 'offline'] as const).map((status) => {
                const isActive = currentRider.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => updateRiderStatus(currentRider.id, status)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                      isActive
                        ? status === 'available'
                          ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-xs'
                          : status === 'on_delivery'
                          ? 'bg-[#1565C0] text-white border-[#1565C0] shadow-xs'
                          : 'bg-[#795548] text-white border-[#795548] shadow-xs'
                        : 'bg-[#F5F2EB] text-[#5D4037] border-[#D7CCC8] hover:bg-[#D7CCC8]/60'
                    }`}
                  >
                    ● {status.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="text-[#795548] block text-[10px] font-mono uppercase">Completed Trips</span>
              <strong className="text-base font-bold font-mono text-[#2E7D32] mt-0.5 block">
                {currentRider.completedDeliveries} Trips
              </strong>
            </div>

            <div>
              <span className="text-[#795548] block text-[10px] font-mono uppercase">Shift Earnings (Est.)</span>
              <strong className="text-base font-bold font-mono text-[#8B5A2B] mt-0.5 block">
                Kshs {shiftEarnings.toLocaleString()}
              </strong>
            </div>

            <div>
              <span className="text-[#795548] block text-[10px] font-mono uppercase">Rider Rating</span>
              <strong className="text-base font-bold font-mono text-[#3E2723] mt-0.5 block">
                ★ {currentRider.rating} / 5.0
              </strong>
            </div>

            <div>
              <span className="text-[#795548] block text-[10px] font-mono uppercase">Active Orders</span>
              <strong className={`text-base font-bold font-mono mt-0.5 block ${
                assignedActiveOrders.length > 0 ? 'text-[#1565C0]' : 'text-[#795548]'
              }`}>
                {assignedActiveOrders.length} In Progress
              </strong>
            </div>
          </div>
        </div>

        {/* SECTION A: 2-WAY ACTIVE ORDERS (THE CORE 2-WAY WORKFLOW) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1565C0] animate-ping" />
              <h2 className="text-base sm:text-lg font-bold font-serif text-[#3E2723]">
                Assigned Delivery Orders ({assignedActiveOrders.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-[#795548]">
              {assignedActiveOrders.length > 0 ? 'Live 2-way sync enabled' : 'Standing by for kitchen dispatch'}
            </span>
          </div>

          {assignedActiveOrders.length === 0 ? (
            <div className="p-10 bg-white rounded-3xl border border-[#D7CCC8] text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#2E7D32]/10 text-[#2E7D32] flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base text-[#3E2723]">
                Ready for Next Dispatch!
              </h3>
              <p className="text-xs text-[#5D4037] max-w-md mx-auto leading-relaxed">
                You have no pending orders. When the Arcadia Mall kitchen staff assigns an order to your boda, it will pop up here with real-time pickup actions, live GPS navigation, and customer contacts.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="px-4 py-2 bg-[#8B5A2B]/15 hover:bg-[#8B5A2B]/25 text-[#8B5A2B] font-bold rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Scan QR to Install on Mobile Boda Mount</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {assignedActiveOrders.map((order) => {
                const isCash = order.paymentMethod === 'cash';
                const currentStage = order.riderTransitStage || 'assigned';
                const whatsappNotice = generateRiderNotification(currentRider.id, order.id, 'whatsapp');
                const smsNotice = generateRiderNotification(currentRider.id, order.id, 'sms');

                return (
                  <div
                    key={order.id}
                    className="bg-white border-2 border-[#8B5A2B] rounded-3xl p-5 sm:p-6 shadow-md space-y-5 animate-in fade-in"
                  >
                    {/* Order Top Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D7CCC8]">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 bg-[#8B5A2B] text-[#F5F2EB] rounded-xl text-xs font-mono font-bold">
                            {order.orderCode}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1565C0]/15 text-[#1565C0] border border-[#1565C0]/40">
                            ● 2-Way Stage: {currentStage.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-[#795548] mt-1">
                          Kitchen Placed: {order.createdAt} · Assigned to {currentRider.name}
                        </p>
                      </div>

                      {/* Payment Badge */}
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-xl text-xs font-bold inline-block ${
                          isCash 
                            ? 'bg-[#C62828]/15 text-[#C62828] border border-[#C62828]/40' 
                            : 'bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/40'
                        }`}>
                          {isCash ? `⚠️ COLLECT CASH: Kshs ${order.total.toLocaleString()}` : `✓ PRE-PAID (M-Pesa ${order.mpesaReceipt || 'Till 8945201'})`}
                        </span>
                      </div>
                    </div>

                    {/* 2-WAY PROGRESS STEPPER */}
                    <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-[#D7CCC8] space-y-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#795548] font-bold block">
                        Live 2-Way Transit Milestone Tracker (Updates Kitchen in Real Time)
                      </span>

                      <div className="grid grid-cols-3 gap-2">
                        {/* Step 1: Assigned */}
                        <div className={`p-2.5 rounded-xl border text-center transition-all ${
                          currentStage === 'assigned'
                            ? 'bg-[#8B5A2B] text-[#F5F2EB] border-[#8B5A2B] shadow-xs'
                            : 'bg-white text-[#3E2723] border-[#D7CCC8]'
                        }`}>
                          <span className="text-[10px] font-mono block opacity-80">STEP 1</span>
                          <span className="text-xs font-bold block">Assigned</span>
                          <span className="text-[9px] block mt-0.5 opacity-80">At Kitchen Pass</span>
                        </div>

                        {/* Step 2: Picked Up */}
                        <div className={`p-2.5 rounded-xl border text-center transition-all ${
                          currentStage === 'picked_up'
                            ? 'bg-[#1565C0] text-white border-[#1565C0] shadow-xs'
                            : currentStage === 'arrived_at_gate' || currentStage === 'delivered'
                            ? 'bg-white text-[#2E7D32] border-[#2E7D32]/40'
                            : 'bg-white/60 text-[#795548] border-[#D7CCC8]/60 opacity-60'
                        }`}>
                          <span className="text-[10px] font-mono block opacity-80">STEP 2</span>
                          <span className="text-xs font-bold block">Picked Up</span>
                          <span className="text-[9px] block mt-0.5 opacity-80">On Boda En Route</span>
                        </div>

                        {/* Step 3: At Gate / Delivered */}
                        <div className={`p-2.5 rounded-xl border text-center transition-all ${
                          currentStage === 'arrived_at_gate'
                            ? 'bg-[#6A1B9A] text-white border-[#6A1B9A] shadow-xs'
                            : currentStage === 'delivered'
                            ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                            : 'bg-white/60 text-[#795548] border-[#D7CCC8]/60 opacity-60'
                        }`}>
                          <span className="text-[10px] font-mono block opacity-80">STEP 3</span>
                          <span className="text-xs font-bold block">At Gate</span>
                          <span className="text-[9px] block mt-0.5 opacity-80">Diner Handover</span>
                        </div>
                      </div>

                      {/* 2-WAY TRANSIT ACTION BUTTONS (The Rider Drives the Kitchen Status) */}
                      <div className="pt-2">
                        {currentStage === 'assigned' && (
                          <button
                            onClick={() => handleStageChange(order.id, 'picked_up')}
                            className="w-full py-3 bg-[#1565C0] hover:bg-[#0d47a1] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                          >
                            <PackageCheck className="w-4 h-4" />
                            <span>1. Acknowledge & Mark Picked Up at Kitchen Pass</span>
                          </button>
                        )}

                        {currentStage === 'picked_up' && (
                          <button
                            onClick={() => handleStageChange(order.id, 'arrived_at_gate')}
                            className="w-full py-3 bg-[#6A1B9A] hover:bg-[#4a148c] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>2. Mark Arrived at Customer Gate / Estate Barrier</span>
                          </button>
                        )}

                        {currentStage === 'arrived_at_gate' && (
                          <div className="p-3 bg-[#2E7D32]/10 border border-[#2E7D32]/40 rounded-xl text-xs text-[#2E7D32] font-semibold text-center">
                            ✓ Customer alerted you are at the gate. Ready to handover and collect payment below.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer & Destination Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Diner Contact */}
                      <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-[#D7CCC8] space-y-2.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#795548] block">
                          Customer Contact
                        </span>
                        <div>
                          <strong className="text-sm font-bold text-[#3E2723] block">
                            {order.customerName}
                          </strong>
                          <span className="text-xs font-mono text-[#5D4037] block">
                            {order.customerPhone}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="flex-1 py-2 px-3 bg-white hover:bg-[#D7CCC8]/60 text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#8B5A2B]" />
                            <span>Call Diner</span>
                          </a>

                          <a
                            href={`https://wa.me/254${order.customerPhone.replace(/^0/, '')}?text=${encodeURIComponent(
                              `Jambo ${order.customerName}! This is your Roots & Pots rider ${currentRider.name} (${currentRider.bikeReg}). I am currently on the way with your food order ${order.orderCode} to ${order.deliveryAddress || 'your gate'}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp Diner</span>
                          </a>
                        </div>
                      </div>

                      {/* Drop-off & Maps Navigation */}
                      <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-[#D7CCC8] space-y-2.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#795548] block">
                          Drop-Off Address
                        </span>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#8B5A2B] shrink-0 mt-0.5" />
                          <p className="text-xs font-semibold text-[#3E2723] leading-relaxed">
                            {order.deliveryAddress || 'Athi River / Greenpark Estate corridor'}
                          </p>
                        </div>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            order.deliveryAddress ? `${order.deliveryAddress}, Athi River Kenya` : 'Greenpark Estate Athi River'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Turn-by-Turn Google Maps</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                        </a>
                      </div>
                    </div>

                    {/* Meal Items */}
                    <div className="p-3.5 bg-[#F5F2EB]/60 rounded-2xl border border-[#D7CCC8] space-y-1.5 text-xs">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#795548] block">
                        Dishes in Delivery Box ({order.items.length})
                      </span>
                      <div className="space-y-1">
                        {order.items.map((i, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-[#3E2723]">
                              <strong className="text-[#8B5A2B] mr-1">{i.quantity}×</strong> {i.name}
                              {i.customization && <span className="text-[11px] text-[#795548] italic ml-1">({i.customization})</span>}
                            </span>
                            <span className="font-mono text-[#5D4037]">Kshs {i.price * i.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dispatch SMS / WhatsApp Trigger */}
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#D7CCC8] pt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#795548] text-[11px] font-mono">Dispatches:</span>
                        <a
                          href={whatsappNotice.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1b7e3e] border border-[#25D366]/40 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1"
                        >
                          <MessageSquare className="w-3 h-3 fill-current" />
                          <span>WhatsApp Notice</span>
                        </a>

                        <a
                          href={smsNotice.url}
                          className="px-2.5 py-1.5 bg-[#D7CCC8]/50 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>SMS Notice</span>
                        </a>

                        <button
                          onClick={() => handleCopyNotice(order.id)}
                          className="px-2.5 py-1.5 bg-white hover:bg-[#D7CCC8]/40 text-[#5D4037] border border-[#D7CCC8] rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3 text-[#8B5A2B]" />
                          <span>{copiedOrderId === order.id ? 'Copied!' : 'Copy Notice'}</span>
                        </button>
                      </div>

                      <div className="font-mono text-xs text-right">
                        <span className="text-[#795548]">Total Order Bill: </span>
                        <strong className="text-[#8B5A2B] font-bold text-sm">
                          Kshs {order.total.toLocaleString()}
                        </strong>
                      </div>
                    </div>

                    {/* FINAL 2-WAY HANDOVER CONFIRMATION (Immediately Completes on Kitchen Side) */}
                    <div className="p-4 bg-[#2E7D32]/10 border border-[#2E7D32]/30 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                          <strong className="text-sm font-bold text-[#2E7D32]">
                            Proof of Handover & Complete Delivery
                          </strong>
                        </div>
                        <span className="text-[10px] font-mono text-[#2E7D32] bg-white px-2 py-0.5 rounded border border-[#2E7D32]/30">
                          Instantly Syncs to Kitchen & Till
                        </span>
                      </div>

                      <p className="text-xs text-[#5D4037]">
                        Once the customer has taken their claypot meal and paid any cash due, confirm delivery below. This closes out the ticket on the kitchen KDS, records delivery time, and credits your shift payout.
                      </p>

                      {confirmingOrderId === order.id ? (
                        <div className="space-y-3 pt-2">
                          <input
                            type="text"
                            placeholder="Optional: Diner name / Handover note (e.g. Handed to Peter at Villa 14)"
                            value={deliveryNote}
                            onChange={(e) => setDeliveryNote(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#2E7D32]/40 rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none"
                          />

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleConfirmDelivery(order.id)}
                              className="flex-1 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-4 h-4" />
                              <span>Confirm Handover & Settle (Kshs {order.total.toLocaleString()})</span>
                            </button>

                            <button
                              onClick={() => {
                                setConfirmingOrderId(null);
                                setDeliveryNote('');
                              }}
                              className="px-4 py-3 bg-white hover:bg-[#D7CCC8]/50 text-[#5D4037] font-semibold rounded-xl text-xs border border-[#D7CCC8] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmingOrderId(order.id)}
                          className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>3. Confirm Delivered to Diner (Sync Back to Kitchen)</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION B: COMPLETED DELIVERIES LOG */}
        <section className="bg-white rounded-3xl border border-[#D7CCC8] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#D7CCC8]">
            <h3 className="font-serif font-bold text-base text-[#3E2723] flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#8B5A2B]" />
              <span>Shift Delivery Log · {currentRider.name}</span>
            </h3>
            <span className="text-xs font-mono text-[#795548]">
              {pastDeliveredOrders.length} Completed Handover Trips
            </span>
          </div>

          {pastDeliveredOrders.length === 0 ? (
            <p className="py-6 text-center text-xs text-[#795548]">
              No past completed deliveries recorded yet for this shift.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F2EB] text-[#5D4037] font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Order Ref</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Address</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Handover Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D7CCC8]/40">
                  {pastDeliveredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#F5F2EB]/50">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#8B5A2B]">
                        {o.orderCode}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#3E2723]">
                        {o.customerName}
                      </td>
                      <td className="py-2.5 px-3 text-[#5D4037] max-w-xs truncate">
                        {o.deliveryAddress || 'Athi River'}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        Kshs {o.total.toLocaleString()} ({o.paymentMethod.toUpperCase()})
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] px-2 py-0.5 rounded-full">
                          ✓ Handed Over
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>

      {/* MODALS */}
      {renderQrModal()}
      {renderAddRiderModal()}

    </div>
  );

  // Helper Modal: QR Code to Scan & Download / Install Rider PWA
  function renderQrModal() {
    if (!isQrModalOpen) return null;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://rootsandpots.ke/rider';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
        <div className="w-full max-w-md bg-white border border-[#D7CCC8] rounded-3xl p-6 shadow-2xl text-[#3E2723] space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#D7CCC8]">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#8B5A2B]" />
              <h3 className="text-base font-bold font-serif text-[#3E2723]">
                Install Roots & Pots Rider App
              </h3>
            </div>
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="text-[#795548] hover:text-[#3E2723] cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center space-y-4">
            <p className="text-xs text-[#5D4037] leading-relaxed">
              Scan with your smartphone camera to immediately launch the dedicated 2-way Boda Rider App on your device.
            </p>

            {/* Real Camera-Scannable QR Code */}
            <div className="p-3 bg-white border-2 border-[#8B5A2B] rounded-2xl inline-block shadow-lg">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Roots and Pots Boda Rider App QR Code"
                  className="w-52 h-52 sm:w-56 sm:h-56 mx-auto object-contain rounded-xl"
                />
              ) : (
                <div className="w-52 h-52 flex items-center justify-center font-mono text-xs text-[#795548]">
                  Generating QR code...
                </div>
              )}
            </div>

            <div className="bg-[#F5F2EB] p-3 rounded-xl border border-[#D7CCC8] text-left text-xs space-y-1.5">
              <strong className="text-[#3E2723] block flex items-center gap-1.5 font-bold">
                <Smartphone className="w-4 h-4 text-[#8B5A2B]" />
                <span>How to Install on Mobile Device:</span>
              </strong>
              <p className="text-[11px] text-[#5D4037]">
                1. <strong>Scan with Phone Camera:</strong> Point your camera at the QR code above and tap the notification banner to open.
              </p>
              <p className="text-[11px] text-[#5D4037]">
                2. <strong>Android (Chrome):</strong> Tap menu <span className="font-mono font-bold">⋮</span> &rarr; tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
              </p>
              <p className="text-[11px] text-[#5D4037]">
                3. <strong>iPhone (Safari):</strong> Tap the <strong>Share</strong> button (box with up arrow) &rarr; tap <strong>"Add to Home Screen"</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyAppUrl}
                className="py-2.5 px-3 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Copy Direct URL'}</span>
              </button>

              {qrCodeDataUrl && (
                <a
                  href={qrCodeDataUrl}
                  download="RootsAndPots-Boda-Rider-App-QRCode.png"
                  className="py-2.5 px-3 bg-white hover:bg-[#D7CCC8]/40 text-[#3E2723] border border-[#BCAAA4] font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span>Download QR PNG</span>
                </a>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={`${window.location.origin}${window.location.pathname}#rider_portal`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#8B5A2B] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Test Rider App in New Tab</span>
              </a>

              <button
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-1.5 bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] rounded-xl text-xs font-semibold border border-[#BCAAA4] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Helper Modal: Add / Register New Rider
  function renderAddRiderModal() {
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

          <form onSubmit={handleRegisterRider} className="space-y-3.5 text-xs">
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
                <label className="block text-[#5D4037] mb-1 font-semibold">Direct Phone</label>
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
                  placeholder="KMDF 123Z (Boxer)"
                  value={newRiderBike}
                  onChange={(e) => setNewRiderBike(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#5D4037] mb-1 font-semibold">National ID / DL</label>
                <input
                  type="text"
                  placeholder="e.g. 32948102"
                  value={newRiderNationalId}
                  onChange={(e) => setNewRiderNationalId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

              <div>
                <label className="block text-[#5D4037] mb-1 font-semibold">4-Digit Login PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="e.g. 1234"
                  value={newRiderPin}
                  onChange={(e) => setNewRiderPin(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] font-mono tracking-widest focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#5D4037] mb-1 font-semibold">Base Location</label>
              <input
                type="text"
                placeholder="e.g. Arcadia Mall Stage"
                value={newRiderBase}
                onChange={(e) => setNewRiderBase(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
              />
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
              Register Rider to Active Fleet
            </button>
          </form>
        </div>
      </div>
    );
  }
};
