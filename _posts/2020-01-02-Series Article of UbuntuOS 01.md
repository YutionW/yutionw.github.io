---
layout:     post
title:      Series Articles of Ubuntu OS usage -- 01 
subtitle:   如何安装源码opencv
date:       2020-01-02
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Ubuntu OS
---

# preface
Recently, our SRDP project occurs some problems about how to track multi-objectives in one kinds and then count them based on Object Detection networks( SSD we used that time). OpenCV-C++ is the basis of all the methods we considering, either deep sort network or traditional opencv filters. However we have only opencv-python in the isolated environment installed via Anaconda.
Then I attempt to deploy OpenCV-C++ for both my laptop(1604LTS) and the center's server(1804).
# Preparation 
## Source package
On Ubuntu, a source file is required. We choose opencv-3.4.3 just because we have the package, while the downloading speed is too slow. It are easy to be got from GitHub or its official website. Considering the stability, we suggest you to choose the version 3.4.x.x.
Unzip the package and if file **CMakeCache.txt** is here, delete it. 

## Dependence
If sudo is allowed, the following dependences are strongly suggested:
```javascript
sudo apt-get install libopencv-dev 
sudo apt-get install build-essential 
sudo apt-get install libgtk2.0-dev 
sudo apt-get install pkg-config 
sudo apt-get install python-dev 
sudo apt-get install python-numpy 
sudo apt-get install libdc1394-22 
sudo apt-get install libdc1394-22-dev 
sudo apt-get install libjpeg-dev 
sudo apt-get install libpng12-dev 
sudo apt-get install libtiff5-dev 
sudo apt-get install libjasper-dev 
sudo apt-get install libavcodec-dev 
sudo apt-get install libavformat-dev 
sudo apt-get install libswscale-dev 
sudo apt-get install libxine2-dev 
sudo apt-get install libgstreamer0.10-dev 
sudo apt-get install libgstreamer-plugins-base0.10-dev 
sudo apt-get install libv4l-dev 
sudo apt-get install libtbb-dev 
sudo apt-get install libqt4-dev 
sudo apt-get install libfaac-dev 
sudo apt-get install libmp3lame-dev 
sudo apt-get install libopencore-amrnb-dev 
sudo apt-get install libopencore-amrwb-dev 
sudo apt-get install libtheora-dev 
sudo apt-get install libvorbis-dev 
sudo apt-get install libxvidcore-dev 
sudo apt-get install x264v4l-utils
```
If not, continue to the next step.
## cmake & make 
It's not matter that where do you unzip the opencv package, but we suggest you to install it under `/home/your_environment/`directly.
run the following code:
```
unzip opencv-3.4.3.zip
cd opencv-3.4.3
rm -rf CMakeCache.txt
mkdir build && cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/home/your_path/opencv34 -D WITH_TBB=ON -D WITH_V4L=ON -D BUILD_TIFF=ON -D BUILD_EXAMPLES=ON -D WITH_OPENGL=ON -D WITH_EIGEN=ON -D WITH_CUDA=ON -D WITH_CUBLAS=ON ..
make -j
make install
```
May this [blog](https://blog.csdn.net/weixin_41896508/article/details/80795239) is helpful for you if some errors that packages are not found  occurred.

## Add opencv into environment variable
To make your machine know that openCV is already here, add its path into `~/.bashrc` following the code:
```
PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/home/yours/opencv/lib/pkgconfig
export PKG_CONFIG_PATH
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/yours/opencv34/lib/
```
Also, we suggest you to check your direction `opencv34` to ensure is sub direction 'lib' there, or `lib64`.
We also suggest you to add the above sentences before CUDA path.

Save `~/.bashrc` and run `source ~/.bashrc` to update your environment path.
