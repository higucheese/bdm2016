# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import cv2

LED_PIN = 37
SERVO_PHI_PIN = 31
SERVO_THETA_PIN = 29
 
GPIO.setmode(GPIO.BOARD)
GPIO.setup(LED_PIN, GPIO.OUT)
GPIO.setup(SERVO_PHI_PIN, GPIO.OUT)
GPIO.setup(SERVO_THETA_PIN, GPIO.OUT)

# Const Parameter
PHI_0 = 5.85
PHI_64 = 6.83
PHI_128 = 8.05
PHI_192 = 9.25
PHI_256 = 10.45
THETA_0 = 9.5
THETA_64 = 5.8
# PHI_STEP = 13.5
PHI_STEP = 64
THETA_STEP = 13.7
LPF_RATE = 0.9

# CalcParams
THETA_ALPHA = (THETA_0 - THETA_64) / 64.0
THETA_BETA = THETA_0

try:
    GPIO.output(LED_PIN, True)
    
    servo_phi = GPIO.PWM(SERVO_PHI_PIN, 50.0)
    servo_phi.start(PHI_0)
    
    servo_theta = GPIO.PWM(SERVO_THETA_PIN, 50.0)
    servo_theta.start(THETA_BETA)

    camera = cv2.VideoCapture(0)
    
    time.sleep(2.0)

    CUT_SIZE = 256
    def clip_frame(frm):
        height, width, channels = frm.shape
        th = (height - CUT_SIZE) / 2
        tw = (width - CUT_SIZE) / 2
        return frm[th:th + CUT_SIZE, tw:tw + CUT_SIZE]

    def phi_move(degree = 0):
        if degree > 256 or degree < 0:
            print "invalid phi was given."
        else:
            if degree < 64:
                PHI_ALPHA = (PHI_0 - PHI_64) / 64.0
                PHI_BETA = PHI_0
            elif degree < 128:
                PHI_ALPHA = (PHI_64 - PHI_128) / 64.0
                PHI_BETA = 2 * PHI_64 - PHI_128
            elif degree < 192:
                PHI_ALPHA = (PHI_128 - PHI_192) / 64.0
                PHI_BETA = 3 * PHI_128 - 2 * PHI_192
            else :
                PHI_ALPHA = (PHI_192 - PHI_256) / 64.0
                PHI_BETA = 4 * PHI_192 - 3 * PHI_256
            
            duty = PHI_BETA - PHI_ALPHA * degree
            servo_phi.ChangeDutyCycle(duty)
            time.sleep(1.0)
            servo_phi.ChangeDutyCycle(0.0)

    def theta_move(degree = 0):
        if degree > 128 or degree < 0:
            print "invalid theta was given."
        else:
            duty = THETA_BETA - THETA_ALPHA * degree
            servo_theta.ChangeDutyCycle(duty)

    def theta_stop():
            servo_theta.ChangeDutyCycle(0.0)

    phi_degree = 0
    while phi_degree < 256:
        phi_move(phi_degree)
        print "phi_degree:" + str(phi_degree)

        theta_degree = 0
        theta_stop()
        while theta_degree <= 96:
            theta_move(theta_degree)
            print "theta_degree:" + str(theta_degree)
            time.sleep(0.5)
            theta_stop()
            
            time.sleep(0.5)
            clip = clip_frame(camera.read()[1])
            name = "./data/" + str(theta_degree) + "_" + str(phi_degree) + ".png"
            cv2.imwrite(name, clip)
            time.sleep(0.5)
            
            theta_degree += THETA_STEP
        
        theta_move()
        phi_degree += PHI_STEP

except KeyboardInterrupt:
    GPIO.cleanup()

GPIO.output(LED_PIN, False)
GPIO.cleanup()
camera.release()
cv2.destroyAllWindows()
