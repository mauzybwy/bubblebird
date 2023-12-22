import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './components/Header';
import { useOverviewStatsQuery } from './hooks/useStatsOverviewQuery';
import { SliceOverviewStats } from './store/reducers/SliceOverviewStats';
import { useAppDispatch } from './store/Store';

export const App = (): JSX.Element => {
    const dispatch = useAppDispatch();

    // Get the basic site data
    const overviewData = useOverviewStatsQuery();

    useEffect(() => {
        if (overviewData && overviewData.data) {
            dispatch(SliceOverviewStats.actions.setOverviewStats(overviewData.data));
        }
    }, [dispatch, overviewData]);


    return (
        <>
            <Header />
            <main className="flex-shrink-0 mb-3">
                <Container fluid className="mt-2" id="main-container">
                    <Outlet />
                </Container>
            </main>
            <Footer />
        </>
    );
};
