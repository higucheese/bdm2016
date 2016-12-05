#!/usr/bin/python
# -*- coding: utf-8 -*-

import math

PI = math.pi

fr = open("search.log", "r")
fw = open("search_xyz.log", "w")

for line in fr:
    spl = line.split(",")
    r = float(spl[0])
    theta = float(spl[1]) / 256.0 * 2 * PI
    phi = float(spl[2]) / 256.0 * 2 * PI
    x = r * math.sin(theta) * math.cos(phi)
    y = r * math.sin(theta) * math.sin(phi)
    z = r * math.cos(theta)
    # newline = str(x)+"\t"+str(y)+"\t"+str(z)+"\n"
    newline = str(spl[0])+","+str(spl[1])+","+str(int(spl[2]) - 1)+"\n"
    # newline = str(spl[0])+"\t"+str(spl[2])
    fw.write(newline)

fr.close()
fw.close()
