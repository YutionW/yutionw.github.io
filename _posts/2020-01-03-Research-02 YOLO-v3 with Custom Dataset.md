---
layout:     post
title:      Series Articles of Researching Recording -- 02
subtitle:   Training YOLO-v3 with Custom Dataset
date:       2020-01-03
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - pytorch
    - object detection
---
# Preface
Recently, our SRDP (Student Researching and Development Project) occurs some problems about how to track multi objectives in one kind and count them. We then try the deep sort network based on YOLO-v3(You Only Look Once) network, however, although YOLO may be tested and deployed on pytorch or other DeepLearning framework, it only support darknet to train.
# Preparation
1. OpenCV. May this [blog](https://blog.csdn.net/OUC_liuxiang/article/details/89476697)  is helpful for you.
2. Custom data for VOC2007. May this [blog]() is helpful for you
3. VOC2007 -> YOLO. May this [blog](https://blog.csdn.net/OUC_liuxiang/article/details/89482062) is helpful for you.

# Deploy
## clone the whole project
> git clone https://github.com/pjreddie/darknet
## modify the configure file
> vim Makefile  
> GPU=1  
> CUDNN=1  
> OPENCV=1  
> NVCC=/usr/local/cuda-8.0/bin/nvcc

Notifying the `NVCC` item, `cuda-8.0` or `cuda-9.0` or `10.0` should be set according your actual state.
## make
Just one commend
> make -j

## download pretrained weight
> wget https://pjreddie.com/media/files/darknet53.conv.74

# Modifying
## cfg/voc.data
> classes= 1  
> train  = /home/liuxiang/darknet/scripts/train.txt  
> valid  = /home/liuxiang/darknet/scripts/2007_test.txt  
> names = /home/liuxiang/darknet/data/voc.names  
> backup = /home/liuxiang/darknet/results/ 


backup is path where the weight store.
## data/voc.name
One row
>holothurian

if you have more than one objects to detect, modifying it is okay.
## cfg/yolov3-voc.cfg
Annotate Testing and its relevant configure rows. Apply Training and its relevant rows. `batches = 64` is not suggest to change, changing `subdivisions` is allowed. If your GPU memory is limited, enlarge it may help you to train. If contrary, reduce it. the picture feed into network each time is $\dfrac{batches}{subdivisions}$

### YOLO layers
Separately at row **608, 692, 776**, change the classes item in YOLO layers as yours, **1** in ours. And Accordingly the filters of convolutional layers before YOLO should also be changed to `filters = (classes + 5) * 3`

# Train
One command
>CUDA_VISIBLE_DEVICES=0 nohup ./darknet detector train cfg/voc.data cfg/yolov3-voc.cfg darknet53.conv.74 -gpus 0 2>&1 >train_yolov3.log &

