import React from "react";

export const Skeleton = ({ className = "", style }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export const SkeletonText = ({ className = "", width = "100%" }) => (
  <Skeleton className={`h-3.5 rounded-md ${className}`} style={{ width }} />
);

export const SkeletonCircle = ({ size = 40, className = "" }) => (
  <Skeleton
    className={`rounded-full ${className}`}
    style={{ width: size, height: size }}
  />
);

export const SkeletonStatCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div className="flex-1 space-y-3">
        <SkeletonText width="60%" className="h-3" />
        <SkeletonText width="45%" className="h-7 rounded-lg" />
      </div>
      <SkeletonCircle size={48} />
    </div>
  </div>
);

export const SkeletonStatsGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonStatCard key={i} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 6, columns = 6 }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800/60">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-6 py-3">
              <SkeletonText width="70%" className="h-3" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: columns }).map((_, c) => (
              <td key={c} className="px-6 py-4">
                <SkeletonText
                  width={c === 0 ? "80%" : c === columns - 1 ? "40%" : "65%"}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 p-5 space-y-4">
    <div className="flex justify-between items-start">
      <SkeletonText width="55%" className="h-5" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <SkeletonCircle size={28} />
          <SkeletonText width="60%" />
        </div>
      ))}
    </div>
    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
      <Skeleton className="h-8 w-16 rounded-md" />
      <Skeleton className="h-8 w-16 rounded-md" />
    </div>
  </div>
);

export const SkeletonCardGrid = ({ count = 6 }) => (
  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const DashboardSkeleton = ({ rows = 6, columns = 6, showStats = true }) => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20 p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 space-y-3">
        <SkeletonText width="260px" className="h-7" />
        <SkeletonText width="420px" />
      </div>
      {showStats && <SkeletonStatsGrid />}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <SkeletonText width="180px" className="h-5" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-1 md:grid-cols-12 gap-4">
          <Skeleton className="md:col-span-4 h-10 rounded-lg" />
          <Skeleton className="md:col-span-3 h-10 rounded-lg" />
          <Skeleton className="md:col-span-3 h-10 rounded-lg" />
          <Skeleton className="md:col-span-2 h-10 rounded-lg" />
        </div>
        <SkeletonTable rows={rows} columns={columns} />
      </div>
    </div>
  </div>
);

export default Skeleton;
