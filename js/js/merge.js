async function mergePDFs() {
    const files = document.getElementById("pdfFiles").files;
    if (!files.length) {
        alert("Seleziona almeno un PDF");
        return;
    }

    const mergedPdf = await PDFLib.PDFDocument.create();

    for (const file of files) {
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
