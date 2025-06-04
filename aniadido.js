// function handleAction(action) {
//     const container = document.getElementById('contenido-dinamico');
//     container.innerHTML = '';
//     if (action === 'ecualizar') {
//         container.innerHTML = `
//             <div class="mt-6 p-4 border rounded shadow">
//                 <h4 class="text-lg font-semibold mb-2">Resultado: Ecualización</h4>
//                 <p>Se ha generado el contenido necesario para ecualizar el histograma.</p>
//                 <!-- Aquí podrías llamar una función JS específica -->
//             </div>
//                 <canvas id="ecualizacion"></canvas>
//                 me añadieron
//         `;
//         console.log('Ejecutando lógica de ecualización...');
//     }
//     else if (action === 'expandir') {
//         container.innerHTML = `
//             <div class="mt-6 p-4 border rounded shadow">
//                 <h4 class="text-lg font-semibold mb-2">Resultado: Expansión</h4>
//                 <p>Se ha generado el contenido necesario para expandir el histograma.</p>
//             </div>
//                 <canvas id="expancion"></canvas>
//         `;
//         console.log('Ejecutando lógica de expansión...');
//     }
// }


// const prueba = (imagendata) => {
//     const blancoNegro = []   
//     for(i = 0; i < imagendata.length; i + 4){
//         const r = imagendata[i];
//         const g = imagendata[i + 1];
//         const b = imagendata[i + 2];
        
//         const gris = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
//     }

// }