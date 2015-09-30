---
layout: testpage
title: "SWF文件的破解与修改研究（续）"
date: 2014-11-05 14:00
comments: true
author: MewX
published: true
categories: [Flash, Crack, AS3, 汉化, python]
---

　　本篇是针对上一篇未完成的研究进行的补充，对于无法显示中文、改过脚本无法导入回去等问题都进行解决。  
　　上一篇：**[《ActionScript3.0的SWF文件的破解与修改研究》]({{ site.baseurl }}blog/201411/swf-crack-and-extract-actionscript-3/)**  
　　  
　　  

## 一、那么问题来了？  

　　上次我使用Sothink SWF Decompiler导出的fla文件用Adobe Flash CS6进行再次开发，然后导出swf发现游戏在播放音频的地方卡住了，这里主要有两个原因：  
　　　　**1. 类属性的错误**：按照提取出来的资源顺序，应该使用逆序进行类的划分，而我使用的是顺序。  
　　　　**2. 提取工具的问题**：这些提取器的设计初衷就是提取资源，并没有考虑让提取出来的资源再次封装回去。  
　　所以，封装回去会失效也是没有办法的事情。  
　　  
　　  

## 二、超级强大的工具  

　　在不断地Google和各种关键词的尝试，我发现了一款完全免费而且设计初衷就是为了修改swf文件而存在的软件！  
　　它的名字就叫 —— “[JPEXS Free Flash Decompiler](http://www.free-decompiler.com/flash/)”！  
　　这款软件的核心使用Java写的，所以它具有跨平台的特性！**开源的！开放接口的！**  
　　软件运行界面如下：  
<center><a href="{{ site.baseurl }}imgs/201411/09-jpexs-free-flash-decompiler.png" target="_blank"><img src="{{ site.baseurl }}imgs/201411/09-jpexs-free-flash-decompiler.png" style="max-width:100%; height:auto;"/></a></center>  
　　  
　　这款强大的工具被埋没的原因大概是和商业软件的推广有关吧，之前使用的商业软件完全不及这款**自由软件**的功能。（于是又要扯到《大教堂与市集》了……）  
　　  
　　下面来说说这款软件的**强大功能**：  
　　　　1. 直接编辑ActionScript脚本，支持P-code（伪代码）安全编辑和纯AS脚本实验编辑功能。也就是说允许编辑P-code，而且是安全得到保障得的；另外就是允许直接在swf上编辑ActionScript，这个对于偷懒的人来说可以尝试。  
　　　　2. 导出完美的fla文件。这款软件同样可以导出fla，但是比其他软件要强很多，我用这款软件导出了游戏的第一个脚本，然后修改成翻译后的脚本可以直接运行的，完全没有在之前两款软件上发生的错误。软件做的太棒了，真想给他们捐钱了 \_(:з」∠)\_  
　　　　3. 可以直接扩展字库。  
　　  
　　  

## 三、脚本提取搞起  

　　**1. 解压swf文件**  
　　　首先看到游戏目录下68个剧本swf文件，果然是想写个工具来提取文本了，但是这些文件都是“CWS”文件头，是经过压缩的。所以需要先解压，再提取明文。  
　　　这里我在找提取工具的过程中发现了一个[小工具](http://hp.vector.co.jp/authors/VA020429/ffmpeg/swf_comp.html)，于是用它把所有脚本都解压了，文件头变成“FWS”（SWF反过来）了。现在文件内的内容全是明文，令人心情愉悦啊。如图：  
<center><a href="{{ site.baseurl }}imgs/201411/10-raw-content.png" target="_blank"><img src="{{ site.baseurl }}imgs/201411/10-raw-content.png" style="max-width:100%; height:auto;"/></a></center>  
　　  
　　**2. 提取swf文件中的脚本**  
　　对于68个已经解压的脚本文件，果断得写个小工具把脚本提取出来，于是找规律，写了个py脚本来提取文件信息：  

<?prettify lang=python?>
    #-*-encoding:utf-8-*-
    import sys, os

    def get_recursive_file_list(path):
      current_files = os.listdir(path)
      all_files = []
      for file_name in current_files:
        full_file_name = os.path.join(path, file_name)

        if not os.path.isdir(full_file_name) and
          full_file_name[ len(full_file_name)-4 : len(full_file_name)] == ".swf":
          all_files.append(full_file_name)

      return all_files

    # generateList 1>l.txt
    dirc = ".\\";
    for fileName in get_recursive_file_list( dirc ):
      swf = open( fileName, 'rb' );
      s = swf.read( );
      fileSize = len( s );

      # 04 4E 65 78 74
      scriptEnd = s.rfind( "\x04\x4E\x65\x78\x74" );
      if scriptEnd == -1: print( "scriptEnd = 0" );

      secondPos = s.rfind( "\xBF\x14", 0, scriptEnd );
      if scriptEnd == -1: print( "BF14 not found" );

      # 06 73 70 6C 69 63 65
      scriptBeg = s.find( "\x06\x73\x70\x6C\x69\x63\x65", secondPos, scriptEnd );
      if scriptEnd == -1: print( "splice not found" );

      print( fileName[len(dirc):len(fileName)] + "\t" + str(fileSize) + "\t" +
        str(secondPos+2) + "\t" + str(scriptBeg+7) + "\t" + str(scriptEnd+5) );

　　输出出来的是：文件名+文件大小+应用字符串大小数值的存储位置+脚本开始处+脚本结束处。可以使用1>fileList.txt重定向一下就到外部文本里了；接着就是写另一个C++工具处理了。C++因为我有自己的Unicode库，所以跟文本有关的操作我都用的是C++。  
　　  
　　最后提取的脚本的一小部分预览：  

<?prettify lang=python?>
    #0001: BGMstop
     Tr->: BGMstop

    #0002: BGMplay`37`1.0
     Tr->: BGMplay`37`1.0

    #0003: introBG`01
     Tr->: introBG`01

    #0004: MsgWin`show
     Tr->: MsgWin`show

    #0005: SndPlay`se_108`0.3`0`true
     Tr->: SndPlay`se_108`0.3`0`true

    #0006: null
     Tr->: null

    #0007: <明るい日差しが差し込む、いつもと変わらない教室。>
     Tr->: <明るい日差しが差し込む、いつもと変わらない教室。>

    #0008: <いつも通りの面々の、他愛も無い話が聞こえてくる>
     Tr->: <いつも通りの面々の、他愛も無い話が聞こえてくる>

    #0009: ChrPosSet`-35`-13`1.05`1.05`0`2\n
     Tr->: ChrPosSet`-35`-13`1.05`1.05`0`2\n

　　这样提取工作就完成了，坐等翻译。  
　　  
　　  

## 四、简体中文没法显示怎么破？

　　上一篇文章的末尾我运行时截了一张图：是部分不在字库中的字符直接就不显示了。  
　　我自己在Adobe Flash CS6里面做了实验，导入的字库确实是矢量字库，而且导入的时候还让我选择字符集了，导入字库后再导出swf，文件会大很多。  
　　  
　　于是任务就变成了寻找字库。  
　　由于所有文件我都能看到AS3的源码，我发现是在AS\\StoryObj\\MsgWin\\MsgFormat.as里面定义了字体名称“MMCedar P”。最终这个字库文件实体在主程序的第4个内含的SWF中找到，于是使用之前介绍的超级强大软件把字库扩大一下，我把它扩展成“英文+日文+简中+繁中”的微软雅黑字体库了，导出r4.swf。  
　　  
　　导出了修改过字库的swf有什么用呢？没法直接运行啊！接下来就是封回到exe的过程。  
　　  
　　  

## 五、将SWF封回EXE  

　　对于从exe中提取出来的swf文件，我们用16进制编辑器很容易就定位到存储位置了，而且是没有加密的。  
　　用PEid查看之后发现swf直接就存在附加数据段（Overlay Bytes），所以将修改过的bytes替换原来的bytes即可。  
　　但是替换之后发现没法运行，是白屏，于是可以想到是程序作了什么检查，搜索原来bytes的偏移或者大小，果然看到存储大小的地方了，是文件的最后4字节，可以猜到exe运行后是从文件末尾开始读取文件的。修改文件末尾的大小即可成功运行，显示中文！  
<center><img src="{{ site.baseurl }}imgs/201411/11-game-support-chinese.png" style="max-width:100%; height:auto;"/></center>  
　　  
　　最后透露一下，这款游戏是：  
　　**[141031][ティンクルベル] 輪舞曲Duo -夜明けのフォルテシモ- ぷにゅぷりFF**  
　　祝大家游戏愉快 23333333  
　　
