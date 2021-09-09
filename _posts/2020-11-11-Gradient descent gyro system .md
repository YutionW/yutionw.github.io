---
layout:     post
title:      Gradient descent for gyro system
subtitle:   Resonant gyroscope parameter identification
date:       2020-11-11
author:     OUC_WYC
header-img: img/identification.jpg
catalog: true
tags:
    - Algorithm
    - System identification
    - MATLAB
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

# 造数据
首先采用一阶模型造一组陀螺输出数据的真值，代码如下：
```MATLAB
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

<br>
<br>

# 参数辨识
随后采用梯度下降的方法进行系统辨识，代码如下：
```MATLAB
close all;

x_data=Gdata(:,1)';    %频率
y_data=Gdata(:,2)';    %幅值

%形如 y=u/ ( sqrt(x^2+w^2) )
%形如 y=A/ ( sqrt(x^2+B^2) )
u= 201;
w= 63;
%随便给个初始值
plot(x_data,y_data,'r.');
hold on;

u_lr = 10;  %u学习率learn rate
w_lr = 2;   %w学习率learn rate
iteration = 10000;  %迭代次数
loss_history = [];


for i=1:iteration
    
    l_result = 0.0;
    for n=1:length(x_data)  %均方误差
        l_result=l_result + ( y_data(n)-( u/ ( sqrt(x_data(n)^2+w^2) ) ) )^2;
    end
    
    loss_history(i,1)=l_result; %储存每次的l_result
    loss_history(i,2)=u;        %储存每次的u
    loss_history(i,3)=w;        %储存每次的w
    
    u_grade=0.0;
    w_grade=0.0;
    for n=1:length(x_data)
        C=1 / ( sqrt(x_data(n)^2+w^2) );
        u_grade = u_grade + (u*C - y_data(n))*C;
        w_grade = w_grade - (u*C - y_data(n))*(u*w*C^3);
    end
    
    u = u - u_lr*u_grade;   %向最小值移动
    w = w - w_lr*w_grade;   %向最小值移动 
end

u
w

x_ex=0:1:x_data(1)+x_data(length(x_data))+1;
y_ex=u./ ( sqrt(x_ex.^2+w^2) );

plot(x_ex,y_ex);
ylabel('增益');
xlabel('频率 弧度');
grid on;

figure;
plotx=loss_history(:,2)';
ploty=loss_history(:,3)';
plotz=loss_history(:,1)';
plot3(plotx,ploty,plotz);
xlabel('增益');
ylabel('频率 弧度');
zlabel('均方误差');

grid on;
```
<br>
<br>

# 结果
![图片](/img/GradientDescent/FirstOrderDescentProcess.png)

一阶系统梯度下降过程

![图片](/img/GradientDescent/FirstOrderResult.png)

一阶系统拟合结果