---
layout:     post
title:      Series Article of RasPi -- 01
subtitle:   树莓派使用实录01 -- 系统烧写和开机配置         
date:       2021-07-27
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - RasPi   
---     

## 系统烧写     

1. 下载烧写软件。
   在树莓派[官网](https://www.raspberrypi.org/software/)下载相应系统的烧写软件，我的工作主机是 ubuntu 系统，就以 [Imager for Ubuntu](https://downloads.raspberrypi.org/imager/imager_latest_amd64.deb) 进行介绍。    
   如果是树莓派系统，应当通过包管理器 `apt` 下载安装：    
   ```shell    
   $ sudo apt-get install rpi-imager
   ```     

2. 下载系统镜像。
   在树莓派[官网](https://www.raspberrypi.org/software/operating-systems/#raspberry-pi-os-32-bit)下载镜像，推荐 [Raspberry Pi OS with desktop](https://downloads.raspberrypi.org/raspios_armhf/images/raspios_armhf-2021-05-28/2021-05-07-raspios-buster-armhf.zip) 这个镜像，因为有图形界面，可以防不时之需。    
   然后 `sudo dpkg -i xxx` 安装即可。     

3. 烧写镜像到sd卡。     
   ```shell    
   $ rpi-imager
   ```    
   启动软件，当然将软件加到 dock 上最好了。界面如下：   
   <div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/raspi/raspi01.png"></div>    
   然后选择 sd 卡， 选择镜像。
   <div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/raspi/raspi02.png"></div>
   <div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/raspi/raspi03.png"></div>    

   镜像一定要从 `Use custom` 这一项中，选择下载好的镜像，如果选择 第一项 Raspberry Pi OS (32-bit) 这一项，会重新从网络下载，但下载源不在大陆，在墙外面，下载过程很费时间的。    
   点击 Write，输入 sudo 密码即可。大概等待十几分钟吧。    


## 无屏幕配置wifi 和 ssh 
资深 linux 用户不习惯使用桌面，于是此处介绍如何在无桌面的情况下配置 wifi 和 ssh 远程连接。     
烧写完镜像后不要拔出 sd 卡，进入卡的 `boot` 路径，如果是 windows 机器，应该只能找到一个分区，那就是 `boot`。 建立文件 `wpa_supplicant.conf` 并写入以下内容：     
```conf
country=CN 
ctrl_interface=DIR=/var/run/wpa_supplicant 
GROUP=netdev 
update_config=1 
network={ 
    ssid="wifi ssid" 
    psk="password" 
    key_mgmt=WPA-PSK
    priority=1 }
```     

仍然是 `boot` 路径下，生成一个空的 ssh 文件：    
```shell    
$ touch ssh
```    
注意，没有任何格式。该文件在树莓派开机后就会消失。    

装载 sd 卡到树莓派，开机。之后树莓派开机都会默认连接到设置好的 wifi 并开启SSH服务。   


## apt 换清华源    

```shell    
$ sudo nano /etc/apt/sources.list    
```
注释掉默认源，添加下面两行：    
```
deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main non-free contrib
deb-src http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ buster main non-free contrib
```
`ctrl + o` 保存， `ctrl + x` 关闭。     
此处可选的还有阿里云的源：     
```
deb http://mirrors.aliyun.com/raspbian/raspbian/ buster main contrib non-free rpi     
deb-src http://mirrors.aliyun.com/raspbian/raspbian/ buster main contrib non-free rpi      
```    

```shell    
$ sudo nano /etc/apt/sources.list.d/raspi.list
```
注释掉原有内容，替换为以下项：     
```
deb http://mirrors.tuna.tsinghua.edu.cn/raspberrypi/ buster main ui   
deb-src http://mirrors.tuna.tsinghua.edu.cn/raspberrypi/ buster main ui    
```     
最后
```shell    
sudo apt-get update
```
更新源。   


## 修改默认 python 路径及 pip 换源    
树莓派4B 默认安装了 Python2 以及 Python3 。首先查看默认 Python 版本：      
`python --version`     
查看安装的python路径:      
`whereis python`       
查看python默认链接的路径:      
`which python`     
删除原来python链接文件:    
`sudo rm /usr/bin/python`      
建立新的python链接指向:     
`sudo ln -s /usr/bin/python3.7 /usr/bin/python`      
把路径/usr/bin加入环境变量中:     
`PATH=/usr/bin:$PATH`      
重新打开 terminal 或 `source ~/.bashrc` 查看python版本。      


一行命令将 pip 换为清华源：      
```bash     
$ pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

## 超频升压    

树莓派4b 默认 cpu 频率为 700MHz，但允许超频至 2GHz。标准电压同理。    
先升级了固件和操作系统：
```shell    
sudo rpi-update
sudo apt dist-upgrade
```    
然后，以root用户（sudo）编辑 /boot /config.txt 文件，添加以下代码：     
```shell   
force_turbo=0
arm_freq=2000
over_voltage=6
```    
意思既是将最大频率提升到2.0 GHz，将最高电压提升 6*0.025 伏特。     

`force_turbo` 这一项如果置 1，虽然允许进一步提升电压，但会改变芯片中的保险结构。既有可能导致板子损坏。    


## 系统配置     

ssh 进入 raspi 系统，键入命令：`sudo raspi-config` 进入树莓派系统配置界面，使用方向键 $\uparrow\downarrow\leftarrow\rightarrow$控制 （方向键语法见博客 [一些Markdown语法记录](https://www.ouc-liux.cn/2021/04/27/Markdown-Grammar/)）。      
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/raspi/raspi04.png"></div>      

RasPi3 和 RasPi4有些许不同，但也只是列表顺序和包含关系的改变。如果和博客图片有不同的话，仔细找找，能找到需要的项。     

### Change User Password      
按照里面的要求修改成自己的密码即可。默认用户名为pi，默认密码为raspberry(第一次开机已设置过的无需再次修改)。    
这个密码会用于远程ssh登陆、VNC远程桌面及需要管理员root权限时输入。    
密码在第一次开机时应该已经设置过，无需再次修改。     
 
### Interfacing Options      
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/raspi/raspi05.png"></div>        

打开 Camera、SSH、VNC、Serial、Remote GPIO， 这几个功能都是我们在以后会用到的功能。     

* Camera：摄像头      
* SSH：ssh远程通信与登陆      
* VNC：VNC远程桌面登陆      
* Serial：串口控制      
* Remote GPIO：远程GPIO引脚控制      
  
### Advanced Options      
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/raspi/raspi06.png"></div>        
 
* 选择Expand Filesystem，将根目录扩展到这个SD卡，充分利用SD卡的存储空间    
* 选择Overscan，在整个屏幕上显示    
* 选择Audio，选择Force 3.5mm(‘headphone’ jack)，树莓派的声音会从耳机孔输出     
* 选择Resolution，选择默认设置，自动根据显示屏调整分辨率     
     
其他项无需修改，保持默认即可，设置完成后返回选择Finish，会跳出对话框问是否重新启动，可以直接回车确定重启，也可以等下次启动时候生效。

