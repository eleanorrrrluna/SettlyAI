//模块的layout,只负责模块在page里的结构,先占位
import { Box, Typography, styled } from '@mui/material';
import PropertyMetricCard from './components/PropertyMetricCard';
import type { PropertyMetricItem } from './components/PropertyMetricCard';
//styled API创建组件
const SectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 16),
  margin: theme.spacing(3, 0),
}));
const TitleWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(8),
}));
const CardGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, min(300px))',
  //卡与卡之间横竖8px
  gap: theme.spacing(6),
  //responsive:屏幕尺寸小于中等md:899.95px时卡片变一列
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));
const PropertyMarketInsightsSection = ({
  //title默认为'Property Market Insights'也可以被传其他string
  title = 'Property Market Insights',
  items,
}: {
  title?: string;
  items: PropertyMetricItem[];
}) => {
  return (
    <SectionContainer>
      <TitleWrapper>
        <Typography variant="h4">{title}</Typography>
      </TitleWrapper>

      <CardGrid>
        {/* 对 items 数组中的每个 item 都渲染一个 <PropertyMetricCard /> 组件,并把item对象中的所有属性作为独立props传递给 <PropertyMetricCard /> 组件*/}
        {items.map((item, index) => (
          <PropertyMetricCard key={index} {...item} />
        ))}
      </CardGrid>
    </SectionContainer>
  );
};
export default PropertyMarketInsightsSection;
