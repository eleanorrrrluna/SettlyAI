import { useNavbar } from '@/api/navBarLayoutApi';
import type { NavItem, NavVariant, RenderGlobalNavButtonArgs } from '@/features/navbar';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Typography, styled, Box, MenuItem, Popper, Paper } from '@mui/material';
import theme from '@/styles/theme';
import GlobalButton from '../GlobalButton';
import { useRef, useState, type ComponentProps } from 'react';
import HomeRounded from '@mui/icons-material/HomeRounded';
import React, { Fragment } from 'react';

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

const LeftSlot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flex: '1 1 0',
  paddingLeft: theme.spacing(6),
  [theme.breakpoints.down(400)]: {
    paddingTop: '8px',
  },
}));

const CenterSlot = styled('div')(({ theme }) => ({
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

const RightSlot = styled('div')(({ theme }) => ({
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

//Sorting the items within each container
const itemsByOrder = (a: NavItem, b: NavItem) => a.order - b.order;

//Adding 'component' props to GlobalButton to prevent compiling error from TS
type GlobalButtonProps = ComponentProps<typeof GlobalButton> & { to: string };
const WrappedGlobalButton = ({ to, children, ...buttonProps }: GlobalButtonProps) => (
  <Box component={RouterLink} to={to}>
    <GlobalButton {...buttonProps}>{children}</GlobalButton>
  </Box>
);

//Determine the typography type of button based on variant props from backend data
const typographyByVariant = (variant?: NavVariant) => (variant === 'brand' ? theme.typography.h5 : theme.typography.p1);

//Styling of each navbar item based on its varient
const renderGlobalNavButton: React.FC<RenderGlobalNavButtonArgs> = args => {
  const {
    item,
    featureButtonHover,
    openFeatureButtonMenu,
    awayFeatureButton,
    menuTimerRestart,
    keepMenuOpen,
    featureMenuRef,
  } = args;

  const to = item.path;
  const label = item.label ?? '';
  const id = item.id;

  //Setting a reference of the feature button width for its menu underneith
  const featureButtonWidth = featureButtonHover ? featureButtonHover.getBoundingClientRect().width : undefined;

  if (item.variant === 'link') {
    return (
      <WrappedGlobalButton
        key={id}
        to={to}
        variant="text"
        sx={{
          width: 90,
          ...typographyByVariant(item.variant),
          color: 'text.secondary',
        }}
      >
        {label}
      </WrappedGlobalButton>
    );
  }

  if (item.variant === 'menu') {
    return (
      <Fragment key={id}>
        <WrappedGlobalButton
          key={item.id}
          to={to}
          variant="text"
          sx={theme => ({ width: 90, ...(typographyByVariant(item.variant) || {}), color: 'text.secondary' })}
          onPointerEnter={openFeatureButtonMenu}
          onPointerLeave={e => {
            const featureButton = e.relatedTarget instanceof Element ? e.relatedTarget : null;
            if (featureButton && featureMenuRef.current?.contains(featureButton)) return;
            menuTimerRestart();
          }}
        >
          {label}
        </WrappedGlobalButton>

        <Popper open={Boolean(featureButtonHover)} anchorEl={featureButtonHover}>
          <Paper
            ref={featureMenuRef}
            onPointerEnter={keepMenuOpen}
            onPointerLeave={e => {
              const featureButton = e.relatedTarget instanceof Element ? e.relatedTarget : null;
              if (featureButton && featureButtonHover?.contains(featureButton)) return;
              menuTimerRestart();
            }}
            sx={theme => ({
              minWidth: featureButtonWidth ?? undefined,
            })}
          >
            {item.subItems?.map(subItem => (
              <MenuItemRow key={subItem.id} component={RouterLink} to={subItem.path} onClick={awayFeatureButton}>
                {subItem.label}
              </MenuItemRow>
            ))}
          </Paper>
        </Popper>
      </Fragment>
    );
  }

  if (item.variant === 'text') {
    return (
      <WrappedGlobalButton
        key={id}
        to={to}
        variant="text"
        width="100"
        sx={theme => ({
          width: 90,
          borderRadius: 2,
          [theme.breakpoints.down(400)]: {
            width: '100%',
            px: '2px',
          },
          ...typographyByVariant(item.variant),
          color: 'text.secondary',
          bgcolor: 'common.white',
          boxShadow: 3,
          whiteSpace: 'nowrap',
        })}
      >
        {label}
      </WrappedGlobalButton>
    );
  }

  if (item.variant === 'contained') {
    return (
      <WrappedGlobalButton
        key={id}
        to={to}
        variant="contained"
        sx={theme => ({
          width: 100,
          boxShadow: 1,
          [theme.breakpoints.down(400)]: {
            width: '100%',
            px: '2px',
          },
          ...typographyByVariant(item.variant),
          borderRadius: 2,
          whiteSpace: 'nowrap',
        })}
      >
        {label}
      </WrappedGlobalButton>
    );
  }
  return null;
};

//Setting up styling for the menu item under feature button
const MenuItemRow = styled(MenuItem)(({ theme }) => ({
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
}));

//Styling for Brand logo
const BrandLogo = () => (
  <Box
    sx={theme => ({
      width: 40,
      height: 40,
      borderRadius: '8px',
      placeItems: 'center',
      bgcolor: '#7B61FF',
      display: 'grid',
    })}
  >
    <HomeRounded sx={{ color: 'common.white' }} fontSize="medium" />
  </Box>
);
const renderBrandLogo = (item: NavItem) => {
  const id = item.id;
  const label = item.label;
  return (
    <Typography
      component={'span'}
      key={id}
      sx={theme => ({
        ...typographyByVariant(item.variant),
        color: 'text.primary',
        lineHeight: theme => theme.typography.button.lineHeight,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      })}
    >
      <BrandLogo />
      {label}
    </Typography>
  );
};

const Navbar = () => {
  const { data: items = [] } = useNavbar();
  //Mapping for items in left, center and right slot respectively
  const leftItems = items.filter(item => item.position === 'left').sort(itemsByOrder);
  const centerItems = items.filter(item => item.position === 'center').sort(itemsByOrder);
  const rightItems = items.filter(item => item.position === 'right').sort(itemsByOrder);

  //Seting state to see if point is on the feature button
  const [featureButtonHover, setFeatureButtonHover] = useState<HTMLElement | null>(null);

  //Setting a reference layer for the presence of menu under feature button
  const featureMenuRef = useRef<HTMLDivElement>(null);

  //Function to trigger the pop-up of feature button menu
  const openFeatureButtonMenu = (e: React.MouseEvent<HTMLElement>) => {
    keepMenuOpen();
    setFeatureButtonHover(e.currentTarget);
  };

  //Setting state to be null, when pointer is away from feature button
  const awayFeatureButton = () => {
    setFeatureButtonHover(null);
  };

  const menuCloseTimer = useRef<number | null>(null);
  //Resetting state and timer when pointer is away from menu and feature button
  const menuTimerRestart = () => {
    if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current);
    menuCloseTimer.current = window.setTimeout(() => {
      setFeatureButtonHover(null);
    }, 200);
  };

  //keeping menu open when pointer is on feature button
  const keepMenuOpen = () => {
    if (menuCloseTimer.current) {
      window.clearTimeout(menuCloseTimer.current);
      menuCloseTimer.current = null;
    }
  };

  //Rendering items based on styling functions above
  const renderItem = (item: NavItem): React.ReactNode => {
    //Rendering the brand logo (leftslot)
    if (item.variant === 'brand') return renderBrandLogo(item);

    //Rendering the remaining items in Navbar
    return renderGlobalNavButton({
      item,
      featureButtonHover,
      openFeatureButtonMenu,
      awayFeatureButton,
      menuTimerRestart,
      keepMenuOpen,
      featureMenuRef,
    });
  };

  //Putting every rendered item in place
  return (
    <StyledAppBar position="static" color="transparent" elevation={0}>
      <LeftSlot>{leftItems.map(renderItem)}</LeftSlot>
      <CenterSlot>{centerItems.map(renderItem)}</CenterSlot>
      <RightSlot>{rightItems.map(renderItem)}</RightSlot>
    </StyledAppBar>
  );
};

export default Navbar;
