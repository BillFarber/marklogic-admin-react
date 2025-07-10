import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components';
import Admin from './Admin';
import AdminDigest from './AdminDigest';
import NotFound from './NotFound';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/adminDigest" element={<AdminDigest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
