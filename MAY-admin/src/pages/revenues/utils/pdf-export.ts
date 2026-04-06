import html2pdf from 'html2pdf.js'

export const exportToPDF = (elementId: string, fileName: string = 'report.pdf') => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  const opt = {
    margin: 10,
    filename: fileName,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' as const, unit: 'mm' as const, format: 'a4' as const },
  }

  html2pdf().set(opt).from(element).save()
}
