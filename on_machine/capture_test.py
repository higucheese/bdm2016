# -*- coding: utf-8 -*-
import cv2

camera = cv2.VideoCapture(0)
if camera.isOpened() is False:
    raise("camera IO Error")

frame = camera.read()[1]
cv2.imwrite("/home/pi/bdm2016/on_machine/frame.png", frame)
camera.release()

cv2.destroyAllWindows()
