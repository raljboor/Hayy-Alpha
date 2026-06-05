import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div className="hy" data-palette="dawn" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
    <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Outlet />
    </main>
  </div>
);

export default AuthLayout;
