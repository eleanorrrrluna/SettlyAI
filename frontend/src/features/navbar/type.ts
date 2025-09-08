export type NavPosition = 'left' | 'center' | 'right';
export type NavVariant = 'brand' | 'link' | 'menu' | 'text' | 'contained';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  position: NavPosition;
  order: number;
  variant?: NavVariant;
  subItems?: NavItem[];
}

export type RenderGlobalNavButtonArgs = {
  item: NavItem;
  featureButtonHover: HTMLElement | null;
  openFeatureButtMeun: (e: React.MouseEvent<HTMLElement>) => void;
  awayFeatureButton: () => void;
  menuTimerRestart: () => void;
  keepMenuOpen: () => void;
  featureMenuRef: React.RefObject<HTMLDivElement>;
};
