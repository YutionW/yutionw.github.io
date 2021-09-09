---
layout:     post
title:      Series Articles of Java Learning  -- 04
subtitle:   Java学习实录02 -- 总结一些小知识
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


## List 和 ArrayList   
[Java项目实录02](https://www.ouc-liux.cn/2021/01/30/Series-Record-of-Java-Learning-02/)开头有这么一行代码：    
```java   
List<NameValuePair> params = new ArrayList<NameValuePair>();
```   
试图建立一个ArrayList（泛型）对象，再将之指向到List（泛型）。对该语句的正确解释是：   

List是一个接口，而ArrayList是List接口的一个实现类。   
ArrayList类是继承AbstractList抽象类和实现List接口的一个实现类。   
因此，List接口不能被构造，也就是我们说的不能创建实例对象，但是我们可以为List接口创建一个指向自己的对象引用，而ArrayList实现类的实例对象就在这充当了这个指向List接口的对象引用。  

我们进行一组对比：   
```java   
List list = new ArrayList();        // 1
List list = new List();             // 2
ArrayList alist = new ArrayList();  // 3
```    

上面三行代码中，**1** 是可行的用法，这个语句创建了一个ArrayList实现类的对象后把它上溯到了List接口。此时它就是一个List对象了，有些ArrayList类具有的，但是List接口没有的属性和方法，它就不能再用了。   
**3** 创建的实现类ArrayList的对象则保留了ArrayList的所有属性和方法。   
**2** 是错误的写法，由于接口类List无法具体实现为对象，该句无法执行。    


## 正则表达式/去除字符串中特定值    

[项目实录02](https://www.ouc-liux.cn/2021/01/30/Series-Record-of-Java-Learning-02/)中遇到一个小问题：在一串由数字和短横杠组成的String类型变量中提取数字，得到一个纯数字字符串；问题可以等价为在原字符串中去除非数字字符。可以采用正则匹配方法处理，代码及解读如下：    
```java    
public static String IntegerOnly(String str){
    Pattern p = Pattern.compile("[^0-9]");  // 1
    Matcher m = p.matcher(str);             // 2
    return m.replaceAll("").trim();         // 3
}
```      

**语句 1** ：    
构造了一个正则表达式。`"[^0-9]"`是反向字符范围的正则表达，意思是除0--9以外的所有字符。由于0--9的ASICII码是连续的，从而可以通过短横连接作为一个范围。关于正则表达，相似的例子有：    
* `"[0-9]"` ：字符范围，意思是（以ASICII码顺序）0--9之间的字符。    
* `"[abc]"` ：字符集，意思是只允许abc三个字符。    
* `"[^abc]"`：反向字符集的，意思是除a、b、c以外的所有字符。   
* 关于正则表达的更多语法，见[这里](https://www.runoob.com/java/java-regular-expressions.html)。   

**语句 2** ：    
通过 1 构建的正则表达式对字符串str进行匹配，并返回一个带有匹配结果的`Matcher`变量。在本项目中就是匹配出有短横杠的String中的非数字字符。     

**语句 3** ：    
对语句 2 的匹配结果加以操作： 通过`Matcher`变量的`replaceAll(String)`方法将原始字符串str中的匹配结果（非数字字符）全部替换为空。该方法返回一个字符串，详见[文档](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Matcher.html#replaceAll-java.lang.String-)。   
随后调用String变量的`trim()`方法，去除replaceAll之后的字符串头尾的空白符。得到纯数字组成的字符串,返回。     


## 类类型Double与基本数据类型double    
 
* Double是一个类，创建对象，存放在堆中   
* double是一种基本数据类型，创建引用，存放在栈中   
* Double是对double类型的封装，内置很多方法可以实现String到double的转换，以及获取各种double类型的属性值（MAX_VALUE，SIZE等）   
* `Double d =new Double(dou)`  可将double基本数据类型自动装箱为Double包装类    
* `double dou =d.doubleValue()`可将Double的包装类自动拆箱为基本数据类型    

Double提取字符串中浮点数的两个静态方法：    
* `Double.parseDouble(String)`： 把数字类型的字符串转换成基本数据类型double    
* `Double.valueOf(String)`： 把数字类型的字符串转换成类类型Double    


## String.format()格式化输出     

来自String的静态类`String.format(String, [argvs])`用于格式化填充字符串。方法的第一个参数是一个含有格式化占位符的字符串变量，如%d, %f, %3.4f等等，第二个及之后的参数按顺序是填充内容。     
常用的format占位符含义及表现展示为如下[表格](https://www.ouc-liux.cn/2021/04/27/Markdown-Grammar/)：     

|占位符|含义    |案例   |   
|:--- |:---   |:---  |   
|%d   |int型变量| 'c' -> 99|   
|%s   |String变量| |    
|%c   |char型变量| 99 -> 'c'|   
|%f   |浮点型变量，<br>默认小数点后六位|3.12 -> <br>3.120000|   
|%x   |十六进制数|101(10) -> 65|   
|%o   |八进制数|15(10) -> 17|       
|%nd, <br>n是整数 |右对齐n位，左侧为空|  |   
|%n.mf, <br>n,m都整数|小数点前右对齐n位，<br>左侧为空；保留m位小数|123.45(%3.3f)<br>->123.450|
|%mnd, mn是整数|右对齐n位，左侧补'm'|101(%010d)-><br>0000000101|    
|%mn.kf, m,n,k是整数|不做|解释|    
|%-nd, n是整数|左对齐n位，右侧为空||      
|类似地|可以|自行组合|   


## 文件读写与存在性判断     
[文件读写]操作都要包装在    
```java   
try{
    ...
}catch(IOException e){
    e.printStackTrace();
}   
```    
语句中用以捕获可能发生的IO错误。读文件通过是固定的流程：    
```java    
// 1. 以文件名为参 构造文件对象;
File newExcelFile = new File(outputName);    

// 2. 以文件对象为参构造文件输出流对象；     
FileOutputStream out = new FileOutputStream(newExcelFile);    

// 3. 以文件输出流为参数写入内容；    
wb.write(out);    

// 4. 关闭文件输出流。     
out.close();     
```     

可以通过文件对象的`exist()`方法判断文件是否为空。文件非空，读到了内容，返回`true`，否则，建立新文件并返回`false`。    
在`new`的同时调用方法`new File(name).exist()`也无不可。    

## 读文件与读图像

图像可以读取为文件对象`File img = new File(imgPath)`，但这样读出来是字节码，可以通过`img.length()`方法获取图片大小，但无法获取诸如长宽像素值类似的图像属性。要获得图像属性，需要将图像读取为`BufferedImg`对象，再通过该对象的get方法获取其属性：    
```java   
BufferedImg bim = ImageIO.read(imgPath);    // 读取图像为BufferedImg对象
int imgHeight= bim.getHeight();             // 提取图像高度
int imgWidth = bim.getWidth();              // 提取图像宽度
```    
其中`BufferedImg`和`ImageIO`分别需要import `java.awt.image.BufferedImg` 和 `javax.imageio.ImageIO`。    

  
## 判断字符串中是否有特定字符或子串     

三种方法：    
* startsWith()    
* contains()    
* indexOf()     

### startsWith()    

调用方法： `str.startsWith( subStr, offset);`，参数`subStr`是要匹配的字串/字符， `offset`是偏移量，俗称从哪里开始找，默认从0开始。    
返回值是boolean，找到就是true， 没找到就是false。    

### contains()    

调用方法： `str.contains(subStr);`，参数`subStr`是要匹配的字串/字符。返回值是boolean，找到就是true， 没找到就是false。    

### indexOf()    

调用方法： `str.indexOf(subStr, offset);`，参数`subStr`是要匹配的字串/字符，`offset`是偏移量，俗称从哪里开始找，默认从0开始。    
返回值是int，找到了就返回子串/字符第一次出现时首字符在**整个字符串**的下标（和offset是多少无关），没找到就是-1。     


## thumbnailator压缩图片    
详见[项目实录02](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-02/#%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95-commpresspicforscaleparams)和[学习实录04](https://www.ouc-liux.cn/2021/04/28/Series-Record-of-Java-Learning-06/)。    


## 对字符串追加的五种操作    

1. 直接使用“+”；

2. String contact() 方法；

3. StringUtils.join() 方法；

4. StringBuffer append() 方法；

5. StringBuilder append() 方法；   

时间开销如下图：    

<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-009.png"></div>      

