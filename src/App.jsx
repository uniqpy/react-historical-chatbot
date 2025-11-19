import { Routes, Route, Link, Outlet } from 'react-router-dom';
import ChatFullPage from './pages/ChatFullPage.jsx';
import AboutDocs from './pages/AboutDocs.jsx';
import HelpPage from './pages/HelpPage.jsx';

// Simple top-left links (no header component)
function TopLinks() {
  return (
    <div className="container py-2">
      <div className="d-flex align-items-center gap-3">
        <Link to="/" className="text-decoration-none fw-semibold">Historical Chatbot</Link>
        <Link to="/about" className="text-decoration-none text-secondary">About</Link>
        <Link to="/help" className="text-decoration-none text-secondary">Help</Link>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <>
      <TopLinks />
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ChatFullPage />} />
        <Route path="about" element={<AboutDocs />} />
        <Route path="help" element={<HelpPage/>} />
      </Route>
    </Routes>
  );
}
