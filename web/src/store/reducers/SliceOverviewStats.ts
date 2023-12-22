import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OverviewStatsResponse } from '../../types/BirdnetPi';

interface OverviewStatsState {
    value: OverviewStatsResponse | undefined;
}

const initialState: OverviewStatsState = {
    value: undefined,
};

export const SliceOverviewStats = createSlice({
    name: 'overviewStats',
    initialState,
    reducers: {
        setOverviewStats: (state, action: PayloadAction<OverviewStatsResponse | undefined>) => {
            state.value = action.payload;
        },
    },
});
