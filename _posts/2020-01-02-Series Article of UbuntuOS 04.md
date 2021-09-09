---
layout:     post
title:      Series Article of UbuntuOS -- 04 
subtitle:   一些常用的有用的linux命令     
date:       2021-05-07
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Ubuntu OS
---

> 记录一些常用的且有用的Linux命令，散乱着记，想起来就补充一点儿。    

## 实时查看N卡状态     
```bash    
watch -n 1 nvidia-smi    
```   
其中 `-n`指定刷新时间，单位为秒。上面指令的意思就是以每秒刷新一次的频率显示`nvidia-smi` 内容。      

## 查看cpu及内存实时状态    
```bash    
htop   
```    
和`top`命令类似，但更加高大上，如下图。      
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/ubuntuSeries/ubuntu-001.png"></div>    

## 进程后台运行，关闭终端进程不停      
```bash    
nohup Command [Args] 2>&1 > yours.log &     
```   
用服务起跑程序，尤其是耗时非常长的程序的时候，不可能一直远程连接着服务器。但默认地，进程建立于终端shell，这时候断开连接意味着远程终端被关闭，进程随即终端。    

`nohup`命令意思是'no hang up'： 用于在系统后台不挂断地运行命令，退出终端不会影响程序的运行。。再后面跟着的是应该输入的命令。再其后`2>&1 > yours.log`意思是将程序的输出流，就是原本应打印到终端上的内容，重导向到`yours.log`文件加以记录，文件操作的方式是`w`写入，也即没有则创建，存在则重写。缺省会输出到同路径下的`nohup.out`。    

`&` 放在启动参数后面表示设置此进程为后台进程。默认情况下，进程是前台进程，这时就把Shell给占据了，我们无法进行其他操作，对于那些没有交互的进程，很多时候，我们希望将其在后台启动，可以在启动参数的时候加一个'&'实现这个目的。 

## 查看和杀死进程      
```bash    
ps -ef | grep xxxx     
```    
有时候进程位于后台，只能通过kill pid方式终止，这组命令可以用来查询进程的pid。搜索参数xxxx用于搜索进程关键词，可以是命令、参数、用户等等。比如`user01`用户曾通过`python setup.py --name abc`命令启动一个python任务，那么xxxx可以是用户名或这一行命令里的任意完整或不完整字符，`user01`, `user`, `python`, `ytho`, `etup.p`等等等等都可以。在命令打印到终端的列表里寻找匹配的任务的pid，kill掉即可。       


## 查看磁盘使用状态和挂载/解挂载硬盘       

```bash    
sudo fdisk -l      
df -h
```    
后一个命令用来查看已挂载的磁盘的状态。     
前一个命令列出磁盘及分区信息，通常用来在没有图形界面的系统上寻找特定磁盘，用来挂载。这个命令还会列出分区之下信息，不知道是什么。我们挂载磁盘的时候一般截止到分区，也就是类似`/dev/sda1`这种路径就行了。        

```bash 
sudo mount /dev/sdb2(磁盘分区) /path/to/mount(挂载路径)     
sudo umount /path/to/mount     
```   
其中挂载路径如果不存在，得自己创建。卸载的时候注意命令是`umount`而不是`unmount`。    
 

## ls的参数及隐藏文件    

一般会用`ls -hl`查看文件信息及其连接关系。    

其中`h`意思是`human`，也就是说人话，自动地以`Kb, Mb, Gb`等为单位展示文件（注意是文件，路径不行）大小，而不是一串以字节（应该是）为单位的没单位的数字。     
`l`是列出文件连接关系，那个文件和那个文件有软连接关系，就可以清楚的看出来。    

如果要显示隐藏的文件，则`ls -a`。     

linux下隐藏文件通过在文件名前面加一个`.`实现，比如要将`setup.py`隐藏起来，只需要将之重命名为`.setup.py`即可。     


## 图形界面显示/不显示隐藏的文件     

这也算是个命令吧。ubuntu有很友好的图形界面，在图形界面的文件夹下，使用`ctrl+h`键可以显示/隐藏那些名字开头有`.`的文件。    

## ln与路径软连接    

装系统时分给`/home/`100G，感觉挺多的，但用了两年还是不够了。好在根目录还有220G的空间，于是在根目录建立一个`/data`路径，专用于数据集等大数据或文件。但是在根目录CURD总感觉怪怪的，于是使用`ln -s`命令将`/data`路径软连接到`/home/data`，营造一种自己没有操作根目录的错觉，聊以自慰。    
命令中`-s` 是代号（symbolic）的意思。    

另外有两点要注意：    
第一，ln命令会保持每一处链接文件的同步性，也就是说，不论改动了哪一处，其它的文件都会发生相同的变化。    
第二，ln又分为软链接和硬链接两种，软链接就是`ln -s source target` ，它只会在选定的位置上（target）生成一个源路径或文件（source）的镜像，不会占用磁盘空间；硬链接`ln source target`，没有参数-s， 它会在选定的位置上生成一个和源文件大小相同的文件，无论是软链接还是硬链接，文件都保持同步变化。   


## rename批量重命名一组文件    

文件重命名或改变路径常用的命令是`mv`，这个命令仅适用于单个文件或路径。面对大量文件时，使用`mv`就有点儿力不从心了。批量重命名一组文件就得使用`rename`命令了。    

既然`rename`用于批量操作，那[正则表达式](https://www.ouc-liux.cn/2020/05/08/Series-Article-of-UbuntuOS-05/)是免不了的。看一个例子：    

```bash          
$ ls *txt
001.txt     002.txt     003.txt    
$ rename 's/txt/xml/' *txt     
$ ls *txt     
001.xml     002.xml     003.xml        
```    
其中，`s` 的作用是指定我们使用第二个字符串替换第一个字符串。    


## scp传输文件指定端口号     

如果机器端口号不是默认的22，则必须通过**大写的 P** ： `-P port`指定端口号。


## Ubuntu 一个任务窗口开启多个terminal子页     

前几天遇到有用过不少时间Ubuntu的人问我是怎么做到的，所以这应该不是个很常识的东西。    
`ctrl + alt + T`打开terminal，`ctrl + shitf + T`新建terminal 子页。    

## 进程查看工具 ps   

一个查找相关进程的常用的指令：     
```bash     
ps -ef | grep keywork
```      
其中 管道操作符和文本查找工具分别可见博客 [一些常用的有用的linux命令](https://www.ouc-liux.cn/2021/05/07/Series-Article-of-UbuntuOS-04/) 和 [grep 文本搜索和 sed 文本替换](https://www.ouc-liux.cn/2021/07/21/Series-Article-of-UbuntuOS-09/)。     
关于 `ps -ef`：     
`ps` 是 linux 中非常强大的进程查看工具，其中 `-e` 为显示所有进程， `-f` 为全格式显示。    

## cd - 在两个常用路径之间切换

需要在两个不同路径之间频繁来回切换的时候，可以通过 `cd -` 省去输入路径的麻烦。    

## mkdir -p 建立多级路径      

需要建立多级目录的时候，可以      
```shell     
$ mkdir path1 && cd path1 && mkdir path2 && cd path2 && ...
```      
这样做，但毕竟比较麻烦。于是可以使用参数 `-p`：     
```shell    
$ mkdir -p path1/path2/path3/....
```     

## wc 命令统计文件字数行数字节数      

利用wc指令我们可以计算文件的Byte数、字数、或是列数，若不指定文件名称、或是所给予的文件名为"-"，则wc指令会从标准输入设备读取数据。    

**使用**：    
```shell     
$ wc [-c/l/w] [--help] [--version] [file]
```     

**参数**：      
`-c`： 显示字节数；    
`-l`： 显示行数；       
`-w`： 显示单词数；    
以上三者可单独或组合使用，不指定的话默认为三者全部显示。    

**案例**：    
```shell    
$ wc testfile testfile_1 testfile_2  #统计三个文件的信息  
3 92 598 testfile                    #第一个文件行数为3、单词数92、字节数598  
9 18 78 testfile_1                   #第二个文件的行数为9、单词数18、字节数78  
3 6 32 testfile_2                    #第三个文件的行数为3、单词数6、字节数32  
15 116 708 total                     #三个文件总共的行数为15、单词数116、字节数708 
```     

## echo 使用 -e 参数允许正则表达     

如果拟使用 echo 命令打印含有正则表达的字符串，需要添加 `-e` 参数：     
```shell    
$ echo "1,2,3\n4,5\n6"
1,2,3\n4,5\n6
$ echo -e "1,2,3\n4,5\n6"
1,2,3
4,5
6
```    

## 使用 somethind{a, b} 实现更便捷的 cp   

已知 some{string1, string2, string3} 会扩展成 somestring1 somestring2 somestring3 （没有逗号，是空格），于是拷贝一份仅改变后缀名的文件作为备份则如：    
```shell      
$ cp filename.{py, bak}
```      

