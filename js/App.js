import { Scanner } from './Scanner.js';
import { Parser } from './parser.js';
import {} from './Fun_Adic.js';
import * as fa from './Fun_Adic.js';



function compilar() {
    const cadenaFuente = document.getElementById('Input').value;
    const output = document.getElementById('output');
    let scanner = new Scanner(cadenaFuente);
    let parser = new Parser(scanner);

    output.textContent = '';
    if (cadenaFuente != '') {
        let res = parser.parser();
        if (res) {
            output.textContent += "El código es válido\n";
        } else {
            output.textContent += "\nEl código no es válido\n";
        }
    }
}
document.getElementById('run').addEventListener('click', compilar);