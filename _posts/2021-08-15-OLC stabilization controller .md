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
    - C
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
OLC算法由张承玺博士提出，本文主要参考其首次提出OLC算法的论文[On low-complexity control design to spacecraft attitude stabilization: An online-learning approach](https://www.sciencedirect.com/science/article/pii/S1270963820311238)。

> Compared with the conventional control design, an obvious distinction of the online-learning control (OLC) algorithm is that it together utilizes the previous control input information and the system's current state information, as if learning experience from previous control input. In contrast, the conventional control scheme does not fully use the existing information and chooses to discard the previous control input information when generating control instructions. Due to the learning strategy, the utility of adaptive- or observer-based tools can be avoided when designing a robust control law, making a simple, effective algorithm, moreover saving system resources.

OLC是一种简单易用的控制算法，具有一定的工程实践意义。本次实验结果反映了OLC准确度高、噪声摆幅小的特点。

<br>
<br>



# 谐振陀螺实验
模态A作为陀螺的驱动模态，模态B作为陀螺的敏感模态，分别采用OLC和NON-OLC产生控制输入施加在模态A上，
![图片](/img/OLC-C/OLC.png)
<center>OLC方法下的两模态输出</center>
<br>

放大看细节不难发现，OLC的优势相比于NON-OLC还是很明显的，不管是从超调情况，还是噪声摆幅方面。
![图片](/img/OLC-C/NON-OLC.png)
<center>NON-OLC方法下的两模态输出</center>