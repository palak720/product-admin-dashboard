export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-16 space-y-4" role="alert">
      <p className="text-red-600">{message}</p>
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Retry
      </button>
    </div>
  );
}