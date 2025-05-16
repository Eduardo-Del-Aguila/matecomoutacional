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
        `;
        console.log('Ejecutando lógica de ecualización...');
    }
    else if (action === 'expandir') {
        container.innerHTML = `
            <div class="mt-6 p-4 border rounded shadow">
                <h4 class="text-lg font-semibold mb-2">Resultado: Expansión</h4>
                <p>Se ha generado el contenido necesario para expandir el histograma.</p>
            </div>
        `;
        console.log('Ejecutando lógica de expansión...');
    }
}