#!/bin/bash
while :
    do
        date >> progress.log
        /home/pi/bdm2016/capture.sh &> /dev/null
        /home/pi/bdm2016/upload.sh &> /dev/null
    done
