---
layout:     post
title:      Series Article of UbuntuOS -- 06 
subtitle:   vim 中的分栏显示          
date:       2021-07-08
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Ubuntu OS
    - vim
---

vim 用习惯了还是挺舒服的。前几天有人问我下面这个界面是怎么做到的：     
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/ubuntuSeries/ubuntu002.png"></div>     

这东西，应该是 vim 的基本技巧了。简单记录几条语句：    
1. 在终端直接分栏打开。    
   `vim file1 -on file2` 上下分栏；      
   `vim file1 -On file2` 左右分栏。    
   如果要做到上图一样的大分栏里套小分栏，好像这个命令做不到。     
2. 进入到编辑界面后，英文字符状态下 `shift + :` 调出底部命令框，     
   `vsplit path/to/file1` 左右分栏；        
   `split path/to/file1` 上下分栏。     
3. 完成分栏显示后：      
   `ctrl+w` 然后上下左右四个方向键在不同的分栏之间切换；      
   `ctrl+w + n >` 本分栏扩大 n 列，其中 n 是具体数字；     
   `ctrl+w + n <` 本分栏缩小 n 列，其中 n 是具体数字；    
   `ctrl+w + n +` 本分栏扩大 n 行，其中 n 是具体数字；          
   `ctrl+w + n -` 本分栏缩小 n 行，其中 n 是具体数字；          
   n 的缺省值为 1。      
