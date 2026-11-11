import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MENU_ITEMS as INITIAL_MENU_ITEMS, MenuItem } from '../data/menuData';

export type UserRole = 'guest' | 'staff' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
}

export type ReservationStatus = 'confirmed' | 'seated' | 'completed' | 'cancelled';
export type DiningZone = 'terrace' | 'hearth' | 'kraal';

export interface Reservation {
  id: string;
  code: string;
  guestName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  zone: DiningZone;
  tableAssigned?: string;
  status: ReservationStatus;
  specialRequests?: string;
  isVIP?: boolean;
  createdAt: string;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'en_route' | 'completed' | 'cancelled';
export type OrderType = 'dine_in' | 'delivery' | 'pickup';

export interface OrderItemRecord {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customization?: string;
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  orderType: OrderType;
  items: OrderItemRecord[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'mpesa' | 'cash';
  mpesaReceipt?: string;
  status: OrderStatus;
  tableNumber?: string;
  assignedRiderId?: string;
  assignedRiderName?: string;
  assignedRiderPhone?: string;
  assignedRiderBike?: string;
  dispatchCallStatus?: 'none' | 'calling' | 'confirmed' | 'escalated';
  riderTransitStage?: 'assigned' | 'picked_up' | 'arrived_at_gate' | 'delivered';
  specialInstructions?: string;
  createdAt: string;
}

export interface DeliveryRider {
  id: string;
  name: string;
  phone: string;
  bikeReg: string;
  status: 'available' | 'on_delivery' | 'offline';
  rating: number;
  completedDeliveries: number;
  currentOrderId?: string;
  baseLocation: string;
  nationalId?: string;
  emergencyContact?: string;
  pin?: string;
}

export interface LoyaltyMember {
  id: string;
  name: string;
  phone: string;
  points: number;
  tier: 'Mwiko Silver' | 'Chungu Gold' | 'Mababu Platinum';
  totalSpend: number;
  visits: number;
  lastVisit: string;
}

interface RestaurantContextType {
  currentUser: UserProfile | null;
  loginAs: (role: 'staff' | 'admin', customName?: string) => void;
  logout: () => void;
  
  // Reservations
  reservations: Reservation[];
  addReservation: (res: Omit<Reservation, 'id' | 'code' | 'createdAt' | 'status'>) => Reservation;
  updateReservationStatus: (id: string, status: ReservationStatus, table?: string) => void;
  cancelReservation: (id: string) => void;
  
  // Orders & Sales
  orders: OrderRecord[];
  addOrder: (order: Omit<OrderRecord, 'id' | 'orderCode' | 'createdAt' | 'status'>) => OrderRecord;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  assignRiderToOrder: (orderId: string, riderId: string, callStatus?: 'confirmed' | 'escalated') => void;
  updateRiderTransitStage: (orderId: string, stage: 'assigned' | 'picked_up' | 'arrived_at_gate' | 'delivered', note?: string) => void;
  confirmDeliveryByRider: (orderId: string, riderId: string, notes?: string) => void;
  generateRiderNotification: (riderId: string, orderId: string, channel: 'whatsapp' | 'sms') => { url: string; text: string };
  
  // Real-time Active Client Order Tracking
  activeClientOrderId: string | null;
  setActiveClientOrderId: (id: string | null) => void;
  activeClientOrder: OrderRecord | null;
  clearActiveClientOrder: () => void;

  // Saved Riders Management
  riders: DeliveryRider[];
  addRider: (rider: Omit<DeliveryRider, 'id' | 'completedDeliveries' | 'rating'>) => DeliveryRider;
  updateRiderStatus: (riderId: string, status: 'available' | 'on_delivery' | 'offline') => void;
  deleteRider: (riderId: string) => void;

  // Menu Master
  menuItems: (MenuItem & { isAvailable?: boolean })[];
  toggleItemAvailability: (id: string) => void;
  updateItemPrice: (id: string, newPrice: number) => void;

  // Loyalty
  loyaltyMembers: LoyaltyMember[];
  registerLoyaltyMember: (name: string, phone: string) => LoyaltyMember;

  // Analytics Helpers
  todaySalesTotal: number;
  todayOrdersCount: number;
  todayReservationsCount: number;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Initial Seed Reservations for today & tomorrow
const SEED_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    code: 'RP-ATHI-8291',
    guestName: 'Senator Mutua & Family',
    phone: '0722 341 890',
    email: 'mutua.family@kenya.org',
    date: '2026-11-08',
    time: '19:30',
    guests: 6,
    zone: 'kraal',
    tableAssigned: 'KRAAL-01',
    status: 'confirmed',
    specialRequests: 'Prefers roasted goat ribs well done and brown sorghum ugali. Celebrating anniversary.',
    isVIP: true,
    createdAt: '2026-11-07 14:20',
  },
  {
    id: 'res-102',
    code: 'RP-ATHI-4520',
    guestName: 'Evelyn Wanjiku',
    phone: '0711 890 234',
    email: 'wanjiku.e@safaricom.co.ke',
    date: '2026-11-08',
    time: '13:00',
    guests: 4,
    zone: 'terrace',
    tableAssigned: 'T-04',
    status: 'seated',
    specialRequests: 'Outdoor shaded table overlooking Greenpark garden.',
    isVIP: false,
    createdAt: '2026-11-08 09:15',
  },
  {
    id: 'res-103',
    code: 'RP-ATHI-1984',
    guestName: 'David Kiprono',
    phone: '0790 567 123',
    email: 'kiprono.d@athi-water.go.ke',
    date: '2026-11-08',
    time: '14:00',
    guests: 2,
    zone: 'hearth',
    tableAssigned: 'H-07',
    status: 'confirmed',
    specialRequests: 'Business lunch, order 1L Mursik in advance.',
    isVIP: false,
    createdAt: '2026-11-08 10:30',
  },
  {
    id: 'res-104',
    code: 'RP-ATHI-9921',
    guestName: 'Grace Achieng',
    phone: '0733 456 789',
    email: 'grace.achieng@gmail.com',
    date: '2026-11-08',
    time: '20:00',
    guests: 8,
    zone: 'terrace',
    tableAssigned: 'T-10',
    status: 'confirmed',
    specialRequests: 'Birthday dinner, cake cutting requested after dessert.',
    isVIP: true,
    createdAt: '2026-11-06 18:45',
  },
  {
    id: 'res-105',
    code: 'RP-ATHI-3012',
    guestName: 'Arch. Peter Kamau',
    phone: '0721 890 120',
    email: 'peter@kamauarchitects.com',
    date: '2026-11-08',
    time: '12:30',
    guests: 3,
    zone: 'hearth',
    tableAssigned: 'H-03',
    status: 'completed',
    specialRequests: 'Pre-ordered Kienyeji Chicken and Managu.',
    isVIP: false,
    createdAt: '2026-11-08 11:00',
  },
];

// Initial Seed Saved Riders for Athi River & Greenpark
const SEED_RIDERS: DeliveryRider[] = [
  {
    id: 'rider-01',
    name: 'Juma Mwangi',
    phone: '0722 345 891',
    bikeReg: 'KMDF 294X (Boxer 150)',
    status: 'available',
    rating: 4.9,
    completedDeliveries: 342,
    baseLocation: 'Arcadia Mall Stage / Greenpark Gate',
    pin: '1234',
  },
  {
    id: 'rider-02',
    name: 'Kevin Otieno',
    phone: '0711 982 431',
    bikeReg: 'KMEP 812B (TVS Apache)',
    status: 'available',
    rating: 4.8,
    completedDeliveries: 288,
    baseLocation: 'Mombasa Road / Athi Interchange',
    pin: '1234',
  },
  {
    id: 'rider-03',
    name: 'Boniface Kiprono',
    phone: '0793 671 204',
    bikeReg: 'KMCT 450Y (Honda Ace)',
    status: 'on_delivery',
    rating: 5.0,
    completedDeliveries: 415,
    baseLocation: 'Greatwall / Sabaki Enroute',
    currentOrderId: 'ord-802',
    pin: '1234',
  },
  {
    id: 'rider-04',
    name: 'Peter Mutiso',
    phone: '0708 554 912',
    bikeReg: 'KMEE 673Q (Bajaj Boxer)',
    status: 'available',
    rating: 4.7,
    completedDeliveries: 195,
    baseLocation: 'Greenpark Estate Main Gate',
    pin: '1234',
  },
];

// Initial Seed Orders for today's shift
const SEED_ORDERS: OrderRecord[] = [
  {
    id: 'ord-801',
    orderCode: 'ORD-72941',
    customerName: 'Arch. Peter Kamau',
    customerPhone: '0721 890 120',
    orderType: 'dine_in',
    tableNumber: 'H-03',
    items: [
      { id: 'combo-kienyeji', name: 'Kienyeji Chicken Lunch', price: 750, quantity: 2, customization: 'Brown Millet Ugali · Managu' },
      { id: 'dr-dawa', name: 'Hot Lemon & Ginger Dawa', price: 200, quantity: 2 },
      { id: 'sw-chapati', name: 'Layered Swahili Chapati', price: 100, quantity: 2 },
    ],
    subtotal: 2100,
    deliveryFee: 0,
    total: 2100,
    paymentMethod: 'mpesa',
    mpesaReceipt: 'QJK91840X',
    status: 'completed',
    createdAt: '2026-11-08 12:45',
  },
  {
    id: 'ord-802',
    orderCode: 'ORD-72942',
    customerName: 'Wairimu Njeri',
    customerPhone: '0724 551 229',
    deliveryAddress: 'Greenpark Estate, Cluster B, Villa 14',
    orderType: 'delivery',
    assignedRiderId: 'rider-03',
    assignedRiderName: 'Boniface Kiprono',
    assignedRiderPhone: '0793 671 204',
    assignedRiderBike: 'KMCT 450Y',
    dispatchCallStatus: 'confirmed',
    items: [
      { id: 'combo-highlands-goat', name: 'Highlands Mbuzi Choma Platter', price: 850, quantity: 2, customization: 'Brown Ugali · Kachumbari' },
      { id: 'dr-tamarind-1l', name: 'Tamarind Juice (Ukwaju) 1L', price: 400, quantity: 1 },
      { id: 'soup-bone', name: 'Traditional Bone Soup', price: 250, quantity: 2 },
    ],
    subtotal: 2600,
    deliveryFee: 100,
    total: 2700,
    paymentMethod: 'mpesa',
    mpesaReceipt: 'QJK94812Y',
    status: 'en_route',
    createdAt: '2026-11-08 13:10',
  },
  {
    id: 'ord-803',
    orderCode: 'ORD-72943',
    customerName: 'Eng. Hassan Omar',
    customerPhone: '0715 678 901',
    deliveryAddress: 'Athi River Town, Greatwall Phase 3, Apt 4B',
    orderType: 'delivery',
    items: [
      { id: 'combo-luo-lake', name: 'Luo Lakeside Crispy Tilapia', price: 750, quantity: 2, customization: 'Millet Sorghum Ugali · Mrenda' },
      { id: 'sw-pilau', name: 'Fragrant Swahili Beef Pilau', price: 450, quantity: 1 },
    ],
    subtotal: 1950,
    deliveryFee: 150,
    total: 2100,
    paymentMethod: 'mpesa',
    mpesaReceipt: 'QJL10492B',
    status: 'preparing',
    createdAt: '2026-11-08 13:28',
  },
  {
    id: 'ord-804',
    orderCode: 'ORD-72944',
    customerName: 'Evelyn Wanjiku',
    customerPhone: '0711 890 234',
    orderType: 'dine_in',
    tableNumber: 'T-04',
    items: [
      { id: 'prot-choma-1kg', name: 'Charcoal Choma (1 kg Full Platter)', price: 1850, quantity: 1, customization: 'Served with salt & fresh chilies' },
      { id: 'st-ugali-brown', name: 'Ugali (Brown Sorghum & Millet)', price: 150, quantity: 3 },
      { id: 'st-managu', name: 'Managu (African Nightshade)', price: 150, quantity: 2 },
      { id: 'dr-mursik-1l', name: 'Traditional Mursik 1L Gourd', price: 450, quantity: 1 },
    ],
    subtotal: 3050,
    deliveryFee: 0,
    total: 3050,
    paymentMethod: 'mpesa',
    mpesaReceipt: 'QJL22910M',
    status: 'ready',
    createdAt: '2026-11-08 13:35',
  },
  {
    id: 'ord-805',
    orderCode: 'ORD-72945',
    customerName: 'Brian Mutisya',
    customerPhone: '0702 443 118',
    orderType: 'pickup',
    items: [
      { id: 'sw-pilau', name: 'Fragrant Swahili Beef Pilau', price: 450, quantity: 3 },
      { id: 'sw-samosa', name: 'Traditional Samosas (3 pcs)', price: 250, quantity: 2 },
    ],
    subtotal: 1850,
    deliveryFee: 0,
    total: 1850,
    paymentMethod: 'cash',
    status: 'received',
    createdAt: '2026-11-08 13:48',
  },
];

// Initial Seed Loyalty Members
const SEED_LOYALTY: LoyaltyMember[] = [
  {
    id: 'mem-01',
    name: 'Senator Mutua',
    phone: '0722 341 890',
    points: 480,
    tier: 'Mababu Platinum',
    totalSpend: 54000,
    visits: 18,
    lastVisit: '2026-11-01',
  },
  {
    id: 'mem-02',
    name: 'Wairimu Njeri',
    phone: '0724 551 229',
    points: 210,
    tier: 'Chungu Gold',
    totalSpend: 23500,
    visits: 9,
    lastVisit: '2026-11-05',
  },
  {
    id: 'mem-03',
    name: 'Evelyn Wanjiku',
    phone: '0711 890 234',
    points: 155,
    tier: 'Chungu Gold',
    totalSpend: 16800,
    visits: 6,
    lastVisit: '2026-11-08',
  },
  {
    id: 'mem-04',
    name: 'Eng. Hassan Omar',
    phone: '0715 678 901',
    points: 90,
    tier: 'Mwiko Silver',
    totalSpend: 9800,
    visits: 4,
    lastVisit: '2026-10-29',
  },
];

export const RestaurantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rp_user_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return null;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rp_reservations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return SEED_RESERVATIONS;
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rp_orders');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return SEED_ORDERS;
  });

  const [riders, setRiders] = useState<DeliveryRider[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rp_riders');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return SEED_RIDERS;
  });

  // Client Active Order Tracking State (ONLY set when customer places their order)
  const [activeClientOrderId, setActiveClientOrderId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rp_active_client_order_id');
      if (saved && saved !== 'ord-803') return saved;
      // If was the legacy hardcoded ord-803, purge it
      if (saved === 'ord-803') {
        localStorage.removeItem('rp_active_client_order_id');
      }
    }
    return null; // Tracking is strictly only visible after an order is submitted!
  });

  const [menuItems, setMenuItems] = useState<(MenuItem & { isAvailable?: boolean })[]>(() => {
    return INITIAL_MENU_ITEMS.map((item) => ({ ...item, isAvailable: true }));
  });

  const [loyaltyMembers, setLoyaltyMembers] = useState<LoyaltyMember[]>(SEED_LOYALTY);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rp_reservations', JSON.stringify(reservations));
    }
  }, [reservations]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rp_orders', JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('rp_riders', JSON.stringify(riders));
    }
  }, [riders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (activeClientOrderId) {
        localStorage.setItem('rp_active_client_order_id', activeClientOrderId);
      } else {
        localStorage.removeItem('rp_active_client_order_id');
      }
    }
  }, [activeClientOrderId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('rp_user_profile', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('rp_user_profile');
      }
    }
  }, [currentUser]);

  const loginAs = (role: 'staff' | 'admin', customName?: string) => {
    if (role === 'staff') {
      setCurrentUser({
        id: 'usr-staff-01',
        name: customName || 'Achieng Odhiambo',
        title: 'Floor Supervisor & Hostess Lead',
        email: 'achieng@rootsandpots.ke',
        role: 'staff',
        avatarInitials: 'AO',
      });
    } else {
      setCurrentUser({
        id: 'usr-admin-01',
        name: customName || 'Chef James Omondi',
        title: 'Executive Chef & General Manager',
        email: 'omondi@rootsandpots.ke',
        role: 'admin',
        avatarInitials: 'JO',
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addReservation = (data: Omit<Reservation, 'id' | 'code' | 'createdAt' | 'status'>): Reservation => {
    const code = `RP-ATHI-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRes: Reservation = {
      ...data,
      id: `res-${Date.now()}`,
      code,
      status: 'confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setReservations((prev) => [newRes, ...prev]);
    return newRes;
  };

  const updateReservationStatus = (id: string, status: ReservationStatus, table?: string) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status,
            tableAssigned: table !== undefined ? table : r.tableAssigned,
          };
        }
        return r;
      })
    );
  };

  const cancelReservation = (id: string) => {
    updateReservationStatus(id, 'cancelled');
  };

  const addOrder = (orderData: Omit<OrderRecord, 'id' | 'orderCode' | 'createdAt' | 'status'>): OrderRecord => {
    const code = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: OrderRecord = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderCode: code,
      status: 'received',
      dispatchCallStatus: 'none',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveClientOrderId(newOrder.id); // Bind client directly to this real order

    // Check if loyalty member matches phone
    const member = loyaltyMembers.find((m) => m.phone.replace(/\s+/g, '') === orderData.customerPhone.replace(/\s+/g, ''));
    if (member) {
      const addedPoints = Math.floor(orderData.total / 50); // 1 point per 50 Kshs
      setLoyaltyMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? { ...m, points: m.points + addedPoints, totalSpend: m.totalSpend + orderData.total, visits: m.visits + 1 }
            : m
        )
      );
    }

    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          // If moving to completed, free up any assigned rider
          if (status === 'completed' && o.assignedRiderId) {
            setRiders((rList) =>
              rList.map((r) =>
                r.id === o.assignedRiderId
                  ? { ...r, status: 'available', completedDeliveries: r.completedDeliveries + 1, currentOrderId: undefined }
                  : r
              )
            );
          }
          return { ...o, status };
        }
        return o;
      })
    );
  };

  const assignRiderToOrder = (orderId: string, riderId: string, callStatus: 'confirmed' | 'escalated' = 'confirmed') => {
    const targetRider = riders.find((r) => r.id === riderId);
    if (!targetRider) return;

    // Update order with rider information and transition status to en_route
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            assignedRiderId: targetRider.id,
            assignedRiderName: targetRider.name,
            assignedRiderPhone: targetRider.phone,
            assignedRiderBike: targetRider.bikeReg,
            dispatchCallStatus: callStatus,
            riderTransitStage: 'assigned',
            status: 'en_route',
          };
        }
        return o;
      })
    );

    // Update rider state to on_delivery
    setRiders((prev) =>
      prev.map((r) =>
        r.id === riderId
          ? { ...r, status: 'on_delivery', currentOrderId: orderId }
          : r
      )
    );
  };

  const updateRiderTransitStage = (
    orderId: string,
    stage: 'assigned' | 'picked_up' | 'arrived_at_gate' | 'delivered',
    note?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const stageNote = note ? ` [Stage: ${stage} at ${timestamp} - ${note}]` : ` [Stage: ${stage} at ${timestamp}]`;
          return {
            ...o,
            riderTransitStage: stage,
            status: stage === 'delivered' ? 'completed' : 'en_route',
            specialInstructions: o.specialInstructions ? `${o.specialInstructions} | ${stageNote}` : stageNote,
          };
        }
        return o;
      })
    );

    if (stage === 'delivered') {
      const order = orders.find((o) => o.id === orderId);
      const riderId = order?.assignedRiderId;
      if (riderId) {
        setRiders((prev) =>
          prev.map((r) =>
            r.id === riderId
              ? {
                  ...r,
                  status: 'available',
                  completedDeliveries: r.completedDeliveries + 1,
                  currentOrderId: undefined,
                }
              : r
          )
        );
      }
    }
  };

  const addRider = (riderData: Omit<DeliveryRider, 'id' | 'completedDeliveries' | 'rating'>): DeliveryRider => {
    const newRider: DeliveryRider = {
      ...riderData,
      id: `rider-${Date.now()}`,
      rating: 5.0,
      completedDeliveries: 0,
      pin: riderData.pin || '1234',
    };
    setRiders((prev) => [...prev, newRider]);
    return newRider;
  };

  const updateRiderStatus = (riderId: string, status: 'available' | 'on_delivery' | 'offline') => {
    setRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, status } : r))
    );
  };

  const confirmDeliveryByRider = (orderId: string, riderId: string, notes?: string) => {
    // 1. Update order status to completed and record delivery confirmation notes
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const deliveryNote = notes ? ` [Handed over at ${timestamp}: ${notes}]` : ` [Handed over at ${timestamp}]`;
          return {
            ...o,
            status: 'completed' as OrderStatus,
            riderTransitStage: 'delivered' as const,
            specialInstructions: o.specialInstructions ? `${o.specialInstructions} | ${deliveryNote}` : deliveryNote,
          };
        }
        return o;
      })
    );

    // 2. Set rider back to available, increment trip count, and clear active order
    setRiders((prev) =>
      prev.map((r) =>
        r.id === riderId
          ? {
              ...r,
              status: 'available',
              completedDeliveries: r.completedDeliveries + 1,
              currentOrderId: undefined,
            }
          : r
      )
    );
  };

  const deleteRider = (riderId: string) => {
    setRiders((prev) => prev.filter((r) => r.id !== riderId));
  };

  const generateRiderNotification = (riderId: string, orderId: string, channel: 'whatsapp' | 'sms') => {
    const rider = riders.find((r) => r.id === riderId);
    const order = orders.find((o) => o.id === orderId);
    const rawPhone = rider ? rider.phone.replace(/[\s\-()]/g, '') : '';
    const cleanPhone = rawPhone.startsWith('0') ? `254${rawPhone.slice(1)}` : rawPhone.startsWith('+') ? rawPhone.slice(1) : rawPhone;
    
    const itemsList = order?.items.map((i) => `${i.quantity}x ${i.name}`).join(', ') || 'Roots & Pots Clay Pot Delicacy';
    const paymentLabel = order?.paymentMethod === 'cash'
      ? `COLLECT CASH ON DELIVERY: Kshs ${order?.total.toLocaleString()}`
      : `PRE-PAID VIA M-PESA TILL 8945201 (Receipt: ${order?.mpesaReceipt || 'Verified'})`;

    const message = `*ROOTS & POTS BISTRO - BODA DISPATCH NOTICE* 🍲🏍️\n` +
      `Jambo ${rider?.name || 'Rider'},\n` +
      `You have been assigned a delivery from Arcadia Mall Kitchen:\n` +
      `• *Order Ref:* ${order?.orderCode || orderId}\n` +
      `• *Customer:* ${order?.customerName} (${order?.customerPhone})\n` +
      `• *Drop-off Location:* ${order?.deliveryAddress || 'Athi River / Greenpark'}\n` +
      `• *Dishes:* ${itemsList}\n` +
      `• *Payment Due:* ${paymentLabel}\n\n` +
      `Please collect from the kitchen pass and confirm delivery once handed over to the diner. Asante sana!`;

    if (channel === 'whatsapp') {
      return {
        url: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`,
        text: message,
      };
    } else {
      return {
        url: `sms:${cleanPhone}?body=${encodeURIComponent(message)}`,
        text: message,
      };
    }
  };

  const toggleItemAvailability = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item))
    );
  };

  const updateItemPrice = (id: string, newPrice: number) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const registerLoyaltyMember = (name: string, phone: string): LoyaltyMember => {
    const existing = loyaltyMembers.find((m) => m.phone === phone);
    if (existing) return existing;

    const newMember: LoyaltyMember = {
      id: `mem-${Date.now()}`,
      name,
      phone,
      points: 50,
      tier: 'Mwiko Silver',
      totalSpend: 0,
      visits: 1,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    setLoyaltyMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const clearActiveClientOrder = () => {
    setActiveClientOrderId(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rp_active_client_order_id');
    }
  };

  const activeClientOrder = orders.find((o) => o.id === activeClientOrderId) || null;

  const todaySalesTotal = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const todayOrdersCount = orders.filter((o) => o.status !== 'cancelled').length;
  const todayReservationsCount = reservations.filter((r) => r.status !== 'cancelled').length;

  return (
    <RestaurantContext.Provider
      value={{
        currentUser,
        loginAs,
        logout,
        reservations,
        addReservation,
        updateReservationStatus,
        cancelReservation,
        orders,
        addOrder,
        updateOrderStatus,
        assignRiderToOrder,
        updateRiderTransitStage,
        confirmDeliveryByRider,
        generateRiderNotification,
        activeClientOrderId,
        setActiveClientOrderId,
        activeClientOrder,
        clearActiveClientOrder,
        riders,
        addRider,
        updateRiderStatus,
        deleteRider,
        menuItems,
        toggleItemAvailability,
        updateItemPrice,
        loyaltyMembers,
        registerLoyaltyMember,
        todaySalesTotal,
        todayOrdersCount,
        todayReservationsCount,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const ctx = useContext(RestaurantContext);
  if (!ctx) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return ctx;
};
