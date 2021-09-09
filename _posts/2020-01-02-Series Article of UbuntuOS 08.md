---
layout:     post
title:      Series Article of UbuntuOS -- 08
subtitle:   文件描述符、管道和重定向           
date:       2021-07-20
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Ubuntu OS
---

## 文件描述符     

Linux启动时，最开始会创建init进程，其余的程序都是这个进程的子进程。而init进程默认打开3个文件描述符：    
1. 0 -- stdin; （标准输入），位于 `\dev\stdin`；      
2. 1 -- stdout; （标准输出），位于 `\dev\stdout`；          
3. 2 -- stderr; （标准错误），位于 `\dev\stderr`；           

其中标准输入就是键盘，标准输出和标准错误都是屏幕，后面的数字分别是他们的文件描述符。    

## （输出）重定向     

输出重定向是最常见的重定向操作，期一般格式如下：     
```bash    
$ command [argvs...] > 文件、设备、或文件描述符     
```      
比如我现在的网站根目录有一个 `feed.xml` 文件，但不存在 `feed` 文件。

* 无重定向
  当我在根目录下键入如下命令：    
  ```bash    
  $ ls feed.xml feed    
  ```    
  显然应该得到一个执行成功的结果（stdout）和一个执行不成功的结果（stderr），又由于 stdout 和 stderr 都是屏幕，于是在屏幕上有：    
  ```bash     
  ls: cannot access 'feed': No such file or directory # stderr     
  feed.xml # stdout      
  ```    

* 重定向 stdout 和 stderr      
  ```bash    
  $ ls feed.xml feed 1> success.log 2> fail.log 
  ```     
  屏幕无任何信息打印，根路径下出现两个新文件： success.log 和 fail.log， 分别接收标准输出和标准错误的结果。这里也可以使用 `>>` 代替 `>` ，区别在于前者以 “追加” 模式添加信息到文件，后者总是倾向于清空并重写文件。      


* 重定向 stdout    
  ```bash    
  $ ls feed.xml feed > success.log 
  ```     
   这个应该是我们平时用的最多的形式了，重定向的缺省文件描述符为 1 ，其意义就是将命令执行成功的结果输出到 success.log 中，因此屏幕上没有命令执行成功的结果，只有出错的结果。如果只重定向标准错误的结果，则文件描述符2不能省略。     

* 关闭 stdout/stderr    
  可以将相应的结果重定向到黑洞设备 `\dev\null`，进入设备黑洞的任何信息会被销毁不做保留；也可以将编号锚定的文件描述符解绑 `&-`，这样标准输出和标准错误会因为找不到指定的文件描述符而指空：     
  ```bash     
  $ ls feed.xml feed 1> \dev\null 2> \dev\null         
  $ ls feed.xml feed 1>&- 2>&-       
  ```     

### 关于 2>&1      
跑神经网络的时候常用这个指令，一般是配合 `nohup` 使用，最开始只知道重定向配合这个指令可以做到屏幕不产生输出，细节没有细究过。本篇博客做出一点解释。其常用形式如下：     
```bash     
$ command [argv... with stdout/stderr] >example.log 2>&1  
```     
意思是将标准错误和标准输出都重定向到 `example.log` 这个文件，但是它和 `1>example.log 2>example.log`还不一样。    
具体而言，这一行命令里 `>&` 是一个整体，倒过来写 `&>` 的意思也一样，后面接文件描述符的编号；其实这样看来 `&` 的意思更像是一个转义符号。比如 `>&1` 就是重定向到文件描述符为 1 的标准输出 `stdout` ，`>&2` 就是重定向到标准错误 `stderr`；相对地，如果缺少了 `&` ，比如 `>1` ，则代表重定向到当前路径下文件名为 1 的常规文件。     
* **顺序问题**        
  `2>&1` 指令是有顺序要求的，具体而言，对于以下两行指令中的顺序：      
  ```bash     
  $ ls feed.xml feed >examples.log 2>&1      
  $ ls feed.xml feed 2>&1 >examples.log      
  ```     
  第一行的意思是，先将标准输出 `stdout` 重定向到文件 examples.log，此时文件 examples.log 就是程序的标准输出。随后将标准错误 `stderr` 重定向到标准输出 `stdout`，也就是文件 examples.log 。      
  第二行的意思是，先将标准错误 `stderr` 重定向到标准输出 `stdout`，此时会产生一个 `stdout` 的拷贝作为 `stderr` 接受标准错误信息，但程序原本的标准输出仍然在铆定在原本的 `/dev/stdout` 没有改变， （**此处，比较难理解，多读两遍**），因此第二步的标准输出重定向依然只是将程序原本的标准输出信息重定向到文件 examples.log，却不影响原本的标准错误，也就是 stdout 的拷贝。 

## 管道操作符与多命令执行     

管道操作符 `|` （写markdown的时候务必留神，这个 `|` 要么使用 `\` 转意，要么写到代码块 \`\` 里面）可以用来执行多命令，多条指令的执行不一定依赖于管道操作符。列举如下表：     

|操作符|格式|作用|
|:---:|:---:|:---:|    
|;|cmd1;cmd2|多条命令顺序执行，之间没有逻辑关系|     
|&&|cmd1&&cmd2|逻辑与，前一个命令成功执行后再执行下一个命令|
|\|\||cmd1\|\|cmd2|逻辑或，前一个指令执行失败后执行下一命令|
|\||cmd1\|cmd2| 管道，前一个命令的标准输出 `stdout` 作为下一命令的输入|     

管道命令要求比较严格：    
一是管道左侧命令一定且只能要产生标准输出 `stdout`；     
二是管道右侧命令一定要能接受标准输入流 `stdin`。    
管道操作符的右侧命令常常是 `grep` ，用于对左侧的标准输出进行筛选。比如常用的进程查找：    
```bash     
$ ps -ef | grep keyword         
```     
`ps -ef` 的标准输出是全格式的所有进程，管道右侧紧跟 `grep keyword` 将管道左侧的标准输出中带有关键词 keyword 的项筛选出来。     

关于 `ps -ef` 命令见博客[一些常用的有用的linux命令](https://www.ouc-liux.cn/2021/05/07/Series-Article-of-UbuntuOS-04/) ； 关于 `grep` 命令见博客 [grep 文本搜索和 sed 文本替换](https://www.ouc-liux.cn/2021/07/21/Series-Article-of-UbuntuOS-09/)