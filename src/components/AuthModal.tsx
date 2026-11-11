import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, KeyRound, ArrowRight, Sparkles } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (targetPage?: 'staff_portal' | 'admin_portal') => void;
  initialRole?: 'staff' | 'admin';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  initialRole = 'staff',
}) => {
  const { loginAs } = useRestaurant();
  const [selectedRole, setSelectedRole] = useState<'staff' | 'admin'>(initialRole);
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedRole === 'staff') {
      if (pin === '1234' || email.includes('staff')) {
        loginAs('staff');
        onSuccess('staff_portal');
        onClose();
      } else {
        setErrorMessage('Invalid Staff PIN. (Demo PIN: 1234)');
      }
    } else {
      if (pin === '9999' || email.includes('admin')) {
        loginAs('admin');
        onSuccess('admin_portal');
        onClose();
      } else {
        setErrorMessage('Invalid Admin PIN. (Demo PIN: 9999)');
      }
    }
  };

  const handleQuickDemoLogin = (role: 'staff' | 'admin') => {
    loginAs(role);
    onSuccess(role === 'staff' ? 'staff_portal' : 'admin_portal');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#F5F2EB] border border-[#D7CCC8] rounded-3xl shadow-2xl overflow-hidden text-[#3E2723]">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#D7CCC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B5A2B]/15 border border-[#8B5A2B]/30 flex items-center justify-center text-[#8B5A2B]">
              {selectedRole === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-serif tracking-tight text-[#3E2723]">
                {selectedRole === 'admin' ? 'Executive Admin Portal' : 'Floor & Kitchen Staff Login'}
              </h3>
              <p className="text-xs text-[#795548]">
                Roots & Pots Bistro · Arcadia Mall
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#795548] hover:text-[#3E2723] hover:bg-[#D7CCC8]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Role Segmented Selector */}
          <div className="grid grid-cols-2 p-1 bg-[#D7CCC8]/40 rounded-2xl border border-[#D7CCC8]">
            <button
              type="button"
              onClick={() => { setSelectedRole('staff'); setErrorMessage(''); }}
              className={`py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                selectedRole === 'staff'
                  ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md'
                  : 'text-[#5D4037] hover:text-[#3E2723]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Staff Login</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedRole('admin'); setErrorMessage(''); }}
              className={`py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                selectedRole === 'admin'
                  ? 'bg-[#3E2723] text-[#F5F2EB] shadow-md'
                  : 'text-[#5D4037] hover:text-[#3E2723]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>General Manager</span>
            </button>
          </div>

          {/* Quick Demo Access Callout */}
          <div className="p-4 bg-white rounded-2xl border border-[#D7CCC8] space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#8B5A2B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>Instant 1-Click Demo Login</span>
              </span>
              <span className="text-[11px] font-mono text-[#795548]">Verified Access</span>
            </div>

            {selectedRole === 'staff' ? (
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('staff')}
                className="w-full py-2.5 px-4 bg-[#8B5A2B]/15 hover:bg-[#8B5A2B] text-[#3E2723] hover:text-[#F5F2EB] border border-[#8B5A2B]/40 hover:border-[#8B5A2B] rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group"
              >
                <span>Login as <strong>Achieng Odhiambo</strong> (Hostess / Floor Lead)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="w-full py-2.5 px-4 bg-[#3E2723]/10 hover:bg-[#3E2723] text-[#3E2723] hover:text-[#F5F2EB] border border-[#3E2723]/30 hover:border-[#3E2723] rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer group"
              >
                <span>Login as <strong>Chef James Omondi</strong> (General Manager)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <p className="text-[11px] text-[#795548] leading-tight">
              {selectedRole === 'staff'
                ? 'Permits seating guests, managing incoming bookings, kitchen KDS tickets & shift sales.'
                : 'Permits full financial reconciliation, till reports, menu price editing & CRM analytics.'}
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#D7CCC8] w-full" />
            <span className="bg-[#F5F2EB] px-3 text-[11px] uppercase tracking-wider text-[#795548] font-mono font-bold">
              Or Enter Credentials
            </span>
          </div>

          {/* PIN / Password Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5D4037] mb-1.5">
                Staff Email or ID
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'staff' ? 'staff@rootsandpots.ke' : 'admin@rootsandpots.ke'}
                className="w-full px-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5D4037] mb-1.5">
                Access PIN (Staff: <code className="text-[#8B5A2B] font-bold">1234</code> | Admin: <code className="text-[#2E7D32] font-bold">9999</code>)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#795548] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B] font-mono tracking-widest"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-[#C62828] font-medium bg-[#FFEBEE] p-2.5 rounded-lg border border-[#EF9A9A]">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                selectedRole === 'staff'
                  ? 'bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB]'
                  : 'bg-[#3E2723] hover:bg-[#251714] text-[#F5F2EB]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate & Open Dashboard</span>
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
