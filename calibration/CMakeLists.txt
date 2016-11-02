# cmakeのバージョン指定
cmake_minimum_required(VERSION 2.8)
project(calib CXX)
add_executable(calib
  main.cpp
  stereocalib.cpp
  camcalib.cpp
)

find_package(OpenCV REQUIRED)
target_link_libraries(calib ${OpenCV_LIBRARIES})

set(CMAKE_CXX_FLAGS "-std=c++11 -fopenmp -g")

