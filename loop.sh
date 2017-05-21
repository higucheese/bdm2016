#!/bin/bash
while :
    do
        sudo route del default gw 192.168.2.1 &> /dev/null
        date >> progress.log
        /home/pi/bdm2016/capture.sh &> /dev/null
        /home/pi/bdm2016/upload.sh &> /dev/null
        sleep 60
    done
