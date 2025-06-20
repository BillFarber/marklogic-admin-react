import { Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import AdminDigest from './AdminDigest';
import NotFound from './NotFound';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Admin />} />
            <Route path="/adminDigest" element={<AdminDigest />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
