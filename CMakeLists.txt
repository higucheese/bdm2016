# cmakeのバージョン指定
cmake_minimum_required(VERSION 2.8)
project(Mary CXX)
add_executable(Mary
  main.cpp
  stereoTest.cpp
  fillOcclusion.cpp
  makeQmatrix.cpp
  lookat.cpp
  projectImagefromXYZ.cpp
)

find_package(OpenCV REQUIRED)
target_link_libraries(Mary ${OpenCV_LIBRARIES})

set(CMAKE_CXX_FLAGS "-std=c++11 -fopenmp")

