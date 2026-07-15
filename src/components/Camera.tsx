import { useCallback, useState } from "react"
import { cn } from "@/lib/utils"

interface CameraProps {
  className?: string
  stream: MediaStream | null
  onStart: () => void
  isActive: boolean
  countdown: number | null
}

export function Camera({ className, stream, onStart, isActive, countdown }: CameraProps) {
  const [error, setError] = useState<string | null>(null)

  const setupVideo = useCallback((el: HTMLVideoElement | null) => {
    if (el && stream) {
      el.srcObject = stream
    }
  }, [stream])

  const handleStart = async () => {
    try {
      setError(null)
      onStart()
    } catch {
      setError("Camera access denied. Please allow camera permissions.")
    }
  }

  return (
    <div className={cn("relative mx-auto w-full max-w-[420px]", className)}>
      <div className="absolute -top-4 left-1/2 z-10 h-9 w-[132px] -translate-x-1/2 border-2 border-b-0 border-foreground bg-secondary">
        <div className="absolute right-3 top-2 h-1.5 w-5 rounded-full bg-accent" />
      </div>

      <div className="relative border-2 border-foreground bg-card p-3 shadow-[10px_10px_0_var(--foreground)]">
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-6 rounded-full bg-primary" />
            <div className="h-2 w-2 rounded-full bg-secondary" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">snappop</span>
          <div
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-colors duration-300",
              isActive ? "bg-primary shadow-[0_0_0_3px_var(--photo-yellow)]" : "bg-muted",
            )}
          />
        </div>

        <div className="mx-auto mb-2 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-foreground bg-secondary">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-foreground bg-[#20242d]">
            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full border-2 border-[#3f8cff] bg-[#0c111c]">
              <div className="h-[12px] w-[12px] rounded-full bg-[#05070c] ring-2 ring-[#293850]">
                <div className="ml-[2px] mt-[2px] h-[4px] w-[4px] rounded-full bg-secondary" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden border-[3px] border-foreground bg-black">
          <div className="relative aspect-[4/3] w-full">
            {stream ? (
              <>
                <video
                  ref={setupVideo}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55">
                    <span className="border-2 border-foreground bg-primary px-6 py-2 font-display text-7xl font-black text-primary-foreground shadow-[6px_6px_0_var(--foreground)] motion-safe:animate-[countdown-pop_0.35s_ease-out]">
                      {countdown === 0 ? "SNAP" : countdown}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#141416]">
                <div className="h-12 w-12 rounded-full border-2 border-[#3f8cff] bg-[#1e1e22]/80" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#7b8290]">Camera off</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between px-1">
          <div className="flex gap-1.5">
            <div className="h-6 w-6 border-2 border-foreground bg-secondary" />
            <div className="h-6 w-6 border-2 border-foreground bg-accent" />
          </div>

          <button
            onClick={handleStart}
            disabled={isActive && countdown !== null}
            className={cn(
              "group relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-foreground bg-card transition-all duration-300",
              "hover:bg-secondary hover:shadow-[0_0_0_5px_var(--photo-yellow)]",
              "active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
              isActive && !countdown && "bg-secondary shadow-[0_0_0_5px_var(--photo-yellow)]",
            )}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-full bg-primary transition-all duration-300",
                isActive && "shadow-[0_0_0_3px_var(--foreground)]",
              )}
            />
          </button>

          <div className="flex gap-1.5">
            <div className="h-6 w-6 border-2 border-foreground bg-primary" />
            <div className="h-6 w-6 border-2 border-foreground bg-secondary" />
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-0.5 px-4">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="h-2 w-1 rounded-full bg-foreground"
              style={{ opacity: 0.18 + (index % 3) * 0.12 }}
            />
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-center text-xs text-destructive">{error}</p>}
    </div>
  )
}
