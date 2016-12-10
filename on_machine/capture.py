# -*- coding: utf-8 -*-
import cv2

camera = cv2.VideoCamera(1)
if camera.isOpened() is False:
    raise("camera IO Error")

cv2.namedWindow("camera", cv2.WINDOW_AUTOSIZE)

count = 0
while True:
    ret, image = camera.read()
    if ret is False:
        continue

    cv2.imshow("camera", image)

    k = cv2.waitKey(10)
    if k is 115:
        cv2.imwrite("data.png", image)
        count += 1
        print count
    elif k == 27:
        break

cv2.destroyAllWindows()
