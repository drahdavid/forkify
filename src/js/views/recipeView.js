// ES IMPORTANTE SABER QUE NADA SE EJECUTA DIRECTAMENTE EN LAS VISTAS, SINO QUE SE EXPORTA PARA QUE EL CONTROLADOR LO EJECUTE. 

import icons from 'url:../../img/icons.svg';  // De esta manera importamos archivos estáticos para que funcionen en PARCEL  
import { Fraction } from 'fractional'; // Librería para trabajar con fracciones 
import View from './View';

// Creamos una Clase para las Vistas de las Recetas
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe'); // Contenedor en el que renderizaremos datos. 
  _errorMessage = "We couldn't find that recipe. Please try another one ";
  _successMessage = "";



  //PUBLICADOR: Event Listener en la Vista.
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler)); // La "controlRecipes" se ejecutará con el cambio de "hash" en la barra de navegación o cuando se cargue la página.

  }

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const updateTo = +btn.dataset.updateTo;  // data-update-to --> Cuando hay un "-" se utiliza camelCase. 
      if (updateTo === 0) return;
      handler(updateTo);
    });
  };

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;
      handler();
    })
  }

  // Función que nos devuelve el HTML con todos los DATOS retornados de la API. 
  _generateMarkup() {
    return `
  <figure class="recipe__fig">
    <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this._data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
    <svg>
      <use href="${icons}#icon-user"></use>
    </svg>
  </div>
    
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${this._data.bookmarked ? '-fill' : ''}"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
  
    ${this._data.ingredients.map(this._generateMarkupIngredient).join('')} 
  
    </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>
    `;
  }

  // Función que retorna HTML con los Ingredientes
  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${ing.quantity ? new Fraction(ing.quantity).toString() : ''} </div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
      `

  }
}

export default new RecipeView(); // Exportamos un Nuevo Objeto creado con Nuestra clase RecipeView