import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';

interface EvaluatorLoginProps {
  onSuccess?: () => void;
  redirectTab?: string;
}

export const EvaluatorLogin: React.FC<EvaluatorLoginProps> = ({ onSuccess, redirectTab = 'analytics' }) => {
  const { setActiveTab, setAdminToken } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lockoutTimer, setLockoutTimer] = useState<number | null>(null);

  // Check if session is already authenticated on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const res = await fetch('/api/auth/verify', { credentials: 'include' });
        if (res.ok) {
          if (onSuccess) {
            onSuccess();
          } else {
            setActiveTab(redirectTab as any);
          }
        }
      } catch (e) {
        // Not authenticated yet
      }
    };
    checkExistingSession();
  }, [onSuccess, redirectTab, setActiveTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      const data = await res.json();

      if (res.ok && data.authenticated) {
        if (data.token) {
          setAdminToken(data.token);
        }
        if (onSuccess) {
          onSuccess();
        } else {
          setActiveTab(redirectTab as any);
        }
      } else {
        if (res.status === 429) {
          setErrorMessage(data.detail || 'Too many login attempts. Evaluator console temporarily locked.');
          setLockoutTimer(15);
        } else {
          setErrorMessage(data.detail || 'Invalid evaluator credentials. Access denied.');
        }
      }
    } catch (err) {
      setErrorMessage('Network error connecting to BIS authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setUsername('demo');
    setPassword('demo');
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Card padding="lg" className="border-t-4 border-t-brass shadow-paper-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-brass">
            <Lock className="w-6 h-6 text-amber-700" />
          </div>
          <h2 className="text-lg font-bold text-ink font-serif tracking-tight">
            BIS Evaluator Console Authentication
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Restricted access portal for Bureau of Indian Standards regulatory evaluators, technical auditors, and benchmark inspectors.
          </p>
        </div>

        {/* Server-Side Security Callout */}
        <div className="p-3 bg-stone-50 border border-stone-200 rounded text-[11px] text-stone-700 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 font-semibold text-stone-900">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Server-Side Authenticator Active</span>
          </div>
          <p className="text-[10.5px] text-stone-500 font-sans">
            Credentials verified against bcrypt salted hashes. Sessions are guarded with 8-hour HttpOnly cookies and per-IP brute-force rate limiting.
          </p>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-start gap-2" role="alert">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 block">
              Evaluator Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. demo or evaluator"
                disabled={loading}
                autoComplete="username"
                className="w-full pl-9 pr-3 py-2 text-xs border border-line rounded bg-paper-light text-ink focus:outline-none focus:border-brass font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700 block">
              Access Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                className="w-full pl-9 pr-3 py-2 text-xs border border-line rounded bg-paper-light text-ink focus:outline-none focus:border-brass font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(lockoutTimer)}
            className="w-full py-2.5 bg-indigo-deep hover:bg-indigo-deep-dark disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            {loading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Sign In to Evaluator Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Access Helper */}
        <div className="pt-2 border-t border-line text-center space-y-2">
          <p className="text-[11px] text-stone-500">
            For evaluation and judging demonstration:
          </p>
          <button
            type="button"
            onClick={handleDemoFill}
            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded text-xs font-medium transition-colors cursor-pointer"
          >
            Auto-Fill Demo Credentials (demo / demo)
          </button>
        </div>
      </Card>
    </div>
  );
};
