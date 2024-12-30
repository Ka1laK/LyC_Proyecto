#include<iostrem>

using namespace std;


string toLowerCase(string& str) {
    string result = str;
    for (char& c : result) {
        if (c >= 'A' && c <= 'Z') {
            c = c + ('a' - 'A');
        }
    }
    return result;
}

int main(){
	
	string palabra = "EnEmY dOwN";
	toLowerCase(palabra);
	cout << palabra;
	return 0;
}