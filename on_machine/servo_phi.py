# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import sys

SERVO_PHI_PIN = 31
 
GPIO.setmode(GPIO.BOARD)
GPIO.setup(SERVO_PHI_PIN, GPIO.OUT)

# Const Parameter
PHI_0 = 5.85
PHI_64 = 6.83
PHI_128 = 8.05
PHI_192 = 9.25
PHI_256 = 10.45

try:
    servo_phi = GPIO.PWM(SERVO_PHI_PIN, 50.0)
    servo_phi.start(0)
    
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

    phi_move(int(sys.argv[1]))

except KeyboardInterrupt:
    GPIO.cleanup()

GPIO.cleanup()
