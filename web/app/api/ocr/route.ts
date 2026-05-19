import { NextRequest, NextResponse } from "next/server"
import Tesseract from "tesseract.js"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { image } = body

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      )
    }

    const result = await Tesseract.recognize(
      image,
      "eng",
      {
        logger: (m) => console.log(m),
      }
    )

    return NextResponse.json({
      success: true,
      text: result.data.text,
      confidence: result.data.confidence,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        error: "OCR processing failed",
      },
      { status: 500 }
    )
  }
}