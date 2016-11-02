#include "calib.hpp"
#include <vector>
using namespace std;

void stereocalib(void){
    //numBoardsは左・右片方だけの数
    //チェッカーボードはdata2, 3の計25枚
	int maxnum = 26;
    int numBoards = 17;
    int board_w = 10;
    int board_h = 7;
    Size board_sz = Size(board_w, board_h);
    int board_n = board_w*board_h;

    vector< vector<Point3f> > object_points;
    vector< vector<Point2f> > imagePoints1, imagePoints2;
    vector<Point2f> corners1, corners2;
    vector<Point3f> obj;
    Mat gray1, gray2;
    vector<Mat> imgL, imgR;

    for (int j = 0; j < board_n; j++){
        obj.push_back(Point3f(j / board_w, j%board_w, 0.0f));
    }

    //画像読み込み,vecter<Mat>imgLにL画像, vector<Mat>imgRにR画像
    for (int i = 0; i < maxnum; i++) {
        std::stringstream stream;
        std::stringstream stream2;
        //stream << "non_undistort/1280_960/l" << i + 1 << ".png";
        //stream2 << "non_undistort/1280_960/r" << i + 1 << ".png";
		stream << "data/l" << i + 1 << ".png";
		stream2 << "data/r" << i + 1 << ".png";
        std::string fileName = stream.str();
        std::string fileName2 = stream2.str();
        imgL.push_back(imread(fileName));
        imgR.push_back(imread(fileName2));
        cout << "Load checker image: " << fileName << endl;
        cout << "Load checker image: " << fileName2 << endl;
    }
 
    Mat cameraMatrix(3, 3, CV_64F);
    Mat distCoeffs(1, 5, CV_64F);
 
    // 1280*960
    cameraMatrix.at<double>(0, 0) = 7.8870456311212956e+02;
    cameraMatrix.at<double>(0, 2) = 3.1950000000000000e+02;
    cameraMatrix.at<double>(1, 1) = 7.8870456311212956e+02;
    cameraMatrix.at<double>(1, 2) = 2.3950000000000000e+02;
 
    cameraMatrix.at<double>(0, 1) = 0;
    cameraMatrix.at<double>(1, 0) = 0;
    cameraMatrix.at<double>(2, 0) = 0;
    cameraMatrix.at<double>(2, 1) = 0;
    cameraMatrix.at<double>(2, 2) = 1;
    distCoeffs.at<double>(0, 0) = 7.1479496241995634e-03;
    distCoeffs.at<double>(0, 1) = -7.2546989264379935e-01;
    distCoeffs.at<double>(0, 2) = 0;
    distCoeffs.at<double>(0, 3) = 0;
    distCoeffs.at<double>(0, 4) = 2.1161664362509667e+00;
 
    vector<Mat> undistImgL, undistImgR;
    cv::Mat tmp(imgL[0].rows, imgL[0].cols, CV_8UC1);
 
    // 歪み補正(L, R)
    for (int i = 0; i < maxnum; i++){
        undistImgL.push_back(tmp);
        undistImgR.push_back(tmp);
        undistort(imgL[i], undistImgL[i], cameraMatrix, distCoeffs);
        undistort(imgR[i], undistImgR[i], cameraMatrix, distCoeffs);
    }
	
    imshow("non_undistort", imgL[0]);
    imshow("undistort", undistImgL[0]);
    waitKey(10);
 
    int success = 0, k = 0, num = 0;
    bool found1 = false, found2 = false;

	int count_temp = 0;
    while (success < numBoards){
		std::cout << count_temp << std::endl;
		count_temp++;
		if (num >= maxnum) {
			printf("error:success rate is too low\n");
			return;
		}
        cv::Mat img1 = undistImgL[num];
        cv::Mat img2 = undistImgR[num];
 
        cvtColor(img1, gray1, CV_BGR2GRAY);
        cvtColor(img2, gray2, CV_BGR2GRAY);
 
        //チェッカーボード探し・キャリブレーション描画
        found1 = findChessboardCorners(img1, board_sz, corners1, CV_CALIB_CB_ADAPTIVE_THRESH | CV_CALIB_CB_FILTER_QUADS);
        found2 = findChessboardCorners(img2, board_sz, corners2, CV_CALIB_CB_ADAPTIVE_THRESH | CV_CALIB_CB_FILTER_QUADS);
		//CV_CALIB_CB_ADAPTIVE_THRESH - 画像を2値化する際に，固定の閾値を使うのではなく，（画像の平均輝度値から計算される）適応的な閾値を用いる．
		//CV_CALIB_CB_FILTER_QUADS(4):四角形を抽出する際に追加基準を利用する
		
        if (found1){
            cornerSubPix(gray1, corners1, Size(11, 11), Size(-1, -1), TermCriteria(CV_TERMCRIT_EPS | CV_TERMCRIT_ITER, 30, 0.1));
            drawChessboardCorners(gray1, board_sz, corners1, found1);
        }
        if (found2){
            cornerSubPix(gray2, corners2, Size(11, 11), Size(-1, -1), TermCriteria(CV_TERMCRIT_EPS | CV_TERMCRIT_ITER, 30, 0.1));
            drawChessboardCorners(gray2, board_sz, corners2, found2);
        }
		// type は， MAX_ITER, EPS, MAX_ITER+EPS の内の1つです．
		// type = MAX_ITER の場合は，反復回数だけが問題になります．
		// type = EPS の場合は，要求精度（イプシロン）だけが問題になります．
		//    （もっとも，大抵のアルゴリズムでは反復回数に何らかの制限を設けますが）
		// type = MAX_ITER + EPS の場合は，反復回数が既定値に達するか，
		// あるいは，要求精度が達成された場合にアルゴリズムが停止します．
		
        //キャリブレーション結果表示
        imshow("image1", gray1);
        imshow("image2", gray2);
        k = waitKey(10);
 
        if (found1 && found2){
            k = waitKey(0);
        }
        if (k == 27){ //ESCキーでブレイク
            break;
        }
        if (found1 != 0 && found2 != 0){
            imagePoints1.push_back(corners1);
            imagePoints2.push_back(corners2);
            object_points.push_back(obj);
            printf("[%d]Corners stored\n", num);
            success++;
            if (success >= numBoards){
                break;
            }
        }
        num++;
    }
 
    destroyAllWindows();
    printf("Starting Calibration\n");
    Mat CM1 = Mat(3, 3, CV_64FC1);
    Mat CM2 = Mat(3, 3, CV_64FC1);
    Mat D1, D2;
    Mat R, T, E, F;
 
    object_points.resize(numBoards, object_points[0]);
    stereoCalibrate(object_points, imagePoints1, imagePoints2,
					CM1, D1, CM2, D2, undistImgL[0].size(), R, T, E, F,
					cvTermCriteria(CV_TERMCRIT_ITER+CV_TERMCRIT_EPS, 100, 1e-5),
					CV_CALIB_SAME_FOCAL_LENGTH | CV_CALIB_ZERO_TANGENT_DIST);
	//http://opencv.jp/opencv-2svn/cpp/camera_calibration_and_3d_reconstruction.html
	
    FileStorage fs1("mystereocalib.txt", FileStorage::WRITE);
    fs1 << "CM1" << CM1;
    fs1 << "CM2" << CM2;
    fs1 << "D1" << D1;
    fs1 << "D2" << D2;
    fs1 << "R" << R;
    fs1 << "T" << T;
    fs1 << "E" << E;
    fs1 << "F" << F;
    printf("Done Calibration\n");
    printf("Starting Rectification\n");
    Mat R1, R2, P1, P2, Q;
    stereoRectify(CM1, D1, CM2, D2, imgL[0].size(), R, T, R1, R2, P1, P2, Q);
    fs1 << "R1" << R1;
    fs1 << "R2" << R2;
    fs1 << "P1" << P1;
    fs1 << "P2" << P2;
    fs1 << "Q" << Q;
    printf("Done Rectification\n");
    printf("Applying Undistort\n");
    Mat map1x, map1y, map2x, map2y;
    Mat imgU1, imgU2;
    initUndistortRectifyMap(CM1, D1, R1, P1, imgL[0].size(), CV_32FC1, map1x, map1y);
    initUndistortRectifyMap(CM2, D2, R2, P2, imgR[0].size(), CV_32FC1, map2x, map2y);
    printf("Undistort complete\n");
 
    num = 0;
    while(num < numBoards){
        cv::Mat img1 = undistImgL[num];
        cv::Mat img2 = undistImgR[num];
        remap(img1, imgU1, map1x, map1y, INTER_LINEAR, BORDER_CONSTANT, Scalar());
        remap(img2, imgU2, map2x, map2y, INTER_LINEAR, BORDER_CONSTANT, Scalar());
        //imshow("image1", imgU1);
        //imshow("image2", imgU2);
        if(num == 0){
            imwrite("unsdist_rectifyL.png", imgU1);
            imwrite("unsdist_rectifyR.png", imgU2);
        }
        k = waitKey(0);
        if(k == 27){
            break;
        }
        num++;
    }
}

