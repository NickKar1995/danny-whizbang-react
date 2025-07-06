import type { CustomLayoutProps } from './types/CustomLayoutProps';

export function CustomLayout({ children }: CustomLayoutProps) {
  return (
    <div className="display flex justify-center">
      <div
        className="grid grid-cols-2 gap-4 p-4 mt-4"
        style={{
          boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.2)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
