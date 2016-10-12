#include "marylib.hpp"

int main(int argc, char* argv[]){
	if(argc != 3){
		std::cout << "usage:./a.out l.png r.png" << std::endl;
		exit(1);
	}
	stereoTest(argv);

	return 0;
}
