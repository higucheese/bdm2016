#include "marylib.hpp"

template <class T>
static void projectImagefromXYZ_(Mat& image, Mat& destimage, Mat& disp, Mat& destdisp, Mat& xyz, Mat& R, Mat& t, Mat& K, Mat& dist, Mat& mask, bool isSub){
	if(destimage.empty()){
		destimage = Mat::zeros(Size(image.size()), image.type());
	}
	if(destdisp.empty()){
		destdisp = Mat::zeros(Size(image.size()), image.type());
	}
	if(dist.empty()){
		dist = Mat::zeros(Size(5, 1), CV_32F);
	}
	
	vector<Point2f> pt;
	projectPoints(xyz, R, t, K, dist, pt);

	destimage.setTo(0);
	destdisp.setTo(0);

	//for文をopenmpを使って最適化してくれるらしい -fopenmp
#pragma omp parallel for
    for(int j=1;j<image.rows-1;j++)
    {
        int count=j*image.cols;
        uchar* img=image.ptr<uchar>(j);
        uchar* m=mask.ptr<uchar>(j);
        for(int i=0;i<image.cols;i++,count++)
        {
            int x=(int)(pt[count].x+0.5);
            int y=(int)(pt[count].y+0.5);
            if(m[i]==255)continue;
            if(pt[count].x>=1 && pt[count].x<image.cols-1 && pt[count].y>=1 && pt[count].y<image.rows-1)
            {
                short v=destdisp.at<T>(y,x);
                if(v<disp.at<T>(j,i))
                {
                    destimage.at<uchar>(y,3*x+0)=img[3*i+0];
                    destimage.at<uchar>(y,3*x+1)=img[3*i+1];
                    destimage.at<uchar>(y,3*x+2)=img[3*i+2];
                    destdisp.at<T>(y,x)=disp.at<T>(j,i);
 
                    if(isSub)
                    {
                        if((int)pt[count+image.cols].y-y>1 && (int)pt[count+1].x-x>1)
                        {
                            destimage.at<uchar>(y,3*x+3)=img[3*i+0];
                            destimage.at<uchar>(y,3*x+4)=img[3*i+1];
                            destimage.at<uchar>(y,3*x+5)=img[3*i+2];
 
                            destimage.at<uchar>(y+1,3*x+0)=img[3*i+0];
                            destimage.at<uchar>(y+1,3*x+1)=img[3*i+1];
                            destimage.at<uchar>(y+1,3*x+2)=img[3*i+2];
 
                            destimage.at<uchar>(y+1,3*x+3)=img[3*i+0];
                            destimage.at<uchar>(y+1,3*x+4)=img[3*i+1];
                            destimage.at<uchar>(y+1,3*x+5)=img[3*i+2];
 
                            destdisp.at<T>(y,x+1)=disp.at<T>(j,i);                      
                            destdisp.at<T>(y+1,x)=disp.at<T>(j,i);
                            destdisp.at<T>(y+1,x+1)=disp.at<T>(j,i);
                        }
                        else if((int)pt[count-image.cols].y-y<-1 && (int)pt[count-1].x-x<-1)
                        {
                            destimage.at<uchar>(y,3*x-3)=img[3*i+0];
                            destimage.at<uchar>(y,3*x-2)=img[3*i+1];
                            destimage.at<uchar>(y,3*x-1)=img[3*i+2];
 
                            destimage.at<uchar>(y-1,3*x+0)=img[3*i+0];
                            destimage.at<uchar>(y-1,3*x+1)=img[3*i+1];
                            destimage.at<uchar>(y-1,3*x+2)=img[3*i+2];
 
                            destimage.at<uchar>(y-1,3*x-3)=img[3*i+0];
                            destimage.at<uchar>(y-1,3*x-2)=img[3*i+1];
                            destimage.at<uchar>(y-1,3*x-1)=img[3*i+2];
 
                            destdisp.at<T>(y,x-1)=disp.at<T>(j,i);                      
                            destdisp.at<T>(y-1,x)=disp.at<T>(j,i);
                            destdisp.at<T>(y-1,x-1)=disp.at<T>(j,i);
                        }
                        else if((int)pt[count+1].x-x>1)
                        {
                            destimage.at<uchar>(y,3*x+3)=img[3*i+0];
                            destimage.at<uchar>(y,3*x+4)=img[3*i+1];
                            destimage.at<uchar>(y,3*x+5)=img[3*i+2];
 
                            destdisp.at<T>(y,x+1)=disp.at<T>(j,i);
                        }
                        else if((int)pt[count-1].x-x<-1)
                        {
                            destimage.at<uchar>(y,3*x-3)=img[3*i+0];
                            destimage.at<uchar>(y,3*x-2)=img[3*i+1];
                            destimage.at<uchar>(y,3*x-1)=img[3*i+2];
 
                            destdisp.at<T>(y,x-1)=disp.at<T>(j,i);
                        }
                        else if((int)pt[count+image.cols].y-y>1)
                        {
                            destimage.at<uchar>(y+1,3*x+0)=img[3*i+0];
                            destimage.at<uchar>(y+1,3*x+1)=img[3*i+1];
                            destimage.at<uchar>(y+1,3*x+2)=img[3*i+2];
 
                            destdisp.at<T>(y+1,x)=disp.at<T>(j,i);
                        }
                        else if((int)pt[count-image.cols].y-y<-1)
                        {
                            destimage.at<uchar>(y-1,3*x+0)=img[3*i+0];
                            destimage.at<uchar>(y-1,3*x+1)=img[3*i+1];
                            destimage.at<uchar>(y-1,3*x+2)=img[3*i+2];
 
                            destdisp.at<T>(y-1,x)=disp.at<T>(j,i);
                        }
                    }
                }
            }
        }
    }
 
    if(isSub) {
        Mat image2;
        Mat disp2;
        destimage.copyTo(image2);
        destdisp.copyTo(disp2);
        const int BS=1;
#pragma omp parallel for
        for(int j=BS;j<image.rows-BS;j++)
        {
            uchar* img=destimage.ptr<uchar>(j);
            T* m = disp2.ptr<T>(j);
            T* dp = destdisp.ptr<T>(j);
            for(int i=BS;i<image.cols-BS;i++)
            {
                if(m[i]==0)
                {
                    int count=0;
                    int d=0;
                    int r=0;
                    int g=0;
                    int b=0;
                    for(int l=-BS;l<=BS;l++)
                    {
                        T* dp2 = disp2.ptr<T>(j+l);
                        uchar* img2 = image2.ptr<uchar>(j+l);
                        for(int k=-BS;k<=BS;k++)
                        {
                            if(dp2[i+k]!=0)
                            {
                                count++;
                                d+=dp2[i+k];
                                r+=img2[3*(i+k)+0];
                                g+=img2[3*(i+k)+1];
                                b+=img2[3*(i+k)+2];
                            }
                        }
                    }
                    if(count!=0)
                    {
                        double div = 1.0/count;
                        dp[i]=d*div;
                        img[3*i+0]=r*div;
                        img[3*i+1]=g*div;
                        img[3*i+2]=b*div;
                    }
                }
            }
        }
    }
}

void projectImagefromXYZ(Mat& image, Mat& destimage, Mat& disp, Mat& destdisp, Mat& xyz, Mat& R, Mat& t, Mat& K, Mat& dist, bool isSub){
	Mat mask = Mat::zeros(image.size(), CV_8U);
	switch(disp.type()){
	case CV_8U:
		projectImagefromXYZ_<unsigned char>(image, destimage, disp, destdisp, xyz, R, t, K, dist, mask, isSub);
		break;
	case CV_16S:
		projectImagefromXYZ_<short>(image, destimage, disp, destdisp, xyz, R, t, K, dist, mask, isSub);
		break;
	case CV_16U:
		projectImagefromXYZ_<unsigned short>(image, destimage, disp, destdisp, xyz, R, t, K, dist, mask, isSub);
		break;
	case CV_32F:
		projectImagefromXYZ_<float>(image, destimage, disp, destdisp, xyz, R, t, K, dist, mask, isSub);
		break;
	case CV_64F:
		projectImagefromXYZ_<double>(image, destimage, disp, destdisp, xyz, R, t, K, dist, mask, isSub);
		break;
	}
}
