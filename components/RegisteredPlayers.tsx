import React, { useState } from 'react';
import { Search, ArrowLeft, Users, Trophy, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RegisteredPlayer } from '../types';

const REGISTERED_PLAYERS: RegisteredPlayer[] = [
  { id: 1, name: "Segun Durojaiye", category: "Masters", seed: 1 },
  { id: 2, name: "Benjamin Humbe", category: "Intermediate", seed: 2 },
  { id: 3, name: "Afolayan Bukunmi", category: "Intermediate", seed: 3 },
];

const RegisteredPlayers: React.FC = () => {
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
    <div className="min-h-screen bg-white pt-24 pb-40 px-6 md:px-12 animate-reveal overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2 text-black font-medium text-sm mb-8 sm:mb-12 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft size={16} /> Back to Arena
        </Link>

        <div className="flex flex-col gap-8 mb-16">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl text-black font-medium tracking-tight mb-2">
              Registered Players
            </h1>
            <p className="text-black/50 text-base font-light">
              Official Entry List • Feb 2026
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-[2rem] p-8 text-center border border-black/5 flex flex-col items-center">
              <Users className="w-8 h-8 text-black/40 mb-4" />
              <div className="text-4xl text-black font-medium">{REGISTERED_PLAYERS.length}</div>
              <div className="text-black/40 text-sm font-medium mt-1">Total Players</div>
            </div>
            <div className="bg-white rounded-[2rem] p-8 text-center border border-black/5 flex flex-col items-center">
              <Trophy className="w-8 h-8 text-black/40 mb-4" />
              <div className="text-4xl text-black font-medium">24</div>
              <div className="text-black/40 text-sm font-medium mt-1">Capacity</div>
            </div>
            <div className="bg-white rounded-[2rem] p-8 text-center border border-black/5 flex flex-col items-center">
              <Target className="w-8 h-8 text-black/40 mb-4" />
              <div className="text-4xl text-black font-medium">
                {Math.round((REGISTERED_PLAYERS.length / 24) * 100)}%
              </div>
              <div className="text-black/40 text-sm font-medium mt-1">Occupancy</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-black transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search players..."
              className="w-full bg-white border border-black/10 rounded-full px-14 py-4 outline-none focus:border-black transition-all text-base text-black placeholder:text-black/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Players Grid */}
        <div className="bg-white rounded-[2rem] border border-black/5 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-0 divide-y md:divide-y-[1px] md:divide-x lg:divide-x lg:divide-y-[1px] divide-black/5 border-b-0">
            {filteredPlayers.map((player, index) => (
              <div
                key={player.id}
                className="p-6 flex items-center justify-between hover:bg-black/[0.02] transition-colors group animate-reveal border-b md:border-b-0 lg:border-b border-black/5"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-xl text-black font-medium group-hover:bg-[#111111] group-hover:text-noovo-yellow transition-colors">
                      {player.seed}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-black font-medium text-lg truncate">
                        {player.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-black/50 text-sm">
                          {player.category}
                        </span>
                      </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredPlayers.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-black/50">No players found matching "{searchTerm}"</p>
          </div>
        )}

        {/* Category Distribution */}
        <div className="mt-16 bg-white rounded-[2rem] p-8 md:p-12 border border-black/5">
          <h3 className="text-3xl font-medium text-black mb-10 text-center">Category Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getCategoryStats().map(({ category, count }) => (
              <div key={category} className="flex flex-col items-center justify-center p-8 bg-black/[0.02] rounded-2xl">
                <span className="text-4xl text-black font-medium mb-2">{count}</span>
                <span className="text-black/50 font-medium">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredPlayers;