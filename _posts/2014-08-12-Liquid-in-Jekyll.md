---
layout: testpage
title: "Liquid在Jekyll中的应用例"
date: 2014-08-12 23:00
comments: true
author: MewX
published: true
categories: [Liquid, Jekyll, Website]
---

　　Liquid官方解释是一种模板语言，Jekyll中的网页模板支持插入[Liquid](http://docs.shopify.com/themes/liquid-documentation/basics/)模板语言(Templating Language)实现更加强大的效果。下面用几段本网站的源码来介绍Liquid的一些[高级用法（点这查看全部）](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)。  
　　  
## 一、统计categories的数目  

<?prettify lang=html?>
    {% for category in site.categories %}
                    <a href="{{ site.baseurl }}tags.html#{{ category | first }}"><div class="TagListStyle">
                        {{ category | first }}<!--({{ category | last | size }})-->
                    </div></a>
    {% endfor %}

　　这算是一个比较常见的用法，在遍历site.categories时获取分类名{{ category | first }}和该分类下post数量{{ category | last | size }}。  
　　  
## 二、统计每个月的文章数目  

<?prettify lang=html?>
    {% assign count = 0 %}
    {% for post in site.posts %}
        {% if forloop.first %}
            {% capture saved_month %}{{ post.date | date: "%Y-%m" }}{% endcapture %}
            {% assign count = 1 %}
        {% else %}
            {% capture this_month %}{{ post.date | date: "%Y-%m" }}{% endcapture %}
            {% if this_month == saved_month %}
                {% assign count = count | plus: 1 %}
            {% else %}
                    <a href="{{ site.baseurl }}times.html#{{ saved_month }}"><div class="DateListStyle">
                        {{ saved_month }}<!--({{ count }})-->
                    </div></a>
                {% assign count = 1 %}
                {% capture saved_month %}{{ post.date | date: "%Y-%m" }}{% endcapture %}
            {% endif %}
        {% endif %}
        
        {% if forloop.last %}
                    <a href="{{ site.baseurl }}times.html#{{ saved_month }}"><div class="DateListStyle">
                        {{ saved_month }}<!--({{ count }})-->
                    </div></a>
        {% endif %}
    {% endfor %}

　　这里使用assign和capture两种方式定义变量。assign的作用是自己给定的值赋给变量，而capture的作用是便于将系统提供的参数或者运算结果赋值给变量。变量引用起来是一样方便的，都是通过花括号括起来。  
　　这里是自己编写的运算流程，利用的是site.posts是按照从新到旧的顺序排列的，也就是说相邻的两个post日期只会相同或从新到旧。  
　　这段代码用count变量来计数，{% assign count = 1 %}用来赋初始值，{% assign count = count | plus: 1 %}意思是count自增1。其他的就是一些常见的循环和分支结构。  
　　  
## 三、按月输出文章  

<?prettify lang=html?>
    {% assign count = 0 %}
    {% for post in site.posts %}
        {% if forloop.first %}
            {% capture saved_month %}{{ post.date | date: "%Y-%m" }}{% endcapture %}
            {% assign count = 1 %}
                    <div class="OutlineBorder">
        {% else %}
            {% capture this_month %}{{ post.date | date: "%Y-%m" }}{% endcapture %}
            {% if this_month == saved_month %}
                {% assign count = count | plus: 1 %}
            {% else %}
                    
                        <a name="{{ saved_month }}"><h1>MONTH: {{ saved_month }} ( {{ count }} )</h1></a>
                        <div class="InlineBorder">
                {% for post2 in site.posts %}
                    {% capture this_month2 %}{{ post2.date | date: "%Y-%m" }}{% endcapture %}
                    {% if this_month2 == saved_month %}
                        <a href="{{ post2.url }}">{{ post2.date | date: "%b %d, %Y" }} - {{ post2.title }}</a><br>
                    {% endif %}
                {% endfor %}
                        </div>
                    </div>
                    <div class="spaceline"></div>
                {% assign count = 1 %}
                {% capture saved_month %}{{ post.date | date: "%Y-%m" }}{% endcapture %}
                    <div class="OutlineBorder">
            {% endif %}
        {% endif %}
        
        {% if forloop.last %}
                        <a name="{{ saved_month }}"><h1>MONTH: {{ saved_month }} ( {{ count }} )</h1></a>
                    
                        <div class="InlineBorder">
                {% for post2 in site.posts %}
                    {% capture this_month2 %}{{ post2.date | date: "%Y-%m" }}{% endcapture %}
                    {% if this_month2 == saved_month %}
                        <a href="{{ post2.url }}">{{ post2.date | date: "%b %d, %Y" }} - {{ post2.title }}</a><br>
                    {% endif %}
                {% endfor %}
                        </div>
                    </div>
                    <div class="spaceline"></div>
        {% endif %}
    {% endfor %}

　　这里倒也没有用什么其他的技巧，就是在Head的部分先统计一遍每月文章数，然后再按照月遍历一遍site.posts输出符合本月的所有文章。由于最终结果是静态网页，运算流程上的优化并不是那么重要，只要能实现需要的功能就行。  

## 四、首页文章分页的设计  

　　由于Jekyll只支持首页index页面的分页功能，所以如果怕麻烦，就只给首页做分页吧。其实想要给任意界面做分页也不是那么难，用Javascript就行，根据网址来筛选文章好了。以后网站修缮会在报告中详细写出的。  
　　想要让首页分页，首先要在_config.yml里面定义paginate字段，例如希望每页5篇post，就写“paginate: 5”。  

<?prettify lang=html?>
    {% for post in paginator.posts %}
                    <div class="OutlineBorder">
                        <a href="{{ post.url }}" target="_parent"><h1>{{ post.title }}</h1></a>
                        <div class="InlineBorder">{{ post.date | date: "%b %d, %Y" }}<br><br>{{ post.content | truncatewords:5 }}</div>
                    </div>
                    <div class="spaceline"></div>
    {% endfor %}
                
                    <!-- Add paginator button here -->
    {% if paginator.previous_page_path == nil %}
                    <div class="PageButtonDisable">First</div>
                    <div class="PageButtonDisable">Previous</div>
    {% else %}
        {% if paginator.page == 1 %}
                    <div class="PageButtonDisable">First</div>
        {% else %}
                    <a href="{{ site.baseurl }}"><div class="PageButton">First</div></a>
        {% endif %}
                    <a href="{{ paginator.previous_page_path }}"><div class="PageButton">Previous</div></a>
    {% endif %}
                    {{ paginator.page }} / {{ paginator.total_pages }}
    {% if paginator.next_page_path == nil %}
                    <div class="PageButtonDisable">Next</div>
                    <div class="PageButtonDisable">Last</div>
    {% else %}
                    <a href="{{ paginator.next_page_path }}"><div class="PageButton">Next</div></a>
        {% if paginator.page == paginator.total_pages %}
                    <div class="PageButtonDisable">Last</div>
        {% else %}
                    <a href="{{ site.baseurl }}page{{ paginator.total_pages }}"><div class="PageButton">Last</div></a>
        {% endif %}
    {% endif %}

　　要实现分页也就是通过调用在config里面声明使用的paginator来完成。通过对paginator.posts的遍历可以得到当前页面中Jekyll给你分配的文章列表。  
　　这里使用了一个小技巧，在“FIRST”按钮的链接处我加的是“{{ site.baseurl }}”，这就是调用网站的基址，即站点首页；在“LAST”按钮的链接我加的是“{{ site.baseurl }}page{{ paginator.total_pages }}”，这就是调用最后一页的地址（这是通过Jekyll的生成习惯来定义的）。  
