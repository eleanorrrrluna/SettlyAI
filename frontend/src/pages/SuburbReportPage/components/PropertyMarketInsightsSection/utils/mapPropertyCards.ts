import type { PropertyMetricItem } from '../components/PropertyMetricCard';

export interface HousingMarketDto {
  rentalYield: number;
  medianPrice: number;
  priceGrowth3Yr: number;
  daysOnMarket: number;
  stockOnMarket: number;
  clearanceRate: number;
  medianRent: number;
  rentGrowth12M: number;
  vacancyRate: number;
  population: number;
  populationGrowthRate: number;
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
    { label: 'Rental Yield', value: percent(api.rentalYield) },
    { label: 'Median Price', value: money(api.medianPrice) },
    {
      label: 'Price Growth (3Y)',
      value: percent(api.priceGrowth3Yr),
      trend: api.priceGrowth3Yr >= 0 ? 'up' : 'down',
    },
    { label: 'Days on Market', value: `${api.daysOnMarket}` },
    { label: 'Stock on Market', value: `${api.stockOnMarket}` },
    { label: 'Clearance Rate', value: percent(api.clearanceRate, 0) },
    { label: 'Median Rent', value: `${money(api.medianRent)}/week` },
    {
      label: 'Rent Growth (12M)',
      value: percent(api.rentGrowth12M),
      trend: api.rentGrowth12M >= 0 ? 'up' : 'down',
    },
    { label: 'Vacancy Rate', value: percent(api.vacancyRate) },
    { label: 'Population', value: api.population.toLocaleString() },
    {
      label: 'Population Growth Rate',
      value: percent(api.populationGrowthRate),
      trend: api.populationGrowthRate >= 0 ? 'up' : 'down',
    },
  ];
}
