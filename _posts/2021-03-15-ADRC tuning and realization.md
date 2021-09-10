---
layout:     post
title:      Tuning and realization for ADRC
subtitle:   Linear Active Disturbance Rejection Control 
date:       2021-03-15
author:     OUC_WYC
header-img: img/control.jpg
catalog: true
tags:
    - Algorithm
    - Control
    - C
    - ADRC
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

# ADRC

本文涉及LADRC的实现和调参，但不涉及安排过渡过程的内容，主要参考高志强老师的两篇著作。

[1] Gao, Zhiqiang. "[Scaling and bandwidth-parameterization based controller tuning](https://academic.csuohio.edu/cact/ACC03_ISA0030Final.pdf)." Proceedings of the American control conference. Vol. 6. 2006.

[2] Chen, Xing, et al. "[Tuning method for second-order active disturbance rejection control](https://ieeexplore.ieee.org/abstract/document/6001154)." Proceedings of the 30th Chinese control conference. IEEE, 2011.

ADRC继承了PID的核心思想——反馈控制，并在此基础上发展而来。其主要特点是，把外部干扰和模型不确定性统一视为广义干扰，并通过ESO(扩张状态观测器)的三个状态$z_1$, $z_2$, $z_3$进行实时追踪，在此过程中调整三个观测器的参数$\beta_1$, $\beta_2$, $\beta_3$，可以达到良好的观测效果。ADRC根据观测器得到的广义干扰观测结果，来调整控制输入可以实现自抗扰的控制效果。

Ps.下面这段是从自己以前的作品中巴拉出来的，懒得翻译了，这段写的文字比较简单，应该都能看懂
$$
\begin{cases}
%\begin{aligned}
\dot{z}_{1}&=z_{2}+\beta_{1}\left(y-z_{1}\right) \\
\dot{z}_{2}&=z_{3}+\beta_{2}\left(y-z_{1}\right)+B u \\
\dot{z}_{3}&=\beta_{3}\left(y-z_{1}\right)
%\end{aligned}
\end{cases}
$$
When the parameters are well tuned, the three observer parameters track $y$, $\dot{y}$ and generalized disturbances $f$ respectively. Terms of $K_P$, $K_D$, and $B$ represent the controller parameters, and the control law is written as:
$$
\begin{cases}
%\begin{aligned}
u_{0}&=K_{P}\left(y_{s p}-z_{1}\right)-K_{D} z_{2} \\
u&=\left(u_{0}-z_{3}\right) / B
%\end{aligned}
\end{cases}
$$
where $y_{sp}$ is the set point of the response output. $B$ needs to be selected to weigh the stability and response speed of the closed-loop system. We use the popular parameter tuning method proposed by Gao to conduct experiments.

> a) Get the desired settling time $t_s$.
> 
> b) Let $\omega_c=10/t_s$, $K_P=\omega_c^2$ and $K_D=2\omega_c$.
> 
> c) Let $\omega_o=4\omega_o$, $\beta_1=3\omega_o$, $\beta_2=3\omega_o^2$ and $\beta_3=\omega_o^3$.
> 
> d) Increase $B$ gradually until the dynamic performance is satisfactory.

<br>
<br>

# C语言实现
ADRC目前还是用在嵌入式系统里面比较多一些，所以在此给出C语言的实现。由于代码比较简单，也可以按照伪代码的逻辑来理解。将如下代码写入嵌入式系统的死循环中：
```c
Error = y - Z1;

Z1 += H * (Z2 + Beta1 * Error);
Z2 += H * (Z3 + Beta2 * Error + B * u * H2);
Z3 += H * (Beta3 * Error);

u = (Kp * (ysp - Z1) - Kd * Z2 - Z3) / (B * H2);

if (u > Range_MAX)    u = Range_MAX;
if (u < Range_MIN)    u = Range_MIN;
```
思路：
1. y定义为传感器采集到的对象输出
2. Error定义为y与观测器状态z1的差值，不是PID中的反馈误差
3. 