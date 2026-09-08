async function addWatermark() {
    const file = document.getElementById("pdfFile").files[0];
    const text = document.getElementById("text").value;

    if (!file || !text) return alert("Seleziona PDF e testo");

    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);

    const pages = pdf.getPages();

    pages.forEach(page => {
        page.drawText(text, {
            x: 50,
            y: page.getHeight() - 100,
            size: 40,
            color: PDFLib.rgb(0.8, 0.8, 0.8),
            opacity: 0.4,
        });
    });

    const newBytes = await pdf.save();
    download(newBytes, "watermarked.pdf", "application/pdf");
}

function download(data, filename, type) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
