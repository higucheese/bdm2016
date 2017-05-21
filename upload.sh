#!/bin/sh
sftp -b /home/pi/bdm2016/upload.bat ec2-aws
#if [ $? != 0 ]; then
#    sudo route del default gw 192.168.2.1
#fi
