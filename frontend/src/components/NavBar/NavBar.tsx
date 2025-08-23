import { useNavbar } from '@/api/layoutApi';
import type { NavItem } from '@/features/navbar';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  styled,
  Button,
  Box,
} from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: 72,
  justifyContent: 'center',
}));

const StyledToolbar = styled(Toolbar)({
  minHeight: 72,
});

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
        <Button
          key={item.id}
          component={RouterLink}
          to={item.path}
          variant="contained"
        >
          {item.label}
        </Button>
      );
    case 'text':
      return (
        <Button
          key={item.id}
          component={RouterLink}
          to={item.path}
          variant="text"
        >
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
        {/* <Typography variant="h6" component="div">
          SettlyAI
        </Typography> */}
        <Box sx={{ display: 'flex', gap: 1 }}>{left.map(renderItem)}</Box>
        <Box
          sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 1 }}
        >
          {center.map(renderItem)}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>{right.map(renderItem)}</Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
