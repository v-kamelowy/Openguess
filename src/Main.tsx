import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';

/* Pages */
import NotFound from './NotFound';
import Login from './auth/Login';
import Redirect from './pages/Redirect';
//import Home from './pages/Home';
//import Profile from './pages/Profile';
//import Edit from './pages/Edit';
//import Score from './pages/Score';
//import Final from './pages/Final';

const LazyHome = React.lazy(() => import('./pages/Home'));
const LazyGuess = React.lazy(() => import('./pages/Guess'));
const LazyScore = React.lazy(() => import('./pages/Score'));
const LazyFinal = React.lazy(() => import('./pages/Final'));
const LazyProfile = React.lazy(() => import('./pages/Profile'));
const LazyEdit = React.lazy(() => import('./pages/Edit'));


export default function Main(){
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <GameProvider>
          <Router>
            <Routes>
              <Route path='/' element={<LazyHome />} />
              <Route path='/guess' element={<LazyGuess />} />
              <Route path='/score' element={<LazyScore />} />
              <Route path='/final' element={<LazyFinal />} />
              <Route path='/profile' element={<LazyProfile />} />
              <Route path='/editor' element={<PrivateRoute><LazyEdit /></PrivateRoute>} />
              <Route path='*' element={<NotFound />} />
              <Route path='/login' element={<Login />} />
              {/*<Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>*/}
              <Route path="/redirect" element={<Redirect />} />
            </Routes>
          </Router>
        </GameProvider>
      </AuthProvider>
    </React.Suspense>
  );
}