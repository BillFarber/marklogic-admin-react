import React from 'react';

function NotFound() {
  React.useEffect(() => {
    document.title = 'Page Not Found';
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default NotFound;
