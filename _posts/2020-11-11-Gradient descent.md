---
layout:     post
title:      Gradient descent -  
subtitle:   resonant gyroscope parameter identification
date:       2020-11-11
author:     OUC_WYC
header-img: img/identification.jpg
catalog: true
tags:
    - Algorithm
    - System identification
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

```
clear;

DriveAmp=100;   %激励信号幅值100mV
A=1;
B=10*2*pi;
FreOmega=0;
SigAmp=0;
Gdata = [];

for i=1:20
    FreOmega=(i*0.5+10)*2*pi;                   % 频率×2π得到角频率
    SigAmp=A./(sqrt(FreOmega.*FreOmega+(B)^2)); %计算幅值
    Gdata(i,1)=FreOmega;                        %存储角频率
    Gdata(i,2)=SigAmp*2*DriveAmp;               %存储幅值
    Gdata(i,3)=(i*0.5+10);                      %存储频率
end
```

