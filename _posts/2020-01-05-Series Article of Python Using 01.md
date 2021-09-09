---
layout:     post
title:      Series Article of Python Using -- 01
subtitle:   Python实录01 -- 汇总一些小知识         
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

> 记录一些python编程过程中的一些有用的小知识、小技巧，零零散散，想起来就添一点儿。     


## 判断文件是否为空     

`line = f.readline()`之后判断`line`是否存在，比如现在的任务是剔除一组文件里没有内容的项：     
```python     
for file in fileList:    
    with open(file) as f:    
        line = f.readline()
        if not line:     
            os.remove(filePath)
```   

## 调用系统命令     

```python    
import os 
os.system("system cmd")    
```   

## python标准错误输出   

```python
import sys
sys.stderr.write(string)
# 打印至命令行
```


## np.ndarray指定值类型     

以任何方法产生或转换`np.array()`数组的时候，建议指定数组数据类型。如建造适用于图像的零数组：    
```python   
imgOut = np.zeros(imgIn.shape, dtype=np.uint8)
```    
转换适用于np操作的浮点数组：     
```python    
imgOut = np.array(imgIn/255., dtype=np.float)
```    
如果需要，也可以建造时不指定，而在使用时另行转换：    
```python    
imgOut = np.uint8(imgOut*255)     
```    

## numpy生成高斯噪声      

```python    
np.random.normal(mean, std, shape)
```    
如果是用于给图像加噪声，则图像以np.array表示为imgArr后，各参数可有：    
`mean = imgArr.mean()`；     
`std = imgArr.std()`；     
`shape = imgArr.shape`。     


## numpy限定数组的值范围      

图像作为数组执行加噪声操作后，值可能会突破0--255，使用`uint8`类型会报错。此时需要将值强制限定在0--255的范围。     
```python    
imgOut = np.clip(imgOut, 0.0, 1.0)    
# 这里是因为前面将图像数组转换成浮点类型方便添加高斯噪声，     
# clip函数的min, max 参数可以是浮点或整型。     
```   


## concurrent.futures 并发加速     

本部分内容较多较重要，在[Python实录03](https://www.ouc-liux.cn/2021/05/07/Series-Article-of-Python-Using-03/)中详细展开。



## numba加速    

`numba`对带循环的方法的处理有奇效，往往可达到几十甚至上百倍的加速。使用也很简单，通过`import numba as nb`导入`nb.jit`修饰器，并通过函数定义上一行添加`@jit`标记使用该修饰器的函数。比如给图片添加椒盐噪声的代码：     
```python    
@nb.jit()
def pepperSalt(imgIn):
    imgOut = np.zeros(imgIn.shape, np.uint8)
    for i in range(imgIn.shape[0]):
        for j in range(imgIn.shape[1]):
            for k in range(imgIn.shape[2]):
                rdn = np.random.random()
                if rdn < 0.025:
                    imgOut[i][j][k] = 0
                elif rdn > 0.975:
                    imgOut[i][j][k] = 255
                else:
                    imgOut[i][j][k] = imgIn[i][j][k]
    return imgOut
```   


有三个需要注意的点：    
1. **@jit只能修饰显示定义的函数，而不能修饰某几条语句或lambda函数。**     
2. **Numba对处理循环有奇效，非循环语句则无法实现较强的加速。**      
3. **Numba只支持了Python原生函数和部分NumPy函数，** 对如opencv等其他库函数则无法加速，会报warning甚至error。     



## python3中的zip()函数     

zip() 函数用于将可迭代的对象作为参数，将对象中对应的元素打包成一个个元组，然后返回由这些元组组成的列表。    
在 python 3 中为了减少内存，zip() 返回的是一个对象。如需展示列表，需手动 list() 转换。


```bash    
>>> a = [1,2,3]
>>> b = [4,5,6]
>>> c = [4,5,6,7,8]
>>> zipped = zip(a,b)     # 打包为元组的列表      


>>> print(zipped)         
<zip at zip at 0x......>  # 返回一串地址，由于zip的返回值是一个对象      


>>> print(*zipped)      
(1, 4) (2, 5) (3, 6)      # 返回打包的值，非列表形式。    


# 注意，由于已经通过*符号将zipped的值提取出来了，zipped对应的地址内容现在为空    


>>> print(list(zipped))     
[]                          # zipped已空     


>>> zipped = zip(a,c)              # 元素个数与最短的列表一致    


>>> print(list(zipped))     
[(1, 4), (2, 5), (3, 6)]            # 返回列表     


# 注意，由于已经通过list将zipped的值提取出来了，zipped对应的地址内容现在为空


>>> print(*zipped)     
None                          # zipped已空     


>>>     
```    

## numpy 和 torch 中的 zeros_like      

`zeros_like( array/tensor)` 函数 like 的不只有原 array/tensor 的 shape， type 也会 like。此处一定要注意。   
如果需要一个特定数据元素构成的 array 或 tensor ，如 float 类型的 tensor: ft 转 int8 类型，应当使用 `ft = ft.to(torch.int8)` 类似语句加以指定和转换。     

