import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="hy" data-palette="dawn" style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
      <p style={{ fontFamily: 'var(--display)', fontSize: 80, lineHeight: 1, color: 'var(--clay)', fontStyle: 'italic' }}>404</p>
      <h1 style={{ fontSize: 24 }}>Page not found</h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: 15 }}>This room doesn't exist.</p>
      <button onClick={() => navigate('/')} className="hy-btn hy-btn-primary" style={{ marginTop: 8 }}>
        Go home
      </button>
    </div>
  );
};

export default NotFound;
