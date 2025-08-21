import { Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
export type Trend = 'up' | 'down' | 'neutral';
export interface PropertyMetricItem {
  label: string;
  value: string;
  subText?: string;
  trend?: Trend;
  hint?: string;
}
const PropertyMetricCard = ({
  label,
  value,
  subText,
  trend = 'neutral',
  hint,
}: PropertyMetricItem) => {
  const subColor =
    trend === 'up'
      ? 'success.main'
      : trend === 'down'
        ? 'error.main'
        : 'text.secondary';
  return (
    <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent
        sx={{
          minHeight: 80,
          display: 'grid',
          alignContent: 'center',
          p: 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ mb: 0.5 }}
        >
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {hint && (
            <Tooltip title={hint}>
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ color: 'text disabled' }}
              />
            </Tooltip>
          )}
        </Stack>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {subText && (
          <Typography variant="caption" sx={{ color: subColor, mt: 0.25 }}>
            {subText}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
export default PropertyMetricCard;
