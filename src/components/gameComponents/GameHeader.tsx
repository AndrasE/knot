interface GameHeaderProps {
  title: string;
  subtitle?: string;
  stats: { label: string; value: string | number }[];
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
      <h1 className="text-2xl ">{title}</h1>
      {subtitle && <p className="mb-4 text-gray-600">{subtitle}</p>}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`px-4 py-2 rounded-lg shadow-sm ${
              i === 0
                ? "bg-indigo-100 text-indigo-800"
                : "bg-yellow-100 text-yellow-800"
            }`}>
            {stat.label}: <span>{stat.value}</span>
          </div>
        ))}

        <button
          onClick={onReset}
          className="px-4 py-2 text-white transition duration-200 bg-red-400 rounded-lg shadow-sm active:scale-95">
          Reset
        </button>
      </div>
    </header>
  );
}
