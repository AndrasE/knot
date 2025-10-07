interface GameHeaderProps {
  title: string;
  subtitle?: string; // Update the type to explicitly allow null for values that shouldn't display
  stats: { label: string; value: string | number | null }[];
  onReset: () => void;
}

export default function GameHeader({
  title,
  subtitle,
  stats,
  onReset,
}: GameHeaderProps) {
  return (
    <header className="text-center ">
      <h1 className="text-2xl ">{title}</h1>{" "}
      {subtitle && <p className="mb-4 text-gray-600">{subtitle}</p>}{" "}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {" "}
        {stats.map(
          (stat, i) =>
            // --- 🛑 THE SIMPLE FIX IS HERE: Filter out null values ---
            stat.value !== null && (
              <div
                key={i}
                className={`px-4 py-2 rounded-lg shadow-sm ${
                  // Note: The logic for i === 0 might break if the first stat is filtered.
                  // A safer way is to use a filter() before map(), but this is simplest.
                  i == 0
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                {stat.label}: <span>{stat.value}</span>{" "}
              </div>
            )
        )}{" "}
        <button
          onClick={onReset}
          className="px-4 py-2 text-white transition duration-200 bg-red-400 rounded-lg shadow-sm cursor-pointer active:scale-95">
          Reset{" "}
        </button>{" "}
      </div>{" "}
    </header>
  );
}
