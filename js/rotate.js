async function rotatePDF() {
    const file = document.getElementById("pdfFile").files[0];
    const pagesInput = document.getElementById("pages").value;
    const angle = Number(document.getElementById("angle").value);

    if (!file || !pagesInput) return alert("Seleziona PDF e pagine");

    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);

    const ranges = pagesInput.split(",").map(r => r.trim());
    const pagesToRotate = [];

    ranges.forEach(r => {
        if (r.includes("-")) {
            const [start, end] = r.split("-").map(Number);
            for (let i = start; i <= end; i++) pagesToRotate.push(i - 1);
        } else {
            pagesToRotate.push(Number(r) - 1);
        }
    });

    pagesToRotate.forEach(p => {
        const page = pdf.getPage(p);
        page.setRotation(PDFLib.degrees(angle));
    });

    const newBytes = await pdf.save();
    download(newBytes, "rotated.pdf", "application/pdf");
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
