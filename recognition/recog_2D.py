#!/usr/bin/python
# -*- coding: utf-8 -*-

import math
import numpy as np

PI = math.pi
THERESHOLD = 0.01

class Wall:
    """Wall class"""
    def __init__(self, r, theta):
        self.r = r
        self.theta = theta

def node2D(w1, w2):
    arr_r = np.array([w1.r, w2.r])
    arr1 = [math.cos(w1.theta), math.sin(w1.theta)]
    arr2 = [math.cos(w2.theta), math.sin(w2.theta)]
    mat = np.mat([arr1, arr2])
    if math.fabs(np.linalg.det(mat)) < THERESHOLD:
        return None
    else:
        revmat = np.linalg.inv(mat)
        return np.dot(revmat, arr_r)
    



if __name__ == "__main__":
    walls = []
    walls.append(Wall(1, PI/3))
    walls.append(Wall(1, 5*PI/6))
    walls.append(Wall(1, 4*PI/3))
    walls.append(Wall(1, 11*PI/6))

    nodes = []
    for i in range(0, 4):
        for j in range(i+1, 4):
            #print "("+str(i)+", "+str(j)+")"
            tempnode = node2D(walls[i], walls[j])
            if tempnode is not None:
                nodes.append(tempnode)

    print nodes
