#include "marylib.hpp"

void stereoTest(char* picture[]){
	// (1) Rendering L&R images and estimating disparity map by SGBM

	// flag>0: 3channel color, = 0 glay scale
	Mat imageL = imread(picture[1], 1);
	Mat imageR = imread(picture[2], 1);
	Mat destimage;

	StereoSGBM sgbm(1, 16*2, 3, 200, 255, 1, 0, 0, 0, 0, true);
	Mat disp, destdisp, dispshow;
	sgbm(imageL, imageR, disp);

	//うまい感じに補正する関数らしい.
	fillOcclusion(disp, 16);

	// (2) Make Q matrix and reproject pixels into 3D space
	// Qマトリックスを使うことで3次元空間に投影できるらしい
	const double focal_length = FOCAL_LENGTH;
	const double baseline = BASELINE;
	Mat Q = makeQMatrix(Point2d((imageL.cols - 1.0)/2.0, (imageR.rows - 1.0)/2.0), focal_length, baseline * 16);

	Mat depth;
	reprojectImageTo3D(disp, depth, Q);
	Mat xyz = depth.reshape(3, depth.size().area());

	// (3) Camera setting
	Mat K = Mat::eye(3, 3, CV_64F); //単位行列を生成
	K.at<double>(0, 0) = focal_length;
	K.at<double>(1, 1) = focal_length;
	K.at<double>(0, 2) = (imageL.cols - 1.0)/2.0;
	K.at<double>(1, 2) = (imageL.rows - 1.0)/2.0;

	Mat dist = Mat::zeros(5, 1, CV_64F);
	Mat R = Mat::eye(3, 3, CV_64F);
	Mat t = Mat::zeros(3, 1, CV_64F);

	Point3d viewpoint(0.0, 0.0, baseline * 10);
	Point3d lookatpoint(0.0, 0.0, -baseline * 10.0);
	const double step = baseline;
	int key = 0;
	bool isSub = true;
	
	// (4) Rendering loop
	while(key != 'q'){
		lookat(viewpoint, lookatpoint, R);
		t.at<double>(0, 0) = viewpoint.x;
		t.at<double>(1, 0) = viewpoint.y;
		t.at<double>(2, 0) = viewpoint.z;

		std:: cout << t << std::endl;
		t = R * t;

		// (5) Projecting 3D point cloud to image.
		projectImagefromXYZ(imageL, destimage, disp, destdisp, xyz, R, t, K, dist, isSub);

		destdisp.convertTo(dispshow, CV_8U, 0.5);
		imshow("depth", dispshow);
		imshow("image", destimage);

		key = waitKey(1);
        if(key=='f')
        {
            isSub=isSub?false:true;
        }
        if(key=='k')
        {
            viewpoint.y+=step;
        }
        if(key=='j')
        {
            viewpoint.y-=step;
        }
        if(key=='h')
        {
            viewpoint.x+=step;
        }
        if(key=='l')
        {
            viewpoint.x-=step;
        }
        if(key=='u')
        {
            viewpoint.z+=step;
        }
        if(key=='d')
        {
            viewpoint.z-=step;
        }
	}
}
