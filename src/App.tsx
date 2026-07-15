import { useCallback, useRef, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  Camera as CameraIcon,
  Check,
  Download,
  Heart,
  Instagram,
  Menu,
  Paintbrush,
  Printer,
  RefreshCw,
  Sparkles,
  Users,
  Wifi,
  X,
} from "lucide-react"
import { Camera } from "@/components/Camera"

type BoothState = "idle" | "active" | "capturing" | "result"

const styles = [
  { name: "Caricature", tone: "sunny", people: 2 },
  { name: "Oil painting", tone: "olive", people: 2 },
  { name: "Funny / wacky", tone: "pool", people: 3 },
  { name: "Realistic", tone: "rose", people: 1 },
  { name: "Watercolor", tone: "sky", people: 1 },
  { name: "Comic pop", tone: "pop", people: 2 },
]

const steps = [
  { title: "Take a photo", copy: "Step into the booth and follow the countdown.", icon: CameraIcon },
  { title: "Choose a style", copy: "Pick the art direction that feels most you.", icon: Paintbrush },
  { title: "Print & enjoy", copy: "Your keepsake is ready in a few happy seconds.", icon: Printer },
  { title: "Smile & share", copy: "Take it home—or send a copy to your phone.", icon: Heart },
]

const occasions = ["Birthdays", "Baptisms", "Weddings", "Barkada days", "Company events", "Just because"]

function Logo() {
  return (
    <a className="brand" href="#top" aria-label="Mukha photo studio home">
      <span className="brand-badge" aria-hidden="true">
        <span className="brand-face brand-face-left" />
        <span className="brand-dog" />
        <span className="brand-face brand-face-right" />
      </span>
      <span>
        <span className="brand-name">Mukha<span>.ph</span></span>
        <span className="brand-kicker">Photo studio</span>
      </span>
    </a>
  )
}

function PortraitArt({ tone, people }: { tone: string; people: number }) {
  return (
    <div className={`portrait-art portrait-${tone}`} aria-hidden="true">
      <span className="portrait-sun" />
      <span className="portrait-scribble">✦</span>
      <div className={`portrait-people count-${people}`}>
        {Array.from({ length: people }).map((_, index) => (
          <span className={`portrait-person person-${index + 1}`} key={index}>
            <span className="portrait-hair" />
            <span className="portrait-head"><i /><b /></span>
            <span className="portrait-body" />
          </span>
        ))}
      </div>
    </div>
  )
}

function StyleCard({ item }: { item: (typeof styles)[number] }) {
  return (
    <article className="style-card">
      <PortraitArt tone={item.tone} people={item.people} />
      <h3>{item.name}</h3>
    </article>
  )
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false)
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
        video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: "user" },
      })
      setStream(mediaStream)
      setState("active")
    } catch (err) {
      const message = err instanceof Error ? err.message : ""
      setError(message.includes("NotFound") ? "No camera was found on this device." : "Camera access is needed to start the booth.")
    }
  }, [])

  const takePhoto = useCallback(() => {
    const video = document.querySelector("video")
    if (!video || state === "capturing") return
    setState("capturing")
    setCountdown(3)
    let count = 3
    const timer = window.setInterval(() => {
      count -= 1
      if (count > 0) {
        setCountdown(count)
        return
      }
      window.clearInterval(timer)
      setCountdown(0)
      window.setTimeout(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const context = canvas.getContext("2d")
        if (!context) return
        context.translate(canvas.width, 0)
        context.scale(-1, 1)
        context.drawImage(video, 0, 0)
        setPhoto(canvas.toDataURL("image/png"))
        setCountdown(null)
        setState("result")
      }, 420)
    }, 1000)
  }, [state])

  const handleBooth = useCallback(() => {
    if (state === "result" && stream) {
      setPhoto(null)
      setState("active")
    } else if (state === "idle" || state === "result") startCamera()
    else if (state === "active") takePhoto()
  }, [startCamera, state, stream, takePhoto])

  const reset = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    setPhoto(null)
    setCountdown(null)
    setState("idle")
  }, [stream])

  const download = useCallback(() => {
    if (!photo) return
    const link = document.createElement("a")
    link.href = photo
    link.download = `mukha-${Date.now()}.png`
    link.click()
  }, [photo])

  return (
    <div className="site-shell" id="top">
      <canvas className="hidden" ref={canvasRef} />
      <header className="nav-wrap">
        <nav className="nav" aria-label="Main navigation">
          <Logo />
          <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
            <a href="#top" onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#styles" onClick={() => setMenuOpen(false)}>Styles</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#occasions" onClick={() => setMenuOpen(false)}>Occasions</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </div>
          <a className="book-button" href="#booth"><CalendarDays /> Book now</a>
          <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </header>

      <main>
        <section className="hero" id="booth">
          <div className="hero-doodle doodle-one">✦</div>
          <div className="hero-doodle doodle-two">⌁</div>
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles /> Instant art photo studio</p>
            <h1>Kung mahal mo,<span>ipa-<em>mukha</em> mo!</span></h1>
            <p className="hero-ribbon">Your photo. Your style. Printed in seconds!</p>
            <p className="hero-intro"><strong>Mukha.ph</strong> turns your favorite faces into frame-worthy art—ready to print before the smile fades.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={handleBooth}>
                <CameraIcon /> {state === "active" ? "Take a photo" : "Try the booth"}
              </button>
              <a href="#styles" className="text-link">Explore styles <ArrowRight /></a>
            </div>
            <div className="quick-features" aria-label="Studio features">
              <span><CameraIcon />Instant studio</span>
              <span><Paintbrush />Original styles</span>
              <span><Printer />Ready in seconds</span>
            </div>
          </div>

          <div className="hero-machine">
            <div className="new-badge"><strong>New!</strong><span>Tablet booth<br />+ wireless print</span></div>
            <Camera stream={stream} onStart={handleBooth} isActive={state === "active" || state === "capturing"} countdown={countdown} photo={photo} />
            <div className="wireless-note"><Wifi /><span>Snap here.<br /><strong>Print there.</strong></span></div>
          </div>
        </section>

        {error && (
          <div className="camera-error" role="alert">
            <span>{error}</span><button onClick={startCamera}>Try again</button>
          </div>
        )}

        {state === "result" && photo && (
          <div className="result-bar">
            <p><Check /> Looking good! Your photo is ready.</p>
            <div><button onClick={download}><Download /> Download</button><button onClick={reset}><RefreshCw /> Take another</button></div>
          </div>
        )}

        <section className="styles-section" id="styles">
          <div className="section-heading">
            <span>Pick your look</span>
            <h2>One face. <em>So many moods.</em></h2>
            <p>From cheeky caricatures to soft watercolor portraits, every style is made to feel personal.</p>
          </div>
          <div className="style-grid">
            {styles.map((style) => <StyleCard item={style} key={style.name} />)}
          </div>
          <a className="outline-button" href="#booth">Find your style <ArrowRight /></a>
        </section>

        <section className="how-section" id="how">
          <div className="how-title">
            <span>Zero fuss, all fun</span>
            <h2>How the magic happens</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <article className="step-card" key={step.title}>
                  <div className="step-icon"><Icon /></div>
                  <span className="step-number">{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                  {index < steps.length - 1 && <ArrowRight className="step-arrow" />}
                </article>
              )
            })}
          </div>
        </section>

        <section className="occasion-section" id="occasions">
          <div className="occasion-copy">
            <p className="eyebrow"><Heart /> Made for real memories</p>
            <h2>Perfect for every kind of <em>happy.</em></h2>
            <div className="occasion-list">
              {occasions.map((occasion) => <span key={occasion}><Check />{occasion}</span>)}
            </div>
            <a className="primary-button" href="mailto:hello@mukha.ph">Plan your event <ArrowRight /></a>
          </div>
          <div className="group-portrait" aria-label="A playful illustrated group portrait">
            <div className="group-sun" />
            <div className="group-spark">✦</div>
            {["a", "b", "c", "d", "e", "f"].map((person) => (
              <span className={`group-person gp-${person}`} key={person}>
                <i className="gp-hair" /><i className="gp-head"><b /><em /></i><i className="gp-body" />
              </span>
            ))}
            <span className="group-caption"><Users /> Barkada approved</span>
          </div>
        </section>

        <section className="cta-strip">
          <div><span>Walk in. Snap. Print.</span><strong>Leave with something worth keeping.</strong></div>
          <a href="#booth">Start smiling <ArrowRight /></a>
        </section>
      </main>

      <footer id="contact">
        <div className="footer-main">
          <Logo />
          <p>Artful instant portraits for solo shots, couples, families, barkadas, and whole teams.</p>
          <div className="footer-links"><a href="#styles">Styles</a><a href="#how">How it works</a><a href="#occasions">Occasions</a></div>
          <div className="footer-social"><a href="mailto:hello@mukha.ph">hello@mukha.ph</a><a href="#top"><Instagram /> @mukha.ph</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Mukha.ph Photo Studio</span><span>Made for big smiles in the Philippines.</span></div>
      </footer>
    </div>
  )
}
