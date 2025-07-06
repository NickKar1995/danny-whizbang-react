export const FallbackUI = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>Oops! Something is wrong</h2>
    <p>Yap, you are not getting hired mate</p>
    <button onClick={() => window.location.reload()}>Refresh</button>
  </div>
);
