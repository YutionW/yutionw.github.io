---
layout:     post
title:      Series Article of Python Using -- 03
subtitle:   Python实录03 -- concurrent.futures实现多线程/多进程加速           
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

> concurrent.futures.Executor类有子类ThreadPoolExecutor()和ProcessPoolExecutor()分别可实现多线程和多进程加速。
> 由于这部分内容过于重要，我不得不把它们从`Python实录01 -- 汇总一些小知识`中拿出来单独讲。         

python3中concurrent.futures是标准库，在python2需要自己pip install futures。    
使用futures的多线程/多进程处理需要从futures导入线程池处理器和进程池处理器：    
```python    
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor   
```

## 线程池处理器ThreadPoolExecutor( int max_workers)     

用于多线程处理的类`ThreadPoolExecutor`继承自父类`Executor`，用于创建线程池，可以接受一个整型参数`max_workers`，代表创建的最大线程数。参数可以为空，为空则自动创建基于机器cpu核心数的进程数。    

Executor中定义了submit()方法，这个方法的作用是提交一个可执行的回调task,并返回一个future实例。比如在给图片[添加噪声的代码](https://github.com/OUCliuxiang/smartShip2020/blob/main/data/dataReinformance.py)中，定义`main( imgIn)`函数为随机执行五种添加噪声的函数：    
```python    
def main(imgIn):
    if-else:
        ... ... 
    return imgOut    
```     

于是可以：     
```python    
with ThreadPoolExecutor(max_workers=1) as executor:    
    future = executor.submit(main, img)
# submit(func, argvs[])方法接收第一个参数为需要调用的方法（名），      

# 其后的可选参数为func需要传入接收的形参。    

```   
`future`能够使用`done()`方法判断该任务是否结束，`done()`方法是不阻塞的；使用`result()`方法可以获取任务的返回值，这个方法是阻塞的。以上一句话不重要，重要的是`submit(func, argvs[])`方法只能进行单个任务，常用的并发多个任务，需要使用`map`与`as_completed`。     

### map方法      

依然以数据比赛中[图片添加噪声](https://www.ouc-liux.cn/2021/05/07/Series-Article-of-Deep-Learning-01/#%E6%B7%BB%E5%8A%A0%E5%99%AA%E5%A3%B0)部分为例：     
```python    
if __name__ == "__main__":
    img_root = "./data/images/train/"
    txt_root = "./data/labels/train/"
    img_list = os.listdir(img_root)

    # version within zip       

    with concurrent.futures.ThreadPoolExecutor(max_workers) as executor:
        for img, info in zip(img_list, executor.map(func, img_list)):
            print(info)
    
    # version without zip      
    
    with concurrent.futures.ThreadPoolExecutor(max_workers) as executor: 
        executor.map(func, img_list)    
```     
这里有三个需要注意的点：    
1. `map`方法第二个参数应当是列表`list`，列表的长度是`func`被调用的次数，列表的item是每次加入到`func`的参数。特别的，在map中加入到`func`的参数只能是单个，但item可以是高维的。
2. 虽然不是必须，Executor.map()方法往往与zip打包函数配合使用，这样便于打印信息。zip的使用参照[Python实录01](https://www.ouc-liux.cn/2021/05/07/Series-Article-of-Python-Using-01/#python3%E4%B8%AD%E7%9A%84zip%E5%87%BD%E6%95%B0)。     
3. 可以任意指定的`max_workers`，但建议使之不大于cpu核数。     



## 进程池处理器ProcessPoolExecutor( int max_workers)    

调用方法和ThreadPoolExecutor()一致，需要注意的有两点：    
1. 调用过程一定要在`__name__=="__main__:"`内部。     
2. 对于CPU频繁的操作（方法、函数），ProcessPoolExecutor的效率更高。这是由于GIL锁的存在使得多个线程只能调用一个cpu，GIL锁此处不展开。