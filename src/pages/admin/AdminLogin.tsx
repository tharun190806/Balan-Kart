import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const AdminLogin: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(email.trim(), password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid administrator credentials.');
      setIsSubmitting(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@balan.com');
    setPassword('admin123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-md mx-auto py-12 px-4">
      <div className="text-center space-y-2 mb-6">
        <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
          <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-stone-900 tracking-tight">
          Admin Portal Authentication
        </h1>
        <p className="text-xs text-stone-500">
          Dedicated access for Balan catalog managers, inventory controllers, and dispatch teams.
        </p>
      </div>

      <div className="bg-white border border-stone-300 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <span className="text-xs font-medium text-rose-800">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@balan.com"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Secret Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:border-stone-900"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-stone-100 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-stone-300 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Authorize & Enter Console</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Fill Demo Admin Account */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between gap-2">
          <div className="text-[11px] text-stone-600">
            <span className="font-semibold block text-stone-800">Default Admin Credentials:</span>
            <span>admin@balan.com / admin123</span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoAdmin}
            className="px-2.5 py-1 text-[11px] font-medium bg-stone-800 hover:bg-stone-900 text-stone-100 rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            Fill Admin
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-stone-900">
            <ArrowLeft className="w-3 h-3" />
            <span>Return to Customer Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
