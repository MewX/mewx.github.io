---
layout: post
title: "Thoughts on anti-crawler framework"
subtitle: "Working on a website and wanting to protect its data."
date: 2018-01-16 20:34
comments: true
author: MewX
published: true
categories: [web]
---

Those ideas are basically based on my experience. I also referred to some existing posts in Chinese language
in that the commercial web security in China is quite usual and high-level.
However, it's my bad and it's being a while, so I couldn't find all original website URLs as references.

## Encrypted ID

Easy to implement.

Usually the URL patter looks like:

```
https://xxxx/id=123
```

To crawl this site, I usually define a `for` loop to go through the whole ID range.
In this way, I don't even need to crawl a list page because the ID has its pattern for me to use.

To encrypt the ID, it's easy to implement by performing a server-side query decryption.
The encryption and decryption algorithms can vary,
but basically it can be any secure symmetric or asymmetric encryption algorithm.
Therefore the URL will look like:

```
https://xxxx/id=3d030632fb3c9653
```


The benefit here is that this won't slow down the database query because finally in SQL query,
the id is recovered from `3d030632fb3c9653` to `123`.

It is safe because the encryption key used on server can be very long and not easy to guess.
Also, do not leave database related info on the web page. This can secure the algorithm to some extent.


BTW, I saw an interesting one:

```
http://xxx/pm/ZGphbmdvIOWPjeeIrOiZqw==.html
```

The URL is too obvious to use Base64, and I can easily decode it. It's not recommended to encrypt ID.
However, using it to encrypt key is fine, since `3d030632fb3c9653` is coded to `PQMGMvs8llM=` which is shorter:

```
https://xxxx/id=PQMGMvs8llM=
```


## Dynamic Key Request Chain

Hard to implement.

Define a rule that how pages can jump from one to another, each jump requires a key provided by server.
For example:

```
https://xxxx/id=3d030632fb3c9653&key=a817f6s9
```

This key can be a chain encryption, which can be transformed back to `Http Header: Referrer` page URL or an identifier.
The server will verify this key and try to recover the coming URL.
If the coming URL meets the `rule` we defined at the beginning, this request is allows to proceed;
otherwise HTTP 400 or fake data, etc.

It has a benefit as well, the URL can be copied and still work because the request is actually static.


## Fake Data

Difficult to implement.

Use some similar data, when in bad request mentioned in `dynamic key request chain` section.
The page can be a robot-generate page with information from a machine learning model or even some simple algorithms to generate interesting correct-look page.
This method can frustrate crawler writers, AHAHAHAHAHAHA.

Also, each bad request should return a certain data. Otherwise, if the crawler requests twice, it can easily find the data is dynamically generated fake data.


## Page Rendering after Loaded

Easy to implement.

Using AJAX or simply js codes to write data into web page.
This is like some [`email encoders`](http://hivelogic.com/enkoder/index.php) used for anti-email-spam.

The web page will contain such codes:

```
<script type="text/javascript">
//<![CDATA[
<!--
var x="function f(x){var i,o=\"\",ol=x.length,l=ol;while(x.charCodeAt(l/13)!" +
"=49){try{x+=x;l+=l;}catch(e){}}for(i=l-1;i>=0;i--){o+=x.charAt(i);}return o" +
".substr(0,ol);}f(\")621,\\\"v|pckv&iy<;:771\\\\bcFED130\\\\f400\\\\][B\\\\\\"+
"\\@320\\\\020\\\\mHWV020\\\\XHOCJRU230\\\\\\\\\\\\[Z330\\\\Okrt}v8E%qsg|3s-" +
"2'`ai771\\\\c{771\\\\)rkanwbo230\\\\\\\"(f};o nruter};))++y(^)i(tAedoCrahc." +
"x(edoCrahCmorf.gnirtS=+o;721=%y;2=*y))y+621(>i(fi{)++i;l<i;0=i(rof;htgnel.x" +
"=l,\\\"\\\"=o,i rav{)y,x(f noitcnuf\")"                                      ;
while(x=eval(x));
//-->
//]]>
</script>

```

After its execution, it becomes HTML codes.

This method can prevent simple `HTTP Request` crawlers, because the final web page should be run to reveal data.
However, if the crawler writer is using `NodeJS`, this would not be too hard.
In this case, you might need to obfuscate your JS codes before the web page is sent back.


## Cookie Expiration Strategy

Easy to implement.

Simple set a expiration time of one hour if the cookie is not used in request.
This can add one step for crawler writers that they must analyse your cookie expiration strategy.


## Artificial Intelligence reCAPTCHA

Easy to implement.

However, all steps above cannot prevent `selenium` which is a headless browser driver engine.
Traditional chatcha is not robust enough nowadays, crawlers can use machine learning to break captcha more easily.
I've tried to break Google `reCaptcha` service and Alibaba `slide-to-unlock` service **last month** using `selenium` but failed.
The last step that I haven't used is using `cursor simulator` which records my cursor movement and replay is on web page.

Basically, this is a super-difficult-to-break. Although it somehow reduces user experience's fluency,
it protects the website securely from crawlers.

Therefore, for pages that user is expected to stay long, it's recommended to use this method.

**For Chinese users, Google's service does not exist. Therefore when the server detects Chinese IP,
it's recommended to use an alternate [`GeeTest`](http://www.geetest.com/apply.html).**


## U/A Blocking

Easy to implement.

Some known user agents of crawlers should be obviously blocked or return with fake data.
These user agents should be blocked:

```
FeedDemon
Indy Library
Alexa Toolbar
AskTbFXTV
AhrefsBot
CrawlDaddy
CoolpadWebkit
Java
Feedly
UniversalFeedParser
ApacheBench
Microsoft URL Control
Swiftbot
ZmEu
oBot
jaunty
Python-urllib
lightDeckReports Bot
YYSpider
DigExt
HttpClient
MJ12bot
heritrix
EasouSpider
Ezooms
```


## Prevent Search Engine Using robot.txt

Not too easy to implement.

Search engines can be bad as well. If you have data to be protected,
write the rules in `robot.txt` to tell search engine not to crawl some of your pages.


## Split Deployed Codes

Difficult to implement.

You can write a tool splitting a pending-to-respond html file into several random small parts and use AJAX to load.
Using `iframe` is also a good idea to increase the difficulty using `selenium`.

This idea is to increase the complexity of web page and the analysis time, however, it increases the coding efforts as well.


## Banned IP Pool

Better not to use.

Open proxy IPs can be banned (this requires us to crawl IP proxy websites LOL),
but try not to ban an IP entirely because the 4G network is a dynamic environment
and it's difficult to tell whether this user is from cable or not.

Never ban an IP easily.


----

After reCaptcher, there's not need to prevent crawler because the cost is too high.
See what this project will finally go~ Maybe this idea became a back-end framework :P idk
