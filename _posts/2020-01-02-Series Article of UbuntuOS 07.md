---
layout:     post
title:      Series Article of UbuntuOS -- 07 
subtitle:   vim 中的查找和替换          
date:       2021-07-09
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Ubuntu OS
    - vim
---

> 本意是写一篇 vim 专题博客或一个专题 series，把所有相关内容扔到里面。但好像没什么内容，遂没写；又但是，查找和替换还是挺重要的内容，单独在ubuntuOS series 下面开一篇博客吧。    

1. 英文字符下按下 `/` 自动进入控制栏，可进入查找模式。输入要查找的字符串并回车，光标会跳转从当前行向下的到第一个匹配。`n` 查找下一个，`N` （`shift + n`） 查找上一个。   
2. vim 支持正则表达式，比如控制栏里 `/cfg$` 即代表匹配位于行尾的 `cfg` 字符。有关正则表达式的更多内容可以看 UbuntuOS 系列第五篇博客： [linux中正则表达的一点儿小知识](https://www.ouc-liux.cn/2021/05/08/Series-Article-of-UbuntuOS-05/)。     
3. vim 默认大小写敏感查找，但也允许指定不敏感。比如底部指令栏键入 `/cfg` 或 `/cfg\C` （注意是反斜杠），则指查找 “cfg” 字符串；`/cfg\c` 则查找 `Cfg, CFg, CFG, cFg, cFG, cfG, CfG, cfg` 等所有字符串。      
4. 常规（非输入、替换、选择等）模式下，按下 `*` 为查找光标所在处的单词，注意是单词。也即，如果光标所在处单词为 `func`，则只查找本行开始向下的单独出现的 `func`，如 `func(args[...])` 之类的父串是不被匹配的。但，`g*` 可以。    
   

5. 替换的指令和 linux 下的 `sed` 非常相似，语法为：
   ```shell    
   :{作用范围}s/{目标}/{替换}/{替换标志}
   ```    
   例如 `:%s/foo/bar/g` 会在全局范围(%)查找 foo 并替换为 bar，所有出现都会被替换 (g)
6. `s`用来指定行范围。 s 前面无参数意为当前行执行；加百分号如 `%s` 意为全部行；加数字用于限定范围，如 `5,12s/` 意为第 5 到 12 执行操作， `.,+2`意为当前行和接下来两行。
7. 结尾 `g` 参数表示 glabal，将行的每个符合匹配的模式进行替换，不加则只替换第一个。其他的尾部参数如 `i` 参数表示大小写不敏感， `I` 表示大小写敏感； `c` 表示需要确认。等等。尾部参数可以组合使用，比如 `:s/pattern/replace_string/gic` 这样。