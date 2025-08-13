function DashboardSkeleton() {
  return (
    <div className="min-h-screen px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Header */}
        <div className="h-28 sm:h-32 rounded-3xl bg-gray-200/70 dark:bg-gray-800/70" />

        {/* 3 stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 rounded-3xl bg-gray-200/70 dark:bg-gray-800/70"
            />
          ))}
        </div>

        {/* Quiz card */}
        <div className="h-64 sm:h-72 rounded-3xl bg-gray-200/70 dark:bg-gray-800/70" />

        {/* Daily challenge */}
        <div className="h-48 rounded-xl bg-gray-200/70 dark:bg-gray-800/70" />

        {/* Badges grid */}
        <div className="p-6 rounded-xl bg-gray-200/30 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/40">
          <div className="h-6 w-40 mb-4 bg-gray-200/70 dark:bg-gray-800/70 rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-gray-200/70 dark:bg-gray-800/70"
              />
            ))}
          </div>
        </div>

        {/* Subscription card */}
        <div className="h-40 rounded-3xl bg-gray-200/70 dark:bg-gray-800/70" />

        {/* Recently solved list */}
        <div className="p-6 rounded-3xl bg-gray-200/30 dark:bg-gray-800/30 border border-gray-200/30 dark:border-gray-700/40">
          <div className="h-6 w-56 mb-5 bg-gray-200/70 dark:bg-gray-800/70 rounded" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-xl bg-gray-200/70 dark:bg-gray-800/70"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default DashboardSkeleton;
