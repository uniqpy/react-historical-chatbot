import { Routes, Route, Link, Outlet } from 'react-router-dom';
import ChatFullPage from './pages/ChatFullPage.jsx';
import AboutDocs from './pages/AboutDocs.jsx';
import HelpPage from './pages/HelpPage.jsx';

/**
 * This function shows the links to the other pages on the top of the page. 
 * Links to the jsx pages, so when clicked on the by the user it makes the page change.
 * @returns
 */
function TopLinks() {
  return (
    <div className="container py-2">
      <div className="bg-white p-3 rounded shadow-sm d-inline-flex align-items-center gap-3">
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

/**
 * Routes for the different parts of the site. When the page is initally loaded, it will load onto the chat page. If the user clicks on one of the links to other pages on the top of the page
 * this will load the specified page.
 * @returns
 */
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
