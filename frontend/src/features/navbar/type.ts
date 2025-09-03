export type NavPosition = 'left' | 'center' | 'right';
export type NavVariant = 'brand' | 'link' | 'menu' | 'text' | 'contained';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  position: NavPosition;
  order: number;
  variant?: NavVariant;
}
