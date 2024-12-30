


#include <iostream>
using namespace std;

enum class Estado {Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8,QF};

Estado reconocerDeclaracion(string &cadena);
bool esVariableReservada(string);
bool esID(string);
bool esNumero(string);
bool esAsignacionTipo(string);
bool esCadena(string);
string scanner(const string&);

int j = 0; // índice dentro de la cadena fuente


int main(){
	string cadenaFuente;
    cout << "Ingrese la cadenaFuente: ";
    getline(cin, cadenaFuente);
    
	Estado declaracion_variable = reconocerDeclaracion(cadenaFuente);
	if(declaracion_variable == Estado::QF){
		cout<<"\nSin errores";
	}else{
		cout<<"\nError en la declaracion de variables";
	}

	return 0;
}

string scanner(const string& cadenaFuente) {
    string tok = "";
    while (cadenaFuente[j] == ' ') { // Ignorar espacios en blanco
        j++;
    }
    if (j >= cadenaFuente.length()) {
        return "$"; // fin de cadena
    }
    char c = cadenaFuente[j];
    if (c == '"') { // inicio de una cadena
        tok += c;
        j++;
        c = cadenaFuente[j];
        while (j < cadenaFuente.length() && c != '"') {
            tok += c;
            j++;
            c = cadenaFuente[j];
        }
        if (c == '"') {
            tok += c;
            j++;
        }
    } else if (c >= 'a' && c <= 'z') { // inicio es una letra
        while (j < cadenaFuente.length() && ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9'))) {
            tok += c;
            j++;
            c = cadenaFuente[j];
        }
    } else if (isdigit(c) || c == '.') { // inicio es un nro o punto decimal
        bool puntoEncontrado = (c == '.');
        while (j < cadenaFuente.length() && (isdigit(c) || (!puntoEncontrado && c == '.'))) {
            if (c == '.') {
                puntoEncontrado = true;
            }
            tok += c;
            j++;
            c = cadenaFuente[j];
        }
    } else if (c == ',' || c == '(' || c == ')' || c == '=' || c == '*' || c == '/' || c == '-' || c == '+' ||
               c == '<' || c == '>' || c == ';' || c == '[' || c == ']') { // Operador
        tok += c;
        if ((c == '-' && cadenaFuente[j + 1] == '-') ||
            (c == '+' && cadenaFuente[j + 1] == '+') ||
            (c == '<' && cadenaFuente[j + 1] == '=') ||
            (c == '>' && cadenaFuente[j + 1] == '=')) {
            tok += cadenaFuente[j + 1];
            j++;
        }
        j++;
    } else if (c == '$') { // fin de cadena
        tok += c;
    }
    return tok;
}


Estado reconocerDeclaracion(string &cadena){
	Estado actual = Estado::Q1;
	string token;
	bool cadenaRechazada = false;
	while(!cadenaRechazada && token != "$"){
		token = scanner(cadena); //Usar el scanner()
		cout<<"token: "<<token<<endl;
		switch(actual){
			case Estado::Q1:
							if(esVariableReservada(token)){
								actual = Estado::Q2;
							}else{
								cadenaRechazada = true;
							}
							break;
			case Estado::Q2:
							if(esID(token)){
								actual = Estado::Q3;
							}else{
								cadenaRechazada = true;
							}
							break;
			case Estado::Q3:
							if(token == ";"){
								actual = Estado::Q4;
							}else if(token == ","){
								actual = Estado::Q2;
							}else if(token == "["){
								actual = Estado::Q5;
							}else if(token == "="){
								actual = Estado::Q8;
							}else{
								cadenaRechazada = true;
							}
							break;
			case Estado::Q4:
							if(token == "$"){
								actual = Estado::QF;
							}else if(esVariableReservada(token)){
								actual = Estado::Q2;
							}else{
								cadenaRechazada = true;
							}
							break;
			case Estado::Q5:
							if(esNumero(token)){
								actual = Estado::Q6;
							}else{
								cadenaRechazada = true;
							}
							break;
			case Estado::Q6:
							if(token == "]"){
								actual = Estado::Q7;
							}else{
								cadenaRechazada = true;
							}
							break;
			case Estado::Q7:
							if(token == ";"){
								actual = Estado::Q4;
							}else if(token == ","){
								actual = Estado::Q2;
							}else{
								cadenaRechazada = true;
							}
							break;
			case Estado::Q8:
							if(esAsignacionTipo(token)){
								actual = Estado::Q7;
							}else{
								cadenaRechazada = true;
							}
							break;
			case Estado::QF:
							break;															
		}
	}
	return actual;
}

bool esVariableReservada(string token){
	if(token == "int" || token == "float" || token == "char" || token == "string" || token == "bool" 
		|| token == "double" || token == "long" || token == "short"){
		return true;	
	}else{
		return false;
	}
}

bool esID(string token){
	if(!isdigit(token[0])){
		return true;
	}else{
		return false;
	}
}

bool esNumero(string token){
	bool puntoEncontrado = false;
    int longitud = token.length();

    if (longitud == 0) {
        return false; // cadena vac�a no es un n�mero
    }

    for (int i = 0; i < longitud; i++) {
        if (token[i] == '.') {
            if (puntoEncontrado) {
                return false; // m�s de un punto no es v�lido
            }
            puntoEncontrado = true;
        } else if (!isdigit(token[i])) {
            return false; // cualquier car�cter que no sea d�gito o punto hace que no sea un n�mero
        }
    }

    if (token == "." || token[0] == '.' && token.length() == 1) {
        return false; // un solo punto no es un n�mero v�lido
    }

    return true;
}

bool esCadena(string token){
	if(token.length() > 1){
		if(token[0] == '"'  && token[token.length()-1] == '"'){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

bool esAsignacionTipo(string token){
	if(token == "true" || token == "false" || esNumero(token) || esCadena(token)){
		return true;
	}else{
		return false;
	}
}

