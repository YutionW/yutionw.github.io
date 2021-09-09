---
layout:     post
title:      Life Recording -- 02 
subtitle:   Firefox 的国际板和国内版     
date:       2021-07-28
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Life
---

> 火狐浏览器跨平台设置和账号通用，于是在 linux 系统用习惯了，到了 win 也想配置个火狐，但登陆的时候显示账号不存在。   
> 后来发现火狐分国内和国际版，其间账号不通用。更恶心的是去国际版网址会被重定向到国内版。    

这个是国际版[主页](https://www.mozilla.org/en-US/firefox/)：https://www.mozilla.org/en-US/firefox/ ：    
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/life/firefox01.png"></div>    

这个是国内特供版[主页](https://www.firefox.com.cn/)：https://www.firefox.com.cn/ ：     
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/life/firefox02.png"></div>    

非常恶心，如果直接在浏览器地址栏键入 `https://www.mozilla.org` 会被重定向到国内特供版。
应该是 DNS 污染或 DNS 劫持。目前找到的下载国际版方法有两个：
1. 在有梯子的机器上直接访问 https://www.mozilla.org/en-US/firefox/ 这个网址，注意 en 和 US 之间是连字符而不是下划线。       
2. 在 mozilla 提供的 ftp 服务器 ftp.mozilla.org/pub/firefox/releases 中下载相应的包。      
   