# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time
import sys

PIN = 31
GPIO.setmode(GPIO.BOARD)
GPIO.setup(PIN, GPIO.OUT)

servo = GPIO.PWM(PIN, 50)

servo.start(0.0)

arg = sys.argv
dc = float(arg[1])
servo.ChangeDutyCycle(dc)
time.sleep(2.0)
GPIO.cleanup()
