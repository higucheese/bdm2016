#!/usr/bin/python
# -*- coding: utf-8 -*-

import math
import numpy as np

PI = math.pi
THERESHOLD = 0.01

class Wall:
    """Wall class"""
    def __init__(self, r, phi, theta):
        self.r = r
        self.phi = phi
        self.theta = theta
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

if __name__ == "__main__":
    walls = [
        Wall(1, 0, PI/2),
        Wall(1, PI/2, PI/2),
        Wall(1, PI, PI/2),
        Wall(1, 3*PI/2, PI/2),
        Wall(1, 0, 0),
        Wall(1, 0, PI)
    ]

    nodes = []
    for i in range(0, len(walls)):
        for j in range(i+1, len(walls)):
            for k in range(j+1, len(walls)):
                #print "("+str(i)+", "+str(j)+", "+str(k)+")"
                tempnode = node3D(walls[i], walls[j], walls[k])
                if tempnode is not None:
                    nodes.append(tempnode)

    print walls[0].dots
