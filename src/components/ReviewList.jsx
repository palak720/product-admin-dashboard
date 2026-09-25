export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {reviews.map((r, i) => (
        <li key={`${r.reviewerEmail}-${i}`} className="border rounded-lg p-3 bg-white">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{r.reviewerName}</span>
            <span className="text-gray-500">
              {new Date(r.date).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm mt-1">⭐ {r.rating} / 5</p>
          <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
        </li>
      ))}
    </ul>
  );
}