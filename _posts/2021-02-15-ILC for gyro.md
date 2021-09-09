---
layout:     post
title:      Iterative learning control for gyro system
subtitle:   Control algorithm for resonant gyroscopes
date:       2021-02-15
author:     OUC_WYC
header-img: img/control.jpg
catalog: true
tags:
    - Algorithm
    - Control
    - MATLAB
    - ILC
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

# 一阶系统迭代学习控制
代码如下：
```MATLAB
clear all;
close all;
clc;

m=40000;    %迭代次数
n=100;      %时间
ss(1:m,1:n)=0;      %同向信号
rr(1:m,1:n)=0;      %正交信号

x1(1:m,1:n)=0;      %状态变量
x2(1:m,1:n)=0; 
x3(1:m,1:n)=0; 

u(1:m,1:n)=0;   %控制输入
ufr(1:m,1:n)=0; %控制输入
y(1:m,1:n)=0;   %模型输出
e(1:m,1:n)=0;   %误差
err(1:m,1:n)=0; %存储误差绝对值

% 设定值为周期信号，给定一个周期的设定值
% for n=1:100
%     y_d(n) = sin(8*(n-1)/50); 
% end

% 设定值为脉冲信号，给定一个周期的设定值
 for n=1:30
     y_d(n) = 0; 
 end
 
  for n=31:60
     y_d(n) = 1; 
  end
 
  for n=61:100
     y_d(n) = 0; 
 end

for k=1:m    
    
     for t=1:n-1   %一阶系统运行一个周期
       ss(k,t+1)=-0.8*ss(k,t)+0.1*u(k,t);
       y(k,t)=ss(k,t);
       e(k,t)=y_d(t)-y(k,t);
       err(k,t)=abs(e(k,t));      
     end
 

    
    for t=1:n-1
        u(k+1,t)=u(k,t)+0.01*e(k,t)+0.2*e(k,t+1);     %PD型学习函数 
        %ufs(k+1,t)=ufs(k,t)+0.3*e(k,t); 
        %ufs(k+1,t)=ufs(k,t)+0.9*e(k,t+1);   
    end
    
    errn(k)=max(err(k,:));

end


figure(1)
set(gcf,'Units','centimeter','Position',[30 0 15 25]);
subplot(311)
plot(y(1,1:n),'-b');hold on;
plot(y(10,1:n));hold on;
plot(y(20,1:n));hold on;
plot(y(300,1:n));hold on;
plot(y_d(1:n),'r--');hold on;
xlabel('time');ylabel('y'); 
 
subplot(312) 
plot(e(3,1:n));
xlabel('time');ylabel('err'); 
%plot(err(12,1:20));hold on
%plot(err(15,1:20));hold on
subplot(313)
plot(1:m,errn(1:m));
xlabel('k');ylabel('max err'); 

```

<br>
<br>

# 二阶系统
替换一阶系统的for循环，代码如下：
```MATLAB
    for t=1:n-1   %二阶系统
      x1(k,t+1)=x2(k,t);
      x2(k,t+1)=-0.5*x1(k,t)-0.1*x2(k,t)+0.5*u(k,t);
      y(k,t)=0.5*x1(k,t)+x2(k,t);
      e(k,t)=y_d(t)-y(k,t);
      err(k,t)=abs(e(k,t));      
    end
```
<br>
<br>



# 结果
红色虚代表设定值（所跟踪的曲线），不同颜色代表每次迭代的结果。
![图片](/img/ILC/一阶系统.png)

一阶系统运行结果

![图片](/img/ILC/二阶系统.png)

二阶系统运行结果