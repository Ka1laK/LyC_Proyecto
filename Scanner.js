import * as fa from './Fun_Adic.js';

export class Scanner {
    constructor(cadenaFuente) {
        this.j = 0;
        this.cadenaFuente = cadenaFuente;
        this.lineas = 1;
        this.tipo = "";
        this.tipoToken = {
            PALABRA_RESERVADA: "PALABRA_RESERVADA",
            ID: "ID",
            NUM: "NUM",
            OPERADOR: "OPERADOR",
            SIMBOLO: "SIMBOLO",
            DESCONOCIDO: "DESCONOCIDO",
            EOF: "$",
        };
    }

    getToken() {
        let tok = "";
        while (this.j < this.cadenaFuente.length && this.cadenaFuente.charAt(this.j) == ' ') { // Ignorar espacios en blanco
            this.j++;
        }
        if (this.j >= this.cadenaFuente.length) {
            return { type: this.tipoToken.EOF, value: "$", linea: this.lineas, index: this.j };
        }

        var c = this.cadenaFuente.charAt(this.j);

        if (c >= 'a' && c <= 'z') { // Letra
            while ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
                tok = tok + c;
                this.j++;
                c = this.cadenaFuente.charAt(this.j);
            }
        } else if (c >= '0' && c <= '9') { // Número
            while (c >= '0' && c <= '9') {
                tok = tok + c;
                this.j++;
                c = this.cadenaFuente.charAt(this.j);
            }
        } else if (c == ',' || c == '(' || c == ')' || c == '=' || c == '*' || c == '/' || c == '-' || c == '+' ||
            c == '<' || c == '>' || c == ';') { // Operador
            tok = c;
            if ((c == '-' && this.cadenaFuente.charAt(this.j + 1) == '-') ||
                (c == '+' && this.cadenaFuente.charAt(this.j + 1) == '+') ||
                (c == '<' && this.cadenaFuente.charAt(this.j + 1) == '=') ||
                (c == '>' && this.cadenaFuente.charAt(this.j + 1) == '=')) {
                tok = tok + this.cadenaFuente.charAt(this.j + 1);
                this.j++;
            }
            this.j++;
        }else{
            tok = c;
            this.j++;
        }

        if(tok == "\n"){
            this.lineas++;
        }

        return this.clasificarToken(tok, this.j);
    }

    clasificarToken(token, j) {
        // Si es PALABRA RESERVADA
        if (fa.esPalabraReservada(token)) {
            return { type: this.tipoToken.PALABRA_RESERVADA, value: token, linea: this.lineas, index: j };
        }
        // Si es ID
        if (fa.esID(token)) {
            return { type: this.tipoToken.ID, value: token, linea: this.lineas, index: j };
        }
        // Si es NUM
        if (fa.esNumero(token)) {
            return { type: this.tipoToken.NUM, value: token, linea: this.lineas, index: j };
        }
        // Si es OPERADOR
        if (fa.esOperador(token)) {
            return { type: this.tipoToken.OPERADOR, value: token, linea: this.lineas, index: j };
        }
        // Token desconocido
        return { type: this.tipoToken.DESCONOCIDO, value: token, linea: this.lineas, index: j };
    }
}
