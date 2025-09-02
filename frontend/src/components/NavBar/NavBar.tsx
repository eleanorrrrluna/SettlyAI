import { useNavbar } from '@/api/navBarLayoutApi';
import type { NavItem } from '@/features/navbar';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, styled, Button, Box } from '@mui/material';
import theme from '@/styles/theme';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  minHeight: 72,
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: theme.spacing(2),
});

const LeftSlot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flex: '1 1 0',
}));

const CenterSlot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  justifyContent: 'flex-end',
  flex: '1 1 0',
}));

const RightSlot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  flex: '0 0 auto',
}));

const byOrder = (a: NavItem, b: NavItem) => a.order - b.order;

const renderItem = (item: NavItem) => {
  switch (item.variant) {
    case 'brand':
      return (
        <Typography
          key={item.id}
          variant="h6"
          component={RouterLink}
          to={item.path}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          {item.label}
        </Typography>
      );
    case 'contained':
      return (
        <Button key={item.id} component={RouterLink} to={item.path} variant="contained">
          {item.label}
        </Button>
      );
    case 'text':
      return (
        <Button key={item.id} component={RouterLink} to={item.path} variant="text">
          {item.label}
        </Button>
      );
    default:
      return (
        <Button key={item.id} component={RouterLink} to={item.path}>
          {item.label}
        </Button>
      );
  }
};

const Navbar = () => {
  const { data: items = [], isLoading, isError } = useNavbar();
  const left = items.filter(item => item.position === 'left').sort(byOrder);
  const center = items.filter(item => item.position === 'center').sort(byOrder);
  const right = items.filter(item => item.position === 'right').sort(byOrder);

  return (
    <StyledAppBar position="static" color="transparent" elevation={0}>
      <StyledToolbar>
        <LeftSlot>{left.map(renderItem)}</LeftSlot>
        <CenterSlot>{center.map(renderItem)}</CenterSlot>
        <RightSlot>{right.map(renderItem)}</RightSlot>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
