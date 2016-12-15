# -*- coding: utf-8 -*-
import cv2

camera = cv2.VideoCapture(0)
if camera.isOpened() is False:
    raise("camera IO Error")

frame = camera.read()[1]
height, width, channels = frame.shape
cv2.imwrite("frame.png", frame)
camera.release()

cv2.destroyAllWindows()
