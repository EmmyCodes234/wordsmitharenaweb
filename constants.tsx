
import React from 'react';
import { Users, RotateCcw, BookOpen, Clock, ShieldCheck, Trophy, Medal, Star } from 'lucide-react';
import { TournamentDetail, PrizeCategory } from './types';

export const EVENT_DATE = new Date('2026-02-07T09:00:00+01:00');

export const TOURNAMENT_DETAILS: TournamentDetail[] = [
  {
    icon: <Users className="w-6 h-6" />,
    label: "Player Limit",
    value: "24 Players Max"
  },
  {
    icon: <RotateCcw className="w-6 h-6" />,
    label: "Structure",
    value: "10 Rounds of Play"
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    label: "Lexicon",
    value: "CSW24 Standard"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    label: "Time Control",
    value: "20 Mins Clocks"
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    label: "Rating",
    value: "NSF-Rated Event"
  }
];

export const PRIZE_CATEGORIES: PrizeCategory[] = [
  {
    title: "Masters Tier",
    count: 5,
    description: "Top 5 Overall Winners"
  },
  {
    title: "Intermediate",
    count: 3,
    description: "Top 3 Mid-Tier Players"
  },
  {
    title: "Opens Tier",
    count: 3,
    description: "Top 3 Emerging Talents"
  }
];
