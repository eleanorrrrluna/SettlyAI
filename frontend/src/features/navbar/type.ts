export type NavPosition = 'left' | 'center' | 'right';
export type NavVariant = 'brand' | 'text' | 'contained';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  position: NavPosition;
  order: number;
  variant?: NavVariant;
}
