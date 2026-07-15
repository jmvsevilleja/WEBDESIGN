import { useCallback } from "react"
import { Camera as CameraIcon, Home, RotateCcw, Settings } from "lucide-react"

interface CameraProps {
  stream: MediaStream | null
  onStart: () => void
  isActive: boolean
  countdown: number | null
  photo: string | null
}

export function Camera({ stream, onStart, isActive, countdown, photo }: CameraProps) {
  const setupVideo = useCallback((element: HTMLVideoElement | null) => {
    if (element && stream) element.srcObject = stream
  }, [stream])

  return (
    <div className="camera-wrap">
      <div className="camera-shadow" />
      <div className="camera-body">
        <div className="camera-top">
          <div className="camera-lens"><i /><b /></div>
          <div className="camera-speaker"><i /><i /><i /><i /></div>
        </div>
        <div className="camera-screen-shell">
          <div className="screen-toolbar"><span><Home /></span><small>MUKHA CAM</small><span><Settings /></span></div>
          <div className="camera-screen">
            {photo ? (
              <img src={photo} alt="Your captured Mukha portrait" />
            ) : stream ? (
              <video ref={setupVideo} autoPlay muted playsInline />
            ) : (
              <div className="screen-art">
                <span className="screen-spark">✦</span>
                <div className="screen-person screen-person-one"><i /><b><em /><u /></b><strong /></div>
                <div className="screen-person screen-person-two"><i /><b><em /><u /></b><strong /></div>
                <p>Your best angle<br /><strong>is all of them.</strong></p>
              </div>
            )}
            {countdown !== null && <div className="countdown">{countdown === 0 ? "SNAP!" : countdown}</div>}
          </div>
          <div className="screen-controls">
            <button aria-label="Retake photo" onClick={onStart}><RotateCcw /> Retake</button>
            <button className="shutter" aria-label={stream ? "Take photo" : "Start camera"} onClick={onStart} disabled={isActive && countdown !== null}><CameraIcon /></button>
            <button onClick={onStart}>{stream ? "Next" : "Start"}</button>
          </div>
        </div>
        <span className="camera-dot" />
      </div>
      <div className="camera-stand"><i /></div>
    </div>
  )
}
