export default function Loading() {
  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar skeleton */}
      <div className="w-56 fixed left-0 top-0 h-screen border-r border-neutral-200 bg-cream flex-shrink-0 p-4">
        <div className="h-6 w-24 bg-neutral-200 rounded mb-8 animate-pulse" />
        <div className="space-y-2">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-8 w-full bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* İçerik skeleton */}
      <div className="flex-1 ml-56 px-8 py-10">
        <div className="animate-pulse">
          <div className="h-3 w-24 bg-neutral-200 rounded mb-3" />
          <div className="h-8 w-64 bg-neutral-200 rounded mb-2" />
          <div className="h-4 w-48 bg-neutral-100 rounded mb-10" />
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white border border-neutral-100 rounded-xl p-6">
                <div className="h-8 w-16 bg-neutral-200 rounded mx-auto mb-2" />
                <div className="h-3 w-24 bg-neutral-100 rounded mx-auto" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white border border-neutral-100 rounded-xl p-5">
                <div className="h-5 w-32 bg-neutral-200 rounded mb-3" />
                <div className="h-4 w-full bg-neutral-100 rounded mb-2" />
                <div className="h-4 w-3/4 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}