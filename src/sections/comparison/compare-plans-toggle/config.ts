export interface ComparePlansToggleConfig {
  billing: 'monthly' | 'yearly';
  yearlyDiscount: number;
  featured: 'starter' | 'growth' | 'scale';
  currency: '$' | '€' | '£';
  radius: number;
  background: string;
  textColor: string;
  accent: string;
  animatePrice: boolean;
}

export const defaults: ComparePlansToggleConfig = {
  billing: 'monthly',
  yearlyDiscount: 20,
  featured: 'growth',
  currency: '$',
  radius: 22,
  background: '#f7f5ff',
  textColor: '#17142b',
  accent: '#6d4aff',
  animatePrice: true,
};
