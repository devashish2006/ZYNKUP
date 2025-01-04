import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketProvider'; // Import the SocketProvider
import Authentication from './pages/Authentication';
import Landing from './pages/Landing';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import LobbyScreen from './pages/Lobby';
import RoomPage from './pages/Room';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider> {/* Wrap the routes with SocketProvider */}
          <Routes>
            <Route path='/' element={<Landing />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path='/lobby' element={<LobbyScreen />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
