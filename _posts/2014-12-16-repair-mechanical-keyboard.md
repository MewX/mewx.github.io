---
layout: post
title: "动手维修机械键盘"
subtitle: "修复PCB变形导致的键轴脱焊"
date: 2014-12-16 12:50
comments: true
author: MewX
published: true
categories: [life]
---

几个月前看到淘宝上有卖二手机械键盘的PCB+键轴的，型号是Cherry G80-3850（这个我不懂 = =、），售价110。这个价格相当低，然后就入手了。买之前店家说不保证能用，但是通过看PCB的照片和评论，基本上可以确定PCB不会有问题，于是就冒险入手了第一个机械键盘，权当入门。

拿到板+轴后，接上PC用“keyboard test utility”这个软件测试了一下，5个键无效，而且都在小键盘上，所以无碍，感觉捡了漏子 0.0 （是不是这样的？）

今天找老师借来了电烙铁套件，决定手动修复一下。经过一点小测试，判断问题出在轴和PCB的焊接处，所以把有问题的键轴焊接处的焊锡都吸掉，重新焊接，即可。这部分不麻烦，于是按照这个思路修复了3/5个坏键。

接下来的就麻烦了，不知道怎么回事，重新焊接也没问题，于是把键轴下下来，发现引脚太短，确实是一直焊不上，处于脱焊状态。想把焊锡点成长条状，但是没这个技术啊，所以只能用嫁接的方法了。

我取了双绞线的铜线，然后绕成套索状套到引脚上，通过焊锡固定：

<center><img src="{{ site.cdn }}imgs/201412/06-mechanical-keyboard-shaft.png" style="max-width:100%;"/></center>

然后焊到电路板上（看到千疮百孔了吧 XD 简直手残）：

<center><img src="{{ site.cdn }}imgs/201412/07-mechanical-keyboard-shaft-on-PCB.png" style="max-width:100%;"/></center>

<center><img src="{{ site.cdn }}imgs/201412/08-mechanical-keyboard-shaft-on-PCB-ok.png" style="max-width:100%;"/></center>

最后再用“keyboard test utility”测试，完美通过：

<center><a href="{{ site.cdn }}imgs/201412/09-mechanical-keyboard-test.jpg" target="_blank"><img src="{{ site.cdn }}imgs/201412/09-mechanical-keyboard-test.cache.png" style="max-width:100%;"/></a></center>

以上。
