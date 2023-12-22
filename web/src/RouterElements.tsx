import { AllRecordings } from './routes/AllRecordings';
import { BestRecordings } from './routes/BestRecordings';
import { DailyCharts } from './routes/DailyCharts';
import { Log } from './routes/Log';
import { Overview } from './routes/Overview';
import { SpeciesStats } from './routes/SpeciesStats';
import { Spectrogram } from './routes/Spectrogram';
import { Search } from './routes/Search';
import { Tools } from './routes/Tools';

export type PageLinkInfo = {
    name: string;
    path: string;
    element: JSX.Element;
};

// These items show as links in the navbar
export const HeaderItems: PageLinkInfo[] = [
    {
        name: 'Overview',
        path: '/',
        element: <Overview />,
    },
    {
        name: "Search",
        path: '/search',
        element: <Search />,
    },
];

export const StatsDropdownItems: PageLinkInfo[] = [
    {
        name: 'Daily Charts',
        path: '/dailycharts',
        element: <DailyCharts />,
    },
    {
        name: 'Species Stats',
        path: '/speciesstats',
        element: <SpeciesStats />,
    },
    {
        name: 'Best Recordings',
        path: '/bestrecordings',
        element: <BestRecordings />,
    },
    {
        name: 'All Recordings',
        path: '/allrecordings',
        element: <AllRecordings />,
    },
    {
        name: 'Spectrogram',
        path: '/spectrogram',
        element: <Spectrogram />,
    },
];

export const AdminDropDownItems: PageLinkInfo[] = [
    {
        name: 'Log',
        path: '/log',
        element: <Log />,
    },
    {
        name: 'Tools',
        path: '/tools',
        element: <Tools />,
    },
];

export const RouterElements = [...HeaderItems, ...StatsDropdownItems, ...AdminDropDownItems];
