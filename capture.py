#!/usr/bin/python2
# -*- coding: utf-8 -*-
# http://venuschjp.blogspot.jp/2015/02/pythonopencvweb.html
import cv2

if __name__=="__main__":

    captureL = cv2.VideoCapture(1)
    captureR = cv2.VideoCapture(2)
    
    if captureL.isOpened() is False:
        raise("captureL IO Error")
    if captureR.isOpened() is False:
        raise("captureR IO Error")

    cv2.namedWindow("CaptureL", cv2.WINDOW_AUTOSIZE)
    cv2.namedWindow("CaptureR", cv2.WINDOW_AUTOSIZE)

    count = 1;
    while True:

        retL, imageL = captureL.read()
        retR, imageR = captureR.read()

        if (retL is False) and (retR is False):
            continue

        cv2.imshow("CaptureL", imageL)
        cv2.imshow("CaptureR", imageR)

        k = cv2.waitKey(10)
        if k == 115:
            cv2.imwrite("calibrate/data/l" + str(count) + ".png", imageL)
            cv2.imwrite("calibrate/data/r" + str(count) + ".png", imageR)
            print count
            count += 1
        if k == 27:
            break
            
    cv2.destroyAllWindows()
