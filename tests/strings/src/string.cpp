#include <stdio.h>
#include <iostream>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <map>

using namespace std;

const vector<string> explode(const string& s, const char& c)
{
	string buff{""};
	vector<string> v;

	for(auto n:s)
	{
		if(n != c) buff+=n; else
		if(n == c && buff != "") { v.push_back(buff); buff = ""; }
	}
	if(buff != "") v.push_back(buff);

	return v;
}

const vector<string> split(const string& s)
{
    string buff{""};
    vector<string> v;

    for(auto c:s)
    {
        if (c != ' ' && c != '\t') {
            buff += c;
        } else if(buff != "") {
            v.push_back(buff);
            buff = "";
        }
    }
    if(buff != "") v.push_back(buff);

    return v;
}

void setString(int stringAddress, int length)
{
    char* data = reinterpret_cast<char *>(stringAddress);
    string str = string(data);

    vector<string> lines = explode(str, '\n');
    for(auto n:lines) {
        if (!n.length()) continue;
        vector<string> parts = split(n);
        if (parts[0] == "p") {
            cout << stof(parts[1]) << "\n";
        }
    }

    //std::cout << str << "\n";
}

/*val getString()
{
    return "Hello World";
}*/

EMSCRIPTEN_BINDINGS(hello) {
  emscripten::function("setString", &setString/*, allow_raw_pointers()*/);
  //function("getString", &getString);
}