import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import feather from 'feather-icons';
import avatarImg from '../assets/caligulapfp.jpg';
import './ChatPage.css';

export default function ChatFullPage() {
  //messages are kept locally; server replies as Caligula via /api/chat.
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello. I am Emperor Caligula. What would you want to ask his divinity?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [clicked, setClicked] = useState(false);

  useLayoutEffect(() => {
    if (!footerRef.current) return;
    const update = () => footerRef.current && setFooterHeight(footerRef.current.offsetHeight);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(footerRef.current);
    window.addEventListener('resize', update);
    update();
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  function addMessage(role, text) {
    // Maintain chat history in order for rendering and API payloads.
    setMessages(prev => [...prev, { role, text }]);
  }

  //used for the button animation, so we know to trigger it based on if the value is true. 
  const handleCLick = () => {
    if (!loading) {
      setClicked(true);
      
      setTimeout(() => {
        setClicked(false);
      },500)
    }
  };

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    addMessage('user', trimmed);
    setInput('');
    setLoading(true);

    try { 
      //map local history to API format (assistant/user).
      const payload = {
        messages: messages
          .filter(m => m.role === 'user' || m.role === 'bot')
          .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', text: m.text }))
          .concat([{ role: 'user', text: trimmed }])
      };
      //sends message to express API
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!r.ok) {
        const text = await r.text();
        console.error('API error:', r.status, text);
        //handle possible errors that could occur from communication with the backend. 
        try {
          const parsed = JSON.parse(text);
          const label = parsed.error || `API error (${parsed.status || r.status})`;
          addMessage('bot', `${label}. Reference: ${parsed.cid || 'n/a'}`);
        } catch {
          addMessage('bot', `API error (${r.status}).`);
        }
      } else {
        const data = await r.json();
        addMessage(
          'bot',
          data.success
            ? data.reply
            : `Model not reachable. Reference: ${data.cid || 'n/a'}`
        );
      }
    } catch (e) {
      console.error('Network/JS error:', e);
      addMessage('bot', 'Network error.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    feather.replace();
  }, [messages]);

  useEffect(() => { feather.replace(); }, []);

  //html/jsx needed to render chatpage with use of bootstrap (thus strange classNames)
  return (
    <div className="container-fluid h-100 d-flex flex-column position-relative">
      <div
        ref={listRef}
        className="flex-grow-1 overflow-auto px-3 pt-4 chat-window"
        style={{
          minHeight: 0,
          paddingBottom: (footerHeight || 0) + 16,
          scrollPaddingBottom: (footerHeight || 0) + 16
        }}
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="chat-feed mx-auto" style={{ maxWidth: 960 }}>
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 message-row ${m.role}`}>
              {m.role === 'bot' && (
                <img
                  src={avatarImg}
                  alt="Caligula"
                  className="chat-avatar"
                />
              )}
              <div className={`bubble ${m.role}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message-row bot">
              <img
                src={avatarImg}
                alt="Caligula"
                className="chat-avatar"
              />
              <div className="bubble bot thinking">Caligula is thinking...</div>
            </div>
          )}
        </div>
      </div>

      <div
        ref={footerRef}
        className="px-3 pb-3 position-absolute start-0 end-0"
        style={{ bottom: 0, zIndex: 2 }}
      >
        <div className="mx-auto w-100" style={{ maxWidth: 960 }}>
          <div className="card rounded-3 shadow-sm">
            <div className="card-header rounded-3">Talking with Caligula</div>
            <div className="card-body">
              <form onSubmit={onSubmit} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Send message to Caligula"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  aria-label='form'
                />
                <button
                  type="submit"
                  className={`btn btn-primary ${clicked ? "btn-clicked" : ""}`}
                  aria-label="Send message"
                  title="Send"
                  disabled={loading}
                  onClick = {handleCLick}
                >
                  <i data-feather="send"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
