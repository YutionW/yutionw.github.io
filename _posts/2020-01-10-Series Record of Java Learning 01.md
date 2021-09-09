---
layout:     post
title:      Series Articles of Java Learning  -- 01
subtitle:   Java项目实录01 -- 基于阿里云的表格识别OCR工具开发
date:       2021-03-31
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
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

>  受崇教授所托，开发一款图片转表格OCR工具。决定调用阿里云的api，使用其java接口进行二次开发。项目代码开源在[github](https://github.com/OUCliuxiang/Java_related/tree/main/AliTableOCR)。  
>  这篇博客主要记录项目开发的流程，一些共性的问题和基本语法问题会在其他博客中详细记录。  



# 项目结构：    
```
AliTableOCR   
|  
|--data   
|--lib     
|--out    
|--src    
|  |--com    
|  |  |--alibaba.ocr.damo    
|  |  |  |--AliTableOCR  
|  |  |  |--Base64excel  
|  |  |   
|  |  |--aliyun.api.gateway.demo.util  
|  |  |  |--HttpUtils  
|  |  |  |--pom.xml  
|  |  |  
|  |  |--gui   
|  |  |  |--FileChooser   
|  
|--jars...
```

# 代码解析    

## 主函数类： AliTableOCR    

### 方法： main()    

```java   
public static void main(String[] args) {
    EventQueue.invokeLater(new Runnable() {
        @Override
        public void run() {
            FileChooser.createWindow();
        }
    });
}
```   
由于`class AliTableOCR`的所有方法映射都到了GUI界面，从而项目`main`函数只有一个功能：启动GUI界面。并，通过`EventQueue.invokeLater(Runnable)`实现接口(Inference)`Runnable`中的`run()`方法保证`main`的线程安全。  

### 静态方法： submit2AliAPI( String imgPath, String targetPath)      

将图片编码为base64提交到阿里云API，并将返回的json数据解析为excel表格。   
```java
@ Params:   
@ imgPath:      接收图片路径    
@ targetPath:   目标表格路径
```   

需要避免IO错误，但为查看实际解析出来的excel表格内容，此处不采取异常捕获机制，而是给`targetExcel`一个初始值。方便起见，目标表格路径需要和输入图片路径一一对应。由于输入图片限制为.jpg和.png格式，可以通过简单的字符串`replace()`方法实现，如66-69行代码：   
```java
else if (imgName.charAt(length-2)=='N') {
    targetExcel = targetPath + '\\' + imgName.replace(".PNG", ".xlsx");
}
```    
API的输入接口为base64编码字符串，则需要将目标图片编码为base64：      
```java
String imgBase64 = "";
try {
    File file = new File(imgFile);
    byte[] content = new byte[(int) file.length()];
    FileInputStream finputstream = new FileInputStream(file);
    finputstream.read(content);
    finputstream.close();
    imgBase64 = new String(encodeBase64(content));
} catch (IOException e) {
    e.printStackTrace();
    return;
}
```
通过`try-catch`语句捕获输入输出异常。    
通过`new FileInputStream(file)`创建文件`file = new File(path)`的输入流，并通过`read(byte[])`方法将文件流中的字节返回到字节数组中，字节数组的长度依照输入图片文件file而定。这是由于`encondBase64(byte[])`方法给出的输入接口是字节数组。    
不要忘记关闭文件输入流。    

下一步（row 114--134）将图片编码联合http头文件、请求、配置等等内容拼接成为json文件变量并通过`JSONObject().toString()`转化为字符串变量，目的是提交给云API。JSONObject变量可以通过`json.put(key, body)`加入JSONArray变量，其中JSONArray通过`JSONArray.add(JSONObject)`添加json变量为json数组。

接下来提交数据到云API并接收网络响应HttpResponse：   
```java
HttpResponse response = HttpUtils.doPost(host, path, method, headers, querys, bodys);    
```    
response的状态码通过`response.getStatusLine().getStatusCode()`获取；主体内容通过`response.getEntity()`获取，通过http工具中的`EntityUtils.toString(entity)`得到相应的字符串数据。通过JSON类的静态方法`JSON.parseObject(res)`将上一步获得的字符串数据转化为JSONObject数据，这一步的目的是为了获取到主体内容中特定的value值，也即tables值。 该字符串数据是一串base64编码，通过**Base64excel**类中的 *convert2excel(String base64code, String targetPath)* 方法可以将之转化为目标excel文件： 
```java
String base64code = res_obj.getString(key="tables");    
Base64excel.convert2excel(base64code, targetExcel);
```    

至此，单张图片转化为excel表格的核心功能完成。     


## 类： Base64Excel    

无需第三方jar包，该类只需要导入`java.io` 和 `java.util.Base64`即可。   

### 静态方法： convert2excel(String base64, String output)    

```
params
@base64:    接收到云API返回的base64编码    
@output:    输出的excel路径    
```

通过Base64包中的静态方法`Base64.getDecoder()`创建`Base64.Decoder`类对象。   
定义并初始化文件输出流对象`OutputStream out = null`用以写入数据。   
将文件输出流对象指向到**output**文件，此处有可能发生`FileNotFoundException`异常，使用try-catch捕获。    
写入数据：     
```java
out.write(decoder.decode(base64));    
```

## 类： FielChooser: GUI界面     

东西南北中五部分的`Borderlayout`界面，界面表现如图所示：   
<div align=center><img src="https://raw.githubusercontent.com/OUCliuxiang/OUCliuxiang.github.io/master/img/javaSeries/java-005.png"></div>    

当然，这个GUI的 `NorthPanel` 由于列宽均等显得十分不和谐，[项目实录2](https://www.ouc-liux.cn/2021/03/31/Series-Record-of-Java-Learning-02/#%E6%96%B9%E6%B3%95-createwindow)使用了一种更好的解决方案。    


### 静态方法： creatWindow()    

用于窗口布局：    

```java    
JFrame frame = new JFrame("图片转表格OCR");
frame.setLayout(new BorderLayout());
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

createNorthPanel();
frame.add(northPanel, BorderLayout.NORTH);

createSouthPanel();
frame.add(southPanel, BorderLayout.SOUTH);

createCenterPanel();
frame.add(centerPanel, BorderLayout.CENTER);

frame.setSize(500, 400);
frame.setResizable(true);
frame.setLocationRelativeTo(null);
frame.setVisible(true);
```   

### 静态方法： createNorthPanel()   

窗口上方区域，用于选择/给定输入输出路径。   
基本的提升GUI用户体验的选择是预先填充一个路径到路径文本输入框，而不是一个空的路径文本输入框。这一操作通过获取当前文件的绝对路径而实现：    
```java
File directory = new File("");     
path = directory.getAbsolutePath();      
```      
其中`path`为静态全局变量，复制完成后，按键构造的监听器中可以直接使用。    
显而易见的是，该区域( panel)应当分为两行三列： 输入一行，输出一行；Label（也即文本框前面的提示）一列，文本框一列，再加一个选择按钮，可以通过鼠标点击而不是键盘键入的方式填充路径选择文本框。于是：   
```java
northPanel = new Panel(new GridLayout(2, 3));   
```    
为保证观感，我们希望标签在第一列应当靠右，文本框在中间一列应当靠左：    
```java   
northPanel.add(new JLabel("输入路径：", SwingConstants.RIGHT));   
northPanel.add(picPath, BorderLayout.WEST);   
```    

按钮通过静态方法*createButton(String name, JTextField textField)* 构造。   

### 静态方法： createButton(String name, JTextField textField)     

用以构造路径选择按键，按键可以打开一个路径选择框，并将选定的路径自动填充到路径文本框中。   
在按键事件监听器中添加包含下拉对话框的**路径**选择组件：   
```java
button.accActionListener(new ActionListener(){
    @Override
    public void actionPerformed(ActionEvent e){
        JFileChooser fileChooser = new JFileChooser(path);
        fileChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);  
        // 文件选择器设定只选择路径   
        int option = fileChooser.showOpenDialog(null);
        if(option == JFileChooser.APPROVE_OPTION){
            File file = fileChooser.getSelectedFile();
            textField.setText(file.toString());
            // 给路径输入框赋值为选中的路径   
            if (name == "输入"){
                FileChooser.path = textField.getText();
                FileChooser.outputPath = textField.getText().replace(
                        "data", "output");
                excelPath.setText(outputPath);
            }
            else if ( name == "输出"){
                FileChooser.outputPath = textField.getText();
            }
        }
        else{
            textField.setText("请重新选择");
        }
    }
})；     
```   

### 静态方法： createCenterPanel()    

创建信息输出窗口，这里有两个需要注意的地方。一个需要给是文本域`JTextArea()`设置自动换行：
```java   
JTextAreaObject.setLineWrap(boolean);  // 默认为false，不自动换行            
```    
当布尔参数为`false`的时候，将不自动换行；`true`激活该功能。另外需要了解的是，对于英文字符自动换行有两种风格，可以通过    
```java    
JTextAreaObject.setWrapStyleWord(boolean);  //默认为true
```   
设置。布尔参数为`true`意思是在单词边界处换行（每行最右侧可能留白），当设置为`false`时候在字符边界处换行，右侧不留白，但最右侧单词可能会被分成两部分显示。    

另一个是需要注意的是把设置好的文本域添加到滚动条panel里面：
```java    
JScrollPane scorllPane = new JScrollPane(JTextAreaObject)   
```     
滚动条默认是当文字超出范围文本域后才显示，但可以通过以下语句主动激活其常显示功能：   
```java   
scrollPane.setVerticalScrollBarPolicy( 
    JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);   
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
scrollPane.setHorizontalScrollBarPolicy();    
```   
参数相应地为：     
```java   
params:   
@ JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS   
@ JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED   
@ JScrollPane.HORIZONTAL_SCROLLBAR_NEVER       
```     

最后将`scrollPane`组件加入到`centerPanel`。   
方法中还有一条语句是`centerPanel.serBorder(new EtchedBorder)`，是设置边框显示风格用的，去掉无碍。    


### 静态方法： createSouthPanel    
最下面一层panel，内容很简单，实现“开始”和“退出”两个按键。其中：    
“开始”按键需要添加用来遍历文件、执行主类方法、并打印相关信息到文本信息域的事件监听器，“退出”按键添加退出功能的事件监听器。     

`for(variable: collection)`方式遍历路径下所有非文件夹文件：    
```java   
File files = new File(path);        // 获取路径文件
File[] fs = files.listFiles();      // 获取文件列表
for (File f: fs){                   // 遍历文件
    if( !f.isDirectory() {          // 判断是否是次级路径
        AliTableOCR.submit2AliAPI() // 调用主类方法
        infoPrint.append(String.format("%s 完成转换\n", f.toString()));
        // 添加信息到文本域   
        infoPrint.paintImmediately(infoPrint.getBounds());
        // 实时刷新文本域，如果不，程序执行期间不会更新文本域，
        // 而是积累到结束后一次性打印
    })
}
```
