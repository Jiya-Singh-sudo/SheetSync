export async function processOCR(image: string) {
  const response = await fetch("/api/ocr", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
  });

  return response.json();
}