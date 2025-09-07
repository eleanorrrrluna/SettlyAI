import { useNavbar } from '@/api/navBarLayoutApi';
import type { NavItem, NavVariant } from '@/features/navbar';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Typography, styled, Box, MenuItem, Popper, Paper } from '@mui/material';
import theme from '@/styles/theme';
import GlobalButton from '../GlobalButton';
import { useRef, useState, type ComponentProps } from 'react';
import HomeRounded from '@mui/icons-material/HomeRounded';
import React, { Fragment } from 'react';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'row',
  minHeight: 72,
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const LeftSlot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 0',
  paddingLeft: theme.spacing(6),
}));

const CenterSlot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  justifyContent: 'flex-end',
  flex: '1 1 0',
  color: theme.palette.text.primary,
}));

const RightSlot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flex: '0 0 auto',
  marginLeft: theme.spacing(3),
  paddingRight: theme.spacing(6),
}));

const byOrder = (a: NavItem, b: NavItem) => a.order - b.order;

type GlobalButtonProps = ComponentProps<typeof GlobalButton> & { to: string };

const WrappedGlobalButton = ({ to, children, ...buttonProps }: GlobalButtonProps) => (
  <Box component={RouterLink} to={to}>
    <GlobalButton {...buttonProps}>{children}</GlobalButton>
  </Box>
);

const typographyByVariant = (variant?: NavVariant) => (variant === 'brand' ? theme.typography.h5 : theme.typography.p1);
const renderGlobalNavButton = ({
  item,
  featureButtonHover,
  openFeatureButtMeun,
  awayFeatureButton,
  menuTimerRestart,
  keepMenuOpen,
  menuRef,
}: {
  item: NavItem;
  featureButtonHover: HTMLElement | null;
  openFeatureButtMeun: (e: React.MouseEvent<HTMLElement>) => void;
  awayFeatureButton: () => void;
  menuTimerRestart: () => void;
  keepMenuOpen: () => void;
  menuRef: React.RefObject<HTMLDivElement>;
}): JSX.Element | null => {
  const to = item.path;
  const label = item.label ?? '';

  if (item.variant === 'link') {
    return (
      <WrappedGlobalButton
        key={item.id}
        to={to}
        variant="text"
        sx={{ width: 90, ...(typographyByVariant(item.variant) || {}), color: 'text.secondary' }}
      >
        {label}
      </WrappedGlobalButton>
    );
  }

  if (item.variant === 'menu') {
    return (
      <Fragment key={item.id}>
        <WrappedGlobalButton
          key={item.id}
          to={to}
          variant="text"
          sx={{ width: 90, ...(typographyByVariant(item.variant) || {}), color: 'text.secondary' }}
          onPointerEnter={openFeatureButtMeun}
          onPointerLeave={e => {
            const featureButton = e.relatedTarget instanceof Element ? e.relatedTarget : null;
            if (featureButton && menuRef.current?.contains(featureButton)) return;
            menuTimerRestart();
          }}
        >
          {label}
        </WrappedGlobalButton>

        <Popper open={Boolean(featureButtonHover)} anchorEl={featureButtonHover}>
          <Paper
            ref={menuRef}
            onPointerEnter={keepMenuOpen}
            onPointerLeave={e => {
              const featureButton = e.relatedTarget instanceof Element ? e.relatedTarget : null;
              if (featureButton && featureButtonHover?.contains(featureButton)) return;
              menuTimerRestart();
            }}
          >
            {item.subItems?.map(subItem => (
              <MenuItem key={subItem.id} component={RouterLink} to={subItem.path} onClick={awayFeatureButton}>
                {subItem.label}
              </MenuItem>
            ))}
          </Paper>
        </Popper>
      </Fragment>
    );
  }

  if (item.variant === 'text') {
    return (
      <WrappedGlobalButton
        key={item.id}
        to={to}
        variant="text"
        width="100"
        sx={{
          ...(typographyByVariant(item.variant) || {}),
          bgcolor: 'common.white',
          color: 'text.secondary',
          boxShadow: 3,
        }}
      >
        {label}
      </WrappedGlobalButton>
    );
  }

  if (item.variant === 'contained') {
    return (
      <WrappedGlobalButton
        key={item.id}
        to={to}
        variant="contained"
        sx={{ width: 100, ...(typographyByVariant(item.variant) || {}), borderRadius: 2 }}
      >
        {label}
      </WrappedGlobalButton>
    );
  }
  return null;
};

const BrandLogo = () => (
  <Box sx={{ width: 40, height: 40, borderRadius: '8px', placeItems: 'center', bgcolor: '#7B61FF', display: 'grid' }}>
    <HomeRounded sx={{ color: 'common.white' }} fontSize="medium" />
  </Box>
);
const renderBrandLogn = (item: NavItem) => {
  return (
    <Typography
      component={'span'}
      key={item.id}
      sx={{
        ...typographyByVariant(item.variant),
        color: 'text.primary',
        lineHeight: theme => theme.typography.button.lineHeight,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <BrandLogo />
      {item.label}
    </Typography>
  );
};

const Navbar = () => {
  const { data: items = [] } = useNavbar();
  const leftItems = items.filter(item => item.position === 'left').sort(byOrder);
  const centerItems = items.filter(item => item.position === 'center').sort(byOrder);
  const rightItems = items.filter(item => item.position === 'right').sort(byOrder);
  const [featureButtonHover, setfeatureButtonHover] = useState<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openFeatureButtMeun = (e: React.MouseEvent<HTMLElement>) => {
    keepMenuOpen();
    setfeatureButtonHover(e.currentTarget);
  };

  //Setting state to be null
  const awayFeatureButton = () => {
    // featureButtonHover?.focus();
    setfeatureButtonHover(null);
  };
  const menuCloseTimer = useRef<number | null>(null);

  //Restting state and timer
  const menuTimerRestart = () => {
    if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current);
    // const anchor = featureButtonHover;
    menuCloseTimer.current = window.setTimeout(() => {
      // anchor?.focus();
      setfeatureButtonHover(null);
    }, 250);
  };

  //keep menu open when pointer on button
  const keepMenuOpen = () => {
    if (menuCloseTimer.current) {
      window.clearTimeout(menuCloseTimer.current);
      menuCloseTimer.current = null;
    }
  };

  const renderItem = (item: NavItem): JSX.Element | null => {
    if (item.variant === 'brand') return renderBrandLogn(item);

    return renderGlobalNavButton({
      item,
      featureButtonHover,
      openFeatureButtMeun,
      awayFeatureButton,
      menuTimerRestart,
      keepMenuOpen,
      menuRef,
    });
  };

  return (
    <StyledAppBar position="static" color="transparent" elevation={0}>
      <LeftSlot>{leftItems.map(renderItem)}</LeftSlot>
      <CenterSlot>{centerItems.map(renderItem)}</CenterSlot>
      <RightSlot>{rightItems.map(renderItem)}</RightSlot>
    </StyledAppBar>
  );
};

export default Navbar;
