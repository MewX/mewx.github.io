---
layout: post
title: "历史总是惊人的相似(app用户增长曲线)"
date: 2015-08-07 22:43
comments: true
author: MewX
published: true
categories: [android, app, life]
---

还是说说app的事情，“轻小说文库”是新版的Material风格的app，由于官方网站用户量大，即使没有登陆市场，app也能拥有很多用户量。在去年的时候设计没有思路，做了一个比较简易的app，兼容安卓2.3，后来有了设计方案就重新制作了，原来的代码保留了35%，新版的总代码（包括布局）有20k行以上，兼容旧版存档。

之前官网迁移域名和服务器，导致所有的app都要在内部修改域名，旧版也很久没有维护了（那时是在Eclipse+ADT做的，新的环境也完全没有安装Eclipse），然后考虑到兼容2.3和部分低配机器的特性，我还是决定维护一下，更名：圣诞版->典藏版。使用了Eclipse Mars + ADT 23导出Gradle再在Android Studio 1.3上开发。因为在新的Eclipse上编译问题真的蛮多，编译之后dex总是找不到需要的类，而且我也没有混淆 =。= 于是git reset hard重新来过。

好了，来说说重点，友盟的数据统计真的很有趣，图表数据并存。今天是发布后8天，用户量达到了9000，内测用户是2000。

<center><img src="{{ site.cdn }}imgs/201508/statistics-new1.jpg"/></center>

<center><img src="{{ site.cdn }}imgs/201508/statistics-new2.jpg"/></center>

<center><img src="{{ site.cdn }}imgs/201508/statistics-new3.jpg"/></center>

<center><img src="{{ site.cdn }}imgs/201508/statistics-new4.jpg"/></center>

上面是新版的app统计，“历史总是惊人的相似啊”！下面的是旧版app典藏版的用户量（上次复活性维护我加了友盟统计）：

<center><img src="{{ site.cdn }}imgs/201508/statistics-old1.jpg"/></center>

<center><img src="{{ site.cdn }}imgs/201508/statistics-old2.jpg"/></center>

经常会觉得概率真的很神奇，看不到的事情但是却能预测结果发生的可能性。数学期望在样本容量大的时候体现得淋漓尽致，就比如说一天哪个时段下载人数最多这样的数据。为什么彼此不认识，但是却有着相同的习惯呢，彼此不认识却可以有着神同步似的行为 \_(:3」∠)\_ 等复习复习数理统计的时候好好琢磨琢磨~
