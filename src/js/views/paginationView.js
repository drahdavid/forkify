import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;


      const goToPage = +btn.dataset.goto;



      handler(goToPage);
    });
  }

  _generateMarkup() {

    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    console.log(numPages);
    // Escenenarios: 
    // 1. Estamos en la pagina 1 y hay otras páginas.
    if (this._data.page === 1 && numPages > 1) {
      return `
   
        <span style="display: inline-block; padding-top:1.6%;margin-left:41.5%;font-size: 13px; color: #f048358c;font-weight:bold"
        >Pages ${numPages}</span>
    
            <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
         
           <div>  <span>Page  ${this._data.page + 1}</span> </div>
           
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
           
          </button>
          `
    }


    // 3. última página.
    if (this._data.page === numPages && numPages > 1) {
      return `
      
      <span style="display: inline-block; padding-bottom:2%;margin-left:13%;font-size: 13px; color: #f048358c;padding-top:10px  ; font-weight:bold">Pages ${numPages}</span>
            <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
          `;
    }
    // 4. Otra página: La página actual es menor al número de páginas 
    if (this._data.page < numPages) {
      return `
      <span style="display: inline-block; padding-bottom:2%;margin-left:13%;font-size: 13px; color: #f048358c  ; font-weight:bold; padding-top:10px">Pages ${numPages}</span>
            <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
          
            <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
            <span>Page  ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
          `
    }
    // 2. Estamos en la página 1 y NO hay otras páginas.
    return ''
  }
};

export default new PaginationView();