import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _successMessage = 'Recipe Successfully Uploaded';
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');
    _uploadColumnIng = document.querySelector('.upload__column-2').querySelectorAll('input');
    _uploadColumnIng2 = document.querySelector('.upload__column-2');

    // _inputErrIngr = document.querySelector('.input-err');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
        this._addHandlerTakeInputs();

    };

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    };

    _addHandlerTakeInputs() {
        const markup = `<p class="input-succ-p" >Perfect format</p>`;
        const markupErr = `<p class="input-err-p" >Expected Format: Number | Space + "," + "kg"|"gr"|"ml" + Letters (4 to 15)</p>`;
        const regExp = /[0-9| ]\,(gr|ml|kg)\,[ A-z]{4,15}$/i;
        const _upload__btn = document.querySelector('.upload__column-2').querySelector('.btn');

        this._uploadColumnIng.forEach(el => el.addEventListener
            ('keyup', function (e) {

                if (e.target.value === '' && e.target.nextElementSibling) {

                    e.target.nextElementSibling.remove();
                    _upload__btn.classList.remove('btn-upload-disabled');
                }

                if (regExp.test(el.value)) {
                    _upload__btn.toggleAttribute('disabled', false);
                    if (e.target.nextElementSibling.matches(".input-err-p")) e.target.nextElementSibling.remove();

                    // ! IMPORTANTE: Utilizamos Signo de Preguntas ("?") para validar si está presente o no, y 
                    // así evitar errores que no permitan continuar ejecución.
                    if (e.target.nextElementSibling?.matches(".input-succ-p")) return;

                    e.target.insertAdjacentHTML('afterend', markup);

                    e.target.classList.add('inp-succ')
                    _upload__btn.classList.remove('btn-upload-disabled');
                }
                if (!regExp.test(el.value) && el.value !== '') {
                    _upload__btn.toggleAttribute('disabled', true);
                    _upload__btn.classList.add('btn-upload-disabled');

                    if (e.target.nextElementSibling?.matches(".input-succ-p")) e.target.nextElementSibling.remove();

                    e.target.classList.remove('inp-succ')

                    if (e.target.nextElementSibling?.matches(".input-err-p")) return;

                    e.target.insertAdjacentHTML('afterend', markupErr);
                }

            }))
    }
    _addHandlerShowWindow() {

        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    };

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    };

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)];

            const data = Object.fromEntries(dataArr);     // Toma un Array de Objetos y lo convierte en un objeto

            handler(data);
        })
    };

    _generateMarkup() {

    };
};

export default new AddRecipeView();