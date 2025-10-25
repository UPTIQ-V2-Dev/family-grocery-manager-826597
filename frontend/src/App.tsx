import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ItemsPage } from './pages/ItemsPage';
import { LoginPage } from './pages/LoginPage';
import { isAuthenticated } from './lib/api';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10 // 10 minutes
        }
    }
});

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const location = useLocation();

    if (!isAuthenticated()) {
        return (
            <Navigate
                to='/login'
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
};

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className='min-h-screen bg-gray-50'>
                    <Routes>
                        <Route
                            path='/login'
                            element={<LoginPage />}
                        />
                        <Route
                            path='/'
                            element={
                                <ProtectedRoute>
                                    <Navigate
                                        to='/items'
                                        replace
                                    />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='/items'
                            element={
                                <ProtectedRoute>
                                    <ItemsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path='*'
                            element={
                                <ProtectedRoute>
                                    <Navigate
                                        to='/items'
                                        replace
                                    />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </QueryClientProvider>
    );
};
