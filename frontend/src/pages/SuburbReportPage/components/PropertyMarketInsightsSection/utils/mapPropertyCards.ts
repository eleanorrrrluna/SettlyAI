import type { PropertyMetricItem } from '../components/PropertyMetricCard';
export interface HousingMarketDto {
  RentalYield: number;
  MedianPrice: number;
  PriceGrowth3Yr: number;
  DaysOnMarket: number;
  StockOnMarket: number;
  ClearanceRate: number;
  MedianRent: number;
  RentGrowth12M: number;
  VacancyRate: number;
  Population: number;
  PopulationGrowthRate: number;
}
const percent = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;
const money = (n: number) =>
  n
    .toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    })
    .replace('A$', '$');
export function mapPropertyCards(api: HousingMarketDto): PropertyMetricItem[] {
  return [
    { label: 'Rental Yield', value: percent(api.RentalYield) },
    { label: 'Median Price', value: money(api.MedianPrice) },
    {
      label: 'Price Growth (3Y)',
      value: percent(api.PriceGrowth3Yr),
      trend: api.PriceGrowth3Yr >= 0 ? 'up' : 'down',
    },
    { label: 'Days on Market', value: `${api.DaysOnMarket}` },
    { label: 'Stock on Market', value: `${api.StockOnMarket}` },
    { label: 'Clearance Rate', value: percent(api.ClearanceRate, 0) },
    { label: 'Median Rent', value: `${money(api.MedianRent)}/week` },
    {
      label: 'Rent Growth (12M)',
      value: percent(api.RentGrowth12M),
      trend: api.RentGrowth12M >= 0 ? 'up' : 'down',
    },
    { label: 'Vacancy Rate', value: percent(api.VacancyRate) },
    { label: 'Population', value: api.Population.toLocaleString() },
    {
      label: 'Population Growth Rate',
      value: percent(api.PopulationGrowthRate),
      trend: api.PopulationGrowthRate >= 0 ? 'up' : 'down',
    },
  ];
}
