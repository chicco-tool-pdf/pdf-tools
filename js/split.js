async function splitPDF() {
    const file = document.getElementById("pdfFile").files[0];
    const pagesInput = document.getElementById("pages").value;

    if (!file || !pagesInput) return alert("Seleziona PDF e pagine");

    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);

    const ranges = pagesInput.split(",").map(r => r.trim());
    const pagesToExtract = [];

    ranges.forEach(r => {
        if (r.includes("-")) {
            const [start, end] = r.split("-").map(Number);
            for (let i = start; i <= end; i++) pagesToExtract.push(i - 1);
        } else {
            pagesToExtract.push(Number(r) - 1);
        }
    });

    const newPdf = await PDFLib.PDFDocument.create();
    const copied = await newPdf.copyPages(pdf, pagesToExtract);
    copied.forEach(p => newPdf.addPage(p));

    const newBytes = await newPdf.save();
    download(newBytes, "split.pdf", "application/pdf");
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
