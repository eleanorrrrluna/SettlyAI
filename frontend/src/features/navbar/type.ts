export type MenuItems = { id: string; label: string; path: string; to: string };

export interface NavItem {
  id: string;
  label: string;
  path: string;
  subItems?: NavItem[];
}

export type FeatureMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onItemClick: () => void;
  items: ReadonlyArray<{ id: string; label: string; to: string }>;
  minWidth?: number;
};

export const NAV_ITEMS: NavItem[] = [
  { id: 'brand', label: 'Settly AI', path: '/' },
  { id: 'about', label: 'About', path: '/about' },
  {
    id: 'features',
    label: 'Features',
    path: '/features',

    subItems: [
      { id: 'explore', label: 'Explore Suburbs', path: '/explore/sydney' },
      { id: 'loan-calc', label: 'Loan Calculator', path: '/loan-calculator' },
      { id: 'super', label: 'Settly Super', path: '/super' },
    ],
  },
  { id: 'ask-robot', label: 'Ask Robot', path: '/chat' },
  { id: 'favourites', label: 'Favourites', path: '/favourites' },
  { id: 'login', label: 'Login', path: '/login' },
  { id: 'join', label: 'Join', path: '/registration' },
];
