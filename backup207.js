function proceso2() {
    const salida = document.getElementById('output');
    salida.textContent = '';

    const entrada = document.getElementById('sqlInput').value;
    const lineas = entrada.split('\n'); // Dividir por líneas

    for (let linea of lineas) {

        j = 0; // Reiniciar el índice para cada línea
        const estado = reconocerExpresionCondicional(linea);
        if (estado == EstadoReconocerExpresionCondicional.QF) {
            salida.textContent += "Sin errores en reconocer Declaraciones\n";
        }else{
            salida.textContent += "Error al compilar \n";
        } 
    }
}

const EstadoExpresion = {
    Q0: 'Q0',
    Q1: 'Q1',
    Q2: 'Q2',
    Q3: 'Q3',
    QF: 'QF'
};

const EstadoDeclaracionVariable = {
    Q1: 'Q1',
    Q2: 'Q2',
    Q3: 'Q3',
    Q4: 'Q4',
    Q5: 'Q5',
    QF: 'QF'
};

const EstadoReconocerEstructurasControl = {
    Q0: 'Q0',
    Q1: 'Q1',
    QF: 'QF'
};

const EstadoReconocerExpresionCondicional = {
    Q0: 'Q0',
    Q1: 'Q1',
    Q2: 'Q2',
    Q3: 'Q3',
    Q4: 'Q4',
    Q5: 'Q5',
    QF: 'QF'
};

const EstadoReconocerFlujo = {
    Q0: 'Q0',
    Q1: 'Q1',
    QF: 'QF'
};

class Nodo {
    constructor(token, siguiente = null) {
        this.token = token;
        this.siguiente = siguiente;
    }
}

function push(head, token) {
    let nuevo = new Nodo(token);
    nuevo.siguiente = head;
    return nuevo;
}

function pop(head) {
    if (head != null) {
        let temp = head;
        head = head.siguiente;
        temp.siguiente = null;
        return head;
    }
    return null;
}

function vacio(head) {
    return head === null;
}

function ultimo(pila) {
    if (pila === null) {
        return null;
    }
    return pila.token;
}

// funciones adicionales
function esID(token) {
    const primerCaracter = token[0];
    const caracteresNoID = [',', '(', ')', '=', '*', '/', '-', '+', '<', '>', ';', '[', ']'];
    return isNaN(parseInt(primerCaracter)) && !caracteresNoID.includes(primerCaracter);
}

function esOperador(token) {
    return ['+', '-', '*', '/'].includes(token);
}

function esNumero(token) {
    if (token === "" || token === ".") return false;

    let puntoEncontrado = false;
    for (let i = 0; i < token.length; i++) {
        if (token[i] === '.') {
            if (puntoEncontrado) return false; 
            puntoEncontrado = true;
        } else if (!/^\d$/.test(token[i])) { 
            return false;
        }
    }
    return true;
}

export function esVariableReservada(token){
    if(token == "entero" || token == "real" || token == "caracter" || token == "cadena" || token == "bool" 
        || token == "double" || token == "long" || token == "short"){
        return true;	
    }else{
        return false;
    }
}

function esCadena(token){
	if(token.length > 1){
		if(token[0] == '"'  && token[token.length-1] == '"'){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

function esAsignacionTipo(token){
	if(token == "verdadero" || token == "falso" || esNumero(token) || esCadena(token)){
		return true;
	}else{
		return false;
	}
}


//Automatas Finitos Deterministas
function reconocerExpresionAritmetica(entrada) {
    let actual = EstadoExpresion.Q0;
    let token;
    let pila = null;
    let cadenaRechazada = false;
  //  const entrada = document.getElementById('sqlInput').value;

    while(!cadenaRechazada && token != "$"){
        token = scanner(entrada);
        switch(actual){
            case EstadoExpresion.Q0:
                                    if(esID(token) && vacio(pila)){
                                        actual = EstadoExpresion.Q1;
                                    }else{
                                        cadenaRechazada = true;
                                    }
                                    break;
            case EstadoExpresion.Q1:  
                                    if(token == "=" && vacio(pila)){
                                        actual = EstadoExpresion.Q2;
                                    }else{
                                        cadenaRechazada = true;
                                    }
                                    break;
            case EstadoExpresion.Q2: 
                                    if((esID(token) || esNumero(token)) && vacio(pila)){
                                        actual = EstadoExpresion.Q3; 
                                    }else if(token == "(" && vacio(pila)){
                                        pila = push(pila,token);                                        
                                        actual = EstadoExpresion.Q2;     
                                    }else if(token == "(" && ultimo(pila) == "("){
                                        pila = push(pila,token);
                                        actual = EstadoExpresion.Q2;
                                    }else if((esID(token) || esNumero(token)) && ultimo(pila) == "("){
                                        actual = EstadoExpresion.Q3;
                                    }else{
                                        cadenaRechazada = true;
                                    }    
                                    break;
            case EstadoExpresion.Q3:
                                    if(token ==")" && ultimo(pila) == "("){
                                        pila = pop(pila);
                                        actual = EstadoExpresion.Q3;
                                    }else if(esOperador(token) && vacio(pila)){
                                    
                                        actual = EstadoExpresion.Q2;
                                    }else if(esOperador(token) && ultimo(pila) == "("){
                                        
                                        actual = EstadoExpresion.Q2;
                                    }else if(token == "$" && vacio(pila)){
                                       
                                        actual = EstadoExpresion.QF;
                                    }else{
                                        
                                        cadenaRechazada = true;
                                    }
                                    break;
            case EstadoExpresion.QF:
                                    break;
            
            
        }
    }
    return actual;
};    
   

//Reconoce expresiones como (a > b) || (b < c) || (a = b)
function reconocerExpresionCondicional(entrada){
    let actual = EstadoReconocerExpresionCondicional.Q0;
    let token;
    let pila = null;
    let cadenaRechazada = false;
   // const entrada = document.getElementById('sqlInput').value;
   while(!cadenaRechazada && token != "$"){
        token = scanner(entrada);
        switch(actual){
            case EstadoReconocerExpresionCondicional.Q0:
                                                        if(token == "("){
                                                            actual = EstadoReconocerExpresionCondicional.Q1;
                                                            return actual;    
                                                        }else{
                                                            cadenaRechazada = true;
                                                        }
                                                        break;
            case EstadoReconocerExpresionCondicional.Q1:
                                                        if(esID(token) || esNumero(token)){
                                                            actual = EstadoReconocerExpresionCondicional.Q2;
                                                            return actual;    
                                                        }else{
                                                            cadenaRechazada = true;
                                                        }
                                                        break;
            case EstadoReconocerExpresionCondicional.Q2:
                                                        if(token == "<" || token  == ">" || token == "="){  
                                                            actual = EstadoReconocerExpresionCondicional.Q3;
                                                            return actual;
                                                        }else{
                                                            cadenaRechazada = true;               
                                                        }
                                                        break;
            case EstadoReconocerExpresionCondicional.Q3:
                                                        if(esID(token) || esNumero(token)){
                                                            actual = EstadoReconocerExpresionCondicional.Q4;
                                                            return actual;    
                                                        }else{
                                                            cadenaRechazada = true;
                                                        }
                                                        break;
            case EstadoReconocerExpresionCondicional.Q4:
                                                        if(token == ")"){
                                                            actual = EstadoReconocerExpresionCondicional.Q5;
                                                            return actual;
                                                        }else{
                                                            cadenaRechazada = true;
                                                        }
                                                        break;
            case EstadoReconocerExpresionCondicional.Q5:
                                                        if(token == "$"){
                                                            actual = EstadoReconocerExpresionCondicional.QF;
                                                            return actual;
                                                        }else{
                                                            cadenaRechazada = true;
                                                        }
                                                        break;
            case EstadoReconocerExpresionCondicional.QF:
                                                        break;
        }
    }
    return actual;
}



function reconocerEstructurasDeFlujo(entrada){
    let actual = EstadoReconocerFlujo.Q0;
    let token;
    let pila = null;
    let cadenaRechazada = false;

    while(!cadenaRechazada && token != "$"){
        token = scanner(entrada);
        switch(actual){
            case EstadoReconocerFlujo.Q0:
                                            if(token == "si" && vacio(pila)){
                                                pila = push(pila,token);
                                                actual = EstadoPila.Q1;
                                            }else if(token == "mientras" && vacio(pila)){
                                                pila = push(pila,token);
                                                actual = EstadoPila.Q1;
                                            }else{
                                                //validar error
                                                cadenaRechazada = true;
                                            }
                                            break;  
            case EstadoReconocerFlujo.Q1:
                                            if(token == "si" && !vacio(pila)){
                                                pila = push(pila,token);
                                                actual = EstadoPila.Q1;        
                                            }else if(token == "mientras" && !vacio(pila)){
                                                pila = push(pila,token);
                                                actual = EstadoPila.Q1;
                                            }else if(token == "finsi" && ultimo(pila) == "si"){ 
                                                pila = pop(pila);
                                                actual = EstadoPila.Q1;            
                                            }else if(token == "finmientras" && ultimo(pila) == "mientras"){
                                                pila = pop(pila);
                                                actual = EstadoPila.Q1;        
                                            }else if(token == "sino" && ultimo(pila) == "si"){
                                                pila = push(pila,token);
                                                actual = EstadoPila.Q1; 
                                            }else if(token == "finsi" && ultimo(pila) == "sino"){
                                                pila = pop(pila);
                                                pila = pop(pila);
                                                actual = EstadoPila.Q1; 
                                            }else if(token == "$" && vacio(pila)){
                                                actual = EstadoPila.QF; 
                                            }else{
                                                cadenaRechazada = true;
                                            }
                                            break;   
            case EstadoReconocerFlujo.QF:
                                            break;
        }
    }
    return actual;
}

function reconocerDeclaracion(entrada){
	let actual = EstadoDeclaracionVariable.Q1;
	let token;
	let cadenaRechazada = false;
	while(!cadenaRechazada && token != "$"){
		token = scanner(entrada); //Usar el scanner()
		switch(actual){
			case EstadoDeclaracionVariable.Q1:
							if(esVariableReservada(token)){
								actual = EstadoDeclaracionVariable.Q2;
							}else{
								cadenaRechazada = true;
							}
							break;
			case EstadoDeclaracionVariable.Q2:
							if(esID(token)){
								actual = EstadoDeclaracionVariable.Q3;
							}else{
								cadenaRechazada = true;
							}
							break;
			case EstadoDeclaracionVariable.Q3:
							if(token == ","){
								actual = EstadoDeclaracionVariable.Q2;
							}else if(token == "="){
								actual = EstadoDeclaracionVariable.Q4;
							}else if (token == "$"){
								actual = EstadoDeclaracionVariable.QF;
							}else{
                                cadenaRechazada = true;
                            }
							break;
			case EstadoDeclaracionVariable.Q4:
							if(esAsignacionTipo(token) || esID(token)){
								actual = EstadoDeclaracionVariable.Q5;
							}else{
								cadenaRechazada = true;
							}
							break;
			case EstadoDeclaracionVariable.Q5:
                            if(token == ","){
                                actual = EstadoDeclaracionVariable.Q2;
                            }else if (token == "$"){
                                actual = EstadoDeclaracionVariable.QF;
                            }else{
                                cadenaRechazada = true;
                            }
                            break;
			case EstadoDeclaracionVariable.QF:
							break;															
		}
	}
	return actual;
}


  