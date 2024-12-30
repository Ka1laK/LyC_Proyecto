#include <iostream>
#include <cctype>
#include <algorithm>

using namespace std;

enum class EstadoPila {Q0,Q1,QF};

struct Nodo{
	string token;
	Nodo *siguiente;
};

void push(Nodo *&, string);
void pop(Nodo *&, string &);
bool vacio(Nodo *&);
string ultimo(Nodo *&);
string scanner(const string&);
EstadoPila reconocerFlujo(string &, Nodo *&);

int j = 0; // índice dentro de la cadena fuente

int main(){
	string cadenaFuente;
    Nodo *pila = NULL;
    cout << "Ingrese la cadenaFuente: ";
    getline(cin, cadenaFuente);
    
    EstadoPila reconocerdor_Flujo = reconocerFlujo(cadenaFuente,pila);
    if(reconocerdor_Flujo == EstadoPila::QF){
        cout<<"\nSin errores";
    }else{
        cout<<"\nError en el reconocimiento del flujo";
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

void push(Nodo *&pila, string s){
	Nodo *nuevo_nodo = new Nodo();
	nuevo_nodo->token = s;
	nuevo_nodo->siguiente = pila;
	pila = nuevo_nodo;
}

void pop(Nodo *&pila){
	Nodo *aux = pila;
	pila = aux->siguiente;
	delete aux;
}

bool vacio(Nodo *&pila){
	if(pila == NULL){
		return true;
	}
	return false;	
}

string ultimo(Nodo *&pila){
    Nodo *aux = pila;
    return aux->token;
}


string convertir_minus(string& cadena) {
    string token = cadena;
    for (char& c : token) {
        if (c >= 'A' && c <= 'Z') {
            c = c + ('a' - 'A'); // c += 32
        }
    }
    return token;
}

string convertir_minuscula(string cadena) {
    for (char& c : cadena) {
        c = tolower(c); // Convertir a minúsculas
    }
    return cadena;
}

EstadoPila reconocerFlujo(string &cadena, Nodo *&pila){
    EstadoPila actual = EstadoPila::Q0;
    string token;
    bool cadenaRechazada = false;
    while(!cadenaRechazada && token != "$"){
        token = scanner(cadena); //Usar el scanner()
        token = convertir_minuscula(token);

		cout<<"token: "<<token<<endl;

        
        switch(actual){
            case EstadoPila::Q0:
                                if(token == "si" && vacio(pila)){
                                    push(pila,token);
                                    actual = EstadoPila::Q1;
                                }else if(token == "mientras" && vacio(pila)){
                                    push(pila,token);
                                    actual = EstadoPila::Q1;
                                }else{
                                    //validar error
                                    cadenaRechazada = true;
                                }
                                break;
            case EstadoPila::Q1:
                                if(token == "si" && !vacio(pila)){
                                    push(pila,token);
                                    actual = EstadoPila::Q1;        
                                }else if(token == "mientras" && !vacio(pila)){
                                    push(pila,token);
                                    actual = EstadoPila::Q1;
                                }else if(token == "finsi" && ultimo(pila) == "si"){ 
                                    pop(pila);
                                    actual = EstadoPila::Q1;            
                                }else if(token == "finmientras" && ultimo(pila) == "mientras"){
                                    pop(pila);
                                    actual = EstadoPila::Q1;        
                                }else if(token == "sino" && ultimo(pila) == "si"){
                                    push(pila,token);
                                    actual = EstadoPila::Q1; 
                                }else if(token == "finsi" && ultimo(pila) == "sino"){
                                    pop(pila);
                                    pop(pila);
                                    actual = EstadoPila::Q1; 
                                }else if(token == "$" && vacio(pila)){
                                    actual = EstadoPila::QF; 
                                }else{
                                    cadenaRechazada = true;
                                }
                                break;  
            case EstadoPila::QF:
                                break;
        }
    }
    return actual;
}








