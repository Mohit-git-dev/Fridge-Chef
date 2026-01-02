async function getRecipe() { // Renamed to getRecipe to match your HTML's onclick
    const inputField = document.getElementById('ingredientsInput');
    const ingredients = inputField.value;
    
    const loader = document.getElementById('loader');
    const recipeDiv = document.getElementById('recipe');

    if(!ingredients) return alert("Please enter some ingredients!");

    // Show loader, hide old recipe
    loader.style.display = 'block';
    recipeDiv.style.display = 'none';

    try {
        const response = await fetch('/generate-recipe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredients })
        });

        const data = await response.json();
        
        // Match these IDs exactly to your HTML
        document.getElementById('recipeTitle').innerText = data.title;
        document.getElementById('recipeTime').innerText = data.time;
        document.getElementById('recipeDiff').innerText = data.difficulty;
        
        // Fill the lists
        document.getElementById('recipeIngredients').innerHTML = data.ingredients.map(i => `<li>${i}</li>`).join('');
        document.getElementById('recipeSteps').innerHTML = data.instructions.map(s => `<li>${s}</li>`).join('');
        
        // Show result
        recipeDiv.style.display = 'block';
    } catch (error) {
        console.error("Error:", error);
        alert("The Chef is busy. Make sure your server.js is running!");
    } finally {
        loader.style.display = 'none';
    }
}

function downloadPDF() { // Renamed to match your HTML
    const element = document.getElementById('recipe');
    const opt = {
        margin: 1,
        filename: 'MyRecipe.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}