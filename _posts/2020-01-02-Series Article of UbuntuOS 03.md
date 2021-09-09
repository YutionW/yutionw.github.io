---
layout:     post
title:      Series Articles of Ubuntu OS usage -- 03
subtitle:   Ubuntu16.04LTS下teamviewer14反馈商业用途的解决办法
date:       2020-01-03
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Ubuntu OS
---
# 整体流程
1. 卸载当前teamviewer
2. 修改网卡MAC地址
3. 保存当前MAC信息到ethernet配置
4. 重装 teamviewer
 
## 修改MAC地址前的准备
1. 查看物理网卡信息
    `ifconfig` 用以打印网络信息;
    其中物理地址和ethernet相同的网卡为当前使用无线网卡，本机为enp3s0 
2. MAC 的广播单播和组播机制
    2.1 广播机制仅广播地址 FF:FF:FF:FF:FF
    2.2 组播机制第一节尾比特为1, 如B3:FF:FF:E2:EA, 应当避免组播地址。
    2.3 单播机制为PC机修改MAC需要的方式，第一节尾比特应当为0，如 B4:F4:A0:9C:D4
    
## 卸载teamviewer
`apt-get purge teamviewer`
但是无需`autoremove`
## 修改MAC 地址的两种方法和注意事项
### 临时修改MAC地址
关闭网卡:  `sudo /sbin/ifconfig enp3s0 down`
修改MAC: `sudo /sbin/ifconfig enp3s0 hw ether B4:A3:F6:CC:0F:10`
启动网卡:  `sudo /sbin/ifconfig enp3s0 up`
### 长期修改MAC地址
sudo 进入文件 `/etcrc.local` 再问文档末尾,`exit 0`前添加
`sudo /sbin/ifconfig enp3s0 down`
`sudo /sbin/ifconfig enp3s0 hw ether B4:A3:F6:CC:0F:10`
`sudo /sbin/ifconfig enp3s0 up`

## 保存当前MAC信息到ethernet
1. Editing connections
2. Wired connection 1 (仅限本机)
3. Ethernet -> Cloned MAC adress:
    B4:A3:F6:CC:0F:10 (仅限本机)
4. Saving
## 重装teamviewer
`sudo dpkg -i teamviewer14.0.......deb`