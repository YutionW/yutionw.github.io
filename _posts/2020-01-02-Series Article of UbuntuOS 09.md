---
layout:     post
title:      Series Article of UbuntuOS -- 09
subtitle:   grep 文本搜索和 sed 文本替换               
date:       2021-07-21
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Ubuntu OS
---


> 参照 《Linux Shell 脚步攻略（第二版）》（人民邮电出版社）。     

## 使用 grep 在文件中搜索文本     

grep 最大的特性是接受正则表达。下面依照《Linux Shell 脚步攻略（第二版）》（人民邮电出版社）第四章三节的相关内容做出介绍。       

###  基本使用     
1. 搜索包含特定模式的文本行：      
   ```shell    
   $ grep pattern filename     
   this is a line containing pattern       

   $ grep "pattern" filename       
   this is a line containing pattern       
   ```     

2. 从标准输入流 stdin 中读入数据（管道操作符）：     
   ```shell    
   $ echo "this is a word\nsecond line" | grep word        
   this is a word       
   ```     

3. 对多个文件进行搜索，比如当前路径下 grep_test1.txt, grep_test2.txt 分别有"patterned1"，"patterned2"这两行内容：       
   ```shell      
   $ grep "pattern" grep_te*      
   grep_test1.txt:patternned1
   grep_test2.txt:patternned2
   ```     
   好像不打印到底在第几行。     

4. 使用 `--color` 参数在屏幕输出中着重标记匹配到的字符串：     
    ```shell      
    $ grep "pattern" grep_te*      
    grep_test1.txt:patternned1
    grep_test2.txt:patternned2
   ```      
   Markdown 上体现不出来，在我的 linux terminal 里面，pattern这个字符串是红色的。    
   而且，至少 bash 环境下即使不加 `--color` 也会着重显示，似乎是缺省值就是 `auto`。但可以选择 `--color=never` 关闭颜色。      
   `--color` 参数有 always, never, auto 三个选项。    

5. 使用 `-E` 参数开启[正则表达](https://www.ouc-liux.cn/2021/05/08/Series-Article-of-UbuntuOS-05/)匹配：
    ```shell
    $ grep -E "[a-z]+" filename        
    ```    
    匹配 filename 中的任意单词。尝试了几个案例，正则表达式不在双引号之内似乎不行。    

6. 使用 `-e` 参数匹配多个模式：     
    跟上一个一定分清楚，参数大小写敏感：      
    ```shell     
    $ echo "this is a line of text" | grep -e line -e text -o    
    line    
    text
    ```

7. 使用 `-o` 参数只打印文件匹配到的文本部分：     
    ```shell     
    $ echo this is a line. | grep -o -E "[a-z]+\."
    line.    
    ```

8. 使用 `-v` 参数打印匹配行之外的所有行：   
    ```shell   
    $ echo -e "this is a word.\nnext line." | grep -v "word"     
    next line.    
    ```    

9. 使用 `-c` 参数统计包含匹配字符串的行数（**不是次数**）：    
    ```shell     
    $ echo -e "pattern1, pattern2\npaern03\nptern" | grep -c "pattern"
    1
    ```    
    显然由于只有第一行包含了两个"pattern"，于是输出为 1 。       

10. 使用 `wc` 命令统计匹配字符串出现的**次数**：     
    `wc` 命令的使用见 [一些常用的有用的linux命令 ](https://www.ouc-liux.cn/2021/05/07/Series-Article-of-UbuntuOS-04/#wc-%E5%91%BD%E4%BB%A4%E7%BB%9F%E8%AE%A1%E6%96%87%E4%BB%B6%E5%AD%97%E6%95%B0%E8%A1%8C%E6%95%B0%E5%AD%97%E8%8A%82%E6%95%B0)。    
    具体思路是使用 `-o` 参数将匹配到的字符串逐行打印为标准输出，并通过管道作为标准输入送如 `wc` 命令的执行序列：      
    ```shell    
    $ echo -e "1, 2. 3\n4,5\n6\n78" | grep -o -E "[0-9]" | wc -l    
    8
    ```     

11. 使用 `-n` 参数打印包含匹配字符串的行号：     
    ```shell    
    $ echo -e "line1\nline2\nline_3\nline_4" | grep -n _     
    3:line_3     
    4:line_4
    ```    

12. 使用 `-l` 参数寻找匹配文本位于哪一个文件：     
    ```shell    
    $ grep -l string sed_test1.txt grep_test*     
    sed_test1.txt     
    $ grep -l pattern sed_test1.txt grep_test*     
    grep_test1.txt     
    grep_test2.txt  
    ```    
13. 使用 `-i` 参数进行大小写不敏感搜索：     
    grep 默认大小写敏感，可以使用 `-i` 参数忽略大小写：     
    ```shell       
    $ echo "HellO WoRlD" | grep "hello world"    
    ( print nothing )     
    $ echo "HellO WoRlD" | gerp -i "hello world"    
    HellO WoRlD
    ```    
 
###  进阶用法     
使用 `-R/-r` 参数在多级路进行径递归搜索。   
根据路径包含内容的多少，耗时长短不一。如果路径下文件及文本量过大，时耗可能非常长。比如在 `./yolov5` 路径下搜索字符串 "train("：    
```shell    
$ time grep -r -n "train(" ./yolov5/    
./yolov5/train.py:38:def train(hyp, opt, device, tb_writer=None, wandb=None):     
./yolov5/train.py:223:          model.train()     
./yolov5/train.py:482:          train(hyp, opt, device, tb_writer, wandb)     
./yolov5/train.py:556:          results = train(hyp.copy(), opt, device)      
./yolov5/models/yolo.py:273:    model.train()    

real    10m39.265s     
user    0m44.356s     
sys     0m17.693s    
```    

## 使用 sed 进行文本替换      

sed 是流编辑器（stream editor） 的缩写，我看来这个东西最大的优势就是允许正则表达。使用sed 进行文本替换非常方便高效。     

### 替换文本或来自标准输入的字符串。     
```shell
$ cat sed_test1.txt       
replace_stringed      
edreplace_string      
replace_string      
edreplace_stringed     
$ 
$ sed "s/string/str/" sed_test1.txt     
replace_stred    
edreplace_str    
replace_str     
edreplace_stred    
$ echo "patterntest" | sed "s/pattern/replace_string/"    
replace_stringtest
```      
需要注意，默认情况下 sed 只会将替换后的文本打印到标准输出流而不会保存。

### 替换并保存       
使用 `-i` 参数在替换的同时保存文件。
```shell       
$ sed -i "s/string/str/" sed_test1.txt     
$ cat sed_test1.txt    
replace_stred   
edreplace_str   
replace_str   
edreplace_stred    
```
`-i` 参数应当是将原本打印到屏幕上的标准输出重定向到文件，于是一定要从文件中读取内容，否则会报错：   
```shell     
$ echo "patterntest" | sed -i "s/pattern/replace_string/"
sed: no input files
```    

### 全部替换与部分替换     
上面两部分的例子实际上是寻找并替换每行第一个被匹配的模式，如果要替换全部内容，需要在命令尾部添加参数 `g`：    
```shell    
$ sed "s/pattern/repace_string/g" file
```    
该后缀意味着对每行每一处进行替换。如果要求从第 N 项开始进行替换，则应使用 `Ng` 参数：      
```shell    
$ echo thisthisthisthis | sed "s/this/THIS/"
THISthisthisthis    
$ echo thisthisthisthis | sed "s/this/THIS/g"
THISTHISTHISTHIS    
$ echo thisthisthisthis | sed "s/this/THIS/2g"
thisTHISTHISTHIS    
$ echo thisthisthisthis | sed "s/this/THIS/4g"
thisthisthisTHIS    
```       

### 指定行替换    

事实上，"s/pattern/replace_string/" 这种用法是全文执行操作，更直观一点解释如：   
```shell     
$ echo -e "this1his\nthis2this\nthis3this\nthis4this" | sed "s/this/THIS/"
THIS1his
THIS2this
THIS3this
THIS4this
```      
如果要指定执行替换操作的行，在 `s` 前添加行范围数值：    
```shell     
$ echo -e "this1his\nthis2this\nthis3this\nthis4this" | sed "2,4s/this/THIS/"
this1his
THIS2this
THIS3this
THIS4this
```      
该指令的意思既是制定执行范围为第 2 到 4 行。     

### 移除行     
`/pattern/d` 可以移除包含匹配模式的行。比如当我们知道空白行中行尾标记 `$` 紧跟着行首标记 `^` ，就下面一行命令删除文本中的空行：    
```shell    
$ sed "/$^/d" file     
```    

