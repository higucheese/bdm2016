# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import sys

SERVO_THETA_PIN = 29
 
GPIO.setmode(GPIO.BOARD)
GPIO.setup(SERVO_THETA_PIN, GPIO.OUT)

# Const Parameter
THETA_0 = 9.5
THETA_64 = 5.8

# CalcParams
THETA_ALPHA = (THETA_0 - THETA_64) / 64.0
THETA_BETA = THETA_0

try:
    servo_theta = GPIO.PWM(SERVO_THETA_PIN, 50.0)
    servo_theta.start(0)
    
    def theta_move(degree = 0):
        if degree > 128 or degree < 0:
            print "invalid theta was given."
        else:
            duty = THETA_BETA - THETA_ALPHA * degree
            servo_theta.ChangeDutyCycle(duty)

    def theta_stop():
        servo_theta.ChangeDutyCycle(0.0)

    theta_move(int(sys.argv[1]))
    time.sleep(1.0)
    theta_stop()

except KeyboardInterrupt:
    GPIO.cleanup()

GPIO.cleanup()
