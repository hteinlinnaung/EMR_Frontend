import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IDisease } from "../model/IDisease";
import {BaseTypeForPagination} from '../../utilForFeatures/basePropForPagination';


//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------
//After updating


const fetchDiseases1 = async (query: BaseTypeForPagination): Promise<{ data: IDisease[]; total: number; page: number; totalPages: number }> => {  
  
  const params = new URLSearchParams(query as any).toString();
  
  
  const apiUrl = import.meta.env.VITE_API_URL;  
  const response = await fetch(apiUrl+`api/diseases?${params}`);

  //const response = await fetch(`http://localhost:9999/api/diseases?${params}`);
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Failed to fetch diseases");
  }
  return response.json();
};


interface CustomQueryOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  keepPreviousData?: boolean;
}

export const useGetDiseases1 = (query: BaseTypeForPagination) => {
  return useQuery({
    queryKey: ['diseases', query],
    queryFn: () => fetchDiseases1(query),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
  } as CustomQueryOptions<{ data: IDisease[]; total: number; page: number; totalPages: number }, Error>);
};


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
