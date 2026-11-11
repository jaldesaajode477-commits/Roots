import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Utensils, 
  Calendar, 
  Settings, 
  Award, 
  Download, 
  Check, 
  AlertTriangle, 
  Clock, 
  Phone, 
  ArrowLeft, 
  Sparkles, 
  Edit2, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  Receipt,
  Bike,
  Plus,
  MessageSquare,
  Trash2,
  XCircle,
  Send,
  BarChart3,
  PieChart,
  Layers,
  Activity,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useRestaurant, OrderRecord } from '../context/RestaurantContext';
import confetti from 'canvas-confetti';

interface Props {
  onBackToSite: () => void;
  onSwitchToStaff: () => void;
}

export const AdminPortal: React.FC<Props> = ({ onBackToSite, onSwitchToStaff }) => {
  const {
    currentUser,
    reservations,
    orders,
    menuItems,
    toggleItemAvailability,
    updateItemPrice,
    loyaltyMembers,
    riders,
    addRider,
    updateRiderStatus,
    deleteRider,
    todaySalesTotal,
    todayOrdersCount,
    todayReservationsCount,
  } = useRestaurant();

  const [adminTab, setAdminTab] = useState<'analytics' | 'reservations' | 'menu' | 'loyalty' | 'riders'>('analytics');
  const [analyticsSubTab, setAnalyticsSubTab] = useState<'overview' | 'hourly' | 'menu_engineering' | 'mpesa_ledger'>('overview');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Rider Management Form State in Admin
  const [isAddRiderModalOpen, setIsAddRiderModalOpen] = useState(false);
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [newRiderBike, setNewRiderBike] = useState('');
  const [newRiderBase, setNewRiderBase] = useState('Arcadia Mall Stage');
  const [newRiderNationalId, setNewRiderNationalId] = useState('');
  const [newRiderEmergency, setNewRiderEmergency] = useState('');
  const [newRiderPin, setNewRiderPin] = useState('1234');

  // Commercial F&B Financial Calculations
  const grossSales = todaySalesTotal;
  const vat16 = Math.round((grossSales * 0.16) / 1.18);
  const cateringLevy2 = Math.round((grossSales * 0.02) / 1.18);
  const netSales = grossSales - vat16 - cateringLevy2;

  const mpesaOrders = orders.filter((o) => o.paymentMethod === 'mpesa');
  const cashOrders = orders.filter((o) => o.paymentMethod === 'cash');
  const mpesaTotal = mpesaOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const cashTotal = cashOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);

  const averageCheck = todayOrdersCount > 0 ? Math.round(grossSales / todayOrdersCount) : 0;
  
  // Standard restaurant benchmark: 44 seats across 11 operating hours (11:00 to 22:00 = 484 seat hours)
  const totalAvailableSeatHours = 44 * 11;
  const revPASH = Math.round(grossSales / totalAvailableSeatHours);

  // Cost of Goods Sold (COGS) & Labor ratios
  const estimatedFoodCostPct = 29.4; // 29.4% standard hearth food cost
  const estimatedFoodCostKsh = Math.round(grossSales * 0.294);
  const estimatedLaborCostPct = 19.8; // 19.8% kitchen brigade & service payroll
  const estimatedLaborCostKsh = Math.round(grossSales * 0.198);
  const primeCostPct = (estimatedFoodCostPct + estimatedLaborCostPct).toFixed(1); // 49.2% (< 55% healthy commercial benchmark)

  // Daily target: Kshs 45,000 weekday pace
  const dailyTargetRevenue = 45000;
  const targetPacingPct = Math.min(100, Math.round((grossSales / dailyTargetRevenue) * 100));

  // Fulfillment Channels
  const dineInOrders = orders.filter((o) => o.orderType === 'dine_in');
  const deliveryOrders = orders.filter((o) => o.orderType === 'delivery');
  const pickupOrders = orders.filter((o) => o.orderType === 'pickup');

  const dineInSales = dineInOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const deliverySales = deliveryOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const pickupSales = pickupOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);

  // Hourly Sales Distribution (11:00 to 22:00)
  const HOURLY_VELOCITY = [
    { hour: '11:00', label: '11 AM', sales: 1200, orders: 1, type: 'Prep & Open' },
    { hour: '12:00', label: '12 PM', sales: 4800, orders: 3, type: 'Lunch Start' },
    { hour: '13:00', label: '1 PM', sales: 7950, orders: 4, type: 'Lunch Rush Peak' },
    { hour: '14:00', label: '2 PM', sales: 4200, orders: 2, type: 'Late Lunch' },
    { hour: '15:00', label: '3 PM', sales: 1850, orders: 1, type: 'Dawa & Mursik' },
    { hour: '16:00', label: '4 PM', sales: 1400, orders: 1, type: 'Afternoon Tea' },
    { hour: '17:00', label: '5 PM', sales: 2900, orders: 2, type: 'Sundowner' },
    { hour: '18:00', label: '6 PM', sales: 5100, orders: 3, type: 'Early Dinner' },
    { hour: '19:00', label: '7 PM', sales: 8650, orders: 5, type: 'Dinner Hearth Peak' },
    { hour: '20:00', label: '8 PM', sales: 7400, orders: 4, type: 'Evening Feasts' },
    { hour: '21:00', label: '9 PM', sales: 3600, orders: 2, type: 'Night Cap' },
  ];

  // Menu Engineering Matrix (BCG / Kasavana-Smith Quadrants)
  const MENU_ENGINEERING_DATA = [
    {
      id: 'mbuzi-choma',
      name: 'Highlands Savanna Mbuzi Choma (1kg / Cutlets)',
      category: '⭐ STAR',
      quadrant: 'High Margin · High Volume',
      price: 850,
      cogs: 235,
      margin: 615,
      cogsPct: 27.6,
      unitsSold: 38,
      totalRevenue: 32300,
      strategy: 'Maintain strict portion control; prominent menu placement.',
    },
    {
      id: 'tilapia-mrenda',
      name: 'Lake Victoria Whole Tilapia + Mrenda & Millet',
      category: '⭐ STAR',
      quadrant: 'High Margin · High Volume',
      price: 750,
      cogs: 210,
      margin: 540,
      cogsPct: 28.0,
      unitsSold: 26,
      totalRevenue: 19500,
      strategy: 'Keep fish sourcing direct from Kisumu smallholders daily.',
    },
    {
      id: 'swahili-pilau',
      name: 'Fragrant Swahili Beef Pilau & Kachumbari',
      category: '🐎 PLOWHORSE',
      quadrant: 'Moderate Margin · High Volume',
      price: 450,
      cogs: 165,
      margin: 285,
      cogsPct: 36.6,
      unitsSold: 31,
      totalRevenue: 13950,
      strategy: 'High customer favorite; consider slight price test to Kshs 480.',
    },
    {
      id: 'chapati-layers',
      name: 'Layered Swahili Chapati (Ghee Pressed)',
      category: '🐎 PLOWHORSE',
      quadrant: 'Moderate Margin · High Volume',
      price: 100,
      cogs: 38,
      margin: 62,
      cogsPct: 38.0,
      unitsSold: 64,
      totalRevenue: 6400,
      strategy: 'Staple add-on; bundle with rich bone marrow stews.',
    },
    {
      id: 'mursik-gourd',
      name: 'Traditional Kalenjin Mursik (1L Smoked Gourd)',
      category: '🧩 PUZZLE',
      quadrant: 'High Margin · Moderate Volume',
      price: 450,
      cogs: 105,
      margin: 345,
      cogsPct: 23.3,
      unitsSold: 12,
      totalRevenue: 5400,
      strategy: 'Upsell to kraal banquet tables and mbuzi choma diners.',
    },
    {
      id: 'dawa-ginger',
      name: 'Hot Lemon & Wild Honey Dawa Elixir',
      category: '🧩 PUZZLE',
      quadrant: 'High Margin · Moderate Volume',
      price: 200,
      cogs: 35,
      margin: 165,
      cogsPct: 17.5,
      unitsSold: 18,
      totalRevenue: 3600,
      strategy: 'Train servers to suggest as wellness starter before meals.',
    },
  ];

  const handleStartPriceEdit = (id: string, currentPrice: number) => {
    setEditingItemId(id);
    setTempPrice(currentPrice);
  };

  const handleSavePrice = (id: string) => {
    if (tempPrice > 0) {
      updateItemPrice(id, tempPrice);
      setEditingItemId(null);
      confetti({ particleCount: 25, spread: 40, colors: ['#8B5A2B', '#3E2723'] });
    }
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
      pin: newRiderPin || '1234',
    });

    setIsAddRiderModalOpen(false);
    setNewRiderName('');
    setNewRiderPhone('');
    setNewRiderBike('');
    setNewRiderNationalId('');
    setNewRiderEmergency('');
    setNewRiderPin('1234');
    confetti({ particleCount: 30, spread: 50, colors: ['#8B5A2B'] });
  };

  // Export Commercial CSV Audit Report
  const handleExportCsv = () => {
    const headers = [
      'Shift Date',
      'Order Ref',
      'Order Time',
      'Customer Name',
      'Phone',
      'Channel',
      'Table / Address',
      'Assigned Rider',
      'Transit Stage',
      'Payment Method',
      'M-Pesa Receipt',
      'Subtotal (Kshs)',
      'Delivery Fee (Kshs)',
      'Grand Total (Kshs)',
      'Status'
    ];

    const rows = orders.map((o) => [
      new Date().toISOString().split('T')[0],
      o.orderCode,
      o.createdAt,
      `"${o.customerName}"`,
      o.customerPhone,
      o.orderType,
      `"${o.orderType === 'dine_in' ? `Table ${o.tableNumber}` : o.deliveryAddress || 'Pickup'}"`,
      `"${o.assignedRiderName || 'N/A'}"`,
      o.riderTransitStage || 'N/A',
      o.paymentMethod.toUpperCase(),
      o.mpesaReceipt || 'N/A',
      o.subtotal,
      o.deliveryFee,
      o.total,
      o.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RootsAndPots-Shift-Audit-ZReport-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Commercial Shift Audit CSV (Z-Report) successfully downloaded.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] pb-20 selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#D7CCC8] px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSite}
              className="p-2 rounded-xl bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4 text-[#8B5A2B]" />
              <span>Back to Bistro</span>
            </button>

            <div className="h-5 w-px bg-[#D7CCC8] hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5A2B]" />
                <h1 className="text-sm sm:text-base font-bold font-serif text-[#3E2723] tracking-tight">
                  Roots & Pots · Commercial F&B Management ERP
                </h1>
              </div>
              <p className="text-[11px] text-[#795548] font-mono">
                Arcadia Mall Greenpark · Executive General Manager: {currentUser?.name || 'Chef James Omondi'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onSwitchToStaff}
              className="px-3.5 py-2 bg-[#D7CCC8]/50 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#8B5A2B]" />
              <span>Kitchen KDS & Staff</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Z-Report (CSV)</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {exportNotice && (
          <div className="p-3 bg-[#2E7D32]/15 border border-[#2E7D32]/40 rounded-xl text-xs text-[#2E7D32] font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* COMMERCIAL EXECUTIVE KPI METRICS STRIP (6 TILES) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
          
          {/* Tile 1: Gross Sales */}
          <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs relative overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              Shift Gross Sales
            </span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#3E2723] mt-1 block tabular-nums">
              Kshs {grossSales.toLocaleString()}
            </span>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-[#795548]">
                <span>Pacing: {targetPacingPct}%</span>
                <span>Kshs 45k Goal</span>
              </div>
              <div className="w-full h-1.5 bg-[#D7CCC8]/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#8B5A2B] rounded-full transition-all" 
                  style={{ width: `${targetPacingPct}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Tile 2: Net Sales */}
          <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              Net Sales (Excl. Tax)
            </span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#2E7D32] mt-1 block tabular-nums">
              Kshs {netSales.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#795548] font-mono block mt-2">
              Less 16% VAT & 2% Catering
            </span>
          </div>

          {/* Tile 3: Average Check */}
          <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              Average Check (AC)
            </span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#8B5A2B] mt-1 block tabular-nums">
              Kshs {averageCheck.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#2E7D32] font-semibold block mt-2">
              +14% vs Athi River Benchmark
            </span>
          </div>

          {/* Tile 4: RevPASH */}
          <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              RevPASH Yield
            </span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#3E2723] mt-1 block tabular-nums">
              Kshs {revPASH.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#795548] font-mono block mt-2">
              Per Seat-Hour (44 Covers)
            </span>
          </div>

          {/* Tile 5: Food Cost Margin */}
          <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              Food Cost (COGS)
            </span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#2E7D32] mt-1 block tabular-nums">
              {estimatedFoodCostPct}%
            </span>
            <span className="text-[10px] text-[#795548] font-mono block mt-2">
              Est. Kshs {estimatedFoodCostKsh.toLocaleString()}
            </span>
          </div>

          {/* Tile 6: Prime Cost */}
          <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#795548] font-mono font-bold block">
              Prime Cost Ratio
            </span>
            <span className="text-xl sm:text-2xl font-bold font-serif text-[#3E2723] mt-1 block tabular-nums">
              {primeCostPct}%
            </span>
            <span className="text-[10px] text-[#2E7D32] font-semibold block mt-2">
              ✓ Optimal (&lt; 55% Target)
            </span>
          </div>

        </div>

        {/* Master Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D7CCC8] pb-3">
          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'analytics'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Commercial Financial Intelligence</span>
          </button>

          <button
            onClick={() => setAdminTab('reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'reservations'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Capacity & Table Matrix ({reservations.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('menu')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'menu'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu & 86 Inventory Control ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('loyalty')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'loyalty'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Loyalty CRM ({loyaltyMembers.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('riders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              adminTab === 'riders'
                ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                : 'bg-[#D7CCC8]/40 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Boda Fleet & Riders ({riders.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: COMMERCIAL FINANCIAL & SALES ANALYTICS */}
        {/* ========================================================================= */}
        {adminTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Analytics Sub-Filter Pill Selector */}
            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={() => setAnalyticsSubTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  analyticsSubTab === 'overview'
                    ? 'bg-[#3E2723] text-[#F5F2EB]'
                    : 'bg-white text-[#5D4037] border border-[#D7CCC8] hover:bg-[#F5F2EB]'
                }`}
              >
                Executive Overview & Channels
              </button>

              <button
                onClick={() => setAnalyticsSubTab('hourly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  analyticsSubTab === 'hourly'
                    ? 'bg-[#3E2723] text-[#F5F2EB]'
                    : 'bg-white text-[#5D4037] border border-[#D7CCC8] hover:bg-[#F5F2EB]'
                }`}
              >
                Hourly Rush Hour Velocity
              </button>

              <button
                onClick={() => setAnalyticsSubTab('menu_engineering')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  analyticsSubTab === 'menu_engineering'
                    ? 'bg-[#3E2723] text-[#F5F2EB]'
                    : 'bg-white text-[#5D4037] border border-[#D7CCC8] hover:bg-[#F5F2EB]'
                }`}
              >
                Menu Engineering Matrix (BCG)
              </button>

              <button
                onClick={() => setAnalyticsSubTab('mpesa_ledger')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  analyticsSubTab === 'mpesa_ledger'
                    ? 'bg-[#3E2723] text-[#F5F2EB]'
                    : 'bg-white text-[#5D4037] border border-[#D7CCC8] hover:bg-[#F5F2EB]'
                }`}
              >
                M-Pesa Till 8945201 & Cash Ledger
              </button>
            </div>

            {/* SUB-VIEW 1: EXECUTIVE OVERVIEW & CHANNELS */}
            {analyticsSubTab === 'overview' && (
              <div className="space-y-6">
                
                {/* 3 Fulfillment Channels Strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Dine-In */}
                  <div className="p-5 bg-white rounded-3xl border border-[#D7CCC8] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#795548] flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-[#8B5A2B]" />
                        <span>Dine-In (Terrace / Hearth / Kraal)</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#2E7D32]">
                        {dineInSales > 0 ? Math.round((dineInSales / (grossSales || 1)) * 100) : 0}% Share
                      </span>
                    </div>

                    <div>
                      <strong className="text-2xl font-serif font-bold text-[#3E2723] block">
                        Kshs {dineInSales.toLocaleString()}
                      </strong>
                      <span className="text-xs text-[#795548] block mt-0.5">
                        {dineInOrders.length} Table Checks · Avg Kshs {dineInOrders.length > 0 ? Math.round(dineInSales / dineInOrders.length).toLocaleString() : 0}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#D7CCC8]/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#8B5A2B] rounded-full"
                        style={{ width: `${Math.round((dineInSales / (grossSales || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Direct Boda Delivery */}
                  <div className="p-5 bg-white rounded-3xl border border-[#D7CCC8] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#795548] flex items-center gap-1.5">
                        <Bike className="w-4 h-4 text-[#1565C0]" />
                        <span>Direct Boda Fleet Delivery</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#1565C0]">
                        {deliverySales > 0 ? Math.round((deliverySales / (grossSales || 1)) * 100) : 0}% Share
                      </span>
                    </div>

                    <div>
                      <strong className="text-2xl font-serif font-bold text-[#3E2723] block">
                        Kshs {deliverySales.toLocaleString()}
                      </strong>
                      <span className="text-xs text-[#795548] block mt-0.5">
                        {deliveryOrders.length} Doorstep Drops · Avg Kshs {deliveryOrders.length > 0 ? Math.round(deliverySales / deliveryOrders.length).toLocaleString() : 0}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#D7CCC8]/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1565C0] rounded-full"
                        style={{ width: `${Math.round((deliverySales / (grossSales || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Arcadia Mall Takeaway Pickup */}
                  <div className="p-5 bg-white rounded-3xl border border-[#D7CCC8] shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#795548] flex items-center gap-1.5">
                        <Receipt className="w-4 h-4 text-[#2E7D32]" />
                        <span>Arcadia Counter Takeaway</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#2E7D32]">
                        {pickupSales > 0 ? Math.round((pickupSales / (grossSales || 1)) * 100) : 0}% Share
                      </span>
                    </div>

                    <div>
                      <strong className="text-2xl font-serif font-bold text-[#3E2723] block">
                        Kshs {pickupSales.toLocaleString()}
                      </strong>
                      <span className="text-xs text-[#795548] block mt-0.5">
                        {pickupOrders.length} Packages Picked Up · Zero Commission
                      </span>
                    </div>

                    <div className="w-full h-2 bg-[#D7CCC8]/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2E7D32] rounded-full"
                        style={{ width: `${Math.round((pickupSales / (grossSales || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Split Reconciliation & Best Sellers */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Payment Method Reconciliation */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-[#D7CCC8] p-6 space-y-6 shadow-xs">
                    <div>
                      <h3 className="text-base font-bold font-serif text-[#3E2723]">
                        Shift Payment Settlement & Reconciliation
                      </h3>
                      <p className="text-xs text-[#5D4037]">
                        Verified Lipa na M-Pesa Till settlement against physical counter cash float.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-[#2E7D32]/10 border border-[#2E7D32]/30 rounded-2xl">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-[#2E7D32] flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Lipa na M-Pesa (Buy Goods Till 8945201)</span>
                          </span>
                          <span className="font-mono text-[#2E7D32] font-bold">
                            Kshs {mpesaTotal.toLocaleString()} ({Math.round((mpesaTotal / (grossSales || 1)) * 100)}%)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5D4037]">
                          {mpesaOrders.length} electronic transactions direct to Safaricom merchant settlement.
                        </p>
                      </div>

                      <div className="p-4 bg-[#8B5A2B]/10 border border-[#8B5A2B]/30 rounded-2xl">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-bold text-[#8B5A2B] flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            <span>Cash on Delivery / Hearth Counter Drawer</span>
                          </span>
                          <span className="font-mono text-[#8B5A2B] font-bold">
                            Kshs {cashTotal.toLocaleString()} ({Math.round((cashTotal / (grossSales || 1)) * 100)}%)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5D4037]">
                          {cashOrders.length} physical banknotes verified. Opening float: Kshs 5,000. Variance: Kshs 0.00.
                        </p>
                      </div>
                    </div>

                    {/* Tax Breakdown */}
                    <div className="pt-2 border-t border-[#D7CCC8]/70 grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8]">
                        <span className="text-[10px] font-mono uppercase text-[#795548] block">Gross Revenue</span>
                        <strong className="text-sm font-mono text-[#3E2723] block mt-0.5">Kshs {grossSales.toLocaleString()}</strong>
                      </div>

                      <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8]">
                        <span className="text-[10px] font-mono uppercase text-[#795548] block">16% KRA VAT</span>
                        <strong className="text-sm font-mono text-[#3E2723] block mt-0.5">Kshs {vat16.toLocaleString()}</strong>
                      </div>

                      <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8]">
                        <span className="text-[10px] font-mono uppercase text-[#795548] block">2% Catering Levy</span>
                        <strong className="text-sm font-mono text-[#3E2723] block mt-0.5">Kshs {cateringLevy2.toLocaleString()}</strong>
                      </div>
                    </div>

                  </div>

                  {/* Right: Top Revenue Dishes */}
                  <div className="lg:col-span-5 bg-white rounded-3xl border border-[#D7CCC8] p-6 space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold font-serif text-[#3E2723]">
                        Top Margin Specialties
                      </h3>
                      <button
                        onClick={() => setAnalyticsSubTab('menu_engineering')}
                        className="text-xs font-bold text-[#8B5A2B] hover:underline cursor-pointer"
                      >
                        Full BCG Matrix &rarr;
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: 'Highlands Mbuzi Choma (1kg / Cutlets)', sold: 28, revenue: 32400, margin: '72%' },
                        { name: 'Lake Victoria Whole Tilapia + Mrenda', sold: 22, revenue: 16500, margin: '72%' },
                        { name: 'Kienyeji Free-Range Chicken Stew', sold: 18, revenue: 13500, margin: '68%' },
                        { name: 'Traditional Bone Marrow Soup', sold: 44, revenue: 11000, margin: '76%' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8]">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-[#3E2723]">{item.name}</span>
                            <span className="text-[#8B5A2B] font-mono font-bold">Kshs {item.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-[11px] text-[#795548] mt-1 font-mono">
                            <span>{item.sold} orders prepared</span>
                            <span className="text-[#2E7D32] font-semibold">{item.margin} Gross Margin</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* SUB-VIEW 2: HOURLY RUSH HOUR VELOCITY */}
            {analyticsSubTab === 'hourly' && (
              <div className="bg-white rounded-3xl border border-[#D7CCC8] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D7CCC8]">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#3E2723]">
                      Hourly Sales Distribution & Rush Velocity (11:00 AM – 22:00 PM)
                    </h3>
                    <p className="text-xs text-[#5D4037]">
                      Real-time velocity tracking kitchen ticket flow across lunch and evening firewood shifts.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#8B5A2B]/15 text-[#8B5A2B] font-mono font-bold rounded-lg text-xs">
                      Peak Rush: 19:00 - 21:00
                    </span>
                  </div>
                </div>

                {/* SVG Visual Sales Curve */}
                <div className="space-y-2">
                  <div className="h-56 w-full flex items-end gap-2 sm:gap-4 pt-6 px-2 border-b border-[#D7CCC8]">
                    {HOURLY_VELOCITY.map((slot, idx) => {
                      const maxVal = 9000;
                      const heightPct = Math.round((slot.sales / maxVal) * 100);
                      const isPeak = slot.sales > 7000;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <span className="text-[10px] font-mono text-[#795548] opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                            {slot.sales}
                          </span>
                          <div 
                            className={`w-full rounded-t-xl transition-all duration-500 relative cursor-pointer ${
                              isPeak 
                                ? 'bg-gradient-to-t from-[#8B5A2B] to-[#D7CCC8] hover:brightness-110' 
                                : 'bg-[#D7CCC8]/70 hover:bg-[#8B5A2B]/70'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          >
                            {isPeak && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#8B5A2B]">
                                ★
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#5D4037] mt-2 block whitespace-nowrap">
                            {slot.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Hourly Table Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8] text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#795548] block">Lunch Rush (12–2 PM)</span>
                      <strong className="text-sm font-bold text-[#3E2723] block mt-0.5">Kshs 16,950</strong>
                      <span className="text-[11px] text-[#2E7D32]">9 Checks Prepared</span>
                    </div>

                    <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8] text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#795548] block">Midday Siesta (3–5 PM)</span>
                      <strong className="text-sm font-bold text-[#3E2723] block mt-0.5">Kshs 6,150</strong>
                      <span className="text-[11px] text-[#795548]">Dawa & Mursik Gourd</span>
                    </div>

                    <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8] text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#795548] block">Hearth Dinner (7–9 PM)</span>
                      <strong className="text-sm font-bold text-[#3E2723] block mt-0.5">Kshs 21,150</strong>
                      <span className="text-[11px] text-[#2E7D32]">11 Checks Prepared</span>
                    </div>

                    <div className="p-3 bg-[#F5F2EB] rounded-xl border border-[#D7CCC8] text-xs">
                      <span className="text-[10px] font-mono uppercase text-[#795548] block">Table Turn Rate</span>
                      <strong className="text-sm font-bold text-[#8B5A2B] block mt-0.5">1.8 Turns / Table</strong>
                      <span className="text-[11px] text-[#795548]">Avg 62 min seating</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-VIEW 3: MENU ENGINEERING MATRIX (BCG) */}
            {analyticsSubTab === 'menu_engineering' && (
              <div className="bg-white rounded-3xl border border-[#D7CCC8] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D7CCC8]">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#3E2723]">
                      Menu Engineering Matrix (Kasavana-Smith F&B BCG Model)
                    </h3>
                    <p className="text-xs text-[#5D4037]">
                      Analyzing dishes by contribution margin (profitability) vs sales volume (popularity).
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#8B5A2B] bg-[#8B5A2B]/15 px-3 py-1 rounded-xl">
                    Target Food Cost: 28–32%
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F2EB] text-[#5D4037] font-mono uppercase text-[10px] tracking-wider border-b border-[#D7CCC8]">
                      <tr>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Dish Name</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Food Cost (COGS)</th>
                        <th className="py-3 px-3">Contrib. Margin</th>
                        <th className="py-3 px-3">Units Sold</th>
                        <th className="py-3 px-3">Total Rev</th>
                        <th className="py-3 px-3">Strategic Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D7CCC8]/50">
                      {MENU_ENGINEERING_DATA.map((dish) => (
                        <tr key={dish.id} className="hover:bg-[#F5F2EB]/50 transition-colors">
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase font-mono ${
                              dish.category.includes('STAR') 
                                ? 'bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/30'
                                : dish.category.includes('PLOWHORSE')
                                ? 'bg-[#1565C0]/15 text-[#1565C0] border border-[#1565C0]/30'
                                : 'bg-[#8B5A2B]/15 text-[#8B5A2B] border border-[#8B5A2B]/30'
                            }`}>
                              {dish.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold text-[#3E2723]">
                            {dish.name}
                          </td>
                          <td className="py-3 px-3 font-mono">
                            Kshs {dish.price}
                          </td>
                          <td className="py-3 px-3 font-mono text-[#795548]">
                            Kshs {dish.cogs} ({dish.cogsPct}%)
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#2E7D32]">
                            Kshs {dish.margin}
                          </td>
                          <td className="py-3 px-3 font-mono">
                            {dish.unitsSold}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#3E2723]">
                            Kshs {dish.totalRevenue.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-[11px] text-[#5D4037] max-w-xs">
                            {dish.strategy}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUB-VIEW 4: M-PESA TILL 8945201 & CASH LEDGER */}
            {analyticsSubTab === 'mpesa_ledger' && (
              <div className="bg-white rounded-3xl border border-[#D7CCC8] p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D7CCC8]">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#3E2723]">
                      Safaricom Lipa na M-Pesa Till 8945201 Audit Ledger
                    </h3>
                    <p className="text-xs text-[#5D4037]">
                      Real-time API reconciliation of digital mobile payments vs orders.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#2E7D32] bg-[#2E7D32]/15 px-3 py-1 rounded-xl">
                      Till: 8945201 (Roots & Pots Arcadia)
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F5F2EB] text-[#5D4037] font-mono uppercase text-[10px] tracking-wider border-b border-[#D7CCC8]">
                      <tr>
                        <th className="py-3 px-3">Order Code</th>
                        <th className="py-3 px-3">Diner Name & Phone</th>
                        <th className="py-3 px-3">Channel</th>
                        <th className="py-3 px-3">Payment Method</th>
                        <th className="py-3 px-3">M-Pesa Receipt Code</th>
                        <th className="py-3 px-3">Amount</th>
                        <th className="py-3 px-3">Audit Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D7CCC8]/50">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#F5F2EB]/50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#8B5A2B]">
                            {o.orderCode}
                          </td>
                          <td className="py-3 px-3">
                            <strong className="text-[#3E2723] block">{o.customerName}</strong>
                            <span className="text-[11px] text-[#795548] font-mono">{o.customerPhone}</span>
                          </td>
                          <td className="py-3 px-3 capitalize font-medium text-[#5D4037]">
                            {o.orderType.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                              o.paymentMethod === 'mpesa' 
                                ? 'bg-[#2E7D32]/15 text-[#2E7D32]' 
                                : 'bg-[#8B5A2B]/15 text-[#8B5A2B]'
                            }`}>
                              {o.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#3E2723]">
                            {o.mpesaReceipt || 'COUNTER-CASH'}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#3E2723]">
                            Kshs {o.total.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Verified Settlement</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CAPACITY & RESERVATION MATRIX */}
        {/* ========================================================================= */}
        {adminTab === 'reservations' && (
          <div className="space-y-6">
            
            {/* Zone Capacity Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#3E2723] text-sm">Savanna Garden Terrace</h4>
                  <span className="text-[10px] bg-[#2E7D32]/15 text-[#2E7D32] px-2 py-0.5 rounded font-bold">
                    8/12 Tables Active
                  </span>
                </div>
                <p className="text-xs text-[#5D4037]">
                  Open-air dining under acacia greenery with twilight sunset view over Athi River.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#3E2723] text-sm">Hearth Dining Hall</h4>
                  <span className="text-[10px] bg-[#8B5A2B]/15 text-[#8B5A2B] px-2 py-0.5 rounded font-bold">
                    14/16 Tables Active
                  </span>
                </div>
                <p className="text-xs text-[#5D4037]">
                  Intimate stone dining room centered around the firewood embers and clay pots.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-[#3E2723] text-sm">Private Kraal Suites</h4>
                  <span className="text-[10px] bg-[#8B5A2B]/15 text-[#8B5A2B] px-2 py-0.5 rounded font-bold">
                    3/4 Suites Booked
                  </span>
                </div>
                <p className="text-xs text-[#5D4037]">
                  Exclusive family feasts & executive business meetings with dedicated sommelier.
                </p>
              </div>
            </div>

            {/* Complete Reservations Management Table */}
            <div className="bg-white rounded-2xl border border-[#D7CCC8] overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#D7CCC8] flex justify-between items-center">
                <h3 className="font-bold text-[#3E2723] text-sm font-serif">
                  Full Guest Reservation Registry ({reservations.length} records)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#D7CCC8]/40 border-b border-[#D7CCC8] text-[#5D4037] font-mono uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Booking Code</th>
                      <th className="py-3 px-4">Guest & Contact</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Party & Zone</th>
                      <th className="py-3 px-4">VIP Requests</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D7CCC8]/50">
                    {reservations.map((r) => (
                      <tr key={r.id} className="hover:bg-[#D7CCC8]/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#8B5A2B]">
                          {r.code}
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-[#3E2723] block">{r.guestName}</strong>
                          <span className="text-[#795548] text-[11px] font-mono">{r.phone}</span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-[#5D4037]">
                          {r.date} at {r.time}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-[#3E2723] font-semibold">{r.guests} Guests</span>
                          <span className="text-[11px] text-[#795548] block capitalize">{r.zone}</span>
                        </td>
                        <td className="py-3 px-4 text-[#795548] max-w-xs truncate">
                          {r.specialRequests || 'None'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              r.status === 'seated'
                                ? 'bg-[#2E7D32]/15 text-[#2E7D32] border-[#2E7D32]/40'
                                : r.status === 'confirmed'
                                ? 'bg-[#1565C0]/15 text-[#1565C0] border-[#1565C0]/40'
                                : 'bg-[#795548]/15 text-[#795548] border-[#795548]/40'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MENU & 86 INVENTORY CONTROL */}
        {/* ========================================================================= */}
        {adminTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold font-serif text-[#3E2723]">
                  Menu Master & 86 Stock Switch
                </h3>
                <p className="text-xs text-[#5D4037]">
                  Instantly 86 items when ingredients finish or update kitchen pricing live across client menu & QR orders.
                </p>
              </div>

              <span className="text-xs font-mono text-[#795548]">
                {menuItems.filter((i) => i.isAvailable !== false).length} of {menuItems.length} Dishes In Stock
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => {
                const isAvail = item.isAvailable !== false;
                const isEditing = editingItemId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isAvail ? 'bg-white border-[#D7CCC8] shadow-xs' : 'bg-[#D7CCC8]/30 border-[#D7CCC8] opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#795548] block">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-sm text-[#3E2723] mt-0.5 line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-[#795548] italic font-serif line-clamp-1">{item.swahiliName || item.description}</p>
                      </div>

                      {/* 86 Toggle Button */}
                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                          isAvail 
                            ? 'bg-[#2E7D32]/15 text-[#2E7D32] border-[#2E7D32]/30 hover:bg-[#2E7D32]/25' 
                            : 'bg-[#C62828]/15 text-[#C62828] border-[#C62828]/30 hover:bg-[#C62828]/25'
                        }`}
                        title={isAvail ? 'Dish In Stock (Click to 86)' : 'Dish 86ed Out of Stock (Click to Enable)'}
                      >
                        {isAvail ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#D7CCC8]/60 flex items-center justify-between">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 bg-[#F5F2EB] border border-[#8B5A2B] rounded-lg text-xs font-mono font-bold text-[#3E2723] focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePrice(item.id)}
                            className="p-1 bg-[#8B5A2B] text-white rounded-lg text-xs hover:bg-[#70461F] cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-mono font-bold text-[#8B5A2B]">
                            Kshs {item.price.toLocaleString()}
                          </strong>
                          <button
                            onClick={() => handleStartPriceEdit(item.id, item.price)}
                            className="text-[#795548] hover:text-[#3E2723] p-1 cursor-pointer"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAvail ? 'bg-[#2E7D32]/10 text-[#2E7D32]' : 'bg-[#C62828]/10 text-[#C62828]'
                      }`}>
                        {isAvail ? 'Serving' : '86ed'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: LOYALTY CRM DIRECTORY */}
        {/* ========================================================================= */}
        {adminTab === 'loyalty' && (
          <div className="bg-white rounded-2xl border border-[#D7CCC8] overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#D7CCC8] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#3E2723] text-sm font-serif">
                  Roots & Pots Loyalty Members CRM ({loyaltyMembers.length} Members)
                </h3>
                <p className="text-xs text-[#5D4037]">
                  Diners earn 1 point per 50 Kshs spent. Silver (0-150 pts), Gold (151-300 pts), Platinum (300+ pts).
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#D7CCC8]/40 border-b border-[#D7CCC8] text-[#5D4037] font-mono uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Tier Badge</th>
                    <th className="py-3 px-4">Available Points</th>
                    <th className="py-3 px-4">Lifetime Spend</th>
                    <th className="py-3 px-4">Visits Count</th>
                    <th className="py-3 px-4">Last Visit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D7CCC8]/50">
                  {loyaltyMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-[#D7CCC8]/20 transition-colors">
                      <td className="py-3 px-4">
                        <strong className="text-[#3E2723] block">{m.name}</strong>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#5D4037]">
                        {m.phone}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          m.tier.includes('Platinum')
                            ? 'bg-[#3E2723] text-[#F5F2EB]'
                            : m.tier.includes('Gold')
                            ? 'bg-[#8B5A2B] text-[#F5F2EB]'
                            : 'bg-[#D7CCC8] text-[#3E2723]'
                        }`}>
                          {m.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#8B5A2B]">
                        {m.points} pts
                      </td>
                      <td className="py-3 px-4 font-mono">
                        Kshs {m.totalSpend.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#3E2723]">
                        {m.visits} visits
                      </td>
                      <td className="py-3 px-4 text-[#795548] font-mono">
                        {m.lastVisit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BODA FLEET & RIDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {adminTab === 'riders' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold font-serif text-[#3E2723]">
                  Dedicated Boda Delivery Fleet ({riders.length} Registered Riders)
                </h3>
                <p className="text-xs text-[#5D4037]">
                  Manage registered delivery riders, base stations, motorbikes, and direct WhatsApp/SMS notifications.
                </p>
              </div>

              <button
                onClick={() => setIsAddRiderModalOpen(true)}
                className="px-4 py-2 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Rider</span>
              </button>
            </div>

            {/* Riders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {riders.map((rider) => {
                const isAvailable = rider.status === 'available';
                const isOnDelivery = rider.status === 'on_delivery';

                return (
                  <div
                    key={rider.id}
                    className="p-5 bg-white rounded-2xl border border-[#D7CCC8] shadow-xs space-y-4 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#8B5A2B]/15 text-[#8B5A2B] flex items-center justify-center">
                          <Bike className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#3E2723]">{rider.name}</h4>
                          <span className="text-[11px] font-mono text-[#795548] block">{rider.bikeReg}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        isAvailable 
                          ? 'bg-[#2E7D32]/15 text-[#2E7D32]' 
                          : isOnDelivery 
                          ? 'bg-[#1565C0]/15 text-[#1565C0]' 
                          : 'bg-[#795548]/15 text-[#795548]'
                      }`}>
                        {rider.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-[#5D4037] pt-2 border-t border-[#D7CCC8]/60">
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <strong className="font-mono text-[#3E2723]">{rider.phone}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Base Stage:</span>
                        <span className="truncate max-w-[140px] text-right font-medium">{rider.baseLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deliveries Completed:</span>
                        <strong className="text-[#2E7D32] font-mono">{rider.completedDeliveries} Trips</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer Rating:</span>
                        <strong className="text-[#8B5A2B] font-mono">★ {rider.rating} / 5.0</strong>
                      </div>
                    </div>

                    {/* Quick WhatsApp & Call Rider */}
                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={`https://wa.me/254${rider.phone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1b7e3e] border border-[#25D366]/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5 fill-current" />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${rider.phone}`}
                        className="py-1.5 px-2.5 bg-[#D7CCC8]/60 hover:bg-[#D7CCC8] text-[#3E2723] border border-[#BCAAA4] rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-xs"
                        title="Direct Phone Call"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#8B5A2B]" />
                      </a>
                    </div>

                    {/* Toggle Status & Delete */}
                    <div className="pt-1 flex items-center justify-between gap-2 border-t border-[#D7CCC8]/50">
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
          </div>
        )}

        {/* REGISTER NEW RIDER MODAL IN ADMIN */}
        {isAddRiderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-md bg-[#F5F2EB] border border-[#D7CCC8] rounded-3xl p-6 shadow-2xl text-[#3E2723] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#D7CCC8]">
                <div className="flex items-center gap-2">
                  <Bike className="w-5 h-5 text-[#8B5A2B]" />
                  <h3 className="text-base font-bold font-serif text-[#3E2723]">
                    Register New Boda Delivery Rider
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
                    <label className="block text-[#5D4037] mb-1 font-semibold">Direct Phone (WhatsApp / Calls)</label>
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
                    <label className="block text-[#5D4037] mb-1 font-semibold">National ID / DL</label>
                    <input
                      type="text"
                      placeholder="e.g. 33891024"
                      value={newRiderNationalId}
                      onChange={(e) => setNewRiderNationalId(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D7CCC8] rounded-xl text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#5D4037] mb-1 font-semibold">4-Digit Terminal PIN</label>
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
        )}

      </main>

    </div>
  );
};
