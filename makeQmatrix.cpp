#include "marylib.hpp"

Mat makeQMatrix(Point2d image_center, double focal_length, double baseline){
	Mat Q = Mat::eye(4, 4, CV_64F);
	Q.at<double>(0, 3) = -image_center.x;
	Q.at<double>(1, 3) = -image_center.y;
	Q.at<double>(2, 3) = focal_length;
	Q.at<double>(3, 3) = 0.0;
	Q.at<double>(2, 2) = 0.0;
	Q.at<double>(3, 2) = 1.0 / baseline;

	return Q;
}
