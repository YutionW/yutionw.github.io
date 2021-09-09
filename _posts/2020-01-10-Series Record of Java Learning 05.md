---
layout:     post
title:      Series Articles of Java Learning  -- 05
subtitle:   Java学习实录03 -- JFrame小知识大杂烩
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


## 窗口位置     

* 可以使用`setLocationRelativeTo(null)`方法将窗口在屏幕中央显示。   
  JFrame 中的 `setLocationRelativeTo(Component c)`是从`java.awt.Window`类继承的方法，用于设置当前窗口相对于指定组件`c`的位置。    
  如果指定组件当前未显示，或者`c = null`，则此窗口位于屏幕的中央。    
  如果组件`c`在屏幕的右部，则当前窗口将被放置在左部，其他情况亦然。    

* 可以使用`setLocation(up, left)`方法设置窗口距显示屏上边缘up像素，距显示屏左边缘left像素。     


## 窗口退出方式     

可以通过`setDefaultCloseOperation(int operation)`设置用户在此窗口上发起 "close" 时默认执行的操作。其中参数`operation`的取值和含义有：    
*  为`0`或`JFrame.DO_NOTHING_ON_CLOSE`：不执行任何操作。    
*  为`1`或`JFrame.HIDE_ON_CLOSE`：隐藏窗口界面而不关闭程序，任务管理器中可以看到java.exe依然在运行。点击关闭按钮后在IDE中已无法再启动窗口，因为程序线程尚未关闭，窗口仍在。    
*  为`2`或`JFrame.DISPOSE_ON_CLOSE`：释放窗口对象而不关闭程序，任务管理器中可以看到java.exe依然在运行，只是释放窗口占用的资源。     
*  为`3`或`JFrame.EXIT_ON_CLOSE`：使用 System exit 方法退出应用程序。仅在应用程序中使用，从系统层级结束进程。

## 标签Label值的位置     

当不指定位置构造标签对象的时候，如`JLabel label = new JLabel("value");`，默认内容“value”居中；可以通过`SwingConstants`参数主动指定值“value”的位置。如`new JLabel("value", SwingConstants.RIGHT);`意味着值在右；类似地，将RIGHT换成CENTER、LEFT即为指定居中或居左。     

## 面板布局     

建立`JFrame`后调用对象的`setLayout(param)` 方法指定JFrame对象布局。   
最常用最简单的一种布局是边界布局BorderLayout，可以通过`setLayout(new BorderLayout())`指定，不指定也没事儿，它是窗口、框架的内容窗格和对话框等的缺省布局。BorderLayout把容器的的布局分为五个位置：CENTER、EAST、WEST、NORTH、SOUTH。依次对应为：上北（NORTH）、下南（SOUTH）、左西（WEST）、右东（EAST），中（CENTER），如下图。

<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-006.png"></div>    

 
`add`组建的时候在组件参数后面加跟`BorderLayout.xxxx`参数（xxxx可以是WEST、EAST、CENTER这些）指定组件的位置。如果未指定位置，则缺省的位置是CENTER。
南、北位置控件各占据一行，控件宽度将自动布满整行。东、西和中间位置占据一行;若东、西、南、北位置无控件，则中间控件将自动布满整个屏幕。若东、西、南、北位置中无论哪个位置没有控件，则中间位置控件将自动占据没有控件的位置。    


项目用到的另一种布局是`GridLayout(row, col)`网格布局，通过row和col参数指定行数和列数，随即版面被**均等地**划分成row行col列的矩形网格区域, 每个区域只能放置一个组件。   


## 文本域自动换行、添加滚动条、实时更新      

### 自动换行    

`JTextArea`文本域对象`JTextAreaObject`通过调用`setLineWrap()`方法完成自动换行：   
```java   
JTextAreaObject.setLineWrap(boolean);  // 默认为false，不自动换行            
```    
当布尔参数为`false`的时候，将不自动换行；`true`激活该功能。另外需要了解的是，英文单词的换行有两种风格，可以通过：        
```java    
JTextAreaObject.setWrapStyleWord(boolean);  //默认为true
```   
设置。布尔参数为`true`意思是在单词边界处换行（每行最右侧可能留白），当设置为`false`时候在字符边界处换行，右侧不留白，但最右侧单词可能会被分成两部分显示。    


### 滚动条    

要给文本域添加滚动条，需要构造一文本域对象为参数的`JScrollPane`对象：    
```java    
JScrollPane scorllPane = new JScrollPane( JTextAreaObject)   
```     

滚动条默认是当文字超出范围文本域后才显示，但可以通过以下语句主动激活其常显示功能：   
```java   
scrollPane.setVerticalScrollBarPolicy( param);   
```   
命令意思是设置垂直滚动条策略，参数有：   
```java   
@ params:  
@ JScrollPane.VERTICAL_SCROLLBAR_ALWAYS     // 常显示    
@ JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED  // 当需要时显示（默认）    
@ JScrollPane.VERTICAL_SCROLLBAR_NEVER      // 从不显示   
```   

额外的，我们还可以类似地设置水平滚动条策略：    
```java   
scrollPane.setHorizontalScrollBarPolicy( param);    
```   
参数相应地为：     
```java   
params:   
@ JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS   
@ JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED   
@ JScrollPane.HORIZONTAL_SCROLLBAR_NEVER       
```     

### 实时更新    

默认地，当Swing主线程运行时向`JTextArea`对象添加或删改内容，不会实时地刷新在屏幕上，而是等到线程结束才一并显示。调用文本域对象的`paintImmediately()`方法可以使之实时刷新：    
```java   
paintImmediately(infoPrint.getBounds());
```   
原理暂不做探讨，后续有时间会进行剖析。    


