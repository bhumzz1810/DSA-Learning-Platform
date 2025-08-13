export default function ProblemDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="h-7 w-64 bg-gray-200 rounded" />
            <div className="h-8 w-40 bg-gray-200 rounded-full" />
          </div>
          <div className="flex items-center space-x-4 mt-3">
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: description card */}
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-9 w-40 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-4/6" />
                <div className="h-4 bg-gray-200 rounded w-3/6" />
              </div>
              <div className="mt-6">
                <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-12 bg-gray-100 rounded" />
              </div>
              <div className="mt-6">
                <div className="h-5 w-28 bg-gray-200 rounded mb-2" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 rounded w-3/5" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-32 bg-gray-100 rounded" />
            </div>
          </div>

          {/* Right: editor + IO */}
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
              <div className="px-4 py-2 bg-gray-900 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 rounded-full bg-gray-700" />
                  <span className="w-3 h-3 rounded-full bg-gray-700" />
                  <span className="w-3 h-3 rounded-full bg-gray-700" />
                </div>
                <span className="h-4 w-20 bg-gray-700 rounded" />
              </div>
              <div className="h-[400px] bg-gray-700" />
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 flex">
                <div className="px-4 py-2">
                  <div className="h-5 w-12 bg-gray-200 rounded" />
                </div>
                <div className="px-4 py-2">
                  <div className="h-5 w-14 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="h-28 bg-gray-100" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-12 bg-gray-200 rounded" />
              <div className="flex-1 h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
