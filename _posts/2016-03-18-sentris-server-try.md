---
layout: post
title: "Sentris袖珍VPS配置手记（3年75RMB）"
subtitle: "配置很low，但价格良心：1G硬盘；1核CPU；128M内存；每月250GB流量！"
date: 2016-03-18 18:36
comments: true
author: MewX
published: true
categories: [web,life]
---

前天群友[武少](http://weibo.com/ranxiangzi)推荐了一个特别廉价的VPS服务，因为配置低，所以价格特别便宜，于是就点进去看了一下：[http://www.sentris.net/billing/aff.php?aff=245&pid=794](http://www.sentris.net/billing/aff.php?aff=245&pid=794)，果然配置低的吓人，但是据测试开个ss服务只要30M内存，所以我也心动了。

## 推荐配置

2G硬盘；1核CPU；128M内存；250GB/month流量。

*因为我买的没考虑那么多，1G硬盘实在是不够的，引用我在知乎上面的[一个答案](https://www.zhihu.com/question/19757001/answer/91325669)：*

    目前运行：ss（非supervisor）、nginx+php，内存占用35M，硬盘剩余280M。
    安装mariadb-server之后硬盘剩余100M，跑些php不是问题。
    安装了python2.7（自带简单http网站服务），看了下安装3.5还需要35MB硬盘空间。

    所以目前看来内存不是问题，问题是硬盘！

## 搭建指南

默认的系统是CentOS-x86版，这个包实在是太大了，我后来换成了`	ubuntu-15.10-x86_64-minimal.tar.gz`这个包，目前看来好处在于:

- Python版本在2.7以上（CentOS版本是2.6.6）
- 没有supervisor，这个东西对于系统资源消耗还蛮大的
- 软件源人性化，可以看到需要下载的包体积，以及安装后大小

### ShadowSocks

这个咱国人都懂哈，所以境外自用VPS第一个要安装的就是这个 233

    apt-get install python-pip
    pip install shadowsocks
    vim /etc/shadowsocks.json

然后编辑这个文件：

    {
        "server":"0.0.0.0",
        "server_port":8484,
        "local_port":1080,
        "password":"********",
        "timeout":600,
        "method":"rc4-md5",
        "fast_open": false
    }

然后运行与停止：

    ssserver -c /etc/shadowsocks.json -d start
    ssserver -c /etc/shadowsocks.json -d stop

*P.S. rc4不安全，但是rc4-md5还是安全的！*

### Nginx + PHP

    apt-get install nginx
    apt-get install php5
    apt-get install php5-fpm

然后配置nginx的文件即可：

*P.S. 如果要配置SSL，可以参见这篇文章[网站搭建小记：ECS+LNMP+SSL]({{ site.baseurl }}blog/201510/server-config-record/)。话说，现在有一个[letsEncrypt](https://letsencrypt.org)项目，可以自签公共证书。*

    user www-data;
    worker_processes auto;
    pid /run/nginx.pid;

    events {
            worker_connections 768;
            # multi_accept on;
    }

    http {
        ##
        # Basic Settings
        ##
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        # server_tokens off;
        # server_names_hash_bucket_size 64;
        # server_name_in_redirect off;

        include /etc/nginx/mime.types;
        default_type application/octet-stream;
        index   index.html index.htm index.php default.html default.htm default.php;

        server { # php/fastcgi
          listen 80;
          server_name test.mewx.org;
          root /var/www/test;
          index   index.html index.htm index.php default.html default.htm default.php;

          location ~ \.php$ {
            include fastcgi.conf;
            fastcgi_index index.php;
            fastcgi_pass unix:/var/run/php5-fpm.sock; #127.0.0.1:9000;
          }
        }

        ##
        # SSL Settings
        ##
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # Dropping SSLv3, ref: POODLE
        ssl_prefer_server_ciphers on;

        ##
        # Logging Settings
        ##
        access_log /var/log/nginx/access.log;
        error_log /var/log/nginx/error.log;

        ##
        # Gzip Settings
        ##
        gzip on;
        gzip_disable "msie6";

        # gzip_vary on;
        # gzip_proxied any;
        # gzip_comp_level 6;
        # gzip_buffers 16 8k;
        # gzip_http_version 1.1;
        # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        ##
        # Virtual Host Configs
        ##
        include /etc/nginx/conf.d/*.conf;
        include /etc/nginx/sites-enabled/*;
    }

    #mail {
    #       # See sample authentication script at:
    #       # http://wiki.nginx.org/ImapAuthenticateWithApachePhpScript
    #
    #       # auth_http localhost/auth.php;
    #       # pop3_capabilities "TOP" "USER";
    #       # imap_capabilities "IMAP4rev1" "UIDPLUS";
    #
    #       server {
    #               listen     localhost:110;
    #               protocol   pop3;
    #               proxy      on;
    #       }
    #
    #       server {
    #               listen     localhost:143;
    #               protocol   imap;
    #               proxy      on;
    #       }
    #}

### 精简系统

#### 删除多余语言包

查看硬盘大小的时候发现有几个文件夹特别大：

- /usr/lib
- /usr/share

这两个文件夹里面都有一个文件夹100M左右，最典型的一个文件叫`/usr/lib/locale/locale-archive`，后来查了很久是系统语言包。

根据[这里的教程](http://unix.stackexchange.com/questions/90006/how-do-i-reduce-the-size-of-locale-archive)，最终将这个文件从200M缩小到16M，效果显著啊~

#### 删除多余的服务

发现安装完php之后多了一个apache2的service，于是which和whereis查看之后，决定删掉，毕竟我都有nginx了嘛。

    apt-get remove apache2

但是卸载完后发现`/etc/init.d`文件夹里面还有这个服务啊，于是找资料。

最后根据[这个答案](http://askubuntu.com/a/387793)搞定：

    Follow these steps to remove the apache2 service using Terminal:
    sudo service apache2 stop
    sudo apt-get purge apache2 apache2-utils apache2.2-bin apache2-common
    sudo apt-get autoremove
    which apache2  - should return a blank line
    sudo service apache2 start  - should return apache2: unrecognized service
