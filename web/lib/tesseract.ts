import { createWorker } from "tesseract.js"

let worker: any = null

export async function getWorker() {
  if (!worker) {
    worker = await createWorker("eng")
  }

  return worker
}