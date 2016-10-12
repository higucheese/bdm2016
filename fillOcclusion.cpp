#include "marylib.hpp"

template <class T>
static void fillOcclusionInv_(Mat& src, T invalidvalue)
{
    int bb=1;
    const int MAX_LENGTH=src.cols*0.8;
#pragma omp parallel for
    for(int j=bb;j<src.rows-bb;j++)
    {
        T* s = src.ptr<T>(j);
        const T st = s[0];
        const T ed = s[src.cols-1];
        s[0]=0;
        s[src.cols-1]=0;
        for(int i=0;i<src.cols;i++)
        {
            if(s[i]==invalidvalue)
            {
                int t=i;
                do
                {
                    t++;
                    if(t>src.cols-1)break;
                }while(s[t]==invalidvalue);
 
                const T dd = max(s[i-1],s[t]);
                if(t-i>MAX_LENGTH)
                {
                    for(int n=0;n<src.cols;n++)
                    {
                        s[n]=invalidvalue;
                    }
                }
                else
                {
                    for(;i<t;i++)
                    {
                        s[i]=dd;
                    }
                }
            }
        }
    }
}
 
template <class T>
static void fillOcclusion_(Mat& src, T invalidvalue)
{
    int bb=1;
    const int MAX_LENGTH=src.cols*0.5;
#pragma omp parallel for
    for(int j=bb;j<src.rows-bb;j++)
    {
        T* s = src.ptr<T>(j);
        const T st = s[0];
        const T ed = s[src.cols-1];
        s[0]=255;
        s[src.cols-1]=255;
        for(int i=0;i<src.cols;i++)
        {
            if(s[i]<=invalidvalue)
            {
                int t=i;
                do
                {
                    t++;
                    if(t>src.cols-1)break;
                }while(s[t]<=invalidvalue);
 
                const T dd = min(s[i-1],s[t]);
                if(t-i>MAX_LENGTH)
                {
                    for(int n=0;n<src.cols;n++)
                    {
                        s[n]=invalidvalue;
                    }
                }
                else
                {
                    for(;i<t;i++)
                    {
                        s[i]=dd;
                    }
                }
            }
        }
    }
}

void fillOcclusion(Mat& src, int invalidvalue, bool isInv)
{
    if(isInv)
    {
        if(src.type()==CV_8U)
        {
            fillOcclusionInv_<uchar>(src, (uchar)invalidvalue);
        }
        else if(src.type()==CV_16S)
        {
            fillOcclusionInv_<short>(src, (short)invalidvalue);
        }
        else if(src.type()==CV_16U)
        {
            fillOcclusionInv_<unsigned short>(src, (unsigned short)invalidvalue);
        }
        else if(src.type()==CV_32F)
        {
            fillOcclusionInv_<float>(src, (float)invalidvalue);
        }
    }
    else
    {
        if(src.type()==CV_8U)
        {
            fillOcclusion_<uchar>(src, (uchar)invalidvalue);
        }
        else if(src.type()==CV_16S)
        {
            fillOcclusion_<short>(src, (short)invalidvalue);
        }
        else if(src.type()==CV_16U)
        {
            fillOcclusion_<unsigned short>(src, (unsigned short)invalidvalue);
        }
        else if(src.type()==CV_32F)
        {
            fillOcclusion_<float>(src, (float)invalidvalue);
        }
    }
}
