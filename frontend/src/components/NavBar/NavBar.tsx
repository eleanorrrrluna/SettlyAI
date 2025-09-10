import { type NavItem, type MenuItems, NAV_ITEMS } from '@/features/navbar';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Typography, styled, Box } from '@mui/material';
import GlobalButton from '../GlobalButton';
import { useRef, useState } from 'react';
import HomeRounded from '@mui/icons-material/HomeRounded';
import React from 'react';
import FeatureMenu from './components/FeatureMenu';

//Setting up the containers
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'row',
  minHeight: 72,
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down(400)]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const LeftContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 0',
  paddingLeft: theme.spacing(6),
  [theme.breakpoints.down(400)]: {
    paddingTop: '8px',
  },
}));

const MiddleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0),
  justifyContent: 'flex-end',
  flex: '1 1 0',
  color: theme.palette.text.primary,
  [theme.breakpoints.down(740)]: {
    display: 'none',
  },
}));

const RightContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flex: '0 0 auto',
  marginLeft: theme.spacing(3),
  paddingRight: theme.spacing(4),
  [theme.breakpoints.down(400)]: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    gap: theme.spacing(3),
  },
}));

//Setting wrapper to add prop 'to' to the GlobalButton component
type GlobalButtonLinkProps = React.ComponentProps<typeof GlobalButton> & { to: string };
const WrappedGlobalButton = React.forwardRef<HTMLButtonElement, GlobalButtonLinkProps>(
  ({ to, className, children, ...props }, ref) => (
    <GlobalButton ref={ref} className={className} component={RouterLink} to={to} {...props}>
      {children}
    </GlobalButton>
  )
);

//Styling for the buttons on NavBar
const LinkButton = styled(WrappedGlobalButton)(({ theme }) => ({
  width: 90,
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
}));

const LoginButton = styled(WrappedGlobalButton)(({ theme }) => ({
  width: 90,
  borderRadius: 2,
  [theme.breakpoints.down(400)]: {
    width: '100%',
    paddingLeft: theme.spacing(0.25),
    paddingRight: theme.spacing(0.25),
  },
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.common.white,
  boxShadow: theme.shadows[3],
  whiteSpace: 'nowrap',
}));

const JoinButton = styled(WrappedGlobalButton)(({ theme }) => ({
  width: 100,
  boxShadow: theme.shadows[1],
  borderRadius: 2,
  ...theme.typography.p1,
  whiteSpace: 'nowrap',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.paper,
  [theme.breakpoints.down(400)]: {
    width: '100%',
    paddingLeft: theme.spacing(0.25),
    paddingRight: theme.spacing(0.25),
  },
}));

const BrandMark = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  placeItems: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: 24,
  display: 'grid',
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(24),
  },
}));

const BrandLink = styled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  textDecoration: 'none',
  '&&:link, &&:visited, &&:hover, &&:active': {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

const Navbar = () => {
  const items: NavItem[] = NAV_ITEMS;

  //States/ handlers for the feature menu
  const [featureButtonHover, setFeatureButtonHover] = useState<HTMLElement | null>(null);
  const openFeatureButtonMenu = (e: React.MouseEvent<HTMLElement>) => {
    keepMenuOpen();
    setFeatureButtonHover(e.currentTarget);
  };
  const menuCloseTimer = useRef<number | null>(null);
  const menuTimerRestart = () => {
    if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current);
    menuCloseTimer.current = window.setTimeout(() => {
      setFeatureButtonHover(null);
    }, 200);
  };
  const keepMenuOpen = () => {
    if (menuCloseTimer.current) {
      window.clearTimeout(menuCloseTimer.current);
      menuCloseTimer.current = null;
    }
  };

  //Identifing the items from data based on item.Id
  const itemById = React.useMemo(() => new Map<string, NavItem>(items.map(item => [item.id, item] as const)), [items]);
  const brandNameItem = itemById.get('brand');
  const aboutItem = itemById.get('about');
  const featureItem = itemById.get('features');
  const askBotItem = itemById.get('ask-robot');
  const favouritesItem = itemById.get('favourites');
  const loginItem = itemById.get('login');
  const joinItem = itemById.get('join');

  //Mapping the subitems in feature menu
  const featureMenuItems: MenuItems[] = React.useMemo(
    () => (featureItem?.subItems ?? []).map(({ id, label, path }) => ({ id, label, path, to: path })),
    [featureItem]
  );

  return (
    <StyledAppBar position="static" color="transparent" elevation={0}>
      <LeftContainer>
        <BrandLink component={RouterLink} to={brandNameItem?.path ?? '/'}>
          <BrandMark>
            <HomeRounded fontSize="inherit" />
          </BrandMark>
          {brandNameItem?.label}
        </BrandLink>
      </LeftContainer>

      <MiddleContainer>
        <LinkButton component={RouterLink} to={aboutItem?.path ?? '/about'}>
          {aboutItem?.label}
        </LinkButton>
        <LinkButton
          component={RouterLink}
          to={featureItem?.path ?? '/features'}
          onPointerEnter={openFeatureButtonMenu}
          onPointerLeave={() => menuTimerRestart()}
        >
          {featureItem?.label}
        </LinkButton>
        <FeatureMenu
          anchorEl={featureButtonHover}
          open={Boolean(featureButtonHover)}
          onEnter={keepMenuOpen}
          onLeave={() => menuTimerRestart()}
          onItemClick={() => setFeatureButtonHover(null)}
          items={featureMenuItems}
        />
        <LinkButton component={RouterLink} to={askBotItem?.path ?? '/chat'}>
          {askBotItem?.label}
        </LinkButton>
        <LinkButton component={RouterLink} to={favouritesItem?.path ?? '/favourites'}>
          {favouritesItem?.label}
        </LinkButton>
      </MiddleContainer>

      <RightContainer>
        <LoginButton component={RouterLink} to={loginItem?.path ?? '/login'}>
          {loginItem?.label}
        </LoginButton>
        <JoinButton component={RouterLink} to={joinItem?.path ?? '/registration'}>
          {joinItem?.label}
        </JoinButton>
      </RightContainer>
    </StyledAppBar>
  );
};

export default Navbar;
