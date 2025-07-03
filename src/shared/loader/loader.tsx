import { Spinner } from 'flowbite-react';
import { overlayStyle } from './utils/Overlay';

export function Loader() {
  return (
    <div style={overlayStyle}>
      <Spinner color="success" aria-label="Loading..." />
    </div>
  );
}
