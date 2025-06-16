
//Variables globales

const img = new Image();
const lector = new FileReader();



// Elementos del DOM (canvas, botones, etc.)
const inputImagen = document.querySelector("#imagen");
const canvas = document.querySelector("#imagenOriginal");
const ctx = canvas.getContext("2d")


const canvasHist = document.querySelector("#histogramaOriginal");
const ctxHist = canvasHist.getContext("2d")

const Ecualizar = document.querySelector("#Ecualizar")
const Expandir = document.querySelector("#Expandir");




//Ecualizacion
Ecualizar.addEventListener("click", () => {
    handleAction('ecualizar');
    // Imagen
    const canvasEcualizar = document.getElementById('ecualizacion');
    const ctxEcualizar = canvasEcualizar.getContext('2d')

    const canvasHistEcualizado = document.getElementById('histogramaEcualizado');
    const ctxHistEcualizado = canvasHistEcualizado.getContext('2d');
    // Obtener los datos de la imagen original
    canvasEcualizar.width = img.width;
    canvasEcualizar.height = img.height;
    canvasHistEcualizado.width = 256;
    canvasHistEcualizado.height = 200;

    //funcion Ecualizacion
    const resultado = Ecualización(imagenRGB)
    const histogramaEcualizado = calcularHistograma(resultado)

    //Pintado de histograma Ecualizado
    dibujarHistograma(histogramaEcualizado,canvasHistEcualizado,ctxHistEcualizado)
    
    const imgData = ctxEcualizar.createImageData(canvasEcualizar.width,canvasEcualizar.height)
    const data = imgData.data

    //Pintado de imagen Ecualizada
    for (let i = 0; i <resultado.length; i++) {
        const gris =resultado[i];
        const j    = i * 4;
        data[j] = gris;  
        data[j + 1] = gris;  
        data[j + 2] = gris;  
        data[j + 3] = 255;   
    }

    ctxEcualizar.putImageData(imgData, 0, 0);


})




//Expanción
Expandir.addEventListener("click", () => {
    handleAction('expandir');
    const canvasExpandir = document.getElementById("expancion");
    const ctxExpandir = canvasExpandir.getContext("2d");

    const canvasHistExpandido = document.getElementById("histogramaExpandido");
    const ctxHistExpandido = canvasHistExpandido.getContext("2d");

    canvasExpandir.width = img.width;
    canvasExpandir.height = img.height;
    canvasHistExpandido.width = 256;
    canvasHistExpandido.height = 200;

    const resultado = Expansion(imagenRGB)
    const histogramaExpandido = calcularHistograma(resultado)
    dibujarHistograma(histogramaExpandido, canvasHistExpandido, ctxHistExpandido)

    const imgData = ctxExpandir.createImageData(canvasExpandir.width,canvasExpandir.height)
    const data = imgData.data

    for (let i = 0; i <resultado.length; i++) {
        const gris =resultado[i];
        const j    = i * 4;
        data[j] = gris;  
        data[j + 1] = gris;  
        data[j + 2] = gris;  
        data[j + 3] = 255;   
    }

    ctxExpandir.putImageData(imgData, 0, 0);


})


//CARGAR IMAGEN
inputImagen.addEventListener("change", event => {
    const archivoInicial = event.target.files[0];
    lector.onload = (e) => {
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvasHist.width = 256; 
            canvasHist.height = 200;
            //dibjamos la imagen
            ctx.drawImage(img, 0, 0);
            //obtenemos los datos de la imagen
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            //convertimos a blanco y negro la imagen pasamos de RGBA a grises
            const newImg = convertirABlancoYNegro(imgData);
            ctx.putImageData(imgData, 0, 0);
            imagenRGB = newImg;
            img.data = imagenRGB;
            //calculamos hitograma y lo pintamos
            const histograma = calcularHistograma(newImg);
            dibujarHistograma(histograma, canvasHist, ctxHist);
        };
        img.src = e.currentTarget.result;
    };
    lector.readAsDataURL(archivoInicial);
})


// Convertimnos a blanco en niveles RGBA
const convertirABlancoYNegro = (imgData) => {
    miImagen = [];
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

//Hitogramna Imagen Original
const Ecualización = (newImg) => {
    //cantidades por cada nivel
    const cantidades = new Array(256).fill(0);
    for (let i = 0; i < newImg.length; i++) {
        const valor = newImg[i];
        cantidades[valor]++;
    }

    //niveles de colores existentes
    const unicos = [...new Set(newImg)].sort((a, b) => a - b);
    const acumulado = new Array(256).fill(0);
    let suma = 0;
    for (let v = 0; v < 256; v++) {
        suma += cantidades[v];
        acumulado[v] = suma;
    }

    //definimos constantes de la formula
    const cdfMin = acumulado.find(c => c > 0);
    const total = newImg.length; 
    const L = 256;              
    const h = new Array(256).fill(0);

    for (const v of unicos) {
        const cdfV = acumulado[v];
        //Formula del video para ecualizar(es necesaria ya que estamos trabajando en niveles de 255)
        const nuevo = Math.round( (cdfV - cdfMin) / (total - cdfMin) * (L - 1) );
        h[v] = nuevo;
    }

    const salida = new Uint8ClampedArray(total);
    for (let i = 0; i < total; i++) {
    salida[i] = h[newImg[i]];
    }

    return salida;
}

//Expansion
const Expansion = (newImg) => {
    const valores = [...new Set(newImg)];
    const max = Math.max(...valores);
    const min = Math.min(...valores);

    let maxG = Number(prompt("Coloca el número mayor (0-255)"));
    
    if (maxG < 0 || maxG > 255) {
        window.alert("Los valores deben estar entre 0 y 255.");
        return; 
    }else{
        let minG = Number(prompt(`Coloca el número menor (0-${maxG})`));
        if (minG > maxG) {
            window.alert("El valor mínimo no puede ser mayor que el valor máximo.");
            return; 
        }else{
            
                const m = (maxG - minG) / (max - min);
                const b = minG - m * min;
            
                const resultado = newImg.map(pixel => {
                    const nuevoValor = Math.round(m * pixel + b);
                    return Math.min(255, Math.max(0, nuevoValor)); 
                });
            
                return resultado;
            
        }
        
    }
    

}

//Caluclo de histogramas y dibujado en el canvas
const calcularHistograma = (newImg) => {
    const histograma = new Array(256).fill(0);
    for (let i = 0; i < newImg.length; i++) {
        const valor = newImg[i];
        histograma[valor]++;
    }    
    return histograma;
}    

const dibujarHistograma = (histograma, canvas, ctx) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const max = Math.max(...histograma);

    const scale = canvas.height / max
    ctx.fillStyle = "black";
    const barWidth = canvas.width / 256;
    
    for (let i = 0; i < 256; i++) {
        const barHeight = histograma[i] * scale;
        ctx.fillRect(
            i * barWidth,
            canvas.height - barHeight,
            barWidth,
            barHeight
        );
    }
}

let imagenRGB = [];


// Maneja las acciones de los botones añadiendo contenido
function handleAction(action) {
    const container = document.getElementById('contenido-dinamico');
    container.innerHTML = '';

    if (action === 'ecualizar') {
        container.innerHTML = `
            <div class="mt-6 p-4 border rounded shadow">
                <h4 class="text-lg font-semibold mb-2">Resultado: Ecualización</h4>
                <p>Se ha generado el contenido necesario para ecualizar el histograma.</p>
            </div>
            <div class="flex flex-col items-center w-full gap-4">
                <div class="flex flex-row items-stretch w-full gap-4">
                    <canvas id="ecualizacion"></canvas>
                    <canvas id="histogramaEcualizado"></canvas>
                </div>
                <button 
                    class="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" 
                    onclick="descargarCanvas('ecualizacion', 'imagen-ecualizada')"
                >
                    Descargar Imagen Ecualizada
                </button>
            </div>
        `;
    } else if (action === 'expandir') {
        container.innerHTML = `
            <div class="mt-6 p-4 border rounded shadow">
                <h4 class="text-lg font-semibold mb-2">Resultado: Expansión</h4>
                <p>Se ha generado el contenido necesario para expandir el histograma.</p>
            </div>
            <div class="flex flex-col items-center w-full gap-4">
                <div class="flex flex-row items-stretch w-full gap-4">
                    <canvas id="expancion"></canvas>
                    <canvas id="histogramaExpandido"></canvas>
                </div>
                <button 
                    class="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition" 
                    onclick="descargarCanvas('expancion', 'imagen-expandida')"
                >
                    Descargar Imagen Expandida
                </button>
            </div>
        `;
    }
}

function descargarCanvas(idCanvas, nombreArchivo) {
    const canvas = document.getElementById(idCanvas);
    const enlace = document.createElement('a');
    enlace.href = canvas.toDataURL("image/png");
    enlace.download = `${nombreArchivo}.png`;
    enlace.click();
}
