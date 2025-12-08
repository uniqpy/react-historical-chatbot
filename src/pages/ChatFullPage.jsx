import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import feather from 'feather-icons';

export default function ChatFullPage() {
  // I keep messages locally; server replies as Caligula via /api/chat.
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello. I am Emperor Caligula. What would you want to ask his divinity?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

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
    setMessages(prev => [...prev, { role, text }]);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    addMessage('user', trimmed);
    setInput('');
    setLoading(true);

    try {
      //perform user verification
      
      
      // I map local history to API format (assistant/user).
      const payload = {
        messages: messages
          .filter(m => m.role === 'user' || m.role === 'bot')
          .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', text: m.text }))
          .concat([{ role: 'user', text: trimmed }])
      };

      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!r.ok) {
        const text = await r.text();
        console.error('API error:', r.status, text);
        try {
          const parsed = JSON.parse(text);
          addMessage('bot', `API error (${parsed.status || r.status}). CID: ${parsed.cid || 'n/a'}`);
        } catch {
          addMessage('bot', `API error (${r.status}).`);
        }
      } else {
        const data = await r.json();
        addMessage('bot', data.success ? data.reply : `Model not reachable. CID: ${data.cid || 'n/a'}`);
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

  return (
    <div className="container-fluid h-100 d-flex flex-column position-relative">
      <div
        ref={listRef}
        className="flex-grow-1 overflow-auto px-3 pt-4"
        style={{
          minHeight: 0,
          paddingBottom: (footerHeight || 0) + 16,
          scrollPaddingBottom: (footerHeight || 0) + 16
        }}
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div className="mx-auto" style={{ maxWidth: 960 }}>
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-end' : ''}`}>
              <div
                className={`d-inline-block px-3 py-2 ${m.role === 'user' ? 'bg-dark text-white' : 'bg-primary text-white'} rounded-3`}
                style={{ 
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {m.text}
              </div>  
            </div>
          ))}
          {loading && <div className="d-inline-block bg-white border rounded p-2 text-muted small mt-2 shadow-sm">Caligula is thinking…</div>}
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
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  aria-label="Send message"
                  title="Send"
                  disabled={loading}
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
