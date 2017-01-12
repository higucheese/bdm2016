# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time

COUNT = 3
PIN = 37 
GPIO.setmode(GPIO.BOARD)
GPIO.setup(PIN, GPIO.OUT)

for _ in xrange(COUNT):
    GPIO.output(PIN, True)
    time.sleep(1.0)
    GPIO.output(PIN, False)
    time.sleep(1.0)

GPIO.cleanup()
