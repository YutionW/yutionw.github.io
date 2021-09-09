---
layout:     post
title:      Series Article of RasPi -- 03
subtitle:   树莓派使用实录03 -- NCS2部署yolov5模型              
date:       2021-07-30
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - RasPi   
    - pytorch    
    - object detection    
---     

> 这是按照2021年4月份实践经验整理出来的博客，由于 pytorch, yolov5, openvino 等版本的更新，现在可能已经不适用。但如果遇到问题，那问题形式应该也大差不差。        


首先，备好两个pytorch(gpu) 版本，一个应当是 1.7.1 以上，用来执行 yolov5 网络训练与推理测试。一个 1.5 以下版本，这是由于高版本 torch 似乎会在安装（使用） onnx 的过程中出现问题。       

## 修改模型文件      

由于YOLOv5的许多算子openvino仍然不支持，因此我们需要做出几点修改。主要是将所有的激活函数（ `Hardswish`， `swish`， `Mish`等）全部替换为 `ReLU` 或 `LeakyReLU`，为避免遗漏，建议使用 grep 搜索。       

参照 [grep 文本搜索和 sed 文本替换](https://www.ouc-liux.cn/2021/07/21/Series-Article-of-UbuntuOS-09/)，使用 `grep "act" *.py -n` 对2021年3月份的 yolov5/models 子路径进行激活函数检索，发现有如下地方需要修改：    
1. `common.py`:line:40;       
2. `common.py`:line:89;        
3. `export.py`:line:47;      

而依照 CSDN 上的[【玩转YOLOv5】YOLOv5转openvino并进行部署](https://blog.csdn.net/weixin_44936889/article/details/110940322) 这篇博客，更老一个版本的 yolov5 有如下地方需要修改：      
1. models/yolo.py：      
   ```python    
   self.act = nn.Hardswish() if act else nn.Identity() # 删掉，修改为：        

   self.act = nn.LeakyReLU(0.1, inplace=True) if act else nn.Identity()         
   ```     

2. models/export.py       
   ```python      
   if isinstance(m, models.common.Conv) and isinstance(m.act, nn.Hardswish):       

            m.act = Hardswish()          
    
    #  删掉，修改为：       

    if isinstance(m, models.common.Conv) and isinstance(m.act, nn.LeakyReLU):      

            m.act = LeakyReLU()      
            
    ```              