---
layout:     post
title:      Series Articles of Java Learning  -- 03
subtitle:   Java学习实录01 -- 一些关于项目的基本知识
date:       2021-03-31
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - 学习
    - Java
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

>  本文旨在对使用**IDEA**进行java项目开发过程中遇到的一些共性问题进行总结。  

# jar包的引入    
当项目需要非默认的功能时，需要引入第三方jar包。  
1, 在[maven](https://mvnrepository.com/)查询并下载指定版本号的File->jar包，如下图所示：   
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-001.png"></div>   

2, 将下载好的jar包放入项目的`lib`目录，也即与`scr/`, `out/`平级的路径，如下图所示。实际上，加入包到项目下任何路径均可，且如果直接加入到根路径，似乎无需下一步导入操作。   
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-002.png"></div>    

3, 导入包到项目。File --> Project Structure --> 左侧栏Modules --> 右侧栏Dependencies --> 最右侧栏“+”号 --> 1.JARs or directories... --> 选中lib中的包 --> OK --> Apply --> OK. 完成导入。过程中部分步骤如下图所示：     
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-003.png"></div> <div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-004.png"></div>    

   
# 发布项目为可执行程序（win系统）       

jpackage 是 java 14 里面自带的打包工具，jpackage 解决了 java 开发过程中得一个难题：分发自己的程序，需要客户电脑中已安装 jre 环境。有了 jpackage，我们可以直接将 java 程序打包成安装包，具体来说：   

$\cdot$  Windows：exe，msi     
$\cdot$  Mac：dmg，pkg    
$\cdot$  Linux：deb，rpm   

jpackage 目前并不成熟，但是也算是可以使用。另外，虽然 jpackage 可以打包各个系统的安装包，但是在一个系统上只能打对应系统的安装包。比如在 windows 上，就只能打成 exe 或 msi。   
## win环境准备    
1. jdk14   
2. [wix3](https://github.com/wixtoolset/wix3/releases)   

### linux下环境准备（未验证）
1. JDK14     
2. apt 安装 alien 和 fakeroot
   
## 生成jar包    
0. File-> Project Structure   
1. 点击artifacts   
2. 点击 +    
3. 点击JAR->From Modules with Dependencies..   
4. 选择相应的Modules   
5. 点击Main Class 最右边的 三个... 进行main的入口的选择   
6. 点击ok，就会看到了，注意里面的输出的路径output dictoinary   
7. 再点击apply，或者ok就可以了   
8. 这个时候点击Build->Build artifacts..输出的文件，就是在第6步里面的output dictoinary里面    
9. 将jar包复制到lib路径里面，为下一部发布安装程序做准备    

## 发布安装包    
一条命令：  

```bash    
jpackage \       
--name TableOCR \    
--input lib \    
--main-class com.alibaba.ocr.demo.AliTableOCR \    
--main-jar AliTableOCR.jar \    
--vendor alibaba.ocr.demo \    
--win-dir-chooser \    
--win-shortcut \    
--win-menu \   
--win-menu-group "TableOCR"    
```     

各参数意义分别为（注意顺序）：    
```bash
parms:
--name:             # 安装包名字      
--input:            # 项目生成jar包的路径      
--main-class:       # 项目入口函数从包到类（含）的路径（从哪儿启动程序）    
--main-jar:         # 项目生成jar包名字    
--vendor:           # 项目入口函数所在类的路径   
--win-dir-chooser:  # 安装时添加“选择安装路径”，该项只用在win系统，下同    
--win-shortcut:     # 安装后自动在桌面添加快捷键     
--win-menu:         # 添加到系统菜单中    
--win-menu-group:   # 启动该应用程序所在的菜单组。放在–win-menu 之后，否则无效。
```    

## 发布为免安装版本（未验证）     
jpackage 提供一个选项，可以用来生成镜像（image），而这个镜像就可以充当便携版执行命令和上面基本一致，添加`--type app-image` 命令，删除所有–win-xxx 即可：    
```bash    
jpackage \       
--name TableOCR \   
--type app-image \    
--input lib \    
--main-class com.alibaba.ocr.demo.AliTableOCR \    
--main-jar AliTableOCR.jar \    
--vendor alibaba.ocr.demo     
```     
结果是一个文件夹。   

### 免安装版本发布为msi安装包     

打包成镜像后，还可以将镜像转化为安装包（通常发生在我们想对镜像做一些定制化内容时），执行命令：    
```bash   
jpackage \   
--name TableOCR \   
--type msi \   
--app-image TableOCR \   # 上一步生成的镜像文件夹的位置 
--vendor alibaba.ocr.demo
```   

# 其他关于模块化项目发布的信息教程    

参考博客[Java 应用程序打包 - jpackage 使用记录 ](https://www.ravenxrz.ink/archives/421e5ad2.html)