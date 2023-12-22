import { useQuery } from '@tanstack/react-query';
import { BIRDS_HOST } from '../Constants';
import { OverviewStatsResponse } from '../types/BirdnetPi';

/**
 * Queries the site and retrieves basic info including the site name,
 * unique detected species, and counts for various time periods.
 */
export const useOverviewStatsQuery = (
    refetchOnWindowFocus?: boolean,
): {
    data?: OverviewStatsResponse;
    error: unknown;
    isFetching: boolean;
    isLoading: boolean;
} => {
    const { data, error, isFetching, isLoading } = useQuery<OverviewStatsResponse>({
        queryKey: [BIRDS_HOST],
        queryFn: async (): Promise<OverviewStatsResponse> => {
            const res = await fetch(`${BIRDS_HOST}/api/index.php?stats_overview`, {
                method: 'GET',
            });

            return await res.json();
        },
        cacheTime: 0,
        staleTime: 0,
        refetchOnWindowFocus,
    });

    return { data, error, isFetching, isLoading };
};
