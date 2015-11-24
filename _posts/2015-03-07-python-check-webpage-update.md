---
layout: post
title: "Python脚本监视网站是否发布了新帖"
date: 2015-03-07 17:00
comments: true
author: MewX
published: true
categories: [python, web]
---

　　突然发现网易《风暴英雄》激活码每天都会在新闻页面底部贴上，自己也是很想体验一下这款游戏，谕示在想开机的时候是否可以用闲置计算能力在后台跑一个随时检索是否有新帖的工具呢？

　　于是想写一个通用的检测网站上是否发布新帖的工具，用Python。

　　这个脚本纯属娱乐，某宝上直接2毛钱就能买到了。

<br/>

**Python脚本**

<?prettify lang=python?>

    # -*- coding:utf-8 -*-
    import os, urllib2, urllib, sys, base64, time

    LAST_TITLE = "《风暴英雄》加兹鲁维攻略：地精科技震撼"
    BaseURL = "http://a.163.com/"
    MusicPath = "E:\\MewX_Projects\\MewXChinesizingTools\\CROSS+CHANNEL\\PatchChs\\PatchChs";

    def tryPost( ):
        req = urllib2.Request(BaseURL);
        urllib2.urlopen(req);
        fd = urllib2.urlopen(req);
        ret = "";
        while True:
            data = fd.read(1024)
            if not len(data):
                break
            ret += data;
        return ret;

    def soundStart():
        if sys.platform[:5] == 'linux':
            import os
            os.popen2('aplay -q' + MusicPath)
        else:
            import winsound
            winsound.Beep(5000, 200)

    while True:
        page = tryPost();
        if page.find(LAST_TITLE)!=-1:
            #print "yes";
            pass
        else:
            print "no";
            soundStart();
        time.sleep(1);

<br/>

**程序说明**

- 首先定义了页底最后一个帖子标题名，如果有新帖，则会自动将这个标题挤到下一页。
- 每隔1秒get一次网页页面，函数原型time.sleep(int sec)。
- 检测手段是判断是否页面中含有LAST_TITLE字符串（模式匹配）。
- 如果检测到不含有LAST_TITLE了，则播放提示音。我这边windows下面使用的是蜂鸣器～很赞！

<br/>
