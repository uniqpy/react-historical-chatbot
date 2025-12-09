import { Routes, Route, Link, Outlet } from 'react-router-dom';
import ChatFullPage from './pages/ChatFullPage.jsx';
import AboutDocs from './pages/AboutDocs.jsx';
import { Modal } from "bootstrap";
import { useRef, useEffect } from "react";



/**
 * This function shows the links to the other pages on the top of the page. 
 * Links to the jsx pages, so when clicked on the by the user it makes the page change.
 * @returns
 */
function TopLinks() {
  const modalRef = useRef(null);
  const bsModal = useRef(null);

  useEffect(() => {
    bsModal.current = new Modal(modalRef.current, {
      backdrop: "static",
      keyboard: false,
    });
  }, []);

  const openModal = () => {
    bsModal.current.show();
  };

  const closeModal = () => {
    bsModal.current.hide();
  };



  return (
    <div className="container py-2">
      <div className="bg-white p-3 rounded shadow-sm d-inline-flex align-items-center gap-3">
        <Link to="/" className="text-decoration-none fw-semibold">Caligula Chatbot</Link>
        <Link to="/about" className="text-decoration-none text-secondary">About</Link>
        <button className="text-decoration-none text-secondary" onClick={openModal}>Help</button>
         <div
        className="modal fade"
        tabIndex="-1"
        ref={modalRef}
      >
        <div className = "modal-dialog">
          <div className = "modal-content">
            <div className = "modal-header">
              <h5 className = "modal-title">Help Pop-up</h5>
            </div>

            <div className="modal-body">
              <h3>Need help?</h3>
              <p>If you need help, contact us at CaligulaNeedsHelp@caligula.net</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      </div>



       
      </div>
    </div>
  );
}

function Layout() {
  return (
    <div className="d-flex flex-column h-100">
      <TopLinks />
      <div className="flex-grow-1 d-flex flex-column overflow-hidden" style={{ minHeight: 0 }}>
        <Outlet />
      </div>
    </div>
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
      </Route>
    </Routes>
  );
}
