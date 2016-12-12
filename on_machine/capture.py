# -*- coding: utf-8 -*-
import cv2

def capture(theta, phi):
    camera = cv2.VideoCapture(0)
    if camera.isOpened() is False:
        raise("camera IO Error")

    frame = camera.read()[1]
    height, width, channels = frame.shape
    CUT_SIZE = 256
    t_height = (height - CUT_SIZE) / 2
    t_width = (width - CUT_SIZE) / 2
    clp = frame[t_height:t_height + CUT_SIZE, t_width:t_width + CUT_SIZE]

    name = "./data/" + str(theta) + "_" + str(phi) + ".png"
    cv2.imwrite(name, clp)

    camera.release()

    cv2.destroyAllWindows()
