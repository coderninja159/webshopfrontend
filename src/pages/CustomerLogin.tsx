import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';

export function CustomerLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Form inputs
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // digits only
    if (value.startsWith('998')) {
      value = value.substring(3);
    }
    
    // Format to +998 (XX) XXX-XX-XX
    let formatted = '+998 ';
    if (value.length > 0) {
      formatted += '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
      formatted += ') ' + value.substring(2, 5);
    }
    if (value.length > 5) {
      formatted += '-' + value.substring(5, 7);
    }
    if (value.length > 7) {
      formatted += '-' + value.substring(7, 9);
    }
    
    if (value.length <= 9) {
      setPhone(formatted);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (phone.length < 19) {
      setError("Telefon raqamingizni to'liq kiriting (masalan: +998 (90) 123-45-67).");
      return;
    }
    if (!password) {
      setError("Maxfiy parolingizni kiriting.");
      return;
    }

    setLoading(true);
    // Use the normalized phone/username for login request
    const username = phone.replace(/\D/g, '');
    const res = await login(username, password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/store');
      }, 1200);
    } else {
      setError(res.error || "Tizimga kirishda xatolik yuz berdi. Telefon yoki parol xato.");
    }
  };

  return (
    <div className="flex-1 bg-[#f2f4f7] flex items-center justify-center py-20 px-4 min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] bg-white border border-gray-150 rounded-3xl p-8 sm:p-10 shadow-sm relative text-left"
      >
        {/* Brand Logo Text */}
        <div className="text-center mb-8">
          <span className="font-display font-extrabold text-3xl tracking-tighter text-purple-650">
            shopwep
          </span>
          <p className="text-xs text-gray-400 mt-2 font-semibold">
            Xaridor Tizimiga Kirish
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-150 rounded-xl p-3.5 mb-6 text-xs font-semibold text-red-650 flex items-start gap-2.5">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-3.5 mb-6 text-xs font-semibold text-emerald-650 flex items-start gap-2.5">
            <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
            <span>Tizimga muvaffaqiyatli kirildi! Xaridlar olamiga yo'naltirilmoqda...</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          
          {/* Phone number input */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
              Telefon raqami
            </label>
            <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-3 focus-within:bg-white focus-within:border-purple-600/40 transition-all">
              <Phone size={15} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 (__) ___-__-__"
                disabled={loading || success}
                className="bg-transparent text-xs w-full text-gray-900 outline-none font-sans font-bold placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">
              Parol
            </label>
            <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-3 focus-within:bg-white focus-within:border-purple-600/40 transition-all">
              <KeyRound size={15} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolingizni kiriting..."
                disabled={loading || success}
                className="bg-transparent text-xs w-full text-gray-900 outline-none font-sans font-bold placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Test credentials reference */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3.5 text-[10px] font-semibold text-purple-750">
            <span className="font-bold text-purple-800">Xaridor uchun test hisob: </span>
            <div className="mt-1 flex justify-between">
              <span>Login: <span className="font-extrabold text-purple-900">user</span></span>
              <span>Parol: <span className="font-extrabold text-purple-900">user</span></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3.5 rounded-2xl bg-purple-600 text-white font-display font-bold hover:bg-purple-700 transition-all flex items-center justify-center space-x-2 shadow-sm shadow-purple-600/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        {/* Redirect to registration */}
        <div className="mt-6 text-center text-xs text-gray-400 font-semibold">
          <span>Hisobingiz yo'qmi? </span>
          <Link to="/register" className="text-purple-650 hover:underline">
            Ro'yxatdan o'tish
          </Link>
        </div>

      </motion.div>
    </div>
  );
}

export default CustomerLogin;
