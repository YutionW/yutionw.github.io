---
layout:     post
title:      Markdown Grammar
subtitle:   一些Markdown语法记录
date:       2021-04-27
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - 博客
    - github
    - Markdown
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

> 使用markdown书写github博客过程中遇到的问题记录，主要是记录一点儿不熟悉的语法。随时补充。     


**`> `**： 右向尖括号后面的内容是引用，适合用在文章开头。     

**表格**： Markdown 制作表格使用“ | ”来分隔不同的单元格，使用“ - ”来分隔表头和其他行。语法格式如下：    
 \|  表头  \|  表头  \|    
 \|  ----  \| ----  \|    
 \|  单元格 \| 单元格 \|    
 \|  单元格 \| 单元格 \|      

效果如下：    

 |  表头  |  表头  |    
 |  ----  | ----  |    
 |  单元格 | 单元格 |    
 |  单元格 | 单元格 |    

By the way，如同“语法格式如下”到“效果如下”之间的内容，也即，当我们想要以原始文本而不是渲染表现展示markdown的语法符号，使用反斜杠 ‘\’ 进行反义。     

**表格内容对齐**：    
通过表头与内容之间的冒号与短横杠组合设置表格的对齐方式：   

冒号在右边： 设置内容和标题栏居右对齐。    
冒号在左边： 设置内容和标题栏居左对齐。    
冒号在两边： 设置内容和标题栏居中对齐。   

\| 左对齐 \| 右对齐 \| 居中对齐 \|    
\| :-----\| ----: \| :----: \|    
\| 单元格 \| 单元格 \| 单元格 \|    
\| 单元格 \| 单元格 \| 单元格 \|    

**表格内换行**    
当内容过长，需要主动换行。换行符`<br>`。


**github博客中渲染数学公式**    

github博客默认markdown页面不支持渲染数学公式，需要再每篇文章开头添加如下内容：    
```javascript
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
```     

**代码及高亮**    

上面的代码以`javascript`格式高亮显示，通过    

\`\`\`javascript(换行)       
代码内容   
\`\`\`    

实现。同理，将javascript换成其他关键词，如java/cpp/bash/python等等，即可以相应语言高亮显示代码块。      

需要注意语法格式的选择，比如在*Python实录01*的书写过程中遇到了python实时交互风格代码块使用 "#" 进行注释后回车不能换行的问题，就是因为选择了`python`代码风格。实际上这属于命令行形式的实施编译环境，应该使用`bash`风格。   


**使用html语言插入图片**     

```html    
<div align=center><img src="https://path/to/pic.png" width=xxx height=xxx></div>      
```     

使用html语言的优势是可以主动指定图片位置和尺寸信息，比如将`center`换成`right`即可指定图像右对齐。尺寸信息可以通过`width(height)=xxx`指定，其中xxx可以是数字，也即像素，也可以是百分数，意思是缩放百分比。通常缺省只写一个，这样会按照原比例缩放。    
github博客中图像仓库是`raw.githubusercontent.com/`，也即src中需要图像在github中存放地址的`github.com/`换成`raw.githubusercontent.com/`。      



**上下左右箭头**     

很少用，通常用于代指方向键：      
$\uparrow$： 数学表达式单 \$ 内部使用语法：  `\uparraw`；     

$\downarrow$： 数学表达式单 \$ 内部使用语法：  `\downarraw`；      

$\leftarrow$： 数学表达式单 \$ 内部使用语法：  `\leftarraw`；       

$\rightarrow$： 数学表达式单 \$ 内部使用语法：  `\rightarraw`。      
