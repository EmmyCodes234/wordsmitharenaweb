
// Add React import to define the React namespace used for types
import React from 'react';

export interface TournamentDetail {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export interface PrizeCategory {
  title: string;
  count: number;
  description: string;
}