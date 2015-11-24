---
layout: post
title: "利用Stylish插件定制自己的搜索页面"
date: 2014-12-11 16:17
comments: true
author: MewX
published: true
categories: [web]
---

　　新版的百度主页可以自定义主页背景，于是终于想试试这个功能了，添加了一张K-ON的壁纸上去，结果搜索框和LOGO把萌妹子的脸遮住了有木有！我需要透明的搜索框和LOGO啊！然后自己在“审查元素”里面把这部分的CSS添加了一个opacity属性（透明度），立刻和谐了很多，但是手动修改完全不方便啊，于是鸡冻地想写个插件了 O(∩_∩)O ~  

　　  

　　搜索了一下发现在Firefox和Chrome下都有一款叫Stylish的插件，可以在载入的页面中自动修改CSS Style样式表，于是看了一下主页的html代码，发现只要给#head_wrapper这个id的div设置透明就可以了。（代码贴在末尾）  

　　  

　　改好效果，第一张是鼠标移开的状态，第二张是鼠标框上：  
<center><a href="{{ site.cdn }}imgs/201412/02-stylish-baidu-home.png" target="_blank"><img src="{{ site.cdn }}imgs/201412/02-stylish-baidu-home.png" style="max-width:100%; height:auto;"/></a></center>  

　　  

<center><a href="{{ site.cdn }}imgs/201412/03-stylish-baidu-home-focus.png" target="_blank"><img src="{{ site.cdn }}imgs/201412/03-stylish-baidu-home-focus.png" style="max-width:100%; height:auto;"/></a></center>  

　　  

　　  

　　但是搜索结果界面直接就跳到白底的页面上了啊，很不爽，所以在结果界面又添加了半透明以及背景效果，如图（同样：第一张是鼠标移开的状态，第二张是鼠标在结果中）：  
<center><a href="{{ site.cdn }}imgs/201412/04-stylish-baidu-result.png" target="_blank"><img src="{{ site.cdn }}imgs/201412/04-stylish-baidu-result.png" style="max-width:100%; height:auto;"/></a></center>  

　　  

<center><a href="{{ site.cdn }}imgs/201412/05-stylish-baidu-result-focus.png" target="_blank"><img src="{{ site.cdn }}imgs/201412/05-stylish-baidu-result-focus.png" style="max-width:100%; height:auto;"/></a></center>  

　　  

　　上面的部分处理多了一个步骤，就是需要把div的宽度调整成100%，不然右边的部分没有白色背景，很难看。  

　　  

　　  

　　下面是Stylish的代码，给百度搜索框透明、搜索结果添加背景：  

<?prettify lang=css?>
    @namespace url(http://www.w3.org/1999/xhtml);
    
    @-moz-document domain("baidu.com") {
    
        #head_wrapper {
          opacity:0.4;
          transition: all 0.2s ease-in-out;
        	-moz-transition: all 0.2s ease-in-out;
        	-o-transition: all 0.2s ease-in-out;
        	-webkit-transition: all 0.2s ease-in-out;
        }
        #head_wrapper:hover {
          opacity:0.8;
        }
        
        #wrapper_wrapper, #main_wrapper {
          background-color:rgb(64, 64, 64);
          background-image:url("http://g.hiphotos.baidu.com/super/crop=166,0,16\
    87,1048/sign=622892a28eb1cb132a266653e0656078/03087bf40ad162d9a4539b5112dfa\
    9ec8a13cd3a.jpg");
          height: 100%;
          width: 100%;
          z-index: -10;
          background-position: center 0px;
          background-repeat: no-repeat;
          background-attachment: fixed;
          background-size: cover;
          opacity:0.8;
        }
        
        #container {
          width:100%;
          background-color:#FFF;
          opacity:0.5;
          transition: all 0.2s ease-in-out;
        	-moz-transition: all 0.2s ease-in-out;
        	-o-transition: all 0.2s ease-in-out;
        	-webkit-transition: all 0.2s ease-in-out;
        }
        #container:hover {
          opacity:0.85;
        }
    }

　　  

　　以上。  
