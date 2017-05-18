#!/usr/bin/python
# -*- coding: utf-8 -*-

import math
import numpy as np

PI = math.pi
THERESHOLD = 0.01

class Wall:
    """Wall class"""
    def __init__(self, r, theta, phi):
        self.r = r
        self.theta = theta
        self.phi = phi
        self.dots = []

def node3D(w1, w2, w3):
    arr_r = np.array([w1.r, w2.r, w3.r])
    arr1 = [math.sin(w1.theta)*math.cos(w1.phi),
            math.sin(w1.theta)*math.sin(w1.phi),
            math.cos(w1.theta)]
    arr2 = [math.sin(w2.theta)*math.cos(w2.phi),
            math.sin(w2.theta)*math.sin(w2.phi),
            math.cos(w2.theta)]
    arr3 = [math.sin(w3.theta)*math.cos(w3.phi),
            math.sin(w3.theta)*math.sin(w3.phi),
            math.cos(w3.theta)]
    mat = np.mat([arr1, arr2, arr3])
    if math.fabs(np.linalg.det(mat)) < THERESHOLD:
        return None
    else:
        revmat = np.linalg.inv(mat)
        dot = np.dot(revmat, arr_r)
        w1.dots.append(dot)
        w2.dots.append(dot)
        w3.dots.append(dot)
        return dot

walls = []
    
f_input = open("/home/pi/bdm2016/recognition/data/recognition.log", "r")
for line in f_input:
    line.strip()
    spl = line.split(",")
    r = float(spl[0])
    theta = float(spl[1]) / 256 * 2 * PI
    phi = float(spl[2]) / 256 * 2 * PI
    walls.append(Wall(r, theta, phi))

nodes = []
for i in range(0, len(walls)):
    for j in range(i+1, len(walls)):
        for k in range(j+1, len(walls)):
            #print "("+str(i)+", "+str(j)+", "+str(k)+")"
            tempnode = node3D(walls[i], walls[j], walls[k])
            if tempnode is not None:
                nodes.append(tempnode)

for i in xrange(0, len(walls)):
    wall = walls[i]
    start = []
    start.append(wall.r * math.sin(wall.theta) * math.cos(wall.phi))
    start.append(wall.r * math.sin(wall.theta) * math.sin(wall.phi))
    start.append(wall.r * math.cos(wall.theta))
    del_flag = []
    for k in xrange(0, len(wall.dots)):
        dot = wall.dots[k]
        end = []
        end.append(dot[0, 0])
        end.append(dot[0, 1])
        end.append(dot[0, 2])
        for j in xrange(0, len(walls)):
            tflag = False
            for tdot in walls[j].dots:
                tflag = (dot == tdot).all() or tflag
            if tflag:
                continue
            else:
                pwall = walls[j]
                p = []
                p.append(pwall.r * math.sin(pwall.theta) * math.cos(pwall.phi))
                p.append(pwall.r * math.sin(pwall.theta) * math.sin(pwall.phi))
                p.append(pwall.r * math.cos(pwall.theta))
                N = np.array(p)
                Pstart = np.array(p) - np.array(start)
                Pend = np.array(p) - np.array(end)
                if (np.dot(N, Pstart) * np.dot(N, Pend)) <= 0:
                    del_flag.append(k)
                    break
                else:
                    continue
                
    del_flag.reverse()
    for k in del_flag:
        del wall.dots[k]

fp = open("/home/pi/bdm2016/recognition/data/walls_dots.log", "w")
fp2 = open("/home/pi/bdm2016/recognition/data/walls.log", "w")
for wall in walls:
    fp.write(str(len(wall.dots)) + "\n")
    fp2.write(str(wall.r)+","+str(wall.theta)+","+str(wall.phi)+"\n")
    for dot in wall.dots:
        x = dot[0,0]
        y = dot[0,1]
        z = dot[0,2]
        fp.write(str(x)+","+str(y)+","+str(z)+"\n")

fp.close()
fp2.close()
