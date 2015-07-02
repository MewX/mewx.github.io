---
layout: testpage
title: "基于微信订阅号的教务管理系统"
date: 2015-05-29 23:27
comments: true
author: MewX
published: true
categories: [php, web]
---

因为参加一个比赛，这两天爆肝写代码啊，累伤掉了，两天熬到4点。

比赛题目需要做这样的一个作品——一个基于微信公众平台的教务管理系统，所以第一次接触微信开发，也是第一次用php写一个比较大的项目。

首先要在`https://mp.weixin.qq.com/`上面申请一个公众号，如果只是做一般的公众号的话，并不需要过多的配置，只要在左侧的菜单栏找到消息推送即可。但是比赛要求必须自己开发，所以需要将微信的消息服务在自己的服务器上实现。这方面稍微看了一下文档，了解了基本的通信原理，就是`GET`消息，然后返回`RAW`的`指定格式的XML`数据。

由于之前我一直在做`轻小说文库`的安卓app，是Material Design风格的，需要用到大量第三方兼容库，所以已经有大量从`GitHub`上找库的经验了。这次也不例外，找到了很多微信开发的工具，搜索的关键词是`WeChat SDK`。之前在百度上搜，竟然有可视化开发工具，也是醉醉的，国人太强大。

于是找到的具有代表性的两个库。一个是`dodgepudding/wechat-php-sdk`，这个是star数量最多的，也是功能最强大的sdk；另一个是`netputer/wechat-php-sdk`，最轻量级的开发包，所有消息回复都支持override，但是唯一遗憾的是不支持微信的`安全模式`，而比赛要求必须使用微信的安全模式传输数据，因为这个代码包简单，所以我直接fork了一下给这个库增加了消息的加密、解密流程，可以参见`MewX/wechat-php-sdk`，只修改了text部分，其他部分也很容易，只要把和`getResponseText(...)`性质的一样的函数仿照着修改一下即可。

关于服务器架设，我这边为了节约SAE的流量，使用了`新花生壳`的内网映射功能。本来Tenda路由器自带的花生壳公网映射，后来发现不行，学校的校园联通宽带实际上仍然是内网映射……不得不用内网映射功能了，这个功能要收费1元，还蛮不错的。在花生壳开启端口映射之后，必须选择80端口，不然微信不认，然后再路由器的`DMZ主机设置`里面把80端口映射到本机即可。

# 系统功能

> 1    账号操作
>
> - 11 账号绑定（语法：11+用户名+密码）：e.g. 11+MewX+pwd \| 亲，密码就别读出来了吧！
>
> - 12 信息查询（语法：12）
>
> - 13 密码修改（语法：13+旧密码+新密码）
>
> - 14 取消绑定（语法：14+密码）

----

> 2    成绩查询
>
> - 21 所有成绩（语法：21）
>
> - 22 课程列表（语法：22）
>
> - 23 某门课成绩（语法：23+课程序号）

----

> 3    课表查询
>
> - 31 今天课表（语法：31）
>
> - 32 明天课表（语法：32）
>
> - 33 昨天课表（语法：33）
>
> - 34 本周课表（语法：34）
>
> - 35 下周课表（语法：35）
>
> - 36 某天课表（语法：36+8位数日期。例如：36+20150513）

----

> 4    通知查询
>
> - 41 通知列表（语法：41）
>
> - 42 查看通知（语法：42+通知序号）

----

> 5    考试查询
>
> - 51 未来考试（语法：51）
>
> - 52 已结束考试（语法：52）

# 数据库设计

**注：写的时候已经发现数据库grade表设计不合理了，但是懒得改了ㄟ(▔，▔)ㄏ**

<?prettify lang=sql?>

    create table student(
    	stuid bigint not null primary key,
        wxid varchar(50),
        pwd varchar(256) not null,
        name varchar(20) not null,
        sex char(1) default 'M' check (sex in ('M','F')),
        ethnicgroups varchar(20) not null default '汉族',
        address varchar(50),
        birthplace varchar(50),
        birthday date,
        comments varchar(100) default '无',
        politicalstatus varchar(20),
        idcard char(18)
    );

    create table notice(
    	notid int not null primary key,
        title varchar(256) not null,
        content text(1024),
        time datetime not null
    );

    create table teacher(
    	R int not null primary key,
        name varchar(10) not null
    );

    create table classroom(
    	clsid int not null primary key,
        name varchar(20) not null,
        capacity int not null
    );

    create table course(
    	corid int not null primary key,
        name varchar(50) not null,
        tchid int,
        clsid int,

        constraint fk_cor_clsid foreign key (clsid) references classroom(clsid),
        constraint fk_cor_tchid foreign key (tchid) references teacher(tchid)
    );

    create table schedule(
    	schid int not null primary key,
        corid01 int, -- 45 min per
        corid02 int,
        corid03 int,
        corid04 int,
        corid05 int,
        corid06 int,
        corid07 int,
        corid08 int,
        corid09 int,
        corid10 int,
        corid11 int,
        corid12 int,

        constraint fk_sch_corid01 foreign key (corid01) references course(corid),
        constraint fk_sch_corid02 foreign key (corid02) references course(corid),
        constraint fk_sch_corid03 foreign key (corid03) references course(corid),
        constraint fk_sch_corid04 foreign key (corid04) references course(corid),
        constraint fk_sch_corid05 foreign key (corid05) references course(corid),
        constraint fk_sch_corid06 foreign key (corid06) references course(corid),
        constraint fk_sch_corid07 foreign key (corid07) references course(corid),
        constraint fk_sch_corid08 foreign key (corid08) references course(corid),
        constraint fk_sch_corid09 foreign key (corid09) references course(corid),
        constraint fk_sch_corid10 foreign key (corid10) references course(corid),
        constraint fk_sch_corid11 foreign key (corid11) references course(corid),
        constraint fk_sch_corid12 foreign key (corid12) references course(corid)
    );

    create table daytime(
    	dayid int not null primary key,
        schid int not null,
        stuid bigint not null,
        daydate date,

        constraint fk_day_stuid foreign key (stuid) references student(stuid),
        constraint fk_day_schid foreign key (schid) references schedule(schid)
    );

    create table exam(
    	exmid int not null primary key,
        name varchar(50) not null,
        clsid int not null,
        begtime datetime not null,
        duration int not null,
        corid int not null,

        constraint fk_exm_clsid foreign key (clsid) references classroom(clsid),
        constraint fk_exm_corid foreign key (corid) references course(corid)
    );

    create table grade(
    	grdid int not null primary key,
        stuid bigint not null,
        corid int not null,
        gradenew decimal(4,1),
        gradeold decimal(4,1),

        constraint fk_grd_stuid foreign key (stuid) references student(stuid),
        constraint fk_grd_corid foreign key (corid) references course(corid)
    );

# 代码段组成

**等比赛结束了再把代码放出来，免得直接被拿来主义了。**

**Update: [所有源码](https://github.com/MewX/WeChat-AcademicTeachingAffairManagementSystem)**

- wechat.php

入口函数，微信`开发者中心`设置的网站地址，需要配置`TOKEN`、`AppID`、`EncodingAESKey`，然后实例化封装的sdk类。

----

- utils/pinyin\_engine.php

用于将汉字转为拼音，因为是经验法，所以准确度不高，GitHub很多字典法的可以尝试。

----

- utils/shell.php

定义数据库相关的功能，本机的以及SAE的服务器参数。以及创建PDO对象。

----

- utils/sql\_no\_injection.php

一个GPL协议下的SQL防注入函数集。

----

- utils/wechat\_sdk.php

开发包，`写在前面`中已经介绍。

----

- utils/official\_crypt/...

官方提供的安全模式demo下面的加密、解密库，直接拿来用了。

----

- serve/...

由wechat.php派发信息到达的处理函数包，所有是数据库操作。
