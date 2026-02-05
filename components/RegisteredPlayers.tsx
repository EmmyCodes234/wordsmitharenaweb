import React, { useState } from 'react';
import { Search, ArrowLeft, Users, Trophy, Target } from 'lucide-react';
import { RegisteredPlayer } from '../types';

const REGISTERED_PLAYERS: RegisteredPlayer[] = [
  { id: 1, name: "Monday Christopher", category: "Intermediate", seed: 1 },
  { id: 2, name: "Ben Humbe", category: "Intermediate", seed: 2 },
  { id: 3, name: "John Aiyedun", category: "Masters", seed: 3 },
  { id: 4, name: "Sophia Ekeruche", category: "Intermediate", seed: 4 },
  { id: 5, name: "Charles Uzamere", category: "Intermediate", seed: 5 },
  { id: 6, name: "Julius Adeyemi", category: "Intermediate", seed: 6 },
  { id: 7, name: "Segun Durojaiye", category: "Masters", seed: 7 },
  { id: 8, name: "Adowei Ebikeme", category: "Intermediate", seed: 8 },
  { id: 9, name: "Olumide Oyejide", category: "Masters", seed: 9 },
  { id: 10, name: "David Ojih", category: "Masters", seed: 10 },
  { id: 11, name: "Hassan Wasiu", category: "Masters", seed: 11 },
  { id: 12, name: "Ewruje James", category: "Masters", seed: 12 },
  { id: 13, name: "Bukunmi Afolayan", category: "Intermediate", seed: 13 },
  { id: 14, name: "Kareem Jamiu", category: "Intermediate", seed: 14 },
  { id: 15, name: "Ezinna Lovejoy", category: "Opens", seed: 15 },
  { id: 16, name: "Benjamin Akpotu", category: "Intermediate", seed: 16 },
  { id: 17, name: "Anthony Odok", category: "Masters", seed: 17 },
  { id: 18, name: "Cyril Umebiye", category: "Masters", seed: 18 },
  { id: 19, name: "Tunde Saporu", category: "Masters", seed: 19 },
  { id: 20, name: "Ibukun Agbelekale", category: "Opens", seed: 20 },
  { id: 21, name: "Effiong Bassey", category: "Intermediate", seed: 21 },
  { id: 22, name: "Sunday Ituah", category: "Intermediate", seed: 22 }
];

const RegisteredPlayers: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = REGISTERED_PLAYERS.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryStats = () => {
    const stats = REGISTERED_PLAYERS.reduce((acc, player) => {
      const category = player.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(stats).map(([category, count]) => ({ category, count }));
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] pt-24 pb-40 px-4 md:px-8 animate-reveal overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#CC5500] font-bold uppercase tracking-widest text-xs mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Back to Arena
        </button>

        <div className="flex flex-col gap-8 mb-12">
          <div className="text-center">
            <h1 className="font-display text-5xl md:text-7xl text-[#5C2A11] uppercase leading-none mb-4">
              Registered Players
            </h1>
            <p className="text-[#CC5500] font-black uppercase tracking-[0.4em] text-[10px]">
              Official Entry List • Feb 2026
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#F5E6D3]/50 rounded-2xl p-6 text-center border border-[#CC5500]/10">
              <Users className="w-8 h-8 text-[#CC5500] mx-auto mb-3" />
              <div className="font-display text-3xl text-[#5C2A11]">{REGISTERED_PLAYERS.length}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#5C2A11]/60">Total Players</div>
            </div>
            <div className="bg-[#F5E6D3]/50 rounded-2xl p-6 text-center border border-[#CC5500]/10">
              <Trophy className="w-8 h-8 text-[#CC5500] mx-auto mb-3" />
              <div className="font-display text-3xl text-[#5C2A11]">24</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#5C2A11]/60">Capacity</div>
            </div>
            <div className="bg-[#F5E6D3]/50 rounded-2xl p-6 text-center border border-[#CC5500]/10">
              <Target className="w-8 h-8 text-[#CC5500] mx-auto mb-3" />
              <div className="font-display text-3xl text-[#5C2A11]">
                {Math.round((REGISTERED_PLAYERS.length / 24) * 100)}%
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#5C2A11]/60">Occupancy</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-2xl mx-auto group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5C2A11]/30 group-focus-within:text-[#CC5500] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search players..."
              className="w-full bg-white border-2 border-[#5C2A11]/5 rounded-2xl px-12 py-3.5 outline-none focus:border-[#CC5500] transition-all font-semibold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Players Grid */}
        <div className="bg-[#F5E6D3]/30 rounded-[2rem] border border-[#CC5500]/10 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#CC5500]/5">
            {filteredPlayers.map((player, index) => (
              <div
                key={player.id}
                className="p-6 flex items-center gap-4 hover:bg-white transition-all group animate-reveal"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex-shrink-0 w-14 h-14 bg-[#CC5500]/10 rounded-xl flex items-center justify-center font-display text-xl text-[#CC5500] border border-[#CC5500]/10 group-hover:bg-[#CC5500] group-hover:text-white transition-all transform group-hover:rotate-6">
                  {player.seed}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#5C2A11] text-base leading-tight truncate">
                    {player.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-[#5C2A11]/5 text-[#5C2A11] text-[9px] font-black uppercase rounded-full">
                      {player.category}
                    </span>
                    {player.seed && (
                      <span className="text-[9px] font-bold text-[#CC5500] uppercase">
                        #{player.seed} Seed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredPlayers.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-[#5C2A11]/60">No players found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Category Distribution */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-[#CC5500]/10">
          <h3 className="font-display text-2xl text-[#5C2A11] mb-6 text-center">Category Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {getCategoryStats().map(({ category, count }) => (
              <div key={category} className="flex items-center justify-between p-4 bg-[#F5E6D3]/30 rounded-xl">
                <span className="font-bold text-[#5C2A11]">{category}</span>
                <span className="font-display text-xl text-[#CC5500]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredPlayers;