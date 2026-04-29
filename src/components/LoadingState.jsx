export function LoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} data-testid="skeleton-card" className="rounded-2xl overflow-hidden bg-white/10 animate-pulse">
          <div className="w-full aspect-square bg-white/10" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-3 rounded bg-white/10 w-3/4" />
            <div className="h-2 rounded bg-white/10 w-1/2" />
            <div className="h-2 rounded bg-white/10 w-1/4 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
