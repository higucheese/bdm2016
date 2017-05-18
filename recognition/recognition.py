# -*- coding: utf-8 -*-

import math
import numpy as np

debug = False
PI = math.pi
DETECTABLE_MAX_RANGE = 600.0
DETECTABLE_MIN_RANGE = 16.0
FFT_DEG = 256

# data loading
print "data loading"
try:
    logfile = open("/home/pi/bdm2016/recognition/data/search.log", "r")
    # logfile = open("dammy.log", "r")
except:
    print "error: please prepare 'search.log'"
    exit(1)
    
data = {}

for line in logfile:
    spl = line.split(",")
    r = float(spl[0])
    theta = int(spl[1])
    phi = int(spl[2])
    if r > DETECTABLE_MIN_RANGE:
        data[(theta, phi)] = r
    else:
        data[(theta, phi)] = DETECTABLE_MAX_RANGE
        
logfile.close()


# two-dimention fft
print "two-dimention fft"
fft_input = np.zeros((FFT_DEG / 2, FFT_DEG)) # (theta, phi)
THETA_MAX_DEG = 96

for i in xrange(FFT_DEG / 2):
    for j in xrange(FFT_DEG):
        if i < THETA_MAX_DEG:
            fft_input[i, j] = data[(i, j)]
        elif i == THETA_MAX_DEG:
            fft_input[i, j] = data[(i, j)]
        else:
            fft_input[i, j] = fft_input[i - 1, j] - 0.1

if debug:
    f_fft_input = open("./data/fft_input.dat", "w")
    for x in xrange(FFT_DEG / 2):
        for y in xrange(FFT_DEG):
            newline = str(x)+"\t"+str(y)+"\t"+str(fft_input[x, y])+"\n"
            f_fft_input.write(newline)
    f_fft_input.close()
else:
    pass

fft_output = np.fft.fft2(fft_input)


# canceling high frequency noise
print "canceling high frequency noise"
R = 32
filter_matrix = np.zeros((FFT_DEG / 2, FFT_DEG))
for i in xrange(FFT_DEG / 2):
    for j in xrange(FFT_DEG):
        if (i - FFT_DEG / 4)**2 + (j - FFT_DEG / 2)**2 < R**2:
            filter_matrix[i, j] = 1

fft_output = np.fft.fftshift(fft_output)
fft_output = filter_matrix * fft_output
ifft_input = np.fft.fftshift(fft_output)

# two-dimention ifft
print "two-dimention ifft"
fft_result = np.matrix(np.fft.ifft2(ifft_input)).real

if debug:
    f_fft_result = open("./data/fft_result.dat", "w")
    for x in xrange(FFT_DEG / 2):
        for y in xrange(FFT_DEG):
            newline = str(x)+"\t"+str(y)+"\t"+str(fft_result[x, y])+"\n"
            f_fft_result.write(newline)
    f_fft_result.close()
else :
    pass


# detect local minimums
print "detect local minimums"
TRIAL_TIMES = int(FFT_DEG/4)
INITIAL_POSITION_INTERVAL = FFT_DEG / 8
SEARCH_RANGE = INITIAL_POSITION_INTERVAL

local_mins = []
ti = INITIAL_POSITION_INTERVAL
while ti < FFT_DEG / 2:
    tj = INITIAL_POSITION_INTERVAL
    while tj < FFT_DEG:
        local_mins.append([ti, tj])
        tj += INITIAL_POSITION_INTERVAL
    ti += INITIAL_POSITION_INTERVAL

for local_min in local_mins:
    for k in xrange(TRIAL_TIMES):
        x = local_min[0]
        y = local_min[1]

        if x - SEARCH_RANGE / 2 < 0:
            mx_start = 0
            mx_end = x + SEARCH_RANGE / 2
        elif x + SEARCH_RANGE / 2 > FFT_DEG / 2 - 1:
            mx_start = x - SEARCH_RANGE / 2
            mx_end = FFT_DEG / 2 - 1
        else:
            mx_start = x - SEARCH_RANGE / 2
            mx_end = x + SEARCH_RANGE / 2

        if y - SEARCH_RANGE / 2 < 0:
            my_start = 0
            my_end = y + SEARCH_RANGE / 2
        elif y + SEARCH_RANGE / 2 > FFT_DEG - 1:
            my_start = y - SEARCH_RANGE / 2
            my_end = FFT_DEG - 1
        else:
            my_start = y - SEARCH_RANGE / 2
            my_end = y + SEARCH_RANGE / 2

        X = range(mx_start, mx_end + 1)
        Y = range(my_start, my_end + 1)

        mat_m = np.copy(fft_result[mx_start:mx_end + 1, my_start:my_end + 1])
        for i in xrange(len(X)):
            for j in xrange(len(Y)):
                if mat_m[i, j] <= fft_result[x, y]:
                    mat_m[i, j] = 1
                else:
                    mat_m[i, j] = 0
                    
        M = np.sum(mat_m)

        x_mean = 0
        y_mean = 0

        for i in xrange(len(X)):
            x_mean += np.sum(mat_m[i, :]) * X[i]
        x_mean = int(x_mean / M)

        for i in xrange(len(Y)):
            y_mean += np.sum(mat_m[:, i]) * Y[i]
        y_mean = int(y_mean / M)

        if (x is x_mean) and (y is y_mean):
            break
        else:
            local_min[0] = x_mean
            local_min[1] = y_mean

            
# integration local minimums
print "integration local minimums"
SEPARATABLE_MINIMUM = int(FFT_DEG / 4)
walls = []
sep_a = FFT_DEG
sep_b = SEPARATABLE_MINIMUM
sep_c = 0

def integ():
    for i in xrange(0, len(walls)):
        m = walls[i]
        for j in xrange(i+1, len(walls)):
            n = walls[j]
            if (abs(m[0] - n[0]) < sep_b or abs(m[0] - n[0]) > (FFT_DEG/2 - sep_b)) and (abs(m[1] - n[1]) < sep_b or abs(m[1] - n[1]) > (FFT_DEG - sep_b)):
                if fft_result[m[0], m[1]] > fft_result[n[0], n[1]]:
                    del walls[i]
                else:
                    del walls[j]
                return False
            else:
                pass
    return True

while True:
    walls = local_mins[:]
    while True:
        if integ():
            break
        else:
            pass

    if len(walls) < 6:
        sep_a = sep_b
        sep_b = (sep_b + sep_c) / 2
    elif len(walls) is 6:
        break
    else:
        sep_c = sep_b
        sep_b = (sep_b + sep_a) / 2


f_result = open("/home/pi/bdm2016/recognition/data/recognition.log", "w")
for wall in walls:
    theta = wall[0]
    phi = wall[1]
    r = fft_result[theta, phi]
    newline = str(r)+","+str(theta)+","+str(phi)+"\n"
    f_result.write(newline)
f_result.close()
