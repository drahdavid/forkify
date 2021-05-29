import View from './View';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class BookMarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = "No recipes found for your query. Please try againaaaa :)";
  _successMessage = "Hola";

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {

    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

}

export default new BookMarksView();