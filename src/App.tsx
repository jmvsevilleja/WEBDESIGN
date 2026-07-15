import { useCallback, useRef, useState } from "react"
import { Aperture, Camera as CameraIcon, Download, RefreshCw, Sparkles } from "lucide-react"
import { Camera } from "@/components/Camera"

type BoothState = "idle" | "active" | "capturing" | "result"

export function App() {
  const [state, setState] = useState<BoothState>("idle")
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 960 },
          facingMode: "user",
        },
      })
      setStream(mediaStream)
      setState("active")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not access camera"
      if (message.includes("NotAllowed")) {
        setError("Camera permission denied. Please allow camera access in your browser settings.")
      } else if (message.includes("NotFound")) {
        setError("No camera found. Please connect a camera and try again.")
      } else {
        setError("Could not access camera. Please check your device settings.")
      }
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const takePhoto = useCallback(() => {
    const video = document.querySelector("video")
    if (!video) return

    setState("capturing")
    setCountdown(3)

    let count = 3
    const interval = setInterval(() => {
      count--
      if (count > 0) {
        setCountdown(count)
      } else {
        clearInterval(interval)
        setCountdown(0)

        setTimeout(() => {
          const canvas = canvasRef.current
          if (!canvas) return

          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext("2d")
          if (!ctx) return

          ctx.drawImage(video, 0, 0)
          const dataUrl = canvas.toDataURL("image/png")
          setPhoto(dataUrl)
          setCountdown(null)
          setState("result")
        }, 400)
      }
    }, 1000)
  }, [])

  const handleStart = useCallback(() => {
    if (state === "idle") {
      startCamera()
    } else if (state === "active") {
      takePhoto()
    }
  }, [state, startCamera, takePhoto])

  const handleReset = useCallback(() => {
    stopCamera()
    setPhoto(null)
    setCountdown(null)
    setState("idle")
  }, [stopCamera])

  const handleDownload = useCallback(() => {
    if (!photo) return
    const link = document.createElement("a")
    link.href = photo
    link.download = `photobooth-${Date.now()}.png`
    link.click()
  }, [photo])

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <canvas ref={canvasRef} className="hidden" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,var(--photo-red)_0_28px,var(--photo-yellow)_28px_56px,var(--photo-blue)_56px_84px,var(--photo-mint)_84px_112px)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-[repeating-linear-gradient(90deg,var(--photo-blue)_0_28px,var(--photo-mint)_28px_56px,var(--photo-red)_56px_84px,var(--photo-yellow)_84px_112px)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 pb-5 pt-8 sm:px-6 lg:px-8">
        <a
          href="/"
          className="group flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          <span className="grid size-11 place-items-center border-2 border-foreground bg-primary text-primary-foreground shadow-[5px_5px_0_var(--foreground)] transition-transform group-hover:-rotate-3">
            <Aperture className="size-5" />
          </span>
          <span>
            <span className="block font-display text-xl font-black leading-none sm:text-2xl">SnapPop</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              mini photo booth
            </span>
          </span>
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 rounded-full border-2 border-foreground bg-card px-2 py-1 shadow-[4px_4px_0_var(--foreground)] sm:flex"
        >
          {["Pose", "Flash", "Print"].map((item) => (
            <a
              key={item}
              href="#booth"
              className="rounded-full px-4 py-2 text-sm font-extrabold uppercase tracking-wide transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      <main
        id="booth"
        className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1fr)] lg:px-8"
      >
        <section className="flex flex-col gap-6 text-center lg:text-left">
          <div className="inline-flex w-fit items-center gap-2 self-center border-2 border-foreground bg-card px-3 py-2 text-xs font-black uppercase tracking-[0.2em] shadow-[4px_4px_0_var(--foreground)] lg:self-start">
            <Sparkles className="size-4 text-primary" />
            Instant silly portraits
          </div>
          <div className="space-y-4">
            <h1 className="font-display text-5xl font-black leading-[0.9] sm:text-7xl lg:text-8xl">
              Make a face.
              <span className="block text-primary">Keep the proof.</span>
            </h1>
            <p className="mx-auto max-w-xl text-base font-semibold leading-7 text-muted-foreground sm:text-lg lg:mx-0">
              A tiny browser photo booth for quick selfies, countdown drama, and one-click downloads.
            </p>
          </div>
          <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-2 lg:mx-0">
            {["wink", "freeze", "save"].map((label, index) => (
              <div
                key={label}
                className="border-2 border-foreground bg-card px-3 py-4 text-center shadow-[4px_4px_0_var(--foreground)]"
              >
                <span className="block font-display text-3xl font-black text-primary">{index + 1}</span>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative mx-auto flex w-full max-w-xl flex-col items-center gap-7">
          <div className="absolute -left-3 top-8 hidden h-[78%] w-8 bg-[radial-gradient(circle,var(--foreground)_0_4px,transparent_5px)] bg-[length:24px_24px] lg:block" />
          <div className="absolute -right-3 top-8 hidden h-[78%] w-8 bg-[radial-gradient(circle,var(--foreground)_0_4px,transparent_5px)] bg-[length:24px_24px] lg:block" />

          <Camera
            stream={stream}
            onStart={handleStart}
            isActive={state === "active" || state === "capturing"}
            countdown={countdown}
          />

          {state === "result" && photo && (
            <div className="flex flex-col items-center gap-5">
              <img
                src={photo}
                alt="Captured photo"
                className="w-full max-w-[300px] rotate-[-2deg] border-[10px] border-card bg-card shadow-[8px_8px_0_var(--foreground)]"
              />

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 border-2 border-foreground bg-card px-5 py-3 text-sm font-black uppercase tracking-wide text-foreground shadow-[4px_4px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Download className="size-4" />
                  Download
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 border-2 border-foreground bg-primary px-5 py-3 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <RefreshCw className="size-4" />
                  Take Another
                </button>
              </div>
            </div>
          )}

          {state === "idle" && (
            <div className="flex flex-col items-center gap-3 text-center">
              <h2 className="font-display text-3xl font-black text-foreground sm:text-4xl">Click to start</h2>
              <p className="max-w-xs text-sm font-semibold leading-relaxed text-muted-foreground">
                Your camera opens in the booth. Smile, blink, or commit to the bit.
              </p>
            </div>
          )}

          {state === "active" && !countdown && (
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={takePhoto}
                className="group inline-flex items-center gap-3 border-2 border-foreground bg-primary px-8 py-4 font-display text-2xl font-black text-primary-foreground shadow-[6px_6px_0_var(--foreground)] transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:translate-y-0 sm:text-3xl"
              >
                <CameraIcon className="size-6 transition-transform group-hover:scale-110" />
                Capture
              </button>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Or press the camera shutter button
              </p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4">
              <p className="max-w-xs text-center text-sm font-semibold text-destructive">{error}</p>
              <button
                onClick={startCamera}
                className="border-2 border-foreground bg-primary px-5 py-3 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-[4px_4px_0_var(--foreground)] transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Try Again
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 pb-8 pt-5 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-muted-foreground">SnapPop Photo Club</p>
        <p className="text-sm font-semibold text-muted-foreground">
          Built for quick poses, bright screens, and downloadable keepsakes.
        </p>
      </footer>
    </div>
  )
}
