#ifndef _MARYLIB_H_
#define _MARYLIB_H_

/*common*/
#include <stdlib.h>
#include <iostream>
#include <opencv2/opencv.hpp>
using namespace cv;

/*main.cpp*/

/*stereoTest.cpp*/
#define FOCAL_LENGTH 598.57
#define BASELINE 14.0
void stereoTest(char* picture[]);

/*fillOcclusion.cpp*/
void fillOcclusion(Mat& src, int invalidvalue, bool isInv = false);

/*makeQmatrix.cpp*/
Mat makeQMatrix(Point2d image_center, double focal_length, double baseline);

/*lookat.cpp*/
void lookat(Point3d from, Point3d to, Mat& destR);

/*projectImagefromXYZ.cpp*/
void projectImagefromXYZ(Mat& image, Mat& destimage, Mat& disp, Mat& destdisp, Mat& xyz, Mat& R, Mat& t, Mat& K, Mat& dist, bool isSub = true);

#endif
