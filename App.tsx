import React, { useState, useEffect } from 'react';
import {
  MapPin, Clock, Calendar, Trophy, Info,
  ExternalLink, Mail, Phone, Star, Medal,
  Shield, Book, Zap, ChevronDown, X, ChevronRight, ChevronLeft, Check, Lock, User, Trash2, Search, ArrowLeft,
  Settings, UserCheck, Layers, FileText,
  Target,
  ArrowRight,
  Copy
} from 'lucide-react';
import Countdown from './components/Countdown';
import ScrabbleTile from './components/ScrabbleTile';
import { TOURNAMENT_DETAILS, PRIZE_CATEGORIES } from './constants';
import { supabase } from './supabase';
import RevealOnScroll from './components/RevealOnScroll';

// --- Types ---
interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  ratingId?: string;
  status: 'pending' | 'confirmed';
  registeredAt: string;
}

// --- Registration Modal ---
const RegistrationModal = ({
  isOpen,
  onClose,
  onRegister
}: {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (player: Omit<Player, 'id' | 'status' | 'registeredAt'>) => void
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Masters (1500+ Rating)',
    ratingId: ''
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFormData({ name: '', email: '', phone: '', category: 'Masters (1400+ Rating)', ratingId: '' });
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText('0916457333');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalSteps = 5;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleRegister = () => {
    onRegister(formData);
    setStep(5);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#1A0D05]/95 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#FFFDF5] rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#CC5500]/20 flex flex-col max-h-[90vh] animate-reveal">
        {/* Header */}
        <div className="p-8 border-b border-[#CC5500]/10 flex justify-between items-center bg-[#F5E6D3]/30">
          <div>
            <h2 className="font-display text-3xl text-[#5C2A11] uppercase leading-none">Registration</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#CC5500] mt-1">Step {step} of {totalSteps}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#CC5500]/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-[#5C2A11]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[#5C2A11]/5">
          <div
            className="h-full bg-[#CC5500] transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Form Content */}
        <div className="p-8 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6 animate-reveal">
              <h3 className="font-display text-xl uppercase text-[#5C2A11]">Personal Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#5C2A11]/60 block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-2 border-[#5C2A11]/10 rounded-xl px-4 py-3 outline-none focus:border-[#CC5500] transition-colors font-semibold"
                    placeholder="e.g. Ebube Okafor"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#5C2A11]/60 block mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border-2 border-[#5C2A11]/10 rounded-xl px-4 py-3 outline-none focus:border-[#CC5500] transition-colors font-semibold"
                    placeholder="ebube@example.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#5C2A11]/60 block mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border-2 border-[#5C2A11]/10 rounded-xl px-4 py-3 outline-none focus:border-[#CC5500] transition-colors font-semibold"
                    placeholder="+234 ..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-reveal">
              <h3 className="font-display text-xl uppercase text-[#5C2A11]">Tournament Specs</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#5C2A11]/60 block mb-2">Competition Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border-2 border-[#5C2A11]/10 rounded-xl px-4 py-3 outline-none focus:border-[#CC5500] transition-colors font-semibold appearance-none"
                  >
                    <option>Masters (1400+ Rating)</option>
                    <option>Intermediate (1100 - 1399)</option>
                    <option>Open (0 - 1099)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#5C2A11]/60 block mb-2">NSF Rating ID (Optional)</label>
                  <input
                    type="text"
                    value={formData.ratingId}
                    onChange={(e) => setFormData({ ...formData, ratingId: e.target.value })}
                    className="w-full bg-white border-2 border-[#5C2A11]/10 rounded-xl px-4 py-3 outline-none focus:border-[#CC5500] transition-colors font-semibold"
                    placeholder="e.g. NSF-2024-001"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center animate-reveal">
              <div className="w-16 h-16 bg-[#CC5500]/10 rounded-full flex items-center justify-center mx-auto text-[#CC5500] mb-2">
                <div className="gold-shimmer"><Info size={32} /></div>
              </div>
              <h3 className="font-display text-2xl uppercase text-[#5C2A11]">Review Details</h3>
              <div className="bg-[#F5E6D3]/50 p-6 rounded-2xl text-left space-y-3 border border-[#CC5500]/10">
                <p className="text-sm"><span className="text-[10px] uppercase font-black text-[#CC5500] block">Name</span> {formData.name}</p>
                <p className="text-sm"><span className="text-[10px] uppercase font-black text-[#CC5500] block">Category</span> {formData.category}</p>
                <p className="text-sm"><span className="text-[10px] uppercase font-black text-[#CC5500] block">Fee</span> ₦10,000.00</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center animate-reveal">
              <h3 className="font-display text-2xl uppercase text-[#5C2A11]">Secure Payment</h3>
              <p className="text-sm text-[#5C2A11]/60">Complete your registration by transferring the fee.</p>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A0D05] to-[#2C1810] p-1 shadow-2xl group">
                {/* Metallic Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#CC5500]/50 via-transparent to-[#CC5500]/50 opacity-20 pointer-events-none"></div>

                <div className="relative rounded-[1.3rem] bg-[#1A0D05] p-6 text-white overflow-hidden">
                  {/* Background Texture */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#CC5500] via-transparent to-transparent"></div>

                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Amount Due</p>
                        <p className="font-display text-3xl text-white">₦10,000.00</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Lock size={18} className="text-[#CC5500]" />
                      </div>
                    </div>

                    <div className="space-y-1 bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#CC5500] mb-1">Account Details</p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-left">
                          <p className="font-display text-2xl tracking-wider text-white truncate">0916457333</p>
                          <p className="text-xs text-white/60 font-medium">Guaranty Trust Bank • Erigi Edafe</p>
                        </div>
                        <button
                          onClick={handleCopy}
                          className="p-3 bg-[#CC5500] hover:bg-[#B34B00] text-white rounded-lg transition-all active:scale-95 flex-shrink-0"
                          title="Copy Account Number"
                        >
                          {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#5C2A11]/40 italic">Please use your name as the transfer instruction/ref.</p>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 text-center animate-reveal">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                <div className="relative w-full h-full bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                  <Check size={40} className="text-green-600" strokeWidth={4} />
                </div>
              </div>

              <div>
                <h3 className="font-display text-2xl uppercase text-[#5C2A11] mb-2">Registration Received!</h3>
                <p className="text-[#5C2A11]/60 text-sm max-w-xs mx-auto">Your spot is reserved pending payment verification.</p>
              </div>

              <div className="bg-white border-2 border-[#5C2A11]/5 rounded-2xl p-5 text-left shadow-sm">
                <p className="text-[10px] uppercase font-black tracking-widest text-[#5C2A11]/40 mb-3 border-b border-[#5C2A11]/5 pb-2">Entry Summary</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#5C2A11] uppercase">{formData.name}</p>
                    <p className="text-[10px] text-[#5C2A11]/60 font-medium">Player Name</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#5C2A11] uppercase truncate">{formData.category}</p>
                    <p className="text-[10px] text-[#5C2A11]/60 font-medium">Category</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[#5C2A11]/80 text-xs font-semibold">Final Step: Verify your payment</p>
                <a
                  href={`https://wa.me/2347034849762?text=${encodeURIComponent(`*PAYMENT EVIDENCE*\n\nPlayer: ${formData.name}\nCategory: ${formData.category}\nAmount: ₦10,000\n\n[Attach Receipt Here]`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_10px_20px_rgba(37,211,102,0.2)] hover:bg-[#128C7E] hover:shadow-[0_10px_20px_rgba(18,140,126,0.3)] transition-all transform hover:-translate-y-1"
                >
                  <Phone size={18} strokeWidth={2.5} /> Send Proof via WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-[#F5E6D3]/20 flex gap-4">
          {step > 1 && step < 5 && (
            <button
              onClick={prevStep}
              className="flex-1 px-6 py-4 rounded-xl border-2 border-[#5C2A11]/10 text-[#5C2A11] font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button
            disabled={step === 1 && !formData.name}
            onClick={step === 4 ? handleRegister : step === 5 ? onClose : nextStep}
            className={`flex-[2] btn-orange text-white font-bold uppercase tracking-widest text-xs px-6 py-4 rounded-xl shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 ${step === 5 ? 'w-full' : ''}`}
          >
            {step === 4 ? 'I Have Paid' : step === 5 ? 'Done' : 'Continue'}
            {step === 4 ? <Check className="w-4 h-4" /> : step === 5 ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Admin Panel Component ---
const AdminPanel = ({
  isOpen,
  onClose,
  players,
  onUpdateStatus,
  onDeletePlayer
}: {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onUpdateStatus: (id: string, status: 'pending' | 'confirmed') => void;
  onDeletePlayer: (id: string) => void;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    setLoading(false);

    if (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-[#1A0D05] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        {!isAuthenticated ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Lock className="text-[#CC5500] mb-6" size={48} />
            <h2 className="font-display text-4xl text-white uppercase mb-8">Admin Access</h2>
            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <input
                type="email"
                placeholder="Admin Email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#CC5500]"
                value={credentials.email}
                onChange={e => setCredentials({ ...credentials, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#CC5500]"
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              />
              <button
                disabled={loading}
                className="w-full btn-orange text-white font-bold py-4 rounded-xl uppercase tracking-widest text-xs disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Login'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="font-display text-3xl text-white uppercase">Player Management</h2>
              <div className="flex gap-4">
                <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">Sign Out</button>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white"><X /></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-8">
              <table className="w-full text-left text-white/80">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest font-black">
                    <th className="py-4 px-2">Player</th>
                    <th className="py-4 px-2">Category</th>
                    <th className="py-4 px-2">Status</th>
                    <th className="py-4 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {players.map(player => (
                    <tr key={player.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-2">
                        <div className="font-bold text-white">{player.name}</div>
                        <div className="text-[10px] opacity-40 uppercase">{player.registeredAt}</div>
                      </td>
                      <td className="py-4 px-2 text-xs">{player.category}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${player.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {player.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-right space-x-2">
                        <button
                          onClick={() => onUpdateStatus(player.id, player.status === 'pending' ? 'confirmed' : 'pending')}
                          className="p-2 hover:bg-[#CC5500]/20 text-[#CC5500] rounded-lg transition-colors"
                          title="Toggle Status"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => onDeletePlayer(player.id)}
                          className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          title="Remove Player"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Players View (Dedicated Page) ---
const PlayersView = ({ players, onBack }: { players: Player[]; onBack: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFDF5] pt-24 pb-40 px-4 md:px-8 animate-reveal overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#CC5500] font-bold uppercase tracking-widest text-xs mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Back to Arena
        </button>

        <div className="flex flex-col gap-6 mb-12">
          <div>
            <h1 className="font-display text-4xl md:text-7xl text-[#5C2A11] uppercase leading-none mb-2">Arena Roster</h1>
            <p className="text-[#CC5500] font-black uppercase tracking-[0.4em] text-[10px]">Official Entry List • Feb 2026</p>
          </div>

          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C2A11]/30 group-focus-within:text-[#CC5500] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Filter names or categories..."
              className="w-full bg-white border-2 border-[#5C2A11]/5 rounded-2xl px-12 py-3.5 outline-none focus:border-[#CC5500] transition-all font-semibold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[#F5E6D3]/30 rounded-[2rem] border border-[#CC5500]/10 overflow-hidden shadow-sm">
          <div className="flex flex-col divide-y divide-[#CC5500]/5">
            {filteredPlayers.map((player, index) => (
              <div
                key={player.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-white transition-all group animate-reveal"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#CC5500]/10 rounded-xl flex items-center justify-center font-display text-xl text-[#CC5500] border border-[#CC5500]/10 group-hover:bg-[#CC5500] group-hover:text-white transition-all transform group-hover:rotate-6">
                    {player.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#5C2A11] text-sm md:text-base leading-tight truncate">{player.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#5C2A11]/40 truncate">{player.category}</p>
                      <span className="w-1 h-1 rounded-full bg-[#5C2A11]/10" />
                      <p className="text-[9px] font-bold text-[#5C2A11]/30 uppercase">{player.registeredAt.split(',')[0]}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${player.status === 'confirmed'
                    ? 'bg-green-500/5 text-green-600 border-green-500/10 group-hover:bg-green-500 group-hover:text-white'
                    : 'bg-yellow-500/5 text-yellow-600 border-yellow-500/10 group-hover:bg-yellow-500 group-hover:text-white'
                    }`}>
                    {player.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---
const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'players'>('landing');
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('registered_at', { ascending: false });

      if (data) {
        // Map snake_case DB fields to camelCase local state if needed
        const mappedPlayers = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          phone: p.phone,
          category: p.category,
          ratingId: p.rating_id,
          status: p.status,
          registeredAt: new Date(p.registered_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })
        }));
        setPlayers(mappedPlayers);
      }
    };

    fetchPlayers();

    // Set up real-time subscription
    const subscription = supabase
      .channel('players_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
        fetchPlayers(); // Refresh data on any change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      if (view === 'landing') {
        const sections = ['home', 'experience', 'rewards'];
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 250 && rect.bottom >= 250) {
              setActiveSection(section);
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  const handleRegister = async (data: Omit<Player, 'id' | 'status' | 'registeredAt'>) => {
    const { error } = await supabase
      .from('players')
      .insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          category: data.category,
          rating_id: data.ratingId,
          status: 'pending' // Default status
        }
      ]);

    if (error) {
      alert('Error registering: ' + error.message);
      return;
    }

    // UI updates are handled by the real-time subscription
    // But we still want to navigate
    setView('players');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const updatePlayerStatus = async (id: string, status: 'pending' | 'confirmed') => {
    await supabase
      .from('players')
      .update({ status })
      .eq('id', id);
  };

  const deletePlayer = async (id: string) => {
    if (confirm('Are you sure you want to remove this player?')) {
      await supabase
        .from('players')
        .delete()
        .eq('id', id);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#5C2A11] linen-texture">
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegister={handleRegister}
      />
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        players={players}
        onUpdateStatus={updatePlayerStatus}
        onDeletePlayer={deletePlayer}
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 transition-all duration-700 ${isScrolled || view === 'players' ? 'bg-[#FFFDF5]/90 backdrop-blur-xl shadow-xl py-3' : 'bg-transparent py-6'}`}>
        <div className="cursor-pointer group" onClick={() => { setView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <img
            src="https://i.ibb.co/Fbq9Msg4/unnamed-88-removebg-preview-removebg-preview.png"
            alt="The Wordsmiths Arena Logo"
            className="h-14 md:h-20 w-auto object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
          />
        </div>

        <div className="hidden md:flex items-center gap-10">
          {view === 'landing' ? (
            ['Experience', 'Rewards'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-xs font-bold text-[#5C2A11]/80 hover:text-[#CC5500] transition-all uppercase tracking-widest relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CC5500] transition-all group-hover:w-full"></span>
              </a>
            ))
          ) : (
            <button onClick={() => setView('landing')} className="text-xs font-bold text-[#5C2A11]/80 hover:text-[#CC5500] transition-all uppercase tracking-widest relative group">
              Back to Arena
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CC5500] transition-all group-hover:w-full"></span>
            </button>
          )}
          <button onClick={() => setView('players')} className={`text-xs font-bold uppercase tracking-widest transition-all ${view === 'players' ? 'text-[#CC5500]' : 'text-[#5C2A11]/80 hover:text-[#CC5500]'}`}>
            Roster
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-orange flex items-center gap-2 text-white text-[10px] md:text-xs font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-lg shadow-xl"
          >
            Register Now
            <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </nav>

      {view === 'landing' ? (
        <>
          <section id="home" className="relative h-screen min-h-[800px] flex flex-col items-center justify-center text-center px-4 overflow-hidden hero-gradient">
            <div className="absolute bottom-0 left-0 w-full h-[60%] z-0 landscape-mask opacity-60 pointer-events-none">
              <svg viewBox="0 0 1440 800" className="w-full h-full object-cover">
                <path d="M0 600 L200 500 L500 650 L800 520 L1100 680 L1440 550 V800 H0 Z" fill="#CC5500" className="animate-float" />
                <path d="M0 700 L300 650 L600 750 L1000 620 L1440 780 V800 H0 Z" fill="#994000" className="animate-float" style={{ animationDelay: '-2s' }} />
                <path d="M0 750 Q400 700 800 750 T1440 750 V800 H0 Z" fill="#7A3300" className="animate-float" style={{ animationDelay: '-4s' }} />
              </svg>
            </div>

            <div className="fixed right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end gap-6 pointer-events-none hidden lg:flex">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CC5500] mb-4 block pointer-events-auto transition-all hover:tracking-[0.5em] cursor-default">The Journey</span>
              <div className="flex flex-col gap-3 pointer-events-auto">
                {['home', 'experience', 'rewards'].map(sec => (
                  <a key={sec} href={`#${sec}`} className={`nav-dot ${activeSection === sec ? 'active' : ''}`}></a>
                ))}
              </div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#CC5500]/20 blur-[100px] rounded-full animate-pulse"></div>
                <img
                  src="https://i.ibb.co/Fbq9Msg4/unnamed-88-removebg-preview-removebg-preview.png"
                  alt="The Wordsmiths Arena Logo"
                  className="h-48 md:h-[450px] w-auto object-contain drop-shadow-2xl relative animate-reveal zoom-in"
                />
              </div>

              <RevealOnScroll delay={200}>
                <p className="text-[#5C2A11]/80 font-bold text-xs md:text-lg mb-4 uppercase tracking-[0.3em]">Feb 7, 2026 • 10 Rounds • CSW24</p>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <h1 className="font-display text-6xl md:text-8xl lg:text-[9.5rem] leading-[0.8] text-[#5C2A11] uppercase tracking-tighter mb-10 drop-shadow-2xl">
                  OPEN SCRABBLE<br />RETREAT
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={400}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-orange text-white font-display text-2xl md:text-3xl lg:text-4xl px-10 md:px-12 lg:px-14 py-6 md:py-8 rounded-3xl shadow-2xl mb-12 uppercase tracking-widest active:scale-95"
                >
                  Register for 10k
                </button>
              </RevealOnScroll>

              <RevealOnScroll delay={500}>
                <Countdown />
              </RevealOnScroll>
            </div>
          </section>

          <main className="pt-32 pb-40 relative z-10">
            {/* SIMPLIFIED LOGISTICS SECTION */}
            <section id="experience" className="max-w-7xl mx-auto px-8 mb-60">
              <RevealOnScroll>
                <div className="text-center mb-24">
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-display text-[#5C2A11] uppercase tracking-tighter">EVENT DETAILS</h2>
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TOURNAMENT_DETAILS.map((detail, idx) => (
                  <RevealOnScroll key={idx} delay={idx * 100} direction="up" className="h-full">
                    <div className="relative group h-full">
                      {/* Wooden Frame */}
                      <div className="absolute inset-0 bg-[#1A0D05] rounded-[2rem] transform translate-y-2 group-hover:translate-y-4 transition-transform shadow-2xl"></div>
                      <div className="relative bg-[#1A0D05] p-3 rounded-[2rem] shadow-xl transform group-hover:-translate-y-1 transition-transform duration-300 h-full">

                        {/* Wood Texture on Frame */}
                        <div className="absolute inset-0 rounded-[2rem] opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] pointer-events-none"></div>

                        {/* Inner Parchment Area */}
                        <div className="relative bg-[#F5E6D3] rounded-[1.5rem] p-6 h-full border border-[#5C2A11]/10 overflow-hidden group-hover:bg-[#FFF8F0] transition-colors flex flex-col justify-between">
                          {/* Inner Shadow/Texture */}
                          <div className="absolute inset-0 bg-[#5C2A11]/5 pointer-events-none mix-blend-multiply"></div>

                          <div className="relative z-10">
                            <div className="w-12 h-12 bg-[#5C2A11]/10 rounded-xl flex items-center justify-center text-[#5C2A11] mb-6 group-hover:scale-110 group-hover:bg-[#CC5500] group-hover:text-white transition-all duration-300">
                              {detail.icon}
                            </div>
                            <div>
                              <p className="text-[#5C2A11]/60 text-[10px] font-black uppercase tracking-widest mb-1">{detail.label}</p>
                              <p className="text-2xl font-display text-[#5C2A11] uppercase">{detail.value}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
                {/* Special Rating Highlight */}
                <RevealOnScroll delay={TOURNAMENT_DETAILS.length * 100} direction="up" className="h-full">
                  <div className="bg-[#5C2A11] rounded-[2rem] p-8 shadow-xl flex flex-col justify-center items-center text-center group relative overflow-hidden h-full">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')] opacity-20"></div>
                    <Shield className="w-12 h-12 text-[#CC5500] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-display text-white uppercase mb-2">NSF Rated</h3>
                    <p className="text-white/60 text-sm italic">Officially Sanctioned Point Earning Event</p>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Quick Rule Footer */}
              <div className="mt-16 bg-[#F5E6D3]/30 rounded-2xl p-6 flex flex-wrap justify-center gap-8 border border-[#CC5500]/10">
                <div className="flex items-center gap-3">
                  <Book size={18} className="text-[#CC5500]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#5C2A11]/60">CSW24 Dictionary Only</span>
                </div>
              </div>
            </section>

            {/* Registered Players Teaser */}
            <section className="max-w-7xl mx-auto px-8 mb-60">
              <RevealOnScroll>
                <div className="mahogany-panel rounded-[4rem] p-12 md:p-20 lg:p-32 relative overflow-hidden shadow-2xl border-4 border-[#CC5500]/10 flex flex-col items-center text-center group">
                  <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/wood-grain.png')] opacity-40"></div>
                  <div className="relative z-10 max-w-3xl">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-display text-[#F5E6D3] uppercase mb-10 leading-tight tracking-tighter">THE RACK<br />IS FILLING.</h2>
                    <p className="text-[#F5E6D3]/50 text-xl md:text-2xl lg:text-3xl mb-14 leading-relaxed font-light">Join the elite circle of wordsmiths. {players.length} contenders already verified.</p>
                    <button
                      onClick={() => setView('players')}
                      className="px-12 md:px-20 py-6 md:py-8 rounded-[2.5rem] bg-[#CC5500] text-white font-display text-2xl md:text-4xl uppercase hover:bg-[#F5E6D3] hover:text-[#5C2A11] transition-all shadow-2xl transform hover:scale-110"
                    >
                      Enter the Arena
                    </button>
                  </div>
                </div>
              </RevealOnScroll>
            </section>

            {/* Redesigned Rewards Section */}
            <section id="rewards" className="max-w-7xl mx-auto px-8 mb-60">
              <RevealOnScroll>
                <div className="text-center mb-32">
                  <span className="text-[#CC5500] font-black uppercase tracking-[0.8em] text-[12px] mb-6 block">THE HALL OF CHAMPIONS</span>
                  <h2 className="text-6xl md:text-7xl lg:text-[10rem] font-display text-[#5C2A11] uppercase tracking-tighter leading-[0.8]">PRIZE BOUNTY.</h2>
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
                {/* 2nd Place Style: Intermediate */}
                <div className="md:col-span-4 order-2 md:order-1">
                  <RevealOnScroll delay={200}>
                    <div className="bg-stone-200/50 p-12 md:p-6 lg:p-12 rounded-[3.5rem] border-t-8 border-stone-300 flex flex-col items-center text-center group hover:bg-white transition-all shadow-xl">
                      <div className="w-24 h-24 rounded-full bg-stone-300 flex items-center justify-center text-stone-600 mb-8 shadow-inner transform group-hover:rotate-12 transition-transform">
                        <Medal size={48} />
                      </div>
                      <h3 className="text-3xl font-display text-[#5C2A11] uppercase mb-2">{PRIZE_CATEGORIES[1].title}</h3>
                      <div className="text-[#CC5500] font-black text-xs uppercase tracking-widest mb-6">{PRIZE_CATEGORIES[1].count} PLACES</div>
                      <p className="text-[#5C2A11]/50 text-lg leading-relaxed">{PRIZE_CATEGORIES[1].description}</p>
                    </div>
                  </RevealOnScroll>
                </div>

                {/* 1st Place Style: Masters Tier */}
                <div className="md:col-span-4 order-1 md:order-2">
                  <RevealOnScroll>
                    <div className="mahogany-panel p-14 md:p-8 lg:p-14 rounded-[4rem] border-t-8 border-[#BF953F] flex flex-col items-center text-center group relative shadow-2xl scale-105 z-20">
                      <div className="absolute -top-10 inset-x-0 flex justify-center">
                        <div className="bg-[#BF953F] px-8 py-2 rounded-full text-white font-black text-[10px] tracking-[0.4em] uppercase shadow-lg">PREMIER TIER</div>
                      </div>
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#BF953F] to-[#AA771C] flex items-center justify-center text-white mb-10 shadow-2xl transform group-hover:scale-110 transition-transform">
                        <Trophy size={64} />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-display gold-shimmer uppercase mb-4 leading-none">{PRIZE_CATEGORIES[0].title}</h3>
                      <div className="text-[#F5E6D3]/40 font-black text-sm uppercase tracking-widest mb-8">{PRIZE_CATEGORIES[0].count} ELITE SLOTS</div>
                      <p className="text-[#F5E6D3]/60 text-xl leading-relaxed italic">{PRIZE_CATEGORIES[0].description}</p>
                    </div>
                  </RevealOnScroll>
                </div>

                {/* 3rd Place Style: Opens Tier */}
                <div className="md:col-span-4 order-3 md:order-3">
                  <RevealOnScroll delay={400}>
                    <div className="bg-amber-100/30 p-12 md:p-6 lg:p-12 rounded-[3.5rem] border-t-8 border-amber-200 flex flex-col items-center text-center group hover:bg-white transition-all shadow-xl">
                      <div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 mb-8 shadow-inner transform group-hover:rotate-[-12deg] transition-transform">
                        <Star size={48} />
                      </div>
                      <h3 className="text-3xl font-display text-[#5C2A11] uppercase mb-2">{PRIZE_CATEGORIES[2].title}</h3>
                      <div className="text-[#CC5500] font-black text-xs uppercase tracking-widest mb-6">{PRIZE_CATEGORIES[2].count} PLACES</div>
                      <p className="text-[#5C2A11]/50 text-lg leading-relaxed">{PRIZE_CATEGORIES[2].description}</p>
                    </div>
                  </RevealOnScroll>
                </div>
              </div>
            </section>

            {/* FINAL HIGH-IMPACT CTA */}
            <section className="max-w-7xl mx-auto px-8 mb-40">
              <div className="relative group overflow-hidden rounded-[4rem]">
                {/* High contrast background */}
                <div className="absolute inset-0 bg-[#CC5500] group-hover:bg-[#B34B00] transition-colors duration-700"></div>

                {/* Diegetic Accents */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>

                <RevealOnScroll>
                  <div className="relative z-10 flex flex-col items-center text-center py-24 md:py-40 px-8">
                    <div className="mb-12 flex items-center justify-center gap-6 md:gap-10">
                      <ScrabbleTile letter="T" points={1} size="md" variant="light" className="rotate-[-10deg] shadow-2xl" />
                      <ScrabbleTile letter="H" points={4} size="md" variant="light" className="rotate-[5deg] shadow-2xl" />
                      <ScrabbleTile letter="E" points={1} size="md" variant="light" className="rotate-[-5deg] shadow-2xl" />
                    </div>

                    <h2 className="text-5xl md:text-7xl lg:text-[9rem] font-display text-white uppercase leading-[0.85] tracking-tighter mb-12">
                      FINAL<br />MOVE IS YOURS.
                    </h2>

                    <p className="text-white/80 text-xl md:text-3xl max-w-2xl mb-16 leading-relaxed font-light">
                      Don't stay on the sidelines. The tiles are set, the clocks are waiting, and the arena belongs to those who dare to play.
                    </p>

                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-white text-[#CC5500] font-display text-2xl md:text-3xl lg:text-3xl px-12 md:px-20 py-6 md:py-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all uppercase flex items-center justify-center gap-4"
                    >
                      Claim My Spot <ArrowRight size={28} />
                    </button>
                  </div>
                </RevealOnScroll>

              </div>

            </section>
          </main>
        </>
      ) : (
        <PlayersView players={players} onBack={() => setView('landing')} />
      )}

      <div className="fixed bottom-10 right-10 z-[60] flex flex-col gap-4 pointer-events-none">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`p-4 bg-white border border-[#CC5500]/20 rounded-full shadow-2xl text-[#CC5500] transition-all duration-500 pointer-events-auto hover:bg-[#CC5500] hover:text-white active:scale-90 ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <ChevronRight className="-rotate-90" size={24} />
        </button>
      </div>

      {/* Admin Trigger */}
      <div className="fixed bottom-4 left-4 z-[60]">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="p-2 bg-black/5 rounded-full text-[#5C2A11]/20 hover:bg-black/10 hover:text-[#CC5500] transition-colors"
          title="Admin Access"
        >
          <Lock size={16} />
        </button>
      </div>
    </div >
  );
};

export default App;