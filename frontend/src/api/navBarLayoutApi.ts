import { useQuery } from '@tanstack/react-query';
import httpClient from './httpClient';
import type { NavItem } from '@/features/navbar/type';

export async function getNavbar(): Promise<NavItem[]> {
  const result = await httpClient.get<NavItem[]>('/layout/navbar');
  return result.data;
}

export function useNavbar() {
  return useQuery({
    queryKey: ['navbar'],
    queryFn: getNavbar,
  });
}
