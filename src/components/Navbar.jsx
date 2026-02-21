const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1E3A8A', // Tailwind's blue-800 color
      color: 'white',
      padding: '10px 20px',
    }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>FleetFlow</div>
      <a href="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Login / Sign In</a>
    </nav>
  );
};

export default Navbar;
