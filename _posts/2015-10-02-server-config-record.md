---
layout: post
title: "网站搭建小记：ECS+LNMP+SSL"
date: 2015-10-02 22:26
comments: true
author: MewX
published: true
categories: [web, php]
---

同样是[`云翼计划`](http://www.aliyun.com/act/aliyun/campus.html)弄到的ECS，手头上几个域名就拿出来使用了，同时还配备了SSL证书。这里做一个记录~

其中遇到了一些问题，比如SSL证书在PC平台上没有问题，但是在Android平台上一直显示证书不受信任的标识，这里查了资料对其做了解决；LNMP删除了`vhost`记录之后目录无法删除的问题也做了解决。

## 安装LNMP

这个可以参见[官方网站的教程](http://lnmp.org/)，相当详细，功能列表如下：

    Usage: lnmp {start|stop|reload|restart|kill|status}
    Usage: lnmp {nginx|mysql|mariadb|php-fpm|pureftpd} {start|stop|reload|restart|kill|status}
    Usage: lnmp vhost {add|list|del}
    Usage: lnmp database {add|list|del}
    Usage: lnmp ftp {add|list|del}


如果需要Apache，那么你需要[`LNMPA`](http://lnmp.org/lnmpa.html)，这个只是多了一个Apache，最大的用途就是兼具Apache和Nginx的优势分工跑服务，但是对于内存要求比较高，推荐是1G以上。

## 升级MYSQL

这套LNMP比其他管理平台好就好在可以全自动升级。安装包里面有一个`upgrade.sh`的脚本。执行：

    screen -S upgrade
    ./upgrade.sh mysql

就可以开启升级向导（因为非常耗时，所以建议放在screen里面运行）。同理，每一个组件都可以升级。升级的时候会从官网获取资源，要求你输入版本号，然后它全自动完成下载、编译的过程。

但是可能因为全自动脚本还需要下载，所以官网最新的版本经常下不下来，比如说今天的最新版本是`5.6.27`，但是能下载到的最新版本是`5.6.21`，不过已经达到Lavarel推荐的`5.6`版本了。

还有，升级的过程中（从编译开始），会自动关闭lnmp的所有服务，期间可以手动开启，但是最好不要打断它的操作。

## 申请SSL证书

免费证书有个特征就是Class 1，是`SSL DV`的，但是聊胜于无，比自签证书好啦！提升逼格！

目前比较好的免费SSL证书提供商就是[`StartSSL`](https://startssl.com/)和[`沃通(WoSign)`](https://wosign.com/)了。

### StartSSL

这个公司的审查比较严格，对于地址、个人信息都会在地图上找一下，确定存在这么个地方才会给你颁发登陆证书。

也就是说你可以用虚假信息，但是虚假信息不能太假！这方面教程也很多，我也是按照其中的教程来的~

### 沃通(WoSign)

这家公司着实搞笑！而且审查也非常松，我匿名申请了3套证书……搞笑之处在于9月份的时候免费申请的证书都是10个域名，有效期3年。刚刚去瞅了一眼，免费证书只能绑定一个域名（www和@算一个），而且有效期降低到了1年！挺失望的，毕竟免费服务缩水太多。

作为国内证书提供商，确是算是非常有良心的了，不过不够专业，登陆没有强制SSL证书登录，而且认证也不严厉，证书是全自动生成的，所以直接可以伪造一堆证书出来。

## 配置Nginx

我这边配置服务器需要做到的功能如下：

- 所有的`http(80)`请求重定向为`https(443)`请求
- 所有的`www`域名请求重定向为`@`域名

配置文件如下：

    server {
        listen 80;
        server_name xxx.com www.xxx.com;
        rewrite ^/(.*) https://xxx.com/$1 redirect;
    }

    server
    {
        listen 443;
        #listen [::]:80;
        server_name xxx.com www.xxx.com;
        index index.html index.htm index.php default.html default.htm default.php;
        root  /www/xxx;

        if ($host = 'www.xxx.com') {
            rewrite ^/(.*) https://xxx.com/$1 redirect;
        }

        ssl on;
        ssl_certificate /root/documents/keys/xxx_ssl.crt;
        ssl_certificate_key /root/documents/keys/xxx_out.key;

        # ... ...
    }

一个块用于接收80端口的`http`请求，另一个块用于接收443端口的`https`请求，对于跳转我采用了302临时跳转。这种跳转对于SEO比较差，我是因为作为调试才使用302跳转的。之前使用过301跳转，结果浏览器缓存实在是太厉害了，缓存之后永远都不会刷新，301真的成了永久性跳转 =。= 所以建议调试的时候不要使用301，而是使用302。不小心使用了301，那么你需要清楚浏览器缓存。

那么301的写法如下，适合搜索引擎收录：

    server {
    listen 80;
    server_name xxx.com www.xxx.com;
    rewrite ^/(.*) https://xxx.com/$1 permanent;
    }

    server
    {
        listen 443;
        #listen [::]:80;
        server_name xxx.com www.xxx.com;
        index index.html index.htm index.php default.html default.htm default.php;
        root  /www/xxx;

        if ($host = 'www.xxx.com') {
            rewrite ^/(.*) https://xxx.com/$1 permanent;
        }

        ssl on;
        ssl_certificate /root/documents/keys/xxx_ssl.crt;
        ssl_certificate_key /root/documents/keys/xxx_out.key;

        # ... ...
    }

没错，就是把`redirect`改成`permanent`，大功告成，来个截图纪念下：

<center><img src="{{ site.cdn }}imgs/201510/ssl-preview.jpg" style="max-width:100%; height:auto;"/></center>

## 关于删除lnmp的项目

单纯使用`lnmp vhost del`是不够的，因为你有时候会遇到vhost文件目录删不掉的情况。

比如我使用：

    rm -rf www
    chmod 777 www/.user.ini

都会出现`Operation not permitted`。文件夹重命名都没有问题，但是这个文件就是删不掉。查了很久得出如下删除方法：

    # lsattr .user.ini
    ----i--------e-- .user.ini

    # chattr -i .user.ini
    # lsattr .user.ini
    -------------e-- .user.ini

    # rm .user.ini

搞定！

小贴士：有时候你发现用root权限都不能修改某个文件，大部分原因是曾经用chattr命令锁定该文件了。chattr命令的作用很大，其中一些功能是由Linux内核版本来支持的，不过现在生产绝大部分跑的linux系统都是2.6以上内核了。通过chattr命令修改属性能够提高系统的安全性，但是它并不适合所有的目录。chattr命令不能保护/、/dev、/tmp、/var目录。lsattr命令是显示chattr命令设置的文件属性。

## 解决Android平台显示证书不受信任

安卓的任何浏览器打开都是清一色显示证书不受信任，这里测试的浏览器有：Google Chrome, UC浏览器, 360免流浏览器, Firefox, Via，以谷歌浏览器的截图为例：

<center><img src="{{ site.cdn }}imgs/201510/cert-err.jpg" style="max-width:100%; height:auto;"/></center>

查了一下还蛮普遍的，是因为StartSSL没有入驻Android的根证书系统，所以在安卓平台上的所有浏览器都会认证失败。可能是因为StartCom的Class 1就是个`中间签发机构`，而Android并不认识它们。那么按照查到的方法，只需要将StartCom的CA证书链合并到我的证书里面，就可以搞定了。

在[http://www.startssl.com/certs/](http://www.startssl.com/certs/)上，找到StartCom的证书链包裹，文件名为 ca-bundle.crt。下载下来以后，用cat指令把它们和我的证书合并：

    wget http://www.startssl.com/certs/ca-bundle.crt -O startssl-ca-bundle.crt #下载
    cat xxx_ssl.crt startssl-ca-bundle.crt > xxx_ssl_new.crt #连接成一个文件
    vim pudieku_ssl_new.crt #把中间的证书连接部分换行分开

把Nginx配置里面的`ssl_certificate`后面的文件改成这个新的文件即可~

    lnmp nginx restart

搞定，放图：

<center><img src="{{ site.cdn }}imgs/201510/cert-pass.jpg" style="max-width:100%; height:auto;"/></center>
