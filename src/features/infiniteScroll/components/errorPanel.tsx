export function ErrorPanel({ retry }: { retry: () => void }) {
  return (
    <div className="sticky top-0 z-10 mb-6 p-4  backdrop-blur-sm rounded-lg border shadow-sm">
      <h3 className="font-semibold mb-3">Error Panel</h3>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={retry}
          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
        >
          🔄 Retry Failed Request
        </button>
      </div>
    </div>
  );
}
