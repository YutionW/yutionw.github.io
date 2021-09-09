---
layout:     post
title:      Series Article of RasPi -- 02
subtitle:   树莓派使用实录02 -- NCS2神经计算棒配置              
date:       2021-07-28
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - RasPi   
---     

依照 OpenVino 官网关于 [OpenVino for Raspbian OS](https://docs.openvinotoolkit.org/latest/openvino_docs_install_guides_installing_openvino_raspbian.html) 的文档进行安装配置。    

### 准备工作    
在[官方仓库](https://storage.openvinotoolkit.org/repositories/openvino/packages/)下载工具包，用于 raspberryPI 的工具包是这种形式：    
l_openvino_toolkit_runtime_raspbian_p_\<version\>.tgz       

进入树莓派系统，解压缩工具压缩包并安装 cmake ：    
```shell
$ tar -xf l_openvino_toolkit_runtime_raspbian_p_<version>.tgz    
$ sudo apt-get install cmake      
```     

### 配置环境路径并配置 usb 规则     
执行以下命令，自动对 `setupvars.sh` 文件做修改并运行：     
```shell   
$ sed -i "s|<INSTALLDIR>|$(pwd)/l_openvino_toolkit_runtime_raspbian_p_2019.3.334|"       
l_openvino_toolkit_runtime_raspbian_p_2019.3.334/bin/setupvars.sh     
```

编辑 `~/.bashrc`，在最后一行加入下方内容并执行 `source ~/.bashrc` 或重启 terminal 将 setupvars.sh 加入永久配置环境：     
```
source /home/pi/Downloads/l_openvino_toolkit_runtime_raspbian_p_2019.3.334/bin/setupvars.sh
```        

成功配置的标志是新打开的 terminal 会自动打印出以下内容：     
```    
[setupvars.sh] OpenVINO environment initialized
```    

使用以下命令将当前的 Linux 用户添加到该 users 组：     
```shell     
$ sudo usermod -a -G users "$(whoami)"     
```    
执行以下命令配置 usb 规则：     
```shell     
$ sh l_openvino_toolkit_runtime_raspbian_p_2019.3.334/install_dependencies/install_NCS_udev_rules.sh
```     

此时可以调用 NCS2 进行计算。     
