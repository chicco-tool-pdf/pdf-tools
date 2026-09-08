async function removePages() {
    const file = document.getElementById("pdfFile").files[0];
    const pagesInput = document.getElementById("pages").value;

    if (!file || !pagesInput) return alert("Seleziona PDF e pagine");

    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);

    const totalPages = pdf.getPageCount();
    const ranges = pagesInput.split(",").map(r => r.trim());
    const pagesToRemove = [];

    ranges.forEach(r => {
        if (r.includes("-")) {
            const [start, end] = r.split("-").map(Number);
            for (let i = start; i <= end; i++) pagesToRemove.push(i - 1);
        } else {
            pagesToRemove.push(Number(r) - 1);
        }
    });

    const newPdf = await PDFLib.PDFDocument.create();
    const keepPages = [];

    for (let i = 0; i < totalPages; i++) {
        if (!pagesToRemove.includes(i)) keepPages.push(i);
    }

    const copied = await newPdf.copyPages(pdf, keepPages);
    copied.forEach(p => newPdf.addPage(p));

    const newBytes = await newPdf.save();
    download(newBytes, "removed-pages.pdf", "application/pdf");
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
