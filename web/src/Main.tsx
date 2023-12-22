import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './sass/main.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RouterElements } from './RouterElements';
import { Provider } from 'react-redux';
import { BirdNetStore } from './store/Store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create router object with children. <App /> is the common parent element of all views.
const router = createBrowserRouter(
    RouterElements.map((r) => {
        return {
            path: r.path,
            element: <App />,
            children: [
                {
                    path: r.path,
                    element: r.element,
                },
            ],
        };
    }),
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <Provider store={BirdNetStore}>
                <RouterProvider router={router} />
            </Provider>
        </QueryClientProvider>
    </React.StrictMode>,
);
