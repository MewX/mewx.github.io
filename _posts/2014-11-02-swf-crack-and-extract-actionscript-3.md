---
layout: testpage
title: "ActionScript3.0的SWF文件的破解与修改研究"
date: 2014-11-02 12:00
comments: true
author: MewX
published: true
categories: [Flash, Crack, AS3, 汉化]
---

　　最近受某人委托研究一下某个游戏的汉化，发现这游戏完全是用Flash写的，主程序也是Adobe Flash导出的exe程序，其他的资源也都是在swf中。  
　　由于这是我第一次接触这样的破解，希望将破解流程与大家分享一下。包括一些工具的可用性也会做一个总结。  
　　  
　　  

## 一、网上流传的工具可用性  

　　  
　　**1. SWF Decompiler**  
　　　叫这个名字的有两个软件，图标如下图所示：  
<center><img src="{{ site.baseurl }}imgs/201411/01-two-swf-decompilers.png" /></center>  
　　　右边的那个也就是“百度”上广为流传的“硕思SWF反编译工具”了，全名“Sothink SWF Decompiler”，这也就意味着这个软件的破解版更好找 :P  
　　　这个软件安装之后会叫你选择是否安装其他的工具，有一个“Sothink SWF Editor”，这个是一个能查看16进制dump文件结构的工具，只是没找到破解版比较可惜 \_(:з」∠)\_  
　　　**更正：左边的全名是“FlashDecompiler Trillix”，功能强大，同样也能找到破解版的，非常推荐使用这个软件，因为这个工具自带了Dump结构查看工具，可以很容易地分析swf文件结构！破解版很完美！**  
<center><a href="{{ site.baseurl }}imgs/201411/12-dump-view.png" target="_blank"><img src="{{ site.baseurl }}imgs/201411/12-dump-view.png" style="max-width:100%; height:auto;"/></a></center>  
　　　不用破解版也就意味着你不能将文件导出为.fla文件，也就不能继续接下来的操作了。  
　　  
　　**2. ActionScript Viewer (ASV)**  
　　　这款软件据说可以直接修改ActionScript，于是果断慕名寻找试(po)用(jie)版啊！
　　　但是找了很久发现国内流传的破解版主要是2011年版本和以前的，我用过的能用的最高的版本也就是ASV2011，这个版本据说能支持到AS2，于是这款AS3写的游戏就无法支持了 :(  
　　　当然，现在这个软件现在有了ASV2012和ASV2013版本，但是售价是999刀，国内也是禁止购买的，连体验版我也没有找到，杯具啊。  
　　  
　　**3. 请看续篇，地址见页底**  
　　  
　　  

## 二、破解流程  

　　  
　　**1. 用SWF Decompiler把swf导出成fla文件**  
　　　是时候掏出我们的神器了，Sothink 7破解版（此贴不会发布任何破解程序 =。=），启动LOGO如下：  
<center><img src="{{ site.baseurl }}imgs/201411/02-swf-decompiler-logo.png" /></center>  
　　　把需要拆解的SWF拖动到窗口里面，点开下图上部的“Export FLA”，保存到一个路径，点“OK”。  
<center><img src="{{ site.baseurl }}imgs/201411/03-swf-to-fla.png" /></center>  
　　　导出的目录将会是一个fla文件加上很多as脚本，接下来就是拼积木的过程。  
　　  
　　**2. 用Adobe Flash组装动画文件**  
　　　经过上一步的操作，所有的as文件全部都是以明文的形式存放的，包括这个游戏的脚本，如下图所示：  
<center><a href="{{ site.baseurl }}imgs/201411/04-sc-example.png" target="_blank"><img src="{{ site.baseurl }}imgs/201411/04-sc-example.png" style="max-width:100%; height:auto;"/></a></center>  
　　　汉化的任务就是将脚本提取出来，将译文封装回去，让程序正常运行，所以接下来要组装这些文件。  
　　  
　　　首先用Adobe Flash载入导出的fla文件，在【文件】-【ActionScript设置】的“源路径”中添加整个导出的目录。*（我这里把目录转移了，所以和之前的截图目录不一致，总之就是第一步中导出的那个目录。）*并且将添加的目录上移至第一位，否则可能会少导入一些内容。如图：  
<center><img src="{{ site.baseurl }}imgs/201411/05-as-setting.png" /></center>  
　　　然后在【视图】-【库】中把需要的添加类的元件的类给添加好，例如这个声音就有一个对应的类：  
<center><a href="{{ site.baseurl }}imgs/201411/06-sound-class.png" target="_blank"><img src="{{ site.baseurl }}imgs/201411/06-sound-class.png" style="max-width:100%; height:auto;"/></a></center>  
　　　上图是右击“001f”-【属性】的界面，在右键菜单中你还可以看到编辑类，点开就可以编辑相应的代码了。  
　　　**但是**这里要注意一个问题：用SWF Dec导出的fla文件里面的元件对应的类可能并不是正确对应的，你需要在上图的界面中设置好对应的类名。  
　　　**当然**，你可能还会遇到一个问题，那就是目录下的as类文件都有对应的了，Adobe Flash不允许使用，就是如下图所示的情况：  
<center><a href="{{ site.baseurl }}imgs/201411/07-fail-to-change-class.png" target="_blank"><img src="{{ site.baseurl }}imgs/201411/07-fail-to-change-class.png" style="max-width:100%; height:auto;"/></a></center>  
　　　那就比较麻烦了，需要手动先去把所有的“为ActionScript导出(X)”这个勾给去掉，然后再一个一个设置正确。  
　　　对于这个游戏，所有swf里面的音频是人物对话，而人物对话的类里面只是简单的继承，所有的音频都是一样的，不改也是没有问题的，可以播放出声音。但是通过阅读as源码发现，该游戏调用的是getDefinitionByName( )来建立语音表的，所以类名和语音的对应关系至关重要，也就是说得手动去改每个音频对应的类名 \_(:з」∠)\_  
　　  
　　**3. 导出swf偷梁换柱**  
　　　在【文件】-【导出】-【导出影片】菜单中就可以导出SWF影片了，然后替换游戏原来的SWF。看！可以运行了：  
<center><img src="{{ site.baseurl }}imgs/201411/08-game-screen-fail-GBK.png" /></center>  
　　　实际上我把文本改成了“<这句话是测试的中文翻译。>”，但是游戏只识别了日文字符集里面的文字，所以接下来还要进行转区处理。因为我保存的as已经是UTF-8了，而且反解也可以解出原文，很显然是游戏忽略了GBK里面的文字，这个问题以后再写。  
　　　**继续运行，卡住了！！！**本来是要放语音的，但是卡住了，语音没有播放出来，**那么问题来了，这是为什么？**（不要打我，我是真心求教）  
　　  
　　  
　　2014.11.05 对于本篇中未解决的问题，我进行了进一步研究：  
　　**[《SWF文件的破解与修改研究（续）》]({{ site.baseurl }}blog/201411/swf-crack-and-extract-actionscript-3-then/)**  
　　  
