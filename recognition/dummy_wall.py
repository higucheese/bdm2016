#!/usr/bin/python
# -*- coding: utf-8  -*-

import math

X = 500.0
Y = 500.0
Z = 250.0

x = 250.0
y = 250.0
z = 100.0

rot = 4.19 

fp = open("/home/pi/bdm2016/recognition/data/walls.log", "w")
fp.write(str(Z-z)+",0.0,"+str(rot)+"\n")
fp.write(str(x)+",1.57,"+str(rot)+"\n")
fp.write(str(y)+",1.57,"+str(1.57+rot)+"\n")
fp.write(str(X-x)+",1.57,"+str(3.14+rot)+"\n")
fp.write(str(Y-y)+",1.57,"+str(4.71+rot)+"\n")
fp.write(str(z)+",3.14,"+str(rot)+"\n")

wall = []
wall.append([X-x,Y-y,Z-z])
wall.append([-x,Y-y,Z-z])
wall.append([-x,-y,Z-z])
wall.append([X-x,-y,Z-z])
wall.append([X-x,Y-y,-z])
wall.append([-x,Y-y,-z])
wall.append([-x,-y,-z])
wall.append([X-x,-y,-z])
for i in xrange(len(wall)):
    s = wall[i][0]
    t = wall[i][1]
    wall[i][0] = s * math.cos(rot) - t * math.sin(rot)
    wall[i][1] = s * math.sin(rot) + t * math.cos(rot)

fp.close()
    
fp2 = open("/home/pi/bdm2016/recognition/data/walls_dots.log", "w")
def p(w):
    fp2.write(str(w[0])+","+str(w[1])+","+str(w[2])+"\n")

fp2.write("4\n")
p(wall[3])
p(wall[0])
p(wall[2])
p(wall[1])
fp2.write("4\n")
p(wall[5])
p(wall[1])
p(wall[6])
p(wall[2])
fp2.write("4\n")
p(wall[6])
p(wall[2])
p(wall[7])
p(wall[3])
fp2.write("4\n")
p(wall[7])
p(wall[3])
p(wall[4])
p(wall[0])
fp2.write("4\n")
p(wall[4])
p(wall[0])
p(wall[5])
p(wall[1])
fp2.write("4\n")
p(wall[4])
p(wall[7])
p(wall[5])
p(wall[6])
