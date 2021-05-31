import * as model from './model.js'; // Importamos todo lo exportado de model 
import recipeView from './views/recipeView.js'; // importamos el Objeto creado a partir de la clase RecipView
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js'
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; // Importamos Pollyfilling para que funcionen sintaxis modernas
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {

    // GUardamos en ID los digitos que se generan luego del # en la barra del navegador. 
    const id = window.location.hash.slice(1);// Cortamos el # ya que no nos sirve.

    if (!id) return;

    recipeView.renderSpinner(); // Spinner de Carga.

    // Utilizamos el Algoritmo de Actualización del Dom para renderizar
    resultsView.update(model.getSearchResultsPage());


    bookMarksView.update(model.state.bookMarks);
    // 1. Modificación del estado de Receta 
    await model.loadRecipe(id); // Llamada a la API , búsqueda de receta con id sacado de barra de navegación. 


    // 2. Renderizado de Receta con Nuevo Estado
    recipeView.render(model.state.recipe); // Utilizamos el método "render" ubicado en "recipeView.js" y los datos obtenidos de "model.js" 


  }
  catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load Search results 
    await model.loadSearchResults(query);

    //Renderizamos sólo 10 resultados 
    resultsView.render(model.getSearchResultsPage());

    // Renderizamos botones de paginación inciales.
    paginationView.render(model.state.search)
  }
  catch (err) {
    console.log(err);

  }
};

const controlPagination = function (goToPage) {
  //Renderizamos resultados NUEVOS
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Renderizamos Nuevos botones
  paginationView.render(model.state.search);
};


const controlServings = function (newServings) {
  // Actualizar Porciones de comida. 
  model.updateServings(newServings);

  // Actualizar la vista. 
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe)
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // Actualizar Vistas de recetas
  recipeView.update(model.state.recipe);
  bookMarksView.render(model.state.bookMarks);

  // Cambiar ID en la URL
  window.history.pushState(null, '', `#${model.state.recipe.id}`);

  // Renderizar BookMarks
  // bookMarksView.render(model.state.bookMarks);

};

const renderBookMarks = function () {
  bookMarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {

    //Cargar Spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Renderizar Receta Añadida
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Renderizar  la vista de Favoritos
    bookMarksView.render(model.state.bookMarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);


    // Cerrar Formulario Adhesión de recetas
    setTimeout(function () {
      addRecipeView.toggleWindow()
      location.reload();
    }, 1000);

  }
  catch (err) {

    addRecipeView.renderError(err.message);
  }


}

// SUSCRIPTOR: Event Handler en el COntrolador. 
const init = function () {
  bookMarksView.addHandlerRender(renderBookMarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('hola');
  console.log('hola');

}
init();
