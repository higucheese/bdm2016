#include "marylib.hpp"

void eular2rot(double yaw, double pitch, double roll, Mat& dest){
	double theta = yaw / 180.0*CV_PI;
	double pusai = pitch / 180.0*CV_PI;
	double phi = roll / 180.0*CV_PI;

	double datax[3][3] = {
		{1.0, 0.0, 0.0},
		{0.0, cos(theta), -sin(theta)},
		{0.0, sin(theta), cos(theta)}
	};
	double datay[3][3] = {
		{cos(pusai), 0.0, sin(pusai)},
		{0.0, 1.0, 0.0},
		{-sin(pusai), 0.0, cos(pusai)}
	};
	double dataz[3][3] = {
		{cos(phi),  -sin(phi), 0.0},
		{sin(phi), cos(phi), 0.0},
		{0.0, 0.0, 1.0}
	};

	Mat Rx(3, 3, CV_64F, datax);
	Mat Ry(3, 3, CV_64F, datay);
	Mat Rz(3, 3, CV_64F, dataz);
	Mat rr = Rz * Rx * Ry;
	rr.copyTo(dest);
}

void lookat(Point3d from, Point3d to, Mat& destR){
	double x = (to.x - from.x);
	double y = (to.y - from.y);
	double z = (to.z - from.z);

	double pitch = asin(x/sqrt(x*x + z*z ))/CV_PI*180.0;
	double yaw = asin(x/sqrt(x*x + z*z ))/CV_PI*180.0;

	eular2rot(yaw, pitch, 0, destR);
}
