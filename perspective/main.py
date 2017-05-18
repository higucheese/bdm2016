# coding: utf-8
import cv2
import numpy as np
import math

wall = np.empty((0, 3), float)
dots = []

# pole to xyz
def pole2xyz(r, theta, phi):
    result = np.array([0.0, 0.0, 0.0])
    result[0] = r * math.sin(theta) * math.cos(phi)
    result[1] = r * math.sin(theta) * math.sin(phi)
    result[2] = r * math.cos(theta)

    return result

def dotproduct(v1, v2):
    return sum((a*b) for a, b in zip(v1, v2))

def length(v):
    return math.sqrt(dotproduct(v, v))

def angle(v1, v2):
    return math.acos(dotproduct(v1, v2) / (length(v1) * length(v2)))
def angle_cos(v1, v2):
    return dotproduct(v1, v2) / (length(v1) * length(v2))

# file read
fp = open("walls.log", "r")
for line in fp:
    r = float(line.split(",")[0])
    theta = float(line.split(",")[1])
    phi = float(line.split(",")[2])
    vec = pole2xyz(1.0, theta, phi)
    wall = np.append(wall, np.array([[vec[0], vec[1], vec[2]]]), axis=0)

fp.close()

fp2 = open("walls_dots.log", "r")
count = 0
dots_num = 0
for line in fp2:
    if count is 0:
        dots_num = int(line)
        dots_temp = np.empty((0, 3), float)
    else:
        x = float(line.split(",")[0])
        y = float(line.split(",")[1])
        z = float(line.split(",")[2])
        size = math.sqrt(x**2 + y**2 + z**2)
        vec = np.array([[x/size, y/size, z/size]])
        dots_temp = np.append(dots_temp, vec, axis=0)

    if count is dots_num:
        count = 0
        dots.append(dots_temp)
    else:
        count += 1

fp2.close()


# draw canvas
HEIGHT = 1024
WIDTH = 1024
R = 512
r = 512
STEP = 13.5 / 256.0 * 2 * math.pi
order = [[0, 1], [1, 3], [3, 2], [2, 0]]

for w in xrange(len(wall)):
    print "hoge"
    canvas = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)

    dots_absarray = []
    for d in xrange(len(dots[w])):
        naiseki = dotproduct(wall[w], dots[w][d])
        dots[w][d] = dots[w][d] / naiseki - wall[w]
        dots_absarray.append(np.absolute(dots[w][d][0]))
        dots_absarray.append(np.absolute(dots[w][d][1]))
    r = int(512.0 / max(dots_absarray))
    for d in xrange(len(dots[w])):
        dots[w][d] = dots[w][d] * r + R

    start = np.float32([[dots[w][0][0], dots[w][0][1]], [dots[w][1][0], dots[w][1][1]], \
                            [dots[w][3][0], dots[w][3][1]], [dots[w][2][0], dots[w][2][1]]])
    end = np.float32([[0, 0], [0, HEIGHT], [WIDTH, HEIGHT], [WIDTH, 0]])
    M = cv2.getPerspectiveTransform(start, end)

    '''
    for d in xrange(len(dots[w])):
        cv2.line(canvas, (int(dots[w][order[d][0]][0]), int(dots[w][order[d][0]][1])),\
                 (int(dots[w][order[d][1]][0]), int(dots[w][order[d][1]][1])), (255, 255, 0), 4)

    cv2.line(canvas, (0,0), (0, HEIGHT), (255,255,0), 8)
    cv2.line(canvas, (0,HEIGHT), (WIDTH, HEIGHT), (255,255,0), 8)
    cv2.line(canvas, (WIDTH,HEIGHT), (WIDTH, 0), (255,255,0), 8)
    cv2.line(canvas, (WIDTH,0), (0, 0), (255,255,0), 8)
    '''

    #img = cv2.imread("./256.png")
    for i in xrange(8):
        if i is 0:
            continue
        for j in xrange(19):
            theta = STEP * i
            phi = STEP * j
            vec = pole2xyz(1.0, theta, phi)
            naiseki = dotproduct(wall[w], vec) # = math.cos(angle)
            if naiseki > 0:
                # これでvec_toがwall[w]原点からvecの伸ばした先とのベクトルとなる
                vec_to = (vec / naiseki  - wall[w]) * r + R
                if vec_to[0] < 0 or vec_to[0] > WIDTH or vec_to[1] < 0 or vec_to[1] > HEIGHT:
                    continue
                #cv2.circle(canvas, (int(vec_to[0]), int(vec_to[1])), 2, (0, 255, 255), -1)
                
                theta -= STEP / 2
                phi -= STEP / 2
                step = [np.array([1.0, theta, phi]), np.array([1.0, theta + STEP, phi]), \
                        np.array([1.0, theta + STEP, phi + STEP]), np.array([1.0, theta, phi + STEP]),]
                vec_corner = []
                for k in xrange(4):
                    vec_temp = pole2xyz(step[k][0], step[k][1], step[k][2])
                    vec_corner.append((vec_temp / dotproduct(wall[w], vec_temp) - wall[w]) * r + R)

                start_m = np.float32([[0, 0], [0, 256], [256, 256], [256, 0]])
                mid_m = np.float32([[vec_corner[0][0], vec_corner[0][1]], [vec_corner[1][0], vec_corner[1][1]],\
                                    [vec_corner[2][0], vec_corner[2][1]], [vec_corner[3][0], vec_corner[3][1]]])
                end_m = cv2.perspectiveTransform(mid_m[None, :, :], M)

                continue_flag = True
                for k in xrange(4):
                    if math.fabs(end_m[0][k][0]) < WIDTH and math.fabs(end_m[0][k][1]) < HEIGHT:
                        continue_flag = False
                        break
                
                if continue_flag:
                    continue

                theta_name = str(round(13.5 * i, 1))
                phi_name = str(round(13.5 * (18 - j), 1))
                if j is 18:
                    phi_name = "0"
                    
                name = "./data/" + theta_name + "_" + phi_name + ".png"
                print name
                img = cv2.imread(name)
                M_m = cv2.getPerspectiveTransform(start_m, end_m)
                dst = cv2.warpPerspective(img, M_m, (WIDTH, HEIGHT))
                canvas += dst


                '''
                for k in xrange(4):
                    frm = k
                    dest = (frm + 1) % 4
                    cv2.line(canvas, (int(end_m[0][frm][0]), int(end_m[0][frm][1])), \
                             (int(end_m[0][dest][0]), int(end_m[0][dest][1])), (0, 0, 255), 1);
                '''

            else:
                pass
    
    cv2.imwrite("./output/result_" + str(w) + ".png", canvas)

#cv2.imshow("test", canvas)

#cv2.waitKey(0)
#cv2.destroyAllWindows()

