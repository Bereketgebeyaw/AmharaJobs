import React, { useState } from 'react';

const ChatWidget = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatSent, setChatSent] = useState(false);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      // Open WhatsApp with pre-filled message
      const encodedMsg = encodeURIComponent(chatMessage);
      const whatsappNumber = '+251963770771';
      window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMsg}`, '_blank');
      setChatSent(true);
      setTimeout(() => setChatSent(false), 2000);
      setChatMessage("");
      setChatOpen(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 2000,
            background: 'var(--primary)',
            color: '#fff',
            borderRadius: 32,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: '1.3rem',
            fontWeight: 500,
            padding: '0.7rem 1.5rem 0.7rem 1.1rem',
            cursor: 'pointer',
            minWidth: 180,
            transition: 'box-shadow 0.2s',
          }}
          aria-label="Chat with us"
        >
          <span style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '50%', width: 32, height: 32, justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="var(--primary)" />
              <path d="M16 7C11.03 7 7 11.03 7 16c0 1.93.63 3.72 1.7 5.18L7 25l3.82-1.7A8.93 8.93 0 0 0 16 25c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 15.5c-1.57 0-3.13-.49-4.4-1.4l-.31-.22-2.6.87.87-2.6-.22-.31A7.48 7.48 0 0 1 8.5 16c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5zm4.05-5.81c-.22-.11-1.3-.64-1.5-.71-.2-.07-.34-.11-.48.11-.14.22-.55.7-.67.84-.12.14-.25.16-.47.06-.22-.11-.92-.34-1.75-1.1-.65-.58-1.09-1.3-1.22-1.52-.13-.22-.01-.34.09-.45.1-.1.22-.25.33-.37.11-.12.14-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.48-1.19-.66-1.63-.18-.44-.36-.38-.48-.39-.12-.01-.27-.01-.41-.01-.14 0-.38.06-.58.25-.2.19-.76.73-.76 1.8 0 1.07.77 2.11.88 2.26.11.15 1.52 2.32 3.68 3.17.51.22.92.36 1.24.46.52.16.99.14 1.36.08.42-.07 1.3-.53 1.48-1.04.18-.51.18-.94.13-1.03-.05-.09-.2-.14-.42-.25z" fill="#fff"/>
            </svg>
          </span>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '1.15rem' }}>Chat with us</span>
        </button>
      )}
      {/* Chat Box */}
      {chatOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 2100,
            width: 340,
            maxWidth: '95vw',
            background: '#f7f9fb',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeInUp 0.2s',
          }}
        >
          {/* Header */}
          <div style={{ background: 'var(--primary)', color: '#fff', padding: '1rem', fontWeight: 700, fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            AmharaJobs Support
            <button onClick={() => setChatOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', marginLeft: 8, lineHeight: 1 }} aria-label="Close chat">×</button>
          </div>
          {/* Welcome message */}
          <div style={{ padding: '1rem', background: 'var(--primary-light)', fontSize: '1rem', color: '#222', borderBottom: '1px solid #e0e0e0' }}>
            <b>Support:</b> Hi there 👋 How can we help you?
          </div>
          {/* Chat form */}
          <form onSubmit={handleSendChat} style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1rem', gap: 8 }}>
            <textarea
              value={chatMessage}
              onChange={e => setChatMessage(e.target.value)}
              placeholder="Write your message here..."
              style={{ resize: 'none', minHeight: 60, borderRadius: 8, border: '1px solid var(--primary-light)', padding: 8, fontSize: '1rem', outline: 'none', background: '#fff' }}
              disabled={chatSent}
              required
            />
            <button
              type="submit"
              style={{
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '1.1rem',
                padding: '0.7rem 0',
                fontWeight: 600,
                cursor: chatSent ? 'not-allowed' : 'pointer',
                marginTop: 4,
                transition: 'background 0.2s',
              }}
              disabled={chatSent}
            >
              {chatSent ? 'Sent!' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget; 