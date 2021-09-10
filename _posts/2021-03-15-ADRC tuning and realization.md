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

本文涉及LADRC的实现和调参，主要参考高志强老师的两篇著作。

[1] Gao, Zhiqiang. "[Scaling and bandwidth-parameterization based controller tuning](https://academic.csuohio.edu/cact/ACC03_ISA0030Final.pdf)." Proceedings of the American control conference. Vol. 6. 2006.

[2] Chen, Xing, et al. "[Tuning method for second-order active disturbance rejection control](https://ieeexplore.ieee.org/abstract/document/6001154)." Proceedings of the 30th Chinese control conference. IEEE, 2011.

ADRC is evolved from PID algorithm, which adopts the core concept of PID error feedback control. It has been proved to be an effective solution in system control and disturbance/uncertainty estimation \cite{li2020active,khaled2020dynamic}. The ESO (extended state observer) has an extended state to track the combination of unknown parts of internal dynamics and unknown external disturbances, i.e. generalized disturbances $f$. It is composed of three outputs $z_1$, $z_2$, $z_3$ and three observer parameters $\beta_1$, $\beta_2$, $\beta_3$, which are expressed as: 
\begin{equation}
\left\{
\begin{aligned}
\dot{z}_{1}&=z_{2}+\beta_{1}\left(y-z_{1}\right) \\
\dot{z}_{2}&=z_{3}+\beta_{2}\left(y-z_{1}\right)+B u \\
\dot{z}_{3}&=\beta_{3}\left(y-z_{1}\right)
\end{aligned}
\right.
\end{equation}

When the parameters are well tuned, the three observer parameters track $y$, $\dot{y}$ and generalized disturbances $f$ respectively. Terms of $K_P$, $K_D$, and $B$ represent the controller parameters, and the control law is written as:
\begin{equation}
\begin{aligned}
u_{0}&=K_{P}\left(y_{s p}-z_{1}\right)-K_{D} z_{2} \\
u&=\left(u_{0}-z_{3}\right) / B
\end{aligned}
\end{equation}
where $y_{sp}$ is the set point of the response output. $B$ needs to be selected to weigh the stability and response speed of the closed-loop system. We use the popular parameter tuning method proposed by Gao \cite{li2020active} to conduct experiments.
\begin{itemize}
  \item [a)] Get the desired settling time $t_s$.
  \item [b)] Let $\omega_c=10/t_s$, $K_P=\omega_c^2$ and $K_D=2\omega_c$.
  \item [c)] Let $\omega_o=4\omega_o$, $\beta_1=3\omega_o$, $\beta_2=3\omega_o^2$ and $\beta_3=\omega_o^3$.
  \item [d)] Increase $B$ gradually until the dynamic performance is satisfactory.
\end{itemize}