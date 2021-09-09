---
layout:     post
title:      Series Article of Python Using -- 02
subtitle:   Python实录02 -- 汇总python-opencv知识        
date:       2021-05-07
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - python   
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

> 记录一些python-opencv使用过程中一些有用的小知识、小技巧，零零散散，想起来就添一点儿。     

## cv.imread()的返回值       

1. cv.imread()返回值类型为`uint8`的数组，也就是其读取图像的像素值为0--255之间的整型。    
2. cv.imread()返回的三维张量shape为[高度，宽度，通道]。      


## cv.resize()图像尺寸缩放      
```python    
cv.resize(src, dsize[, dst[, fx[, fy[, interpolation]]]])
```    
|参数|描述|
|:---|:---|
|src|【必】原图像|
|dsize|【必】输出图像大小|
|fx|【可】水平方向缩放因子|
|fy|【可】竖直方向缩放印子|
|interpolation|【可】差值方式|
|返回值|与输入同类型的图像张量|

差值方式`interpolation`可指定如下几种：     
|方法名|含义|
|:---|:---|
|cv.INTER_NEAREST|最近邻差值|
|cv.INTER_LINEAR|线性插值|
|cv.INTER_CUBIC|双线性插值|
|cv.INTER_AREA|使用像素区域关系重新采样。它可能是图像抽取的首选方法，因为它可以提供无莫尔条纹的结果。但是当图像被缩放时，它类似于INTER_NEAREST方法。|

有几个需要注意的点：   
1. cv.imread()读取的图像通过`.shape`提取长宽信息，`shape[0]`是高，`shape[1]`是宽。所以`dsize`参数不能直接指定为`oriImg.shape`，而需要提取原图像宽高组成新的`newSize = (height, width)`，作为参数。    
2. 如果使用缩放因子参数`fx, fy`，而不是`dsize`指定新图像的宽高，需要给第二个参数一个`None`值。    
3. 面临大量图像的时候，插值方式选最近邻`cv.INTER_NEAREST`，快。     

## cv.waitKey(delay)的使用和作用    

使用`cv.imshow('windowName', img)`显示图片的时候，如果不加`cv.waitKey()`，则会有窗口一闪即逝，并不停留。于是需要使用`cv.waitKey()`保留窗口显示在屏幕上。    

### case 1：      

```python    
cv.imshow('windowName', img)
cv.waitKay()   
```   
图片一直显示，直到按下任意一个键退出显示。     

### case 2：    

```python    
cv.imshow('windowName', img)    
cv.waitKey(1000)
```    
图片显示一秒后自动退出，如果期间按下任意一个键，也会退出显示。    

### case 3：    

```python     
sucess, frame = cap.read()
while sucess:    
    cv.imshow('windowName', frame)     
    sucess, frame = cap.read()     
```    
直观上的表现是不显示，实际上是显示了，但没有完全显示，一闪即过。    

### case 4：     

```python    
sucess, frame = cap.read()    
while True:    
    cv.imshow('windowName', frame)   
    cv.waitKey(n)   # n's integer type,  and expected to be small.   
    sucess, frame = cap.read()    
```   
显示，但一直显示，只能在终端ctrl+A强制中断。     

### case 5：     

```python     
sucess, frame = cap.read()     
while True:     
    cv.imshow('windowName', frame)     
    if cv.waitKey(1) & 0xFF == ord('q'):    
        break;
    sucess, frame = cap.read()    
```     
显示，指导终端检测到`q`键被按下，退出循环。    