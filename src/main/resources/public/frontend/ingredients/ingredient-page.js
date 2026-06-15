/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");

const addSubmitButton = document.getElementById("add-ingredient-submit-button");
const deleteSubmitButton = document.getElementById("delete-ingredient-submit-button");

const token = sessionStorage.getItem("aut-toke");
const isAdmin = sessionStorage.getItem("is-admin:");
/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
/*if(!token || isAdmin !== "true")
{
    alert("Not Admin!")
}
else*/
{
    if(addSubmitButton) addSubmitButton.addEventListener("click", addIngredient);
    if(deleteSubmitButton) deleteSubmitButton.addEventListener("click", deleteIngredient);
}
/*
 * TODO: Create an array to keep track of ingredients
 */

let ingredients = [];
/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    const name = addIngredientNameInput.value.trim();
    if(!name) {
        alert("Please enter an ingredient");
        return;
    }
    const ingredientObj = {name};
    try {
        const response = await fetch('${BASE_URL}/ingredients', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer" + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify(ingredientObj)
        });
        if(response.ok)
        {
            addIngredientNameInput.value = "";
            await getIngredients();
        }
        else {
            alert("Failed to add ingredient. Status" + response.status);
        }
    }
    catch(error){
        console.error("Error adding ingredient: ", error);
        alert("A error occured while adding the ingredient");
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */




async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch('${BASE_URL}/ingredients', {
            method: "GET",
            headers: {
                "Authorization": "Bearer" + sessionStorage.getItem("auth-token")
            }
        });
        if(response.ok)
        {
            ingredients = await response.json();
            refreshIngredientList();
        }
        else {
            alert("Failed to add ingredients: " + response.status);
        }
    }
    catch(error){
        console.error("Error getting ingredients: ", error);
        alert("A error occured while getting the ingredients");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */


async function deleteIngredient() {
    // Implement delete ingredient logic here
    const deleteName = addIngredientNameInput.value.trim();
    if(!deleteName) {
        alert("Please enter an ingredient to delete");
        return;
    }
    const matchedIngredient = ingredients.find(item => item.name && 
        item.name.toLowerCase() === deleteName);
    if(!matchedIngredient)
    {
        alert("Failed to find ingredient");
        return;
    }
    try {
        const response = await fetch('${BASE_URL}/ingredients/${matchedIngredient.id}', {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer" + sessionStorage.getItem("auth-token")
            }
        });
        if(response.ok)
        {
            deleteIngredientNameInput.value = "";
            await getIngredients();
        }
        else {
            alert("Failed to delete ingredient. Status" + response.status);
        }
    }
    catch(error){
        console.error("Error deleting ingredient: ", error);
        alert("A error occured while deleting the ingredient");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    if(!ingredientListContainer) return;
    ingredientListContainer.innerHTML = "";

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");

        p.textContent = ingredient.name || "Unnamed Ingredient";

        li.append(p);
        ingredientListContainer.appendChild(li);
    })
}
