// src/components/TopThreeUsers.jsx
import DefaultAvatar from "@/components/DefaultAvatar";

const themeConfig = {
  light: {
    bg: "bg-white",
    border: "border-gray-300",
    text: "text-gray-800",
    accent: "text-blue-600",
  },
  dark: {
    bg: "bg-gray-800",
    border: "border-gray-700",
    text: "text-white",
    accent: "text-cyan-400",
  },
  ocean: {
    bg: "bg-blue-800",
    border: "border-blue-700",
    text: "text-white",
    accent: "text-cyan-300",
  },
  forest: {
    bg: "bg-green-800",
    border: "border-green-700",
    text: "text-white",
    accent: "text-emerald-300",
  },
};

const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
const nf = new Intl.NumberFormat();

function SkeletonCard() {
  return (
    <div className="flex flex-col items-center gap-2 animate-pulse">
      <div className="w-20 h-20 rounded-full bg-white/10" />
      <div className="h-4 w-24 bg-white/10 rounded" />
      <div className="h-3 w-16 bg-white/10 rounded" />
      <div className="h-4 w-20 bg-white/10 rounded" />
    </div>
  );
}

export default function TopThreeUsers({
  topUsers = [],
  theme = "dark",
  loading = false,
}) {
  const current = themeConfig[theme] || themeConfig.dark;

  // Order to show: #2 (left), #1 (center, bigger), #3 (right)
  const ranks = [2, 1, 3];

  return (
    <div className={`rounded-xl p-6 ${current.bg} border ${current.border}`}>
      <div className="flex justify-around items-end text-center gap-6">
        {loading
          ? [0, 1, 2].map((i) => <SkeletonCard key={i} />)
          : ranks.map((rank) => {
              const u = topUsers[rank - 1] || {};
              const name = u.username || "DSArena User";
              const xp = typeof u.xp === "number" ? u.xp : 0;
              const size = rank === 1 ? 84 : 72;
              const ring =
                rank === 1
                  ? "ring-2 ring-yellow-400 shadow-[0_0_0_3px_rgba(250,204,21,0.15)]"
                  : "ring-0";

              return (
                <div key={rank} className="flex flex-col items-center">
                  <div className="relative">
                    <DefaultAvatar
                      name={name}
                      src={u.avatarUrl}
                      size={size}
                      className={ring}
                    />
                    <span className="absolute -top-2 -right-2 text-2xl select-none">
                      {medals[rank]}
                    </span>
                  </div>

                  <p className={`mt-2 font-bold text-lg ${current.text}`}>
                    {name}
                  </p>
                  <p className={`text-sm ${current.accent}`}>Rank: #{rank}</p>
                  <p className={`text-xl font-bold ${current.accent} mt-1`}>
                    {nf.format(xp)} XP
                  </p>
                </div>
              );
            })}
      </div>
    </div>
  );
}
