
//Variables globales

const img = new Image();
const lector = new FileReader()
;

// Elementos del DOM (canvas, botones, etc.)
const inputImagen = document.querySelector("#imagen");
const canvas = document.querySelector("#imagenOriginal");
const ctx = canvas.getContext("2d")


const canvasHist = document.querySelector("#histogramaOriginal");
const ctxHist = canvasHist.getContext("2d")

const Ecualizar = document.querySelector("#Ecualizar")
const Expandir = document.querySelector("#Expandir");

let imagenRGB = [];



Ecualizar.addEventListener("click", () => {
    handleAction('ecualizar');
    // Imagen
    const canvasEcualizar = document.querySelector("#ecualizacion");
    const ctxEcualizar = canvasEcualizar.getContext("2d")
    const canvasHistEcualizado = document.querySelector("#histogramaEcualizado");
    const ctxHistEcualizado = canvasHistEcualizado.getContext("2d");
    // Obtener los datos de la imagen original
    canvasEcualizar.width = img.width;
    canvasEcualizar.height = img.height;
    canvasHistEcualizado.width = 256;
    canvasHistEcualizado.height = 200;
    
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctxEcualizar.putImageData(imgData, 0, 0);

    const histograma = calcularHistograma(convertirABlancoYNegro(imgData));
    const cdf = calcularCDF(histograma);
    //verificar bien la nueva imagen
    const imagenEcualizada = ecualizarImagen(imagenRGB, cdf);
    const nuevoHistograma = calcularHistograma(imagenEcualizada);
    dibujarHistograma(nuevoHistograma, canvasHistEcualizado, ctxHistEcualizado);
    


})

//revisar mejor esta parte del codigo

const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const ecualizarHistograma = (imgData) => {
    const histograma = calcularHistograma(convertirABlancoYNegro(imgData));
    const cdf = new Array(256).fill(0);
    let sum = 0;

    for (let i = 0; i < histograma.length; i++) {
        sum += histograma[i];
        cdf[i] = sum;
    }
    for (let i = 0; i < cdf.length; i++) {
        cdf[i] = Math.round((cdf[i] / sum) * 255);
    }
    for (let i = 0; i < imgData.data.length; i += 4) {
        const gris = imgData.data[i]; 
        const nuevoValor = cdf[gris];
        imgData.data[i] = nuevoValor;
        imgData.data[i + 1] = nuevoValor;
        imgData.data[i + 2] = nuevoValor;
    }
    ctxEcualizar.putImageData(imgData, 0, 0);
}





//Expansion a futuro
Expandir.addEventListener("click", () => {
    const canvasExpandir = document.querySelector("#expancion");
    const ctxExpandir = canvasExpandir.getContext("2d");
    const canvasHistExpandido = document.querySelector("#histogramaExpandido");
    const ctxHistExpandido = canvasHistExpandido.getContext("2d");
    handleAction('expandir');

})

inputImagen.addEventListener("change", event => {
    const archivoInicial = event.target.files[0];
    lector.onload = (e) => {
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvasHist.width = 256; 
            canvasHist.height = 200; 

            ctx.drawImage(img, 0, 0);
            
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            const newImg = convertirABlancoYNegro(imgData);
            ctx.putImageData(imgData, 0, 0);
            
            imagenRGB = newImg 
            img.data = imagenRGB

            const histograma = calcularHistograma(newImg);
            dibujarHistograma(histograma, canvasHist, ctxHist);
            
        };
        img.src = e.currentTarget.result;
    };
    lector.readAsDataURL(archivoInicial);
    
    

})


// Convertimnos a blanco en niveles RGBA
const convertirABlancoYNegro = (imgData) => {
    // Entrada de  colores Rgb : imgData.data
    miImagen = []

    for(let i = 0; i < imgData.data.length; i += 4) {
        const r = imgData.data[i];
        const g = imgData.data[i + 1];
        const b = imgData.data[i + 2];

        const gris = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
        miImagen.push(gris)
        imgData.data[i] = gris; 
        imgData.data[i + 1] = gris; 
        imgData.data[i + 2] = gris;    
    }
    ;
    imagenRGB = miImagen; 
    return miImagen;
}

// Ecualización
const calcularCDF = (histograma) => {
    const cdf = new Array(256).fill(0);
    cdf[0] = histograma[0];
    for (let i = 1; i < 256; i++) {
        cdf[i] = cdf[i - 1] + histograma[i];
    }
    return cdf;
};

const ecualizarImagen = (imagen, cdf) => {
    const cdfMin = cdf.find(v => v > 0);
    const totalPixeles = imagen.length;
    return imagen.map(valor => {
        return Math.round(((cdf[valor] - cdfMin) / (totalPixeles - cdfMin)) * 255);
    });
};

//Futura Expancion 

// ****************************/

//Hitogramna Imagen Original
const calcularHistograma = (newImg) => {
    const histograma = new Array(256).fill(0);
    for (let i = 0; i < newImg.length; i++) {
        const valor = newImg[i];
        histograma[valor]++;
    }    
    return histograma;
}    

const dibujarHistograma = (histograma, canvas, contexto) => {
    contexto.fillStyle = "white";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    
    const max = Math.max(...histograma);
    
    const scale = canvas.height / max
    
    contexto.fillStyle = "black";
    const barWidth = canvas.width / 256;
    
    for (let i = 0; i < 256; i++) {
        const barHeight = histograma[i] * scale;
        contexto.fillRect(
            i * barWidth,
            canvas.height - barHeight,
            barWidth,
            barHeight
        );
    }
}


// Maneja las acciones de los botones añadiendo contenido
function handleAction(action) {
    const container = document.getElementById('contenido-dinamico');
    container.innerHTML = '';
    if (action === 'ecualizar') {
        container.innerHTML = `
            <div class="mt-6 p-4 border rounded shadow">
                <h4 class="text-lg font-semibold mb-2">Resultado: Ecualización</h4>
                <p>Se ha generado el contenido necesario para ecualizar el histograma.</p>
                <!-- Aquí podrías llamar una función JS específica -->
            </div>
            <div class="flex flex-col-2 gap-4 justify-around w-full">
                <canvas id="histogramaEcualizado" ></canvas>
                <canvas id="ecualizacion"></canvas>
            </div>
        `;
        
        
    }
    else if (action === 'expandir') {
        container.innerHTML = `
            <div class="mt-6 p-4 border rounded shadow">
                <h4 class="text-lg font-semibold mb-2">Resultado: Expansión</h4>
                <p>Se ha generado el contenido necesario para expandir el histograma.</p>
            </div>
            <div class="flex flex-col-2 gap-4 justify-around w-full">
                <canvas id="expancion"></canvas>
                <canvas id="histogramaExpandido" ></canvas>
            </div>
        `;
        
    }
}

