import { useNavbar } from '@/api/navBarLayoutApi';
import type { NavItem, NavVariant } from '@/features/navbar';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Typography, styled, Button, Box } from '@mui/material';
import theme from '@/styles/theme';
import GlobalButton from '../GlobalButton';
import type { ComponentProps } from 'react';
import HomeRounded from '@mui/icons-material/HomeRounded';

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
  gap: theme.spacing(3),
  flex: '1 1 0',
  paddingLeft: theme.spacing(6),
}));

const CenterSlot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
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
  <Box component={RouterLink} to={to} sx={{ textDecoration: 'none', color: 'inherit' }}>
    <GlobalButton {...buttonProps}>{children}</GlobalButton>
  </Box>
);

const typographyByVariant = (variant?: NavVariant) => (variant === 'brand' ? theme.typography.h5 : theme.typography.p1);

const renderGlobalNavButton = (item: NavItem): JSX.Element | null => {
  const to = item.path;
  const label = String(item.label ?? '');

  if (item.variant === 'link' || item.variant === 'menu') {
    return (
      <WrappedGlobalButton
        to={to}
        variant="text"
        sx={{ width: 90, ...(typographyByVariant(item.variant) || {}), color: 'text.secondary' }}
      >
        {label}
      </WrappedGlobalButton>
    );
  }

  if (item.variant === 'text') {
    return (
      <WrappedGlobalButton
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

function renderItem(item: NavItem) {
  switch (item.variant) {
    case 'brand':
      return (
        <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BrandLogo />
          <Typography
            key={item.id}
            sx={{
              ...typographyByVariant(item.variant),
              color: 'text.primary',
              lineHeight: theme => theme.typography.button.lineHeight,
            }}
          >
            {item.label} AI
          </Typography>
        </Box>
      );

    case 'contained':
      return renderGlobalNavButton(item);
    case 'text':
      return renderGlobalNavButton(item);
    case 'menu':
      return renderGlobalNavButton(item);
    case 'link':
      return renderGlobalNavButton(item);
  }
}

const Navbar = () => {
  const { data: items = [] } = useNavbar();
  const left = items.filter(item => item.position === 'left').sort(byOrder);
  const center = items.filter(item => item.position === 'center').sort(byOrder);
  const right = items.filter(item => item.position === 'right').sort(byOrder);

  return (
    <StyledAppBar position="static" color="transparent" elevation={0}>
      <LeftSlot>{left.map(renderItem)}</LeftSlot>
      <CenterSlot>{center.map(renderItem)}</CenterSlot>
      <RightSlot>{right.map(renderItem)}</RightSlot>
    </StyledAppBar>
  );
};

export default Navbar;
