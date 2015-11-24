---
layout: post
title: "ICANN申诉域名转出（从中国互联163ns）"
subtitle: "记录从国内无良域名商转出域名的各种麻烦，申诉ICANN以及不得不提交个人身份信息，最终艰难转到了超实惠域名商NameSilo的辛酸历程（误）！"
date: 2015-10-03 11:03
comments: true
author: MewX
published: true
categories: [web, life]
---

国内域名提供商种类繁多，我入坑的`mewx.org`这个域名的时候就偏偏选择了万恶的`中国互联(163ns)`，现在看到国外域名商的各种优势，果然还是决定转出。但是前面说了，这家域名商实在是黑，对于转出提出了很多限制条件：要求必须打印相关表格、随身份证一起寄送至他们公司总部，然后缴纳50元转出费（不是续费）然后还要和客服死缠烂打才行。我差点就这么做了呢……

后来想想国内价格也不贵，而且转出的费用够我续费一年了呢，打退堂鼓了……还在考虑要不换域名吧，换成`mewx.me`，原域名用CloudFlare做301永久跳转，不过还是id得续费。我各种懒啊……

于是调查了很久，看到过[苦逼的案例](http://www.happysky.org/archives/1385)，看到过[牛逼的案例](http://club.domain.cn/forum.php?mod=viewthread&tid=1102054)，也有[交流讨论贴](http://club.domain.cn/forum.php?mod=viewthread&tid=1975504)，然后碰巧想搜一下`ICANN 申诉`，结果发现国内域名转出通过投诉渠道果然是大势所趋啊！

## 域名商小谈

### 国内域名商

国内域名商建议大家入坑前线确认价格、转出流程，并且网上查一下`中国互联 垃圾`这样的关键词，不然你直接搜`中国互联 怎么样`肯定出来的都是官方做的舆论导向。

国内域名的优势嘛，也就是`.cn`域名能注册、能便宜点。（其实cn域名越来越便宜了，现在是35一年；最主要的是国外域名商不开放cn域名注册）其他真找不出来什么优势了。比如隐私保护，只在特定域名下有效，比如说`.com`、`.net`、`.org`，我申诉的时候中国互联已经取消org的域名隐私保护了，呵呵哒。

最麻烦的是实名啊，国内域名你不实名说不定就给你停掉解析了，而且一天到晚给你发骚扰邮件啊，叫你实名……

非要在国内注册的话，我就建议`万网`吧（目前被`阿里巴巴`收购）

### 国外域名商

最有名的就是GoDaddy了，但是价格还是略贵，比如说`.com`域名一年就需要100RMB多，加上隐私保护一年也好几百，就算服务好也是贵的受不了……

调查了很久发现最便宜口碑也很不错的就是[namesilo](https://www.namesilo.com/)了，价格最低、免费隐私保护、免费域名邮箱转发服务等等等等，感觉需要的功能都有。唯一不足的就是DNS解析时间有点长，都是1000s开外的。我的方式是将DNS服务解到CloudFlare上面，不仅有DNS还有CDN，国内速度还蛮理想的。

## ICANN申诉流程

其实没啥流程，就是填个表就搞定了。

### 优点（复制的）

1. 无需邮寄任何资料，保护隐私；
2. 无需缴纳什么费用，免费；
3. 不看注册商的脸色，舒心；
4. 只要注册人邮箱是你的，不管其他，就能转移出域名；
5. 快速拿到转移码，转移出；

### 申请表

（点击可以查看高清大图）

<center><a href="{{ site.cdn }}imgs/201510/icann-complaint-big.jpg" target="_blank"><img src="{{ site.cdn }}imgs/201510/icann-complaint.jpg" style="max-width:100%; height:auto;"/></a></center>  

提交完毕后就等邮件就好了：

<center><img src="{{ site.cdn }}imgs/201510/icann-received.jpg" style="max-width:100%; height:auto;"/></center>

据说域名代理商如果被投诉会被罚款，所以不用多说，等邮件就好~

*P.S. 查whois比较推荐的是[ChinaZ](http://whois.chinaz.com/)和[whois.net](https://www.whois.net/)。*

----

## 2015/10/06 更新

昨天收到了来自ICANN的确认信息，说明已经帮我催域名商了：

    Dear xyz,

    Thank you for submitting a Transfer complaint concerning the domain name mewx.org. Your report has been entered into ICANN's database. For reference your ticket ID is: XOG-066-xxxxx.

    A 1st Notice will be sent to the registrar, and the registrar will have 5 business days to respond.

    For more information about ICANN's process and approach, please visit http://www.icann.org/en/resources/compliance/approach-processes .

    Sincerely,

    ICANN Contractual Compliance

    ############################################

    The problem summary ... ...

今天收到了域名商的**模板信**，总之有些不爽吧，没有直接把转移码发给我：

    尊敬的客户：

    您好！
    我们接到icann通知，您提交了域名[ mewx.org]的转出申请，现在和您沟通关于此域名转出的问题。
    出于对域名所有者权益的保护， 同时为防止域名被他人恶意转出，需要核实域名所有者的身份。如您提供不了相关证明，我们有理由怀疑该域名存在身份争议。ICANN也是要核实域名转出申请人是否为真实域名所有者之后才可以为您办理域名转出。按照ICANN的转出规则，存在身份争议的域名不可予以转出。

    如果是您本人确认办理转出，请您配合我们工作，提供以下资料扫描件通过域名所有者邮箱发送到registrar@55hl.com ，待我们收到您的资料审核后会将域名转出密码发送到您的域名所有者邮箱，谢谢您的配合。

    所需资料如下：
    1.域名所有者证件扫描件
    2.转出申请表个人签字后扫描件（如是公司，则须盖章）
    3.免责申明个人签字后扫描件（如是公司，则须盖章）

    如得到您的确认回复，江苏邦宁将在5个工作日内向域名注册所有人信箱发送转移密码。
    如果此次申请不是您本人操作，请尽快回复此邮件告知我们。

    我们会把您的回复结果如实反馈给icann。
    请您能配合。谢谢！

信里面要求的内容相当麻烦啊，要打印要签字要扫描什么的。我做开发者认证都没这么麻烦，做备案也就是发个照片就搞定了。这不能接受啊！

再看看这信的发件人和公司，我去，我明明是在“中国互联”注册的，结果怎么变成`江苏邦宁（55hl.com）`了？国内这些公司真是弄不明白了，这封信附件要求我填写的表格写的公司是`商讯国际`，啧啧啧，总之不专业，从这总公司的域名就能看出来不够专业。

于是我又去查了更多的转出域名的案例，大多是好几年前的了（2009-2013）都没有最新的。我具体也不清楚ICANN到底怎么规定的，所以我回了一封信，为了节约时间，将身份证的照片版附上，要求我打印填写、签名、扫描的文件我直接发电子档给他了，没签名：

    尊敬的工作人员：

    您好，首先感谢贵公司的积极回应！
    我是“mewx.org”域名的持有者xyz（xyz），根据ICANN规定我需要证明我的个人身份，所以我将我的身份证照片原件作为附件附上。
    对于贵公司要求的另外2张表格打印并扫描，增加了域名转出的时间跨度和难度，这在ICANN的规定中是没有的。我认为贵公司此举在阻碍客户将域名顺利转出，但是出于对贵公司规定的尊重，我附上了这两份表格的电子版。
    我作为个人客户希望能尽快拿到转移码，再次感谢贵公司的积极回复！

    2015/10/06
    xyz


    ---------- In English ----------

    Dear staff:

    Thank you for quick response!
    I am xyz, the domain holder of "mewx.org". And as is asked in regulation of ICANN, I provide my personal identity by attaching the photo of my ID cardin this email.
    Your company's asking me to print 2 forms and scan them, increases the span of transferring time and the difficulty of my getting Auth-code, which it's not defined by ICANN. I believe this action is not favorable for customers to transfer domain, it's an obstacle! However, for respectful purpose, I attach the 2 docs in digital version.
    As a personal customer, I am hoping to get Auth-code as quick as possible. Thanks again!

    Best wishes
    xyz


    ------------------ Original ------------------

    ... ...

抄送了一份给`compliance-tickets@icann.org`，但由于写得比较急，信中忘记写两点内容：

1. 首先要确认没有后续的要求再发个人信息，不然把个人信息发给他了又叫你交钱就蛋疼了（目前就在担心这个）；
2. 没有拿ICANN的投诉条目来反驳`I am the Registered Name Holder and my email address is listed as the registrant's in the registration information, but the registrar requested proof of my identity.`；

读者如果有时间的话可以尝试周旋一下，用上面这个投诉条目反驳，说明注册协约和email成立的，不应要求我再证明个人身份。（不过在国内嘛，我觉得还是认了吧，反正提供个人信息的又不止你一人……节约时间为主），不过周旋的话就要拖上个好几个月了，前人的案例大约是1-3个月。

首先像咱这样的没有确切的理由要求直接拿到转移码，咱只是懒得交那笔钱，因为交那笔钱够我续期1年了，实在是不爽啊。ICANN规定允许域名商转移收费的，所以这点不占理，要说最占理的是域名商阻碍你转移，就像我说的你要求我打印、签字、再扫描太费时间了，我在表示敬意的同时要节约时间（偷懒）。

关于该不该强势反驳，我觉得你的域名现在在人家手下，你就得认怂，就得低声下气，网上那些高调的域名转移码拿到之后域名被锁了转移不了！这就是装逼的结果。总之纵使心里百般不爽，也等转移完成再开骂 lol 希望下封信直接是转移码！

----

## 2015/10/08 更新

好了，果然这一封是转移码了，信的内容如下：

    尊敬的用户：

    您好！
    我司已经接收到您注册商转出新网的申请，以下是域名转移相关信息，请注意查收。
    域名域名[  mewx.org ]
    域名转移密码：[ owner-invalid   ]

    请及时联系新注册商进行转移操作。
    域名转移注册商授权码的泄露将有可能造成域名所有权和管理权的变更，请您妥善保管及使用。为了保证您的域名安全，系统将会在15天后自动变更此域名的转移注册商授权码。

这回域名商竟然变成`新网`了！

*P.S. 如果回的这封邮件不是转移密码，而是域名商叫你交钱，你就应该讨论上封邮件所述的`提供以下资料扫描件通过域名所有者邮箱发送到registrar@55hl.com ，待我们收到您的资料审核后会将域名转出密码发送到您的域名所有者邮箱`中逻辑关系，然后阐述如果有附加条件自己将不会发送个人最高隐私信息，同样抄送给ICANN。因为域名商有权叫你交钱，但是无权出尔反尔。*

和域名一样，转移码无厘头地前后有空格，我在namesilo点击`transfer`，然后搜索我的域名，发现可以转出之后输入转出密码，然后就是等待的过程了。我输入的是'owner-invalid'，然后就是一通苦战！密码错误！！！网上面说空格用加号代替，但是我怎么知道它有几个空格？而且是不是用加号代替就一定行？namesilo这家提交的时候不支持空格，提交上空格也会被`trim`掉，所以我用了加号试了很多……无果……这是namesilo的log：

    DATE                ACTION
    2015-10-07 21:31:32
    Retrieved imewx@qq.com as the Administrative Contact Email.

    2015-10-07 21:31:33
    We could not request to transfer mewx.org since the authorization code you provided is not correct. The authorization code you gave us was:
    owner-invalid
    Please retrieve the correct transfer authorization code from your current registrar, and then enter it in the Transfer Manager. Remember that the authorization code is case-sensitive and must be entered exactly as it was provided by your current registrar.
    Once this has been done, please click the link to Re-Send the Administrative Email.

    2015-10-07 21:45:24
    We could not request to transfer mewx.org since the authorization code you provided is not correct. The authorization code you gave us was:
    owner-invalid+
    Please retrieve the correct transfer authorization code from your current registrar, and then enter it in the Transfer Manager. Remember that the authorization code is case-sensitive and must be entered exactly as it was provided by your current registrar.
    Once this has been done, please click the link to Re-Send the Administrative Email.

    2015-10-07 22:00:24
    We could not request to transfer mewx.org since the authorization code you provided is not correct. The authorization code you gave us was:
    owner-invalid++
    Please retrieve the correct transfer authorization code from your current registrar, and then enter it in the Transfer Manager. Remember that the authorization code is case-sensitive and must be entered exactly as it was provided by your current registrar.
    Once this has been done, please click the link to Re-Send the Administrative Email.

    2015-10-07 22:15:46
    We could not request to transfer mewx.org since the authorization code you provided is not correct. The authorization code you gave us was:
    owner-invalid
    Please retrieve the correct transfer authorization code from your current registrar, and then enter it in the Transfer Manager. Remember that the authorization code is case-sensitive and must be entered exactly as it was provided by your current registrar.
    Once this has been done, please click the link to Re-Send the Administrative Email.

    2015-10-07 22:30:26
    We could not request to transfer mewx.org since the authorization code you provided is not correct. The authorization code you gave us was:
    +owner-invalid+++
    Please retrieve the correct transfer authorization code from your current registrar, and then enter it in the Transfer Manager. Remember that the authorization code is case-sensitive and must be entered exactly as it was provided by your current registrar.
    Once this has been done, please click the link to Re-Send the Administrative Email.

    2015-10-07 23:15:24
    We have emailed the current administrative contact to get their necessary approval to transfer the domain to your NameSilo account. The person who receives email at imewx@qq.com has until 2015-10-21 to approve the request or else it will be considered as being declined and the domain will not transfer.
    If imewx@qq.com is not an email address that is actively monitored, please change the administrative contact email address with the current registrar for this domain. Once the new email account is reflected in WHOIS, click the link to Re-Send the Administrative Email from within the Transfer Manager of your NameSilo account.

于是无奈，本来以为可以翻身做域名主人了！结果还得认怂……找域名商给我换一个密码：

    尊敬的工作人员：

    您好，再次感谢贵公司的积极回应！
    我是“mewx.org”域名的持有者xyz（xyz），贵公司提供予我的域名转移密码"[ owner-invalid   ]"，我无论如何都无法转移成功，系统提示信息是密码错误，烦请贵公司更换一下域名转移密码（不要包含空格等特殊字符）再发予我！
    我尝试过的密码有：“owner-invalid”、“owner-invalid+”、“owner-invalid++”、“+owner-invalid+++”，目标系统不支持前导和后导空格。
    再次表示感谢！

    2015/10/08
    xyz


    ---------- In English ----------

    Dear staff:

    Thank you for quick response again!
    I am xyz, the domain holder of "mewx.org". I've recieved the Auth-code from your previous email. But the Auth-code "[ owner-invalid   ]" cannot be verified. The system notifies me it's a wrong code!
    So I need you to change the Auth-code, which notcontain space and other special characters.
    The passwords I've tried are: “owner-invalid”、“owner-invalid+”、“owner-invalid++”、“+owner-invalid+++”, because the target system does not support leading spaces.
    Thanks once more!

    Best wishes
    xyz

信件花5分钟写的，嫑在意捉急的表达。因为要赶回校的火车，直接修改上次的信件了，同样抄送给了ICANN的邮箱。认怂果然好办事，半个小时就给我发新的密码了:

    您好：
           重置后密码：24528038-bb3

那时我正在公交车上，抓紧提交给namesilo，很快认证通过。（其实我还是蛮不爽的，他回信没给我道个歉……增加了我这么多麻烦！）

不过别高兴的太早，namesilo提醒我原域名商有5天时间可以撤回该转出……目前咱还不是域名的主人啊！

----

## 关于namesilo

基本上此事告一段落了，来说说namesilo这家域名商吧。

本来ICANN允许免费提供隐私保护的，结果今年5月的时候取消了这项政策，所以地址什么的都在whois信息里卖弄了！很郁闷的，所以网上搜隐私保护的域名商，找到了这家namesilo，似乎是国外唯一一家免费提供隐私保护的域名商了，而且隐私保护可定制联系邮箱~

*P.S.国内的自带域名隐私保护的基本上就万网（被阿里云收购）。而且只支持国际域名，国内域名由于CNNIC不允许隐私保护，而且全部要实名啊，所以没辙 =。=*

其实namesilo是全世界续期最便宜的域名商，而且网上还有长期的折扣可以减$1，支持支付宝啊！

哦对了，还自带有域名邮箱转发功能！（相当于域名邮箱）

----

## 转完了开骂！163ns、江苏邦宁、新网好垃圾！！！

翻身做域名主人了，163ns（中国互联）、江苏邦宁、新网垃圾！垃圾！垃圾！

上面whois信息全部被保护了，我就force push一下盖掉个人信息好了 233

历时11天，终于把域名转出了……代价是个人信息交给了江苏邦宁，不过没收我钱，看了一下续费价格，以前是65，现在涨价到70了，我在namesilo只要50呢！够我两顿饭了 \_(:3」∠)\_

然后收到了ICANN发来的complaint关闭邮件：

    Dear xyz,

    Thank you for submitting a Transfer complaint concerning the domain name mewx.org. ICANN has reviewed and closed your complaint because:

    - According to the Whois records, the transfer of the domain name has been completed.


    ICANN considers this matter now closed.  If you require future assistance, please submit a new complaint to ICANN at http://www.icann.org/resources/compliance/complaints .

    Please do not reply to this email (replies to closed complaints are not monitored by ICANN staff).

    ICANN is requesting your feedback on this closed complaint. Please complete this optional survey at https://www.surveymonkey.com/s/8F2Z6DP .

    Sincerely,

    ICANN Contractual Compliance

最搞笑的是163ns的后台还有我的域名，而且我还能进去管理。那么，试试修改信息会如何？Auth info失败 2333

通过这次转出域名知道了个中的流程啊，域名商主要任务就是保管域名转移码，域名商和ICANN的API接口中间一个环节就是Auth-code，也就是我们说的转移密码，其实这个转移密码一方面也作为域名商和ICANN修改信息的认证。
