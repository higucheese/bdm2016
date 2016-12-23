# -*- coding: utf-8 -*-
import time
import smbus

i2c = smbus.SMBus(1)

while True:
    i2c.write_byte_data(0x70, 0, 81)
    time.sleep(0.07)

    readdata = i2c.read_word_data(0x70, 2)
    highbyte = readdata >> 8
    lowbyte = readdata ^ (highbyte << 8)
    print highbyte + (lowbyte << 8)
