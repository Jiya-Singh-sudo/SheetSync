"use client"

import Webcam from "react-webcam"
import { useRef, useState } from "react"
// import Tesseract from "tesseract.js"

export default function OCRScanner() {
  const webcamRef = useRef<Webcam>(null)

  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

    const capture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot()

    if (!imageSrc) return

    setCapturedImage(imageSrc)
    setLoading(true)

    try {
        const response = await fetch("/api/ocr", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            image: imageSrc,
        }),
        })

        const data = await response.json()

        if (data.success) {
        setText(data.text)
        } else {
        alert(data.error)
        }
    } catch (error) {
        console.error(error)
        alert("OCR request failed")
    }

    setLoading(false)
    }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-full"
          videoConstraints={{
            facingMode: "environment",
          }}
        />
      </div>

      <button
        onClick={capture}
        className="rounded-xl bg-black px-4 py-3 text-white"
      >
        Capture & Scan
      </button>

      {loading && (
        <div className="text-sm">
          Scanning text...
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
        <div className="rounded-xl border bg-gray-100 p-4">
          <h2 className="mb-2 font-semibold">
            Detected Text
          </h2>

          <pre className="whitespace-pre-wrap text-sm">
            {text}
          </pre>
        </div>
      )}
    </div>
  )
}