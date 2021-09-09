---
layout:     post
title:      Series Article of Deep Learning -- 03
subtitle:   目标检测03 -- yolov5 中的 tensor 切片操作报错问题     
date:       2021-07-05
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - pytorch
    - object detection
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

> u版yolov5有一个检测框定位转换函数，某些特殊情况下会抛出 senmentation fault 错误。
> 经时隔三个月后的再次验证，bug 没有复现，怀疑该 bug 和pytorch 版本有关。   

定位在 yolov5/utils/general.py 中的 `xyxy2xywh(x)` 和 `xywh2xyxy(x)` 两函数：    
```python     
def xyxy2xywh(x):
    # Convert nx4 boxes from [x1, y1, x2, y2] to [x, y, w, h] where xy1=top-left, xy2=bottom-right
    y = torch.zeros_like(x) if isinstance(x, torch.Tensor) else np.zeros_like(x)
    y[:, 0] = (x[:, 0] + x[:, 2]) / 2  # x center
    y[:, 1] = (x[:, 1] + x[:, 3]) / 2  # y center
    y[:, 2] = x[:, 2] - x[:, 0]  # width
    y[:, 3] = x[:, 3] - x[:, 1]  # height
    return y


def xywh2xyxy(x):
    # Convert nx4 boxes from [x, y, w, h] to [x1, y1, x2, y2] where xy1=top-left, xy2=bottom-right
    y = torch.zeros_like(x) if isinstance(x, torch.Tensor) else np.zeros_like(x)
    y[:, 0] = x[:, 0] - x[:, 2] / 2  # top left x
    y[:, 1] = x[:, 1] - x[:, 3] / 2  # top left y
    y[:, 2] = x[:, 0] + x[:, 2] / 2  # bottom right x
    y[:, 3] = x[:, 1] + x[:, 3] / 2  # bottom right y
    return y
```      

这是两个坐标点转换的函数，一个中心点转角点，一个角点转中心点。显然两个函数处理的是二维 tensor 。tensor 的第一维长度 shape[0] 无法确定，代表着本次一共送进来多少个待处理（待转换）的bounding box，第二个维度则有固定的 shape[1] = 4 。问题出在第一个维度 shape[0] 上。      
由于函数使用了 tensor[:,index] 语法的切片操作，**某些情况下**，当 tensor 只有一行，也即 shape[0] == 1 时，会抛出 senmentation fault 错误。比如 `tensor([[1,2,3,4], [3,4,5,6]])` 是没有问题的，但 `tensor([[5,6,7,8]])` 会抛出异常。    
问题出现的时候采用了原始 tensor 数据 `x.numpy()` 转 numpy.ndarray 处理，处理完后再 `return torch.from_numpy(y)` 转回 tensor 的方式。    


但是！今天，2021年7月8号，分别在个人 ubuntu1804LTS desktop 和 服务器 ubuntu1804LTS server + torch1.5.1 / torch1.7.1 / torch1.8.1+cu11 环境下进行了复现实验，无论使用cpu 还是 cuda ，问题都没有再次出现。     
靠。     

先记下来，反正肯定是有个 bug 的，万一再次不经意间遇到，知道怎么处理。    