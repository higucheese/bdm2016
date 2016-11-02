#ifndef _CALIB_H_
#define _CALIB_H_

/*common*/
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <opencv2/opencv.hpp>
using namespace cv;

/*stereocalib.cpp*/
void stereocalib(void);

/*camcalib.cpp*/
int camcalib(int, char**);

#endif
