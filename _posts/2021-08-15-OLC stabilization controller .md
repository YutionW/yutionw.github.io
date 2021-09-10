---
layout:     post
title:      Online learning control for gyro system
subtitle:   A novel and efficient control algorithm  
date:       2021-08-15
author:     OUC_WYC
header-img: img/control.jpg
catalog: true
tags:
    - Algorithm
    - Control
    - Experiment
    - OLC
---

<head>
    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript"></script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({
            tex2jax: {
            skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
            inlineMath: [['$','$']]
            }
        });
    </script>
</head>     

# OLC
OLC算法由张承玺博士提出，是一种简单易用的控制算法，具有一定的工程实践意义。

> Compared with the conventional control design, an obvious distinction of the online-learning control (OLC) algorithm is that it together utilizes the previous control input information and the system's current state information, as if learning experience from previous control input. In contrast, the conventional control scheme does not fully use the existing information and chooses to discard the previous control input information when generating control instructions. Due to the learning strategy, the utility of adaptive- or observer-based tools can be avoided when designing a robust control law, making a simple, effective algorithm, moreover saving system resources.
 

本文参考首次提出OLC算法的论文[On low-complexity control design to spacecraft attitude stabilization: An online-learning approach](https://www.sciencedirect.com/science/article/pii/S1270963820311238)，对谐振式陀螺系统进行了实验。本次实验结果反映了OLC准确度高、噪声摆幅小的特点。

<br>
<br>



# 陀螺输出
## 未解调信号
模态A作为陀螺的驱动模态，模态B作为陀螺的敏感模态，分别采用OLC和NON-OLC产生控制输入施加在模态A上。
![图片](/img/OLC-C/OLC-OSC.jpg)
<center>OLC方法下的输出</center>

<br>

![图片](/img/OLC-C/NON-OLC-OSC.jpg)
<center>NON-OLC方法下的输出</center>

<br>

NON-OLC的波形存在明显的锯齿现象，平滑程度不及OLC的波形。

<br>

## 解调后信号
观察解调后的信号可以对两种方法进行直观对比。
![图片](/img/OLC-C/OLC.png)
<center>OLC方法下的两模态输出</center>

<br>

![图片](/img/OLC-C/NON-OLC.png)
<center>NON-OLC方法下的两模态输出</center>

<br>

在OLC的结果中，模态SA的摆幅约为0.4mv，模态SB的摆幅约为0.6mv。反观NON-OLC的结果，模态SA的摆幅约为1.2mv，模态SB的摆幅约为1.6mv。