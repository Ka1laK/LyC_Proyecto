// funciones adicionales
export function esID(token) {
    const primerCaracter = token[0];
    const caracteresNoID = [',', '(', ')', '=', '*', '/', '-', '+', '<', '>', ';', '[', ']', ];
    const palabraReservada = ['si', 'sino', 'finsi', 'mientras', 'finmientras', '\n'];
    return isNaN(parseInt(primerCaracter)) && !caracteresNoID.includes(primerCaracter) && !palabraReservada.includes(token);
}

export function esOperador(token) {
    return ['+', '-', '*', '/'].includes(token);
}

export function esNumero(token) {
    if (token === "" || token === "." || token === "+" || token === "-") return false;

    let hasDigits = false;

    for (let i = 0; i < token.length; i++) {
        const char = token[i];

        if (char >= '0' && char <= '9') {
            hasDigits = true;
        } else if (char === '.') {
            if (token.indexOf('.') !== token.lastIndexOf('.')) {
                return false;
            }
        } else if ((char === '+' || char === '-') && i !== 0) {
            return false;
        } else if (char !== '.' && (char < '0' || char > '9')) {
            return false;
        }
    }

    return hasDigits;
}

export function esPalabraReservada(token) {
    if (token == "entero" || token == "real" || token == "caracter" || token == "cadena" ||
        token == "mientras" || token == "finmientras" || token == "imprimir" ||
        token == "si" || token == "sino" || token == "finsi") {
        return true;
    } else {
        return false;
    }
}

export function esCadena(token) {
    if (token.length > 1) {
        if (token[0] == '"' && token[token.length - 1] == '"') {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export function esAsignacionTipo(token) {
    if (token == "verdadero" || token == "falso" || esNumero(token) || esCadena(token)) {
        return true;
    } else {
        return false;
    }
}