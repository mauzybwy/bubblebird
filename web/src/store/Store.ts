// https://redux.js.org/usage/usage-with-typescript#overview

import { configureStore } from '@reduxjs/toolkit';
import { SliceOverviewStats } from './reducers/SliceOverviewStats';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';


export const BirdNetStore = configureStore({
    reducer: {
        overviewStats: SliceOverviewStats.reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof BirdNetStore.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = typeof BirdNetStore.dispatch;

// import { AppDispatch, RootState } from '../store/Store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
