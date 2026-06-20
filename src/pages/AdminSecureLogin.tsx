import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, Eye, EyeOff, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../stores/useAuthStore';


export function AdminSecureLogin() {
  const navigate = useNavigate();
  const { 
    loginAdminStep1, 
    verifyAdmin2FA, 
    isLockedOut, 
    lockoutTimeRemaining,
    admin2FAPending,
    logout
  } = useAuthStore();

  // Local inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lockout listener
  useEffect(() => {
    if (isLockedOut) {
      setError(`Ko'p marotaba noto'g'ri urinish tufayli kirish bloklandi: ${lockoutTimeRemaining} soniya.`);
    } else if (error.startsWith("Ko'p marotaba")) {
      setError('');
    }
  }, [isLockedOut, lockoutTimeRemaining, error]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password) {
      setError("Elektron pochta va parolni to'liq to'ldiring.");
      return;
    }

    setLoading(true);
    
    // Explicit security boundary check: If a user inputs 'user' to bypass admin secure gate
    if (email.trim().toLowerCase() === 'user' || email.trim() === 'customer') {
      setLoading(false);
      setError("Ruxsat etilmagan foydalanuvchi");
      return;
    }

    const res = await loginAdminStep1(email, password);
    setLoading(false);

    if (res.success && res.require2FA) {
      setSuccess("Tizimga kirish ma'lumotlari tasdiqlandi. 2-bosqich tasdiqlash kodini kiriting.");
    } else if (res.error) {
      setError(res.error);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError("Tasdiqlash kodi 6 ta raqamdan iborat bo'lishi kerak.");
      return;
    }

    setLoading(true);
    const res = await verifyAdmin2FA(otp);
    
    if (res.success) {
      // Security Validation Check: verify user is ADMIN
      const currentUser = useAuthStore.getState().user;
      if (currentUser && currentUser.role !== 'ADMIN') {
        logout();
        setLoading(false);
        setSuccess('');
        setError("Ruxsat etilmagan foydalanuvchi");
        return;
      }

      setSuccess("Kirish muvaffaqiyatli amalga oshirildi!");
      setTimeout(() => {
        setLoading(false);
        navigate('/admin/dashboard');
      }, 1000);
    } else {
      setLoading(false);
      setError(res.error || "Tasdiqlash kodi noto'g'ri");
    }
  };

  return (
    <div className="flex-1 bg-[#0f172a] flex items-center justify-center py-20 px-4 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative text-left"
      >
        {/* Anti-brute force lockout overlay */}
        {isLockedOut && (
          <div className="absolute inset-0 bg-slate-950/95 rounded-3xl backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="h-16 w-16 rounded-full bg-red-950 border border-red-800 text-red-500 flex items-center justify-center mb-4">
              <ShieldAlert size={28} className="stroke-[2.5] animate-bounce" />
            </div>
            <h3 className="font-display font-extrabold text-lg text-white">Kirish Bloklandi</h3>
            <p className="text-xs text-slate-400 font-semibold mt-2.5 leading-relaxed max-w-[300px]">
              Tizim xavfsizligi 5 ta xato urinishdan so'ng brute-force hujumidan himoyani faollashtirdi. 
              {lockoutTimeRemaining} soniyadan keyin qayta urinib ko'ring.
            </p>
          </div>
        )}

        {/* Secure gate header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-3.5">
            <ShieldCheck size={24} className="stroke-[2.5]" />
          </div>
          <h2 className="font-display font-extrabold text-xl text-white">
            Secure Admin Portal
          </h2>
          <p className="text-[10px] tracking-widest text-amber-500 uppercase font-extrabold mt-1">
            Administrator Tizimi (Hidden Gate)
          </p>
        </div>

        {error && (
          <div className="bg-red-950/60 border border-red-800/80 rounded-xl p-3.5 mb-6 text-xs font-semibold text-red-400 flex items-start gap-2.5">
            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-xl p-3.5 mb-6 text-xs font-semibold text-emerald-400 flex items-start gap-2.5">
            <ShieldCheck size={15} className="shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!admin2FAPending ? (
            /* STEP 1: Email + Password Credentials */
            <motion.form
              key="credentialsForm"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              onSubmit={handleStep1Submit}
              className="space-y-5"
            >
              {/* Login Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Elektron pochta (Email)
                </label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-3 focus-within:bg-slate-900 focus-within:border-amber-500/40 transition-all">
                  <Mail size={15} className="text-slate-500 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@shopwep.uz"
                    disabled={loading}
                    className="bg-transparent text-xs w-full text-white outline-none font-semibold placeholder:text-slate-650"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Parol
                </label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-3 focus-within:bg-slate-900 focus-within:border-amber-500/40 transition-all">
                  <Lock size={15} className="text-slate-500 mr-2.5 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    disabled={loading}
                    className="bg-transparent text-xs w-full text-white outline-none font-sans font-bold placeholder:text-slate-650"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-amber-505 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Test credentials reference */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 text-[10px] font-semibold text-amber-500/90">
                <div className="font-extrabold uppercase tracking-wider mb-1">
                  Boshqaruvchi test login:
                </div>
                <div className="flex justify-between">
                  <span>Elektron pochta: <span className="font-bold text-amber-400">admin@shopwep.uz</span></span>
                  <span>Parol: <span className="font-bold text-amber-400">admin</span></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-display font-bold transition-all flex items-center justify-center space-x-2 shadow-sm shadow-amber-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin mr-1.5" />
                    <span>Tekshirilmoqda...</span>
                  </>
                ) : (
                  <span>Xavfsiz Kirish</span>
                )}
              </button>
            </motion.form>
          ) : (
            /* STEP 2: 2FA One-Time Password Input */
            <motion.form
              key="otpForm"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              onSubmit={handleStep2Submit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Tasdiqlash kodi (6 xonali OTP)
                </label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-3 focus-within:bg-slate-900 focus-within:border-amber-500/40 transition-all">
                  <ShieldCheck size={15} className="text-slate-500 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="------"
                    disabled={loading}
                    className="bg-transparent text-xs w-full text-white outline-none font-sans font-bold tracking-[0.25em] placeholder:text-slate-650"
                  />
                </div>
                
                <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3.5 text-[10px] font-semibold text-amber-500/95 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-amber-500 shrink-0" />
                  <span>2FA Tasdiqlash kodi: <span className="font-extrabold text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded border border-amber-500/20 font-mono ml-1">123456</span></span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-display font-bold transition-all flex items-center justify-center space-x-2 shadow-sm shadow-amber-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin mr-1.5" />
                    <span>Kodni tekshirish...</span>
                  </>
                ) : (
                  <span>Tasdiqlash va Kirish</span>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}

export default AdminSecureLogin;
