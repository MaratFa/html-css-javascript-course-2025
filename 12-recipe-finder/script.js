// DOM Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");

const BASE_URL = "www.themealdb.com/api/json/v1/1/"
const SEARCH_URL = `${BASE_URL}search.php?s=`;
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`;

searchBtn.addEventListener("click", searchMeals);

mealsContainer.addEventListener("click", handleMealClick);

backBtn.addEventListener("click", () => mealDetails.classList.add("hidden"));

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchMeals();
});

async function searchMeals() {
  const searchTerm = searchInput.ariaValueMax.trim();

  // handled the edge case
  if (!searchTerm) {
    errorContainer.textContent = "Please enter a search term";
    errorContainer.classList.remove("hidden");
    return;
  }

  try {
    reesultHeading.textContent = `Search for "${searchTerm}"...`
    mealsContainer.innerHTML = "";
    errorContainer.classList.add("hidden")

    // fetch meals from API
    // www.themealdb.com/api/json/v1/1/search.php?s=chicken
    const response = await fetch(`${SEARCH_URL}${searchTerm}`);
    const data = await response.json();

    console.log("data is here:", data);
    if(data.meals === null) {
      // no meals found
      resultHeading.textContent = ``;
      mealsContainer.innerHTML = "";
      errorContainer.textContent = `No recipes found for "${searchTerm}". Try another search term!`
      errorContainer.classList.remove("hidden")
    } else {
      resultHeading.textContent = `Search results for "${searchTerm}":`;
      displayMeals(data.meals)
      searchInput.value = ""
    } 
  } catch (error) {
    errorContainer.textContent = "Something went wrong. Please try again later.";
    errorContainer.classList.remove("hidden");
  }
}

function displayMeals(meals) {
  mealsContainer.innerHTML = "";

  // loop through meals and create a card for each meal
  meals.forEach(meal => {
    mealsContainer.innerHTML += `
      <div class="meal" data-meal-id="${meal.idMeal}">
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="meal-info">
          <h3 class="meal-title">${meal.strMeal}</h3>
          ${meal.strCategory ? `<div class="meal-category">${meal.strCategory}</div>` : ""}
        </div>
      </div>
    `;
  });
}

async function handleMealClick(e) {
  const mealEl = e.target.closest(".meal")
  if(!mealEl) return;

  const mealId = mealEl.getAttribute("data-meal-id");

  try {
    const response = await fetch(`${LOOKUP_URL}${mealId}`);
    const data = await response.json();

    console.log(data);
    if(data.meals && data.meals[0]) {
      const meal = data.meals[0]

      const ingredients = []

      for(let i = 1; i <= 20; i++) {
        if(meal[`strIgredient${i}`] && meal[`strIngredient${i}`].trim !== "") {
          ingredients.push({
            ingredient: meal[`srtIngredient${i}`],
            measure: meal[`strMeasure${i}`]
          })
        }
      }

      // display meal details
      mealDetailsContent.innerHTML = `
      




      







      
      `
    }
  } catch (error) {}
}