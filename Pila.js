class Nodo {
    constructor(token, siguiente = null) {
        this.token = token;
        this.siguiente = siguiente;
    }
}
class Pila{

    constructor() {
        this.head = null;
    }

    
    push(token) {
        let nuevo = new Nodo(token);
        nuevo.siguiente = this.head;
        this.head = nuevo;
        return this;
    }

    pop() {
        if (this.head !== null) {
            let temp = this.head;
            this.head = this.head.siguiente;
            temp.siguiente = null;
            return temp.token;
        }
        return null;
    }

    vacio() {
        return this.head === null;
    }

    ultimo() {
        if(this.head === null){
            return null;
        }
        return this.head.token;
    }
}

export {Nodo, Pila};