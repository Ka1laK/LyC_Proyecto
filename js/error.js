export class error {
    constructor() {
        this.output = document.getElementById('output');
    }

    mensaje(linea, colum, mensj) {
        this.output.textContent = '';
        this.output.textContent = 'Error en la linea: ' + linea + ', Columna: ' +
            colum + '. ' + mensj;
    }

}