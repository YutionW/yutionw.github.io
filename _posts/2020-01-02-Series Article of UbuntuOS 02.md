---
layout:     post
title:      Series Articles of Ubuntu OS usage -- 02
subtitle:   OS kernel & NVIDIA-SMI/CUDA, Jupyter & Anaconda, LaTeX & TexStudio
date:       2020-01-05
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - Ubuntu OS 
    - Anaconda 
    - Jupyter 
    - LaTeX 
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

> Some days ago, I upgraded my linux kernel from 5.0.0 to 5.3.0, as a consequence the desktop was then stucked frequently, at the meanwhile CUDA did not work at all too. Still some days ago, I deleted mistakenly the texlive components, then I was not allowed to write passages with it. More and more, jupyter notebook upon anaconda was dead too... These are not tolerable, thus one day passes but any normal works, all problems were resolved. Methods and operations for resolving these problems are recorded as below, that I hope be helpful for others else and myself after that.  

##  NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver. Make sure that the latest NVIDIA driver is installed and running

As what the sentence means that the current nvidia GPU driver could not match with GPU at all. This problem occurred after upgrading linux-kernel from 5.0.0 to 5.3.0, so that it appeared as GPU driver that being installed during the former kernel period did not work within the current kernel at all. Retreating the linux-kernel back to the original version would resolve the two (being observed) problems.<br>  
### Retreating to a old version but reserving the current
When you do not want to delete it but only to SELECT to use the old version, changing grub and update it can be satisfing.<br>  
Run
```bash
$ sudo vim /etc/default/grub
```
Find the item ***GRUB_DEFAULT=0*** and then modify it as your actual setting. For me, I have 2 kernel version 5.3.0 and 5.0.0, and the default kernel is always the newest i.e. 5.3.0. That means I'd enter the second item (start as 0) "**Advanced Ubuntu**" and select the third item (2 in order, 1 is "**linux-image-5.3.0-37-genericl(recoverd)**") "__linux-image-5.0.0-26-genericl__" to enter a non-recoverd 5.0.0 kernel system. As the above order, I set ***GRUB_DEFAULT*** item as **"1> 2"** (mention the quatation marks and blank) to enter the second and third item sequencely. <br>  
Then, ``wq`` it and update the changing:
```bash
$ sudo upgrade-grub
``` 
to apply it.<br>  

### Deleting the newer and entering system without selection
You'd enter the old version kernel system before all operations. Run
```bash
$ uname -r
```
to display the percious kernel verson you currently use.
```bash
$ dpkg --get-selection | grep image
```
to list all linux images that can be choosed in the machine. Delete the version which are not useful at all as: 
```bash
$ sudo apt-get remove linux-image-x.xx.x-xx-generic
$ sudo apt-get remove linux-module-extra-image-x.xx.x-xx-generic  
$ sudo apt-get remove linux-head-image-xxx.xx.x-xx-generic
$ sudo apt-get autoremove
```
Finally if **/etc/default/grub** once been changed, recovering it back to **GRUB_DEFAULT=0** and `upgrade-gurb`.

### Forbidding ubuntu to upgrade kernel  
```bash
$ sudo apt-mark hold linux-image-x.xx.x-xx-generic
$ sudo apt-mark hold linux-module-extra-x.xx.x-xx-generic
$ sudo apt-mark hold linux-head-image-x.xx.x-xx-generic
```
Re-allowing the upgrade by the above commands that replacing `hold` with `unhold`.

## Re-install Tex-Live and TexStudio  
To uninstall Tex-Live, run commands 
```bash
$ sudo apt remove texlive*
$ sudo rm -rf /usr/local/texlive/ # delete a whole path
$ sudo rm -rf ~/.texlive-201*/ # delete a whole path
```
Download new installing image from [Tsinghua tuna](https://mirrors.tuna.tsinghua.edu.cn/CTAN/systems/texlive/Images/) ( China Mainland), then mount texlive image into `/mnt`. <br>  
After image being ready, run commands below:<br>  
```bash
$ sudo mount -o loop texlive2019.iso /mnt/
$ cd /mnt
$ ./install-tl -gui
```
About 20 minutes of making will be cost. After that, modifying the environmental value:  `sudo vim ~/.bashrc`: add sectences below to its end (delete the originals and add nows if a former version was once exist):<br>  
```bash
export MANPATH=${MANPATH}:/usr/local/texlive/2019/texmf-dist/doc/man
export INFOPATH=${INFOPATH}:/usr/local/texlive/2019/texmf-dist/doc/info
export PATH=${PATH}:/usr/local/texlive/2019/bin/x86_64-linux

$ source .bashrc
``` 

Remember unmounting the image by `sudo umount /mnt/`.

## TexStudio And its config  
Installing and removing via `apt` are recommended:  
1. add ppa source into repository: 
   ```bash
   $ sudo add-apt-repository ppa:sunderme/texstudio
   $ sudo apt update
   ```
2. install via `apt install`
   ```bash
   $ sudo apt install texstudio
   ```
3. configure  
   1. set "Options" -> "Configure TeXstudio" -> "Editor" -> "Editor Font Encoding" as **UTF-8**
   2. set values of "Options" -> "Commands" -> "LaTeX" from `latex -src -xxx=xxx` into `/usr/local/texlive/2019/bin/x86_64-linux/latex -src -xxx=xxx`
   3. items `PdfLaTeX`, `XeLaTeX`, `LuaLaTeX`, `BibTeX`, `BibTeX8`, `Biber`, `Makeindex` are same as `LaTeX` in change.
4. remove via `apt remove`
   ```bash
   $ sudo apt remove --autoremove texstudio*
   ```  

## Kernel Restarting: The kernel appearences to have died, it will restart automatically  
Practically based analysis shows this problem is primally caused by a mistaken installation order between `Ipython` and `Jupyter Notebook`. That the vresion is too high of a pip package named `tornado` is always appointed to causing this error. It's not the root. Sure that a high version of tornado cause the jupyter kernel error, while what causes a high tornado version is that, Ipython is installed into anaconda environment before jupyter. <br>  
Remedy for this is uninstall `Ipython` and `Jupyter` components (where tornado involved) then re-install them via pip.
```bash
(conda envs) $ pip uninstall ipython  
(conda envs) $ pip uninstall jupyter* notebook
```  
Run the following command to delete components directly when permission limited and `sudo` does not work:  
```bash
(conda envs) $ pip uninstall tornado
/path/of/.conda/envs/lib/site-packages $ rm -rf jupyter* ipython* tornado*  
```  
Then just run:  
```bash
(conda envs) $ pip install jupyter notebook 

(conda envs) $ pip install jupyter notebook --user # if permission limitted
```      
Jupyter will work and ipython is also installed.

