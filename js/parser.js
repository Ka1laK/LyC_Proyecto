import {} from './Fun_Adic.js';
import * as fa from './Fun_Adic.js';
import { Pila } from './Pila.js';
import { error } from './error.js';
import { Scanner } from './Scanner.js';

const EstadoControl = { Q0: 'Q0', Q1: 'Q1', QF: 'QF', QR: 'QR' };
const EstadoExpresion = { Q0: 'Q0', Q1: 'Q1', Q2: 'Q2', Q3: 'Q3', QF: 'QF' };
const EstadoDeclaracion = { Q0: 'Q0', Q1: 'Q1', Q2: 'Q2', Q3: 'Q3', Q4: 'Q4', Q5: 'Q5', QF: 'QF' };
const EstadoCondicional = { Q0: 'Q0', Q1: 'Q1', Q2: 'Q2', Q3: 'Q3', Q4: 'Q4', Q5: 'Q5', QF: 'QF' };
const EstadoImprimir = { Q0: 'Q0', Q1: 'Q1', Q2: 'Q2', QF: 'QF' };

export class Parser {
    constructor(scanner) {
        this.scanner = scanner;
        this.token = null;
        this.pila = new Pila();
        this.actualAPD = EstadoControl.Q0;
        this.error = new error();
    }

    //AFD PARA RECONCER IMPRESIONES
    reconocerImpresiones() {
        let actual = EstadoImprimir.Q1;
        let rechaza = false;
        while (this.token.value != "$" && this.token.value != "\n" && !rechaza) {
            this.getNuevoToken();
            switch (actual) {
                case EstadoImprimir.Q0:
                    if (this.token.value == "imprimir") {
                        actual = EstadoImprimir.Q1;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoImprimir.Q1:
                    if (fa.esID(this.token.value)) {
                        actual = EstadoImprimir.Q2;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoImprimir.Q2:
                    if (this.token.value == ",") {

                        actual = EstadoImprimir.Q1;
                    } else if (this.token.value == "\n" || this.token.value == "$") {
                        actual = EstadoImprimir.QF;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoImprimir.QF:
                    break;
            }
        }

        if (rechaza) {
            this.error.mensaje(this.token.linea, this.token.index, "ERROR SINTACTICO: IMPRIMIR");
        }

        return actual == EstadoImprimir.QF;
    }

    // AFD PARA RECONOCER EXPRESIONES CONDICIONALES
    reconocerExpresionCondicional(token) {
        let actual = EstadoCondicional.Q1;
        let rechaza = false;
        if (this.token.value != "(") {
            return false;
        }

        while (this.token.value != "\n" && !rechaza) {
            this.getNuevoToken();
            switch (actual) {
                case EstadoCondicional.Q0:
                    if (this.token.value == "(") {
                        actual = EstadoCondicional.Q1;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoCondicional.Q1:
                    if (fa.esID(this.token.value) || fa.esNumero(this.token.value)) {
                        actual = EstadoCondicional.Q2;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoCondicional.Q2:
                    if (this.token.value == "<" || this.token.value == ">" || this.token.value == "=") {
                        actual = EstadoCondicional.Q3;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoCondicional.Q3:
                    if (fa.esID(this.token.value) || fa.esNumero(this.token.value)) {
                        actual = EstadoCondicional.Q4;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoCondicional.Q4:
                    if (this.token.value == ")") {
                        actual = EstadoCondicional.Q5;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoCondicional.Q5:
                    if (this.token.value == "\n") {
                        actual = EstadoCondicional.QF;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoCondicional.QF:
                    break;
            }
        }
        if (rechaza) {
            this.error.mensaje(this.token.linea, this.token.index, "ERROR SINTACTICO: CONDICIONAL");
        }

        return actual == 'Q5' || actual == 'QF';
    }

    //AFD PARA RECONOCER DECLARACION DE VARIABLES
    reconocerDeclaracion() {
        let actual = EstadoDeclaracion.Q2;
        let rechaza = false;

        while (this.token.type != "$" && this.token.value != "\n" && !rechaza) {

            this.getNuevoToken();

            switch (actual) {
                case EstadoDeclaracion.Q1:
                    if (fa.esPalabraReservada(this.token.value)) {
                        actual = EstadoDeclaracion.Q2;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoDeclaracion.Q2:
                    if (fa.esID(this.token.value)) {
                        actual = EstadoDeclaracion.Q3;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoDeclaracion.Q3:
                    if (this.token.value == ",") {
                        actual = EstadoDeclaracion.Q2;
                    } else if (this.token.value == "=") {
                        actual = EstadoDeclaracion.Q4;
                    } else if (this.token.value == "$" || this.token.value == "\n") {
                        actual = EstadoDeclaracion.QF;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoDeclaracion.Q4:
                    if (fa.esAsignacionTipo(this.token.value) || fa.esID(this.token.value) /*|| fa.esNumero(token.value)*/ ) {
                        actual = EstadoDeclaracion.Q5;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoDeclaracion.Q5:
                    if (this.token.value == ",") {
                        actual = EstadoDeclaracion.Q2;
                    } else if (this.token.value == "$" || this.token.value == "\n") {
                        actual = EstadoDeclaracion.QF;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoDeclaracion.QF:
                    break;
            }
        }


        if (rechaza) {
            this.error.mensaje(this.token.linea, this.token.index, "ERROR SINTACTICO: DECLARACIÓN");
        }

        return actual == EstadoDeclaracion.QF;
    }

    //APD PARA RECONOCER ESTRUCTURAS DE CONTROL
    reconocerEstructurasDeControl() {
        switch (this.actualAPD) {
            case EstadoControl.Q0:
                if (this.token.value == "si" && this.pila.vacio()) {
                    this.pila.push(this.token.value);
                    this.actualAPD = EstadoControl.Q1;
                } else if (this.token.value == "mientras" && this.pila.vacio()) {
                    this.pila.push(this.token.value);
                    this.actualAPD = EstadoControl.Q1;
                } else {
                    this.actualAPD = EstadoControl.QR;
                }
                break;
            case EstadoControl.Q1:
                if (this.token.value == "si" && !this.pila.vacio()) {
                    this.pila.push(this.token.value);
                    this.actualAPD = EstadoControl.Q1;
                } else if (this.token.value == "mientras" && !this.pila.vacio()) {
                    this.pila.push(this.token.value);
                    this.actualAPD = EstadoControl.Q1;
                } else if (this.token.value == "finsi" && this.pila.ultimo() == "si") {
                    this.pila.pop();
                    this.actualAPD = EstadoControl.Q1;
                } else if (this.token.value == "finmientras" && this.pila.ultimo() == "mientras") {
                    this.pila.pop();
                    this.actualAPD = EstadoControl.Q1;
                } else if (this.token.value == "sino" && this.pila.ultimo() == "si") {
                    this.pila.push(this.token.value);
                    this.actualAPD = EstadoControl.Q1;
                } else if (this.token.value == "finsi" && this.pila.ultimo() == "sino") {
                    this.pila.pop();
                    this.pila.pop();
                    this.actualAPD = EstadoControl.Q1;
                } else if (this.token.value == "\n" && this.pila.vacio()) {
                    this.actualAPD = EstadoControl.QF;
                } else {
                    this.actualAPD = EstadoControl.QR;
                }
                break;
            case EstadoControl.QF:
                break;
        }

        this.getNuevoToken();
        return this.actualAPD;
    }

    //APD PARA RECONOCER EXPRESIONES ARITMETICAS
    reconocerEXParitmetica() {
        let actual = EstadoExpresion.Q1;
        let rechaza = false;
        let pilaAux = new Pila();
        while (this.token.value != "$" && this.token.value != "\n" && !rechaza) {
            this.getNuevoToken();
            switch (actual) {
                case EstadoExpresion.Q0:
                    if (fa.esID(this.token.value) && pilaAux.vacio()) {
                        actual = EstadoExpresion.Q1;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoExpresion.Q1:
                    if (this.token.value == "=" && pilaAux.vacio()) {
                        actual = EstadoExpresion.Q2;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoExpresion.Q2:
                    if ((fa.esID(this.token.value) || fa.esNumero(this.token.value)) && pilaAux.vacio()) {
                        actual = EstadoExpresion.Q3;
                    } else if (this.token.value == "(" && pilaAux.vacio()) {
                        pilaAux.push(this.token.value);
                        actual = EstadoExpresion.Q2;
                    } else if (this.token.value == "(" && pilaAux.ultimo() == "(") {
                        pilaAux.push(this.token.value);
                        actual = EstadoExpresion.Q2;
                    } else if ((fa.esID(this.token.value) || fa.esNumero(this.token.value)) && pilaAux.ultimo() == "(") {
                        actual = EstadoExpresion.Q3;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoExpresion.Q3:
                    if (this.token.value == ")" && pilaAux.ultimo() == "(") { //&& !pila.vacio()
                        pilaAux.pop();
                        actual = EstadoExpresion.Q3;
                    } else if (fa.esOperador(this.token.value) && pilaAux.vacio()) {
                        actual = EstadoExpresion.Q2;
                    } else if (fa.esOperador(this.token.value) && pilaAux.ultimo() == "(") {
                        actual = EstadoExpresion.Q2;
                    } else if ((this.token.value == "$" || this.token.value == "\n") && pilaAux.vacio()) {
                        actual = EstadoExpresion.QF;
                    } else {
                        rechaza = true;
                    }
                    break;
                case EstadoExpresion.QF:
                    break;
            }
        }
        if (rechaza) {
            this.error.mensaje(this.token.linea, this.token.index, "ERROR SINTACTICO: EXPRESIÓN ARITMETICA");
        }

        return actual == EstadoExpresion.QF;
    }

    getNuevoToken() {
        this.token = this.scanner.getToken();
    }

    parser() {
        let compilo = true;
        this.getNuevoToken();

        while (this.token.type != "$" && compilo) {

            if (this.token.value == "\n") {
                this.getNuevoToken();
            }

            if (["si", "sino", "finsi", "mientras", "finmientras"].includes(this.token.value)) {
                if (this.token.value === "si" || this.token.value === "mientras") {
                    compilo = this.reconocerEstructurasDeControl(this.token) && this.reconocerExpresionCondicional(this.token);
                } else {
                    compilo = this.reconocerEstructurasDeControl(this.token);
                    if (compilo) {
                        if (this.token.value === '\n' || this.token.value === 'EOF')
                            this.getNuevoToken();
                    } else {
                        return false;
                    }
                }
            } else if (this.token.value === "entero" || this.token.value === "real") {
                compilo = this.reconocerDeclaracion(this.token);
            } else if (this.token.type === "ID") {
                compilo = this.reconocerEXParitmetica(this.token);

            } else if (this.token.value === "imprimir") {
                compilo = this.reconocerImpresiones(this.token);
            }

        }

        if (!compilo) {
            return false;
        }

        if (!this.pila.vacio()) {
            this.error.mensaje(this.token.linea, this.token.index, "ERROR SINTACTICO: ESTRUCTURA DE CONTROL");
            return false;
        }

        return true;
    }

}