---
layout:     post
title:      Series Articles of Java Learning  -- 02
subtitle:   Java项目实录02 -- 基于阿里云的普通增值税发票识别工具开发
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

> 写完崇教授的程序后，想趁着还熟悉开发流程，一些如GUI之类的组件也还能复用，写个发票识别工具。
> 这篇博客主要记录项目开发的流程，一些共性的问题和基本语法问题会在其他博客中详细记录。    
> 所有我们使用poi库读写生成的excel表格均需要是97-03版式`.xls`后缀的远古表格；
> 07及以后的`.xlsx`后缀表格无法读写生成。   

# 项目结构    
```    
Ticket2Excel    
|   
|--GenereteExcel        
|  |    
|  |--Generate    
|  |--Ticket2Excel     
|   
|--utils    
|  |     
|  |--Base64Utils     
|  |--HttpUtils     
|  |--PicUtils     
|  |--Utils    
|    
|--gui    
|  |--FileChooser    
```    

# 代码解析    
已经在[上一篇项目实录](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-01/)中介绍过的内容不再赘述，但会给出提示。    

## 主函数类： Ticket2Excel     

### main函数: main()    

`new Runnable(){...}`线程安全启动不再赘述。    

### 静态方法 submit2AliAPI(String, String)     

该方法内容大致可分为两部分，后半部分是结果解析，也就是怎么通过API返回的结果生成Excel表格，是解读的重点。前半部分主要是`http`实例构建、请求发送、参数设置、结果获取相关的内容。这些知识一是现阶段并不熟悉，二者也可能大部分都是固定的流程，本无需进行解读；但考虑到有些内容牵扯到其他知识点或者前后两部分的衔接，还是则其要者尝试解读，或许以后学习的更深入以后会对http部分进行补充。    

#### 第一部分--http    

定义适用于http传输的`NameValuePair`（来自包`org.apache.http`）链表变量：   
```java   
List<NameValuePair> params = new ArrayList<NameValuePair>();   
```   
关于接口类`List`和抽象类`AbstractList`的实现类`ArrayList`之间关系的小知识，见博客[java学习实录2](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-04/#list-%E5%92%8C-arraylist)    

下一步，参照[这里](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-01/#%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95-submit2aliapi-string-imgpath-string-targetpath)关于图片`Base64`编码的知识对图片编码，并将相应的base64码构造为键值对加入到参数链表`params`中：   
```java    
params.add(new BasicNameValuePair("AI_VAT_INVOICE_IMAGE", imgBase64));
```    
此处注意的是`new BasicNameValuePair(key, value)`，同`List`与`ArrayList`之间的关系一样，`apache.http`中的`NameValuePair`定义了一种接口类型，它无法通过`new`具体实现。而`apache.http.message`中的`BasicNameValuePair`则是适用于这个接口的具体类。     

后面是 HttpGet 实例的构建和请求参数的设置，一是不熟，二是或许就是固定流程，不做解读。   

接下来是发送 HttpGet 请求，通过`httpClient.execute(httpPost)`实现。其中`httpPost`是上一步构建的`HttpPost`类型实例；`httpClient`被声明为一个`CloseableHttpClient`类型变量，但通过`HttpClient`（均来自`org.apache.http.impl.client`）的静态方法`createDefault()`定义。    
发送请求使用的`execute()`方法会返回一个`HttpResponse`类型变量，该变量（本项目设为`execute`）里包含着结果信息。比如可以通过`.getStatueLine().getStatueCode()`获取结果信息状态码已查看结果返回状态。该API中定义状态码为200为返回正常。    

在接下来就是获取结果信息。`execute.getEntity()`会返回一个`HttpEntity`类型变量，既是结果。但是这个结果对我们不是直观可读的，通过`EntityUtils`的静态方法`EntityUtils.parseString(HttpEntity)`可以将`HttpEntity`类型的结果转化为字符串类型。由于结果中包含多种信息，显然json对我们的处理更加方便。

JSON（来自`com.alibaba.fastjson`）中的静态方法`JSON.parseObject(String)`可以将字符串形式表示的结果转化为`JSONObject`变量`res_obj`。    


#### 第二部分--结果解析    

从上一步得到的JSONObject类型变量`res_obj`中将结果各部分提取出来，用到合适的位置。就本项目发票API而言：   
* 发票抬头是一个字符串变量，直接通过`res_obj.getString(key)`提取。    

* 发票日期是一个字符串变量，直接通过`res_obj.getString(key)`提取。   
不同的是，这个日期是“year-month-day”格式的字符串变量。我们不希望出现中间的小短横‘-’，于是通过`Utils`的静态方法`IntegerOnly()`进行提取结果为纯数字。由于涉及到一些有关正则匹配的共性知识，方法的具体实现在[java学习实录2](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-04/#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%8E%BB%E9%99%A4%E5%AD%97%E7%AC%A6%E4%B8%B2%E4%B8%AD%E7%89%B9%E5%AE%9A%E5%80%BC)中单独解读。       

* 发票总额是一个浮点型变量，所以通过`res_obj.getString(key)`提取出后，需要再通过`Double`的静态方法`Double.parseDouble(String)`将之转化为double型的 **基本数据类型** 变量。基本类型这一点很重要，`Double`还有一个静态方法`Double.valueOf(String)`返回一个Double型的 **类类型** 变量。关于Double 和 double的区别与联系依然见于[java学习实录2](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-04/#%E7%B1%BB%E7%B1%BB%E5%9E%8Bdouble%E4%B8%8E%E5%9F%BA%E6%9C%AC%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8Bdouble)中。    

* 发票detail是一个`JSONArray`变量，由多个具体条目组成，每个条目以`JSONObject`表现。通过`res_obj.getJSONArray(key)`提取。    

内容提取结束。然后定义一个String类型变量作为生成的Excel文件的名字，使用`String.format()`方法填充抬头、日期、总额等发票信息对该字符串变量赋值。

接下来创建一个`Generator()`对象，并调用其方法（不能是静态方法，原因存疑）`generator.generateExcel(invoice_detail, excel_name);`生成指定名字的excel表格。    

最后返回状态码`return stateCode;`结束该静态方法。      


## 类： Generator       

该类用于生成excel表格，需要使用`poi.hssf`库：   
```java   
import org.apache.poi.hssf.usermodel.*;     
```   

### 方法 generateExcel(JSONArray inputJson, String outputName)    

```java   
// 该方法需要被其他对象调用，权限为public。
Params:    
@ inputJson，    发票detail信息，json数组类型      
@ outputName，   生成excel表格的名字
```   
     
> 回忆Excel表格的组成，自顶向下为：    
> 工作薄（Workbook） --> 页面（sheet） --> 行（row） --> 单元格（cell），   
> 依次而**不能跨层**地，下一层是上一层的组成部分，上一层是下一层存在的基础。        

那么首先构造一个工作薄对象：`HSSFWorkbook wb = new HSSFWorkbook()`；显然我们还需要且只需要一个页面（sheet），于是再给工作薄`wb`构造一个页面对象，命名为"sheet1"：`HSSFSheet sheet = wb.createSheet("sheet1")`。接下来可以再给sheet1构造一个行（row）对象作为表头：`HSSFRow row = sheet.createRow(0)`，参数零表示作为页面的第一行，这样在调用表头构造方法的时候可以直接将该对象作为参数传入。当然也可以不事先构造，只是本项目如此做了。        

随后分别调用类中私有方法`this.generateHeadRow(params)`和 `this.generateBodyRow(params)`写如表头和主题单元格内容。    

**写文件**：    
填充完表格内容就要将之写入文件了，[文件读写](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-01/#%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95-convert2excelstring-base64-string-output)操作都要包装在    
```java   
try{
    ...
}catch(IOException e){
    e.printStackTrace();
}   
```    
语句中用以捕获可能发生的IO错误。文件读写是固定的流程：    
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


需要考虑，表头有一些重要的项需要加红标注，单元格内容的对齐方式和字体也有要求。从而我们需要主动设置单元格的风格`HSSFCellStyle`：     
类中定义两个`HSSFCellStyle`类型的私有全局变量`style_red`和`style_normal`分别表示加红和正常的单元格格式，通过私有方法`generateStyle`设置赋值。可以在构造函数`Generator()`或者本方法中中调用赋值方法完成赋值，总之在写单元格之前完成赋值就可以。     


### 方法 generateStyle(HSSFWorkbook wb, short color)     

```java    
private HSSFCellStyle getnerateStyle(HSSFWorkbook wb, short color){
    /******************************************    
    * 方法用以返回特定的单元格格式对象，从而在填充单元格式主动为单元格设置其格式。    
    * Params:   
    * @ wb, HSSFWorkbook 工作薄对象     
    * @ color, short 类型变量     
    *     
    * return 返回值     
    * style, HSSFCellStyle 单元格格式 对象       
    *******************************************/    

    // 从本工作薄构造HSSF单元格格式对象，并设置对齐方式。    
    // 是否由本工作薄的构造的单元格格式对象只能应用于本工作薄，存疑。   
    HSSFCellStyle style = wb.createCellStyle();    
    style.setAlignment(LEFT);  //居左    

    // 从本工作薄构造HSSF字体对象，并设置字号颜色和字体等。    
    // 是否由本工作薄构造的字体对象只适用于本工作薄，存疑；    
    // 是否字号设置方法的参数必须要强制转换为short，存疑。
    HSSFFont font = wb.createFont();   
    font.setFontHeightInPoints((short) 11);   
    // 参数传入的color, 其值为HSSFFont.COLOR_NORMAL/RED
    font.setColor(color);    
    font.setFontName("宋体");    

    // 设置style字体为已设置好的font，并返回。    
    style.setFont(font);
    return style;
}

```      
 

### 方法 enerateHeadRow(HSSFRow row)       

接受已构造的表格行（第一行）对象为参数，填充表头内容：    
```java   
// 构造单元格对象，参数是第几列。一次定义，   
// 后面只要改参数重新赋值继续使用就可以。   
HSSFCell cell = row.createCell(0);   
cell.setCellValue("*物资名称(必填)");   // 填内容    
cell.setCellStyle(style_red);         // 设置格式     
```    
重复这三行内容，往后填就行，没什么好说的。    


### 方法 generateBodyRows(Params)     

```java    
Params:   
@ inputJson, JSONArray类型，发票内容，也即表格内容      
@ sheet, HSSFSheet对象，表格页面。对象的值传过来是内存地址，可以直接用。   
```   

for循环开始填充：    
```java    
for (int i = 0; i < inputJson.size(); i ++){
    JSONArray obj = inputJson.getJSONObject(i);
    ......
}
```   
一个for填充一行表格，由于JSONArray里的内容需要使用对象的`getJSONObject(index)`方法提取而不是直接下标`[index]`取值，从而似乎无法使用`for each`语句完成循环。    

for 循环内：   

`obj.getString(key)`取值，通过`Ticket2Excel.java`文件中第111-114行内容可以将API返回的原始json文件保存下来，从而查看`obj`的key值;   
浮点数可以直接通过`obj.getDouble`提取；   
税率是百分数，只能提取到String，但可以`replace('%', '')`将百分号去掉后再`Double.parseDouble()`转String为double，当然，还需要结果乘以0.01；    
物资的真额（净额＋税额）通过`(税率+1.0)*净额`得到。其值一般是整数，考虑到计算机二进制计算误差，可能会出现xxx.000001或xxx.999999类似的值，于是以`(int)round(真额)`将之四舍五入并取整。    

随后填充单元格：   
```java   
HSSFRow row = sheet.createRow(i+1);    // 构造新行    
// index是列数，从0开始；表头有多少列，这一行就重复多少次。   
// 当然，index和value要对应地填充。    
row.createRow(index).setCellValue(value); 
```     


## GUI类： FileChooser     

### 静态方法 createWindow()    

权限为public，由于需要项目主函数调用。   

`setLayout(...)`指定窗口布局，依然是原始的东西南北中布局，参数填`new BorderLayout()`；随后构造和add各`Panel`；最后不要忘记设置[JFrame窗口属性](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-05/)：     
```java     
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);   //如何退出     
frame.setSize(500, 400);            // 原始尺寸
frame.setResizable(true);           // 不解释
frame.setLocationRelativeTo(null);  // 窗口在屏幕居中出现
frame.setVisible(true);             // 不解释
```    


### 静态方法 createNorthPanel()     

上部（北）面板，用于输入路径选择。一般地，我们会先取当前路径作为默认值：    
```java     
File direction = new File("");    
path = direction.getAbsolutePath();    // path是类全局变量。
```    
需要注意的是，[项目实录1](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-01/#%E7%B1%BB-fielchooser-gui%E7%95%8C%E9%9D%A2)中，我们在整个`panel`上通过`new GridLayout(3, 2)`的方式创造了一个包含两行三列内容的面板，其显示效果却不尽人意。如下图，三列宽度均等十分不和谐。    

<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-007.png"></div>      

于是在本项目中，我们采用另一种更灵活的布局方式：以`NorthPanel`为具有`BorderLayout布局方式的`母面板，另行构造三个两行一列的`GridLayout`布局的子面板`labelPanel`、`textPanel`和`buttonPanel`，分别`add`到母面板`NorthPanel`的`WEST`、 `CENTER` 和 `EAST`三个位置。母面板的上下Panel缺失会自动被其他部分占据；母面板的子面板宽度能够根据组件的宽度自行适应，这样得到的界面更加好看：    

<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-008.png"></div>      

该部分另一个需要注意的地方是button的添加，由于其已经在[项目实录01](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-01/#%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95-createbuttonstring-name-jtextfield-textfield)进行过解读，且[源码](https://github.com/OUCliuxiang/Java_learning/blob/main/Ticket2Excel/src/gui/FileChooser.java#L87)足够清晰，这里不再解读。     


### 静态方法： createButton()     

信息展示panel，需要注意的方面有自动换行和滚动条的添加；和[项目实录01](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-01/#%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95-createcenterpanel)一致，不再解读。     


### 静态方法： createSouthPanel()     

按键面板，包含开始按键和退出按键，并为按键添加事件监听器以响应鼠标点击事件：    
```java   
button.addActionListener(new ActionListener(){    
    @Override    
    public void actionPerformed(ActionEvent e){
        ...code...
    }
})
```   

`endButton`比较简单，事件监听器内容有一行： `System.exit(0);`在系统层级完全结束进程。下面仅对`startButton`的事件监听器内容加以解读。          


`new File(direction)`可以一次性读取路径下所有文件，之后调用`File`对象的`listFiles()`可以得到`File[]`类型的文件列表，随后`for(variable: collection)`语句遍历所有文件。具体解读见[项目实录01](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-01/#%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95-createsouthpanel)。    


需要注意，在对文件合法性进行判断的时候，由于本项目还有一部对图像进行压缩的操作，而压缩后的图像会被另存为以原名+“_compress”为名称的新文件，所以有一步判断字符串是否含有某子字符（子串）的操作。[学习实录2](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-04/#判断字符串中是否有特定字符或子串)中总结了3种方法，这里由于已知特定子串（_compress）的具体位置（后缀长度一直，文件名串长度可`length()`方法提取），我们使用较高效的`str.startWith(subStr, offset)`方法，其参数中的offset业绩起始位置就是`str.length() 减 后缀长度`。    

随后，调用静态方法`PicUtils.compressPicForScale(params)`方法压缩图片到指定大小，调用静态方法`Ticket2Excel.submit2AliAPI(parmas)`提交图片到API，同时接受方法返回的状态码。并打印信息到`centerPanel`的`JTextArea`中。需要注意的仍然是每次更新提交都需要做到内容[实时刷新](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-05/#%E5%AE%9E%E6%97%B6%E6%9B%B4%E6%96%B0)。      

## 类 PicUtils     

通过google的`thumbnailator`库，压缩图片到指定大小。    

### 静态方法 commpressPicForScale(params)     

```java    
Param:   
@ srcPath，String类型，原图片路径     
@ desPath，String类型，压缩后目标图片路径     
@ desFileSize， int型，目标图片大小，单位Kb    
@ accuracy，double类型，迭代压缩过程中每次压缩的比例    

return:  
void方法，无返回值    
```   

首先进行路径合法性判断，接受的路径参数是否存在，或文件读出来是否为空：     
```java    
if (StringUtils.isEmpty(srcPath) || !new File(scrPath).exist()){
    return;}
```    

**包装在`try-catch`里的内容**：    
以文件方式[读图像](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-04/#%E8%AF%BB%E6%96%87%E4%BB%B6%E4%B8%8E%E8%AF%BB%E5%9B%BE%E5%83%8F)，并通过`(int) (.length()/1024)`得到以kb为单位的图像大小，这一步非必须操作，目的是将原图像大小打印到控制台，方便查看。         
`Thumbnails.of(srcPath).scale(1f).toFile(desPath);`将原图像以jpg形式另为目标图像路径，调用的各方法和参数暂不展开讨论，有时间回头剖析。     
**[调用compressPicCycle(desPath, desSize, accuracy)方法递归压缩](https://www.ouc-liux.cn/2021/04/28/Series-Record-of-Java-Learning-06/)。**     
同样的方法打印压缩后图像的尺寸，不细表，结束。     


### 静态方法 compressPicCycle(params)     

```java   
Params:   
@ desPath，String型变量，目标图像路径    
@ desSize，int型变量，目标图像大小，单位Kb     
@ accuracy,double型变量，每次大小变化的比例      
```   

该方法递归运行，需要给一个跳出递归的判定条件，也即图像小于目标大小时`return`：    
```java   
if (srcFileSize < desSize * 1024){return;}
```    
其中`srcFileSize`是目标图像大小，通过读图像为`File`后取`length()`得到，默认单位是字节'b'，于是在和以“Kb”为单位的`desSize`比较时将`desSize`乘以1024。    

[读图像，取宽高](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-04/#%E8%AF%BB%E6%96%87%E4%BB%B6%E4%B8%8E%E8%AF%BB%E5%9B%BE%E5%83%8F)
，并设置新的压缩图像的宽高为`accuracy*取得的原宽高`。这一步找到的教程使用了大数乘法:   
```java   
int desWidth = new BigDecimal(srcWidth).
    multiply(new BigDecimal(accuracy)).intValue()     
```   
但我觉得基本数据类型完全能hold住，不知用意何在。   

灵魂的两步，首先设置本次迭代要压缩的的目标尺寸和精度比，并将压缩结果输出到相同路径；随后调用方法自身，完成递归：    
```java   
Thumbnails.of(desPath).size(desWidth, desHeight)
          .outputQuality(accuracy).toFile(desPath);    
this.compressPicCicle(desPath, desSize, accuracy);   
```   

结束
