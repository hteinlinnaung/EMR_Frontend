
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { IPatient } from '../model/IPatient';
import {BaseTypeForPagination} from '../../utilForFeatures/basePropForPagination';


export const fetchPatients1 = async (query:BaseTypeForPagination): 
  Promise<{ data: IPatient[]; total: number; page: number; totalPages: number }> => 
  {
  console.log("fetchPatients from frontend");

  
  const queryParams: { [key: string]: string | number | undefined } = {
    page: query.page,
    limit: query.limit,
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  };

  // Remove undefined values from queryParams
  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, v]) => v !== undefined)
  );

  const params = new URLSearchParams(filteredQueryParams as any).toString();
  console.log(`Fetching patients with params: ${params}`);

  //const response = await fetch(`http://127.0.0.1:9999/api/patients?${params}`);
  //const response = await fetch(`http://localhost:9999/api/patients?${params}`);
  //const response = await fetch('https://emr-backend-intz.onrender.com/api/patients');

  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(apiUrl+`api/patients?${params}`);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error('Fail to fetch patients');
  }
  return response.json();
};


interface CustomQueryOptions<TData, TError> extends UseQueryOptions<TData, TError> {
  keepPreviousData?: boolean;
}


const useGetPatients1 = (query:BaseTypeForPagination) => {
  
  return useQuery({
      queryKey: ['patients',query],
      queryFn:()=> fetchPatients1(query),
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      
    } as CustomQueryOptions<{ data: IPatient[]; total: number; page: number; totalPages: number }, Error>);
};

export default useGetPatients1;

