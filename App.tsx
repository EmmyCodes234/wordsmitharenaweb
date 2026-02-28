import React, { useState, useEffect } from 'react';
import {
  MapPin, Clock, Calendar, Trophy, Info,
  ExternalLink, Mail, Phone, Star, Medal,
  Shield, Book, Zap, ChevronDown, X, ChevronRight, ChevronLeft, Check, Lock, User, Trash2, Search, ArrowLeft,
  Settings, UserCheck, Menu, FileText,
  Target,
  ArrowRight,
  Copy
} from 'lucide-react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Countdown from './components/Countdown';
import ScrabbleTile from './components/ScrabbleTile';
import RegisteredPlayers from './components/RegisteredPlayers';
import { Home } from './components/Home';
import { PaymentModal } from './components/PaymentModal';
import { RegistrationModal } from './components/RegistrationModal';
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

// --- Menu Overlay ---
const MenuOverlay = ({
  isOpen,
  onClose,
  onRegister
}: { isOpen: boolean; onClose: () => void; onRegister: (e: React.MouseEvent) => void }) => {
  const [activeTab, setActiveTab] = useState('/');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  if (!isOpen) return null;

  const menuItems = [
    { id: '/', label: 'Home' },
    { id: '/tournaments', label: 'Tournaments' },
    { id: '/gallery', label: 'Gallery' },
    { id: '/registered-players', label: 'Player List' },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-white animate-reveal overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 md:px-12 py-8">
        <button onClick={onClose} className="flex items-center gap-4 group hover:opacity-70 transition-opacity">
          <X size={32} className="text-black group-hover:rotate-90 transition-transform duration-500" strokeWidth={1.5} />
          <span className="font-medium text-black text-xl">Close</span>
        </button>
        
        {/* Center Logo Mark (Abstract X) -> now Wordsmith Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => { navigate('/'); onClose(); }}>
          <img src="/wordsmithslogo.png" alt="Wordsmiths Arena Logo" className="h-16 md:h-20 lg:h-24 object-contain" />
        </div>

        <div className="flex items-center gap-6">
           <button onClick={(e) => { onClose(); onRegister(e); }} className="bg-noovo-yellow text-black font-medium rounded-full px-6 py-2.5 sm:px-8 sm:py-3 text-sm hover:scale-105 transition-transform">
             Register Now
           </button>
           <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-black/10 overflow-hidden cursor-pointer hover:border-black/30 transition-colors">
             <img src="/IMG-20260228-WA0010.jpg" className="w-full h-full object-cover"/>
           </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 md:p-12 gap-12 lg:gap-24 max-w-[1600px] mx-auto w-full">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-80 flex flex-col gap-1 mt-4">
           {menuItems.map(item => (
             <button 
               key={item.id}
               onMouseEnter={() => setActiveTab(item.id)}
               onClick={() => { navigate(item.id); onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
               className={`text-left text-2xl md:text-3xl tracking-tight font-light py-4 px-8 rounded-[2rem] transition-colors ${
                 (activeTab === item.id) ? 'bg-black text-white font-normal' : 'text-black/70 hover:text-black hover:bg-black/5'
               }`}
             >
               {item.label}
             </button>
           ))}
        </div>

        {/* Dynamic Content Area based on screenshot */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 h-full pb-12">
            {/* Left large card */}
            <div className="relative rounded-[2.5rem] overflow-hidden group row-span-2 hidden md:block">
              <img src="/IMG-20260228-WA0011.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-black/40 p-12 flex flex-col justify-center items-center text-center">
                 <h2 className="text-white text-4xl lg:text-5xl font-medium mb-6">Inside the Arena</h2>
                 <p className="text-white/80 text-lg mb-10">Where Scrabble Meets Excellence</p>
                 <button onClick={() => { navigate('/'); onClose(); }} className="bg-noovo-yellow text-black font-medium py-3 px-10 rounded-full hover:scale-105 transition-transform shadow-lg">Discover</button>
              </div>
            </div>

            {/* Top Right card */}
            <div className="relative rounded-[2.5rem] overflow-hidden group min-h-[250px] shadow-sm">
              <img src="/IMG-20260228-WA0012.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-center items-center text-center">
                 <h2 className="text-white text-3xl font-medium mb-4">Tournaments</h2>
                 <p className="text-white/80 text-base mb-8">Upcoming matches & ratings</p>
                 <button onClick={() => { navigate('/tournaments'); onClose(); }} className="bg-noovo-yellow text-black font-medium py-3 px-8 text-sm rounded-full hover:scale-105 transition-transform shadow-lg">Plan your visit</button>
              </div>
            </div>

            {/* Bottom Right card */}
            <div className="relative rounded-[2.5rem] overflow-hidden group min-h-[250px] shadow-sm">
              <img src="/IMG-20260228-WA0013.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-black/40 p-8 flex flex-col justify-center items-center text-center">
                 <h2 className="text-white text-3xl font-medium mb-4">Gallery</h2>
                 <p className="text-white/80 text-base mb-8">Experience the action.</p>
                 <button onClick={() => { navigate('/gallery'); onClose(); }} className="bg-noovo-yellow text-black font-medium py-3 px-8 text-sm rounded-full hover:scale-105 transition-transform shadow-lg">View Gallery</button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
const GalleryView = () => {
  const images = [
    "/IMG-20260228-WA0014.jpg",
    "/IMG-20260228-WA0015.jpg",
    "/IMG-20260228-WA0016.jpg",
    "/IMG-20260228-WA0024.jpg",
    "/IMG-20260207-WA0029.jpg",
    "/IMG-20260207-WA0036.jpg",
    "/1001876893.jpg",
    "/1001876894.jpg",
    "/1001876956.jpg"
  ];
  return (
    <div className="min-h-screen bg-white pt-32 pb-40 px-6 md:px-12 animate-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-7xl text-black font-medium tracking-tight mb-4">The Gallery</h1>
          <p className="text-black/50 text-base font-light">Memories from the Arena</p>
        </div>
        <div className="columns-1 md:columns-2 gap-6 space-y-6">
          {images.map((src, idx) => (
            <div key={idx} className="break-inside-avoid overflow-hidden rounded-[2rem] shadow-sm group cursor-pointer relative border border-black/5">
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
              <img src={src} alt="Gallery Event" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Tourneys View ---
const TourneysView: React.FC<{ onRegister: (e: React.MouseEvent) => void }> = ({ onRegister }) => {
  const tourneys = [
    {
      id: 1,
      title: "Second Edition",
      date: "March 7, 2026",
      status: "Upcoming",
      link: "https://direktorpro.xyz/public/thewordsmithsarenajanuary26",
      img: "/wordsmithsmarch26.jpg"
    },
    {
      id: 2,
      title: "First Edition",
      date: "February 2026",
      status: "Completed",
      link: "https://direktorpro.xyz/public/thewordsmithsarenajanuary26",
      img: "/IMG-20260228-WA0018.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-32 pb-40 px-6 md:px-12 animate-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-7xl text-black font-medium tracking-tight mb-4">Tournaments</h1>
          <p className="text-black/50 text-base font-light">Past & Upcoming Battles</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tourneys.map(t => (
            <a key={t.id} href={t.status === 'Upcoming' ? "#" : t.link} onClick={t.status === 'Upcoming' ? onRegister : undefined} target={t.status === 'Upcoming' ? undefined : "_blank"} rel={t.status === 'Upcoming' ? undefined : "noopener noreferrer"} className="group block h-full">
              <div className="bg-white rounded-[2rem] p-6 border border-black/5 hover:border-black/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                <div className="w-full h-64 rounded-[1.5rem] overflow-hidden mb-8 relative">
                  <div className={`absolute top-4 right-4 z-10 px-4 py-2 rounded-full font-medium text-xs ${t.status === 'Upcoming' ? 'bg-noovo-yellow text-black' : 'bg-black/50 text-white backdrop-blur-md'}`}>
                    {t.status}
                  </div>
                  <img src={t.img} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="px-4 pb-4 flex-1 flex flex-col">
                  <h3 className="text-2xl md:text-3xl font-medium text-black mb-2 group-hover:text-black/70 transition-colors">{t.title}</h3>
                  <p className="text-black/50 font-light text-sm mb-6 flex items-center gap-2">
                    <Calendar size={16} />
                    {t.date}
                  </p>
                  <div className="mt-auto flex items-center text-black font-medium text-sm group-hover:underline transition-all">
                    {t.status === 'Upcoming' ? 'Register Now' : 'View Details'} <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/register');
    setIsModalOpen(true);
  };

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
      if (view === 'home') {
        const sections = ['hero', 'next-event', 'rewards'];
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
  }, [location.pathname]);

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
        onClose={() => {
          setIsModalOpen(false);
          // Gently push back up the history stack when closing without explicit success
          if (location.pathname === '/register') { navigate(-1); }
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setIsPaymentModalOpen(true);
          // Redirect to a cleaner URL
          navigate('/');
        }}
      />
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        players={players}
        onUpdateStatus={updatePlayerStatus}
        onDeletePlayer={deletePlayer}
      />
      <MenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onRegister={handleRegisterClick}
      />

      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-3 md:py-4 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-white shadow-sm' : 'bg-transparent'}`}>
        {/* Left Side Navigation */}
        <div className="flex items-center gap-8 z-20 flex-1">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors flex items-center justify-center gap-3 group">
            <Menu size={20} className={isScrolled || location.pathname !== '/' ? 'text-black' : 'text-white'} />
            <span className={`text-sm font-medium ${isScrolled || location.pathname !== '/' ? 'text-black' : 'text-white'} group-hover:opacity-70 transition-opacity`}>Menu</span>
          </button>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 z-20">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/wordsmithslogo.png" alt="Wordsmiths Arena Logo" className="h-10 sm:h-12 md:h-16 object-contain transition-all duration-300" />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 z-20 flex-1 justify-end">
          <button
            onClick={handleRegisterClick}
            className="hidden md:flex items-center gap-2 bg-noovo-yellow text-black font-semibold px-6 py-2.5 rounded-full hover:bg-[#E5A600] transition-colors text-sm"
          >
            Register Now
          </button>
          <div className="flex bg-black/10 backdrop-blur-md rounded-full p-1 items-center border border-white/20 cursor-pointer hover:bg-black/20 transition-colors" onClick={() => navigate('/registered-players')}>
             <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white flex-shrink-0">
               <img src="/IMG-20260228-WA0022.jpg" alt="User Avatar" className="w-full h-full object-cover" />
             </div>
             <span className={`hidden sm:inline px-4 text-sm font-medium ${isScrolled || location.pathname !== '/' ? 'text-black' : 'text-white'}`}>Build Your Profile</span>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/tournaments" element={<TourneysView onRegister={handleRegisterClick} />} />
        <Route path="/registered-players" element={<RegisteredPlayers />} />
        <Route path="/register" element={<Home />} />

      </Routes>

      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex flex-col gap-4 pointer-events-none">
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

      {/* Global Minimalist Footer */}
      <footer className="w-full bg-white pt-20 pb-12 px-6 md:px-12 border-t border-black/5 relative z-50 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
             <div className="mb-8">
               <img src="/wordsmithslogo.png" alt="Wordsmiths Arena Logo" className="h-20 md:h-24 object-contain" />
             </div>
             <div className="flex flex-col gap-4 text-black/60 font-light text-sm mb-12">
               <p className="flex items-center gap-2">
                 <span className="w-6 text-center">📞</span> +234 703 484 9762
               </p>
               <p className="flex items-center gap-2">
                 <span className="w-6 text-center">✉️</span> info@thewordsmithsarena.com.ng
               </p>
               <p className="flex items-center gap-2">
                 <span className="w-6 text-center">📍</span> Plot 3155a Eko Akete, New Rd,<br/>Amuwo-Odofin, Lagos
               </p>
             </div>
             <p className="text-black/30 text-[10px] leading-relaxed">
               The Wordsmiths Arena provides the information on this website for general purposes only. We make no guarantees or warranties, express or implied, regarding the accuracy, reliability, or availability of the information, products, services, or related graphics and renderings on this site for any purpose.
             </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-sm">
             <div className="flex flex-col gap-3">
               <span className="text-black/40 mb-2">Events</span>
               <Link to="/tournaments" className="text-black font-medium hover:text-black/60" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Tournaments</Link>
               <Link to="/registered-players" className="text-black font-medium hover:text-black/60" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Player List</Link>
               <Link to="/gallery" className="text-black font-medium hover:text-black/60" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Gallery</Link>
             </div>
             <div className="flex flex-col gap-3">
               <span className="text-black/40 mb-2">Play</span>
               <a href="https://woogles.io" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:text-black/60">Woogles</a>
               <a href="https://isc.ro" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:text-black/60">Internet Scrabble Club</a>
             </div>
             <div className="flex flex-col gap-3">
               <span className="text-black/40 mb-2">Study</span>
               <a href="https://aerolith.org" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:text-black/60">Aerolith</a>
               <a href="https://xerafin.net" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:text-black/60">Xerafin</a>
               <a href="https://wordsmithapp.netlify.app" target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:text-black/60">Wordsmith (App)</a>
             </div>
             <div className="flex flex-col gap-3">
               <span className="text-black/40 mb-2">The Arena</span>
               <a href="#" className="text-black font-medium hover:text-black/60">Mission</a>
               <a href="#" className="text-black font-medium hover:text-black/60">Director</a>
               <a href="#" className="text-black font-medium hover:text-black/60">FAQ</a>
               <a href="#" className="text-black font-medium hover:text-black/60">Contact Us</a>
             </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-black/60">
          <div className="flex gap-6">
            <a href="#" className="hover:text-black">Terms of Event</a>
            <a href="#" className="hover:text-black">Privacy Policy</a>
          </div>
          <p>© 2026 Wordsmiths Arena. All Rights Reserved.</p>
        </div>
      </footer>
    </div >
  );
};

export default App;