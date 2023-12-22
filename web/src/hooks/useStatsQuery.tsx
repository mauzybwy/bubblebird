import { useQuery } from '@tanstack/react-query';
import { BIRDS_HOST } from '../Constants';
import { BirdsQuery, RecentsResponse } from '../types/BirdnetPi';

type UseStatsQueryResponse = {
    data?: RecentsResponse | null;
    error: unknown;
    isFetching: boolean;
    isLoading: boolean;
};

export const useStatsQuery = (
    queryData?: BirdsQuery,
    refetchOnWindowFocus?: boolean,
): UseStatsQueryResponse => {
    const { data, error, isFetching, isLoading } = useQuery<RecentsResponse | null>({
        queryKey: [queryData, BIRDS_HOST],
        queryFn: async (): Promise<RecentsResponse | null> => {
            if (queryData) {
                const res = await fetch(`${BIRDS_HOST}/api/index.php?stats`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(queryData),
                });

                return await res.json();
            }

            return null;
        },
        cacheTime: 0,
        staleTime: 0,
        refetchOnWindowFocus,
    });

    return { data, error, isFetching, isLoading };
};
