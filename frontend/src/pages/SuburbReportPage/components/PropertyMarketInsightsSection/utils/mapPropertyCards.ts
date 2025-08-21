import type { IHousingMarket } from '@/interfaces/housingmarket';
import type { PropertyMetricItem } from '../components/PropertyMetricCard';
const percent = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;

const money = (n: number) =>
  n
    .toLocaleString('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0,
    })
    .replace('A$', '$');

export function mapPropertyCards(api: IHousingMarket): PropertyMetricItem[] {
  return [
    {
      label: 'Rental Yield',
      value: percent(api.rentalYield),
      subText: 'Gross rental yield',
      hint: 'Annual rent as a percentage of property price. Higher is generally better for investors.',
    },
    {
      label: 'Median Price',
      value: money(api.medianPrice),
      subText: 'Median sale price of properties',
      hint: 'The middle price of recent sales. Not adjusted for property characteristics.',
    },
    {
      label: 'Price Growth (3Y)',
      value: percent(api.priceGrowth3Yr),
      subText: 'Over the past 3 years',
      hint: 'Cumulative price growth over the past 3 years. Positive indicates appreciation.',
    },
    {
      label: 'Days on Market',
      value: `${api.daysOnMarket} days`,
      subText: 'Median days on market',
      hint: 'Median number of days a listing stays on the market. Lower suggests stronger demand.',
    },
    {
      label: 'Stock on Market',
      value: `${api.stockOnMarket.toLocaleString()} listings`,
      subText: 'Active for-sale listings',
      hint: 'Approximate number of properties currently listed for sale in the area.',
    },
    {
      label: 'Clearance Rate',
      value: percent(api.clearanceRate, 0),
      subText: 'Auctions sold / total auctions',
      hint: 'Share of auctions resulting in a sale. Higher suggests stronger market conditions.',
    },
    {
      label: 'Median Rent',
      value: `${money(api.medianRent)}/week`,
      subText: 'Typical weekly rent',
      hint: 'Estimated median weekly rent for dwellings in the area.',
    },
    {
      label: 'Rent Growth (12M)',
      value: percent(api.rentGrowth12M),
      subText: 'Over the past 12 months',
      hint: 'Change in median rent over the past 12 months. Positive indicates rising rents.',
    },
    {
      label: 'Vacancy Rate',
      value: percent(api.vacancyRate),
      subText: 'Share of rental properties that are vacant',
      hint: 'Share of rental properties that are vacant. Lower generally indicates tighter rental conditions.',
    },
    {
      label: 'Population',
      value: api.population.toLocaleString(),
      subText: 'Estimated residents',
      hint: 'Estimated number of people living in the suburb.',
    },
    {
      label: 'Population Growth Rate',
      value: percent(api.populationGrowthRate),
      subText: 'Change in population',
      hint: 'Change in population. Growth can indicate increasing demand over time.',
    },
  ];
}
