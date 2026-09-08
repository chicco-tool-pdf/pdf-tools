async function mergePDFs() {
    const inputs = [
        document.getElementById("pdf1").files[0],
        document.getElementById("pdf2").files[0],
        document.getElementById("pdf3").files[0]
    ].filter(f => f); // rimuove quelli vuoti

    if (inputs.length < 2) {
        alert("Seleziona almeno due PDF");
        return;
    }

    const mergedPdf = await PDFLib.PDFDocument.create();

    for (const file of inputs) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(bytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    download(mergedBytes, "merged.pdf", "application/pdf");
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
