---
layout: testpage
title: "Laravel在Apache中网站路径的设置"
date: 2015-09-13 19:27
comments: true
author: MewX
published: true
categories: [web, php]
---

阿里云这个月推出了[`云翼计划`](http://www.aliyun.com/act/aliyun/campus.html)，让学生党可以低价(10CNY/M)购买阿里的低配ECS虚拟机，这大概是国内科技公司对学生做的较大的一次优惠了吧 =。=

可惜我已经大四开学了，正好也有开几个网站的想法，就入了这个`ECS`，不得不吐槽国内厂商没有国外厂商厚道啊，不仅没有免费服务，而且还斤斤计较享受优惠的人。要求申请账号的学生信息必须录入全国的学籍信息，也就是说大专学生不能享受这个优惠了；再者严格控制优惠到期时间，要求续费时间必须在毕业期间以内，我只能说：哎，相见恨晚；还有一点就是限定死的配置，我想稍微提高一点配置都不行，直接就给按原价来了……

那么闲话少说，今天没去图书馆复习考研，而是在搭建`laraval`框架 -。- 这个世界上最NB的`PHP框架`！

首先就在安装composer这一步卡住了。没有离线安装包，只有在线安装。我本机windows用的是upupw集成环境，里面的php有问题，组建不完整（没有openssl），于是我安装了windows的openssl命令行工具，然并卵。还是需要php包含openssl。

没办法，从官网上下载了一个最新的5.6.13 x64的php覆盖上去，不错可以运行，然后composer安装完毕，按照步骤走:

    composer config -g repositories.packagist composer http://packagist.phpcomposer.com
    composer create-project laravel/laravel mewxlaravel 5.0.22

搭建完成后在upupw里面建立新的虚拟机啊什么的，按照常规走，然后就遇到了纠结的地方：

- 站点目录指向/mewxlaravel
- 站点目录指向/mewxlaravel/public

因为laravel的网站主目录是在public文件夹，但是如指向public的话在前面几个目录还要调用文件的，所以会没有权限会失败；如果指向laravel根目录的话虽然可以通过`<domain>/public/index.php`访问，没有权限的问题了，但是我这个强迫症呐！

查了一下Apache的配置文件`/Apache2/conf/httpd-vhosts.conf`是这样的，3个路径全部指向laravel根目录：

    <VirtualHost *:80>
        DocumentRoot "D:/upupw/vhosts/learnlaravel"
    	ServerName 127.0.0.2:80
        ServerAlias laravel.5
        ServerAdmin webmaster@127.0.0.2
    	DirectoryIndex index.html index.htm index.php default.php app.php u.php server.php
    	ErrorLog logs/127.0.0.2-error.log
        CustomLog logs/127.0.0.2-access_%Y%m%d.log comonvhost
    	php_admin_value open_basedir "D:\upupw\vhosts\learnlaravel;D:\upupw\memcached\;D:\upupw\phpmyadmin\;D:\upupw\temp\;C:\WINDOWS\Temp\"
    <Directory "D:/upupw/vhosts/learnlaravel">
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    <LocationMatch "/(inc)/(.*)$">
        AllowOverride none
        Require all denied
    </LocationMatch>
    <LocationMatch "/(attachment|attachments|uploadfiles|avatar)/(.*).(php|php5|phps|asp|asp.net|jsp)$">
        AllowOverride none
        Require all denied
    </LocationMatch>
    </VirtualHost>

查了很多资料最后了解到只要把`DocumentRoot`后面的路径改成public就行了，其他的都是和权限相关的，用laravel根目录，改完之后是这样的（只改了一处路径）：

    <VirtualHost *:80>
        DocumentRoot "D:/upupw/vhosts/learnlaravel/public"
    	ServerName 127.0.0.2:80
        ServerAlias laravel.5
        ServerAdmin webmaster@127.0.0.2
    	DirectoryIndex index.html index.htm index.php default.php app.php u.php server.php
    	ErrorLog logs/127.0.0.2-error.log
        CustomLog logs/127.0.0.2-access_%Y%m%d.log comonvhost
    	php_admin_value open_basedir "D:\upupw\vhosts\learnlaravel;D:\upupw\memcached\;D:\upupw\phpmyadmin\;D:\upupw\temp\;C:\WINDOWS\Temp\"
    <Directory "D:/upupw/vhosts/learnlaravel">
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    <LocationMatch "/(inc)/(.*)$">
        AllowOverride none
        Require all denied
    </LocationMatch>
    <LocationMatch "/(attachment|attachments|uploadfiles|avatar)/(.*).(php|php5|phps|asp|asp.net|jsp)$">
        AllowOverride none
        Require all denied
    </LocationMatch>
    </VirtualHost>

然后就可以尽情地**装币**咯！因为[教程](https://github.com/johnlui/Learn-Laravel-5/)是4.0.x的版本，所以`<domain>/home`也可以访问！（P.S.如果rewrite错误的话Auth访问需要通过`<domain>/index.php/home`）
