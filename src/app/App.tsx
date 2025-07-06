import { InfiniteScroll } from '../features/infiniteScroll/infiniteScroll';
import { ErrorBoundary } from '../shared/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <>
      <ErrorBoundary>
        <InfiniteScroll />
      </ErrorBoundary>
    </>
  );
}

export default App;
