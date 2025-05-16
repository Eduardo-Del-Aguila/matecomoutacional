const inputImagen = document.querySelector("#imagen");
const canvas = document.querySelector("#imagenOriginal");

const ctx = canvas.getContext("2d")
const canvasHist = document.querySelector("#histogramaOriginal");
const ctxHist = canvasHist.getContext("2d")
inputImagen.addEventListener("change", event => {
    const archivoInicial = event.target.files[0];
    if (!archivoInicial) return
    const lector = new FileReader()
    lector.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Configurar tamaño de los canvases
            canvas.width = img.width;
            canvas.height = img.height;
            canvasHist.width = 256; // Ancho para el histograma
            canvasHist.height = 200; // Alto para el histograma
            
            // Dibujar imagen original
            ctx.drawImage(img, 0, 0);
            
            // Convertir a blanco y negro
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            convertirABlancoYNegro(imgData);
            ctx.putImageData(imgData, 0, 0);
            
            // Calcular y dibujar histograma
            const histograma = calcularHistograma(imgData);
            dibujarHistograma(histograma);
        };
        img.src = e.target.result;
    };
    lector.readAsDataURL(archivoInicial);
})
function convertirABlancoYNegro(imgData) {
    for(let i = 0; i < imgData.data.length; i += 4) {
        const r = imgData.data[i];
        const g = imgData.data[i + 1];
        const b = imgData.data[i + 2];
        
        // Calcular valor de gris
        const gris = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
        imgData.data[i] = gris;     
        imgData.data[i + 1] = gris; 
        imgData.data[i + 2] = gris; 
    }
}

function calcularHistograma(imgData) {
    const histograma = new Array(256).fill(0);
    for (let i = 0; i < imgData.data.length; i += 4) {
        const gris = imgData.data[i]; 
        histograma[gris]++;
    }
    return histograma;
}
function dibujarHistograma(histograma) {
    ctxHist.fillStyle = "white";
    ctxHist.fillRect(0, 0, canvasHist.width, canvasHist.height);
    
    const max = Math.max(...histograma);
    const scale = canvasHist.height / max
    ctxHist.fillStyle = "black";
    const barWidth = canvasHist.width / 256;
    
    for (let i = 0; i < 256; i++) {
        const barHeight = histograma[i] * scale;
        ctxHist.fillRect(
            i * barWidth,
            canvasHist.height - barHeight,
            barWidth,
            barHeight
        );
    }
}
