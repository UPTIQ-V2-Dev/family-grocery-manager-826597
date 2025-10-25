import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ItemsPage } from './pages/ItemsPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10 // 10 minutes
        }
    }
});

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className='min-h-screen bg-gray-50'>
                    <Routes>
                        <Route
                            path='/'
                            element={
                                <Navigate
                                    to='/items'
                                    replace
                                />
                            }
                        />
                        <Route
                            path='/items'
                            element={<ItemsPage />}
                        />
                        <Route
                            path='*'
                            element={
                                <Navigate
                                    to='/items'
                                    replace
                                />
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    );
};
