import { styled, MenuItem, Popper, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { FeatureMenuProps } from '@/features/navbar';

//Styling for the feature menu
const MenuItemRow = styled(MenuItem)(({ theme }) => ({
  ...theme.typography.p1,
  color: theme.palette.text.secondary,
}));

const FeatureMenu = ({ anchorEl, open, onEnter, onLeave, onItemClick, items, minWidth }: FeatureMenuProps) => {
  return (
    <div>
      <Popper open={open} anchorEl={anchorEl}>
        <Paper
          onPointerEnter={onEnter}
          onPointerLeave={e => {
            const featureButton = e.relatedTarget instanceof Element ? e.relatedTarget : null;
            if (featureButton && anchorEl?.contains(featureButton)) return;
            onLeave();
          }}
          sx={{ minWidth }}
        >
          {items.map(Item => (
            <MenuItemRow key={Item.id} component={RouterLink} to={Item.to} onClick={onItemClick}>
              {Item.label}
            </MenuItemRow>
          ))}
        </Paper>
      </Popper>
    </div>
  );
};

export default FeatureMenu;
