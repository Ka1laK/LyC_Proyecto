#include <iostream>
#include <cctype>
#include <string>

using namespace std;

enum class EstadoExpresion { Q0, Q1, Q2, Q3, QF };

EstadoExpresion reconocerExpresion(string &cadena);
bool esID(string token);
bool esNumero(string token);
string scanner(string &cadena);

int j = 0;  // índice global para el scanner

int main() {
    string cadenaFuente;
    cout << "Ingrese la expresión: ";
    getline(cin, cadenaFuente);

    EstadoExpresion resultado = reconocerExpresion(cadenaFuente);
    if (resultado == EstadoExpresion::QF) {
        cout << "\nExpresión válida.\n";
    } else {
        cout << "\nError en la expresión.\n";
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


EstadoExpresion reconocerExpresion(string &cadena) {
    EstadoExpresion actual = EstadoExpresion::Q0;
    string token;
    bool cadenaRechazada = false;

    while (!cadenaRechazada && token != "$") {
        token = scanner(cadena);  // Usar el scanner()
        cout << "Token: " << token << endl;

        switch (actual) {
            case EstadoExpresion::Q0:
                if (esID(token)) {
                    actual = EstadoExpresion::Q1;
                } else {
                    cadenaRechazada = true;
                }
                break;
            case EstadoExpresion::Q1:
                if (token == "=") {
                    actual = EstadoExpresion::Q2;
                } else {
                    cadenaRechazada = true;
                }
                break;
            case EstadoExpresion::Q2:
                if (esID(token) || esNumero(token)) {
                    actual = EstadoExpresion::Q3;
                } else {
                    cadenaRechazada = true;
                }
                break;
            case EstadoExpresion::Q3:
                if (token == "+" || token == "-" || token == "*" || token == "/") {
                    actual = EstadoExpresion::Q2;  // Espera otro identificador o número después del operador
                } else if (token == "$") {
                    actual = EstadoExpresion::QF;
                } else {
                    cadenaRechazada = true;
                }
                break;
            case EstadoExpresion::QF:
                break;
        }
    }
    return actual;
}

// Las funciones esID y esNumero deben ser implementadas correctamente.

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

