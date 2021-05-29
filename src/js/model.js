// EN EL MODELO PREPARAMOS LOS DATOS QUE UTILIZAREMOS. 

// import { from } from "core-js/core/array";
import { async } from "regenerator-runtime";
import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers';




// 1. Exportamos el Objeto State para ser utilizado por otros Módulos. 
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookMarks: [],

};


const createRecipeObject = function (data) {
    console.log(data);

    const { recipe } = data.data;

    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }) // Si tiene Key, el proceso prosigue, si no tiene, frena ahí.
    }
}


// 2. Hacemos una llamada a la Api, y con el objeto que nos devuelve , modificamos el objeto STATE.RECIPE. 
export const loadRecipe = async function (id) {
    try {
        const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
        state.recipe = createRecipeObject(data);



        // Tomamos los datos recibidos de la API para construir un nuevo objeto.

        if (state.bookMarks.some(bookMark => bookMark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
        // console.log(state.bookMarks);
    }
    catch (err) {
        throw err;
    }
};

// Carga de Resultados de búsqueda. 
export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;

        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)

        console.log(data);
        // A partir del array de Querys, creamos un nuevo array cambiando el nombre a las props que vienen por defecto 
        console.log(state.search.results);
        state.search.results = data.data.recipes.map(rec => {

            return {
                id: rec.id,
                ingredients: rec.ingredients,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && { key: rec.key })
            }
        });
        state.search.page = 1; // Cuando se produzca una nueva búsqueda, inciará desde la página 1.

    }
    catch (err) {
        throw err;
    }
};

// Paginación.
export const getSearchResultsPage = function (page = state.search.page) {
    state.search.page = page;
    // El parametro "page" será pasado según en que página estemos. 
    //1. Para que empiece en 0 . 
    const start = (page - 1) * state.search.resultsPerPage;
    //2. Para que termine en una decena
    const end = page * state.search.resultsPerPage;

    //3.  Devolvemos el array, cortado desde "start" hasta "end"
    return state.search.results.slice(start, end)
};

// Actualizar Porciones
export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * newServings / state.recipe.servings;
        // newQt = oldQT * newServings / oldServings 
    });

    state.recipe.servings = newServings;
};

// Añadir a Favoritos 
const persistBookmarks = function () {
    // Seteamos el Objeto en el Local Storage. 
    // Convertimos a String los datos que vienen del array de Bookmarks.
    localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
}

export const addBookMark = function (recipe) {
    // Add BookMark
    state.bookMarks.push(recipe);

    // Mark curren recipe as BookMark
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();
};

export const deleteBookMark = function (id) {
    const index = state.bookMarks.findIndex(el => el.id === id);
    state.bookMarks.splice(index, 1);

    if (id === state.recipe.id) state.recipe.bookmarked = false;

    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookMarks = JSON.parse(storage);
}
init();

const clearBookmarks = function () {
    localStorage.clear('bookmarks');
}
// clearBookmarks(); 

export const uploadRecipe = async function (newRecipe) {
    // console.log(Object.entries(newRecipe)) // Transformamos el Objeto descompuesto en un array Pares Clave Valor
    try {
        
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingr') && entry[1] !== '')
            .map(ing => {

                const ingrArr = ing[1]
                    .split(',')
                    .map(el => el.trim());

                if (ingrArr.length !== 3) throw new Error('Wrong Ingredient Format, please use the correct one');

                const [quantity, unit, description] = ingrArr;

                return { quantity: quantity ? +quantity : null, unit, description };
            });

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: + newRecipe.cookingTime,
            servings: + newRecipe.servings,
            ingredients
        };
        console.log(recipe);

        const dataBack = await AJAX(`${API_URL}?key=${KEY}`, recipe);

        state.recipe = createRecipeObject(dataBack);

        addBookMark(state.recipe);
    }
    catch (err) {
        throw err;
    };

};