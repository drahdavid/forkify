import icons from 'url:../../img/icons.svg';
// No vamos a crear ninguna instancia a partir de esta clase, sólo la utilizaremos para que otras clases hereden sus props y methods. 
export default class View {
  _data;


  render(data, render = true) {
    // Sin data|| Es un array y cantidad de datos = 0 --> Entonces error. 
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;
    const markup = this._generateMarkup(); // "markup" será un HTML generado por la función #generateMarkup.


    if (!render) return markup;



    this._clear(); // Limpia Mensajes por Default del Contenedor de búsqueda de recetas. 


    this._parentElement.insertAdjacentHTML('afterbegin', markup);  // Insertamos en el Elemento Padre el "markup" generado. 
  };

  update(data) {


    this._data = data;

    // Creamos el HTML
    const newMarkup = this._generateMarkup();
    // Creamos un Array desde el HTML actual

    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    // Convertimos el HTML en un objeto del DOM 
    const newDom = document.createRange().createContextualFragment(newMarkup);

    // Creamos un Array con todos los elementos del DOM seleccionados. 
    const newElements = Array.from(newDom.querySelectorAll('*'));
    // Creamos un Array con los 


    newElements.forEach((newEl, i) => {
      const curEl = currElements[i];


      //1er Condición:  if (!newEl.isEqualNode(curEl) : Si los elementos extraídos de "newEl" son distintos(isEqualNode)
      // a los extraídos de "curEl" entonces--> 

      //2da Condición: newEl.firstChild?.nodeValue.trim() !== ''|  : Si el elemento tiene algo dentro(firstChild),
      // y si el valor que contiene(nodeValue), sin espacios(trim), es distinto de vacío (!== '')

      // Estas condiciones se utilizan para sólo reemplazar aquellos Nodos con TEXTO dentro. 

      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {

        curEl.textContent = newEl.textContent; // Reemplazamos los valores anteriores por los nuevos. 
      }


      // Modifica ATRIBUTOS
      if (!newEl.isEqualNode(curEl)) {  // Realiza una Comparación entre las Propiedades de los Nodos de ambos Objetos, si son distintos,entonces:
        // 1. Creamos un Array con newEl.Attributes para poder acceder a los atributos.
        // 2. Para cada uno se le setea un atributo: Clave: Valor, sólo se setearán aquellos que sean distintintos entre el NUevo elemento y el Anterior.
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));

      }

    })
  }

  _clear() {
    this._parentElement.innerHTML = ''; // Limpia el elemento padre. 
  };



  // Renderizamos Spinner
  renderSpinner() {
    const markup =
      `
          <div class="spinner">
                  <svg>
                    <use href="${icons}#icon-loader"></use>
                  </svg>
          </div>
          `
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderError(errorMsg = this._errorMessage) {
    const markup =
      `
      <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${errorMsg}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup =
      `
      <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}