#!/bin/sh
python /home/pi/bdm2016/on_machine/capture_sphere.py
python /home/pi/bdm2016/perspective/main.py
cp /home/pi/bdm2016/perspective/output/result_0.png /home/pi/bdm2016/perspective/output/top.png
cp /home/pi/bdm2016/perspective/output/result_1.png /home/pi/bdm2016/perspective/output/left.png
cp /home/pi/bdm2016/perspective/output/result_2.png /home/pi/bdm2016/perspective/output/front.png
cp /home/pi/bdm2016/perspective/output/result_3.png /home/pi/bdm2016/perspective/output/right.png
cp /home/pi/bdm2016/perspective/output/result_4.png /home/pi/bdm2016/perspective/output/back.png
cp /home/pi/bdm2016/perspective/output/result_5.png /home/pi/bdm2016/perspective/output/bottom.png
