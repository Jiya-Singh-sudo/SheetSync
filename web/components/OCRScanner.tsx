"use client"

import Webcam from "react-webcam"
import { useRef, useState } from "react"
import { processOCR } from "@/app/api/processOCR"
// import Tesseract from "tesseract.js"

export default function OCRScanner() {
  const webcamRef = useRef<Webcam>(null)

  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [cameraError, setCameraError] = useState("")
  const [confidence, setConfidence] = useState<number | null>(null)

  const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot()

    if (!imageSrc) return

    setCapturedImage(imageSrc)
    setLoading(true)
    setError("")

    try {
      const result = await processOCR(imageSrc)

      if (!result.success) {
        throw new Error(result.error)
      }

      setText(result.text)
      setConfidence(result.confidence)
    } catch (err) {
      setError("OCR scan failed")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full"
          screenshotQuality={0.9}
          videoConstraints={{
            facingMode: "environment",
          }}
          onUserMediaError={() => {
            setCameraError("Camera access denied")
          }}
        />
      </div>

      <button
        onClick={capture}
        className="rounded-xl bg-black px-4 py-3 text-white"
      >
        Capture & Scan
      </button>
      <button
        onClick={() => {
          setCapturedImage(null)
          setText("")
          setConfidence(null)
        }}
        className="rounded-xl bg-red-500 px-4 py-2 text-white"
      >
        Retake
      </button>
      {loading && (
        <div className="text-sm">
          Scanning text...
        </div>
      )}

      {cameraError && (
        <div className="rounded-xl bg-red-100 p-3 text-red-700">
          {cameraError}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {capturedImage && (
        <img
          src={capturedImage}
          alt="Captured"
          className="rounded-xl border"
        />
      )}
      {text && (
        <div className="space-y-4 rounded-2xl border p-4">
          <div className="text-sm text-gray-500">
            Confidence: {confidence?.toFixed(2)}%
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] w-full rounded-xl border p-4"
          />

          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="rounded-xl bg-black px-4 py-2 text-white"
          >
            Copy Text
          </button>
        </div>
      )}
      {/*{text && (
        <div className="rounded-xl border bg-gray-100 p-4">
          <h2 className="mb-2 font-semibold">
            Detected Text
          </h2>

          <pre className="whitespace-pre-wrap text-sm">
            {text}
          </pre>
        </div>
      )}*/}
    </div>
  )
}