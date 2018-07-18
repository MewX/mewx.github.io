---
layout: post
title: "Xposed in practice"
subtitle: "Hijacking the Android keystore password, thereby building Transocks PC client."
date: 2018-07-18 07:04
comments: true
author: MewX
published: true
categories: [crack, android]
---

## Background

This article was supposed to be posted a half year ago.
However, I had been super super busy with my final semester study and my first formal job.
So, everything's going very well (thanks if you are interested in),
and I finally got some time to record this experience.

The background is that the China's Great Firewall is an **incredible and magnificent project**,
which filters the network flow in a bidirectional way around the whole People's Republic of China.
However, the market in China is accordingly very large and many services do not have any alternatives around the world.
For instance, in this article I am going to talk about the music service provider (Netease music) in China,
which is driven by a very active community.

The issue for me when accessing its service from abroad is that the most songs are not available from my oversea ip address,
and you may want to say using a proxy.
Exactly, but, the Great Firewall can detects common VPN connections in few minutes, and the vpn will be banned for you in short.
Therefore, the usual way we being use is SOCKS5, to be more specific - [Shadowsocks](https://github.com/shadowsocks)
which is an obfuscated version of SOCKS5.

There is an app called [Transocks](https://play.google.com/store/apps/details?id=com.fobwifi.transocks&hl=en_US),
providing SOCKS5 China's proxies to people from overseas.
The service is great as a free-to-use software, but the problem is that it supports mobile devices only,
and I simply want to make it work with PC.
So, this is my intention.


## Procedure

Here's an record how I make it.


### Detecting the protocol

First of all, when I want to make use of the existing service, I have to find out which protocol it is using.
When opening the `apk` file as a zip, I can easily see that in `assets/armeabi-v7a`,
there are `ss-local` and `ss-tunnel` which are the essential libraries that drive the Shadowsocks.

### Acting as man-in-the-middle

I have known that the proxy is shadowsocks, so I need to know how the app gets the login token.
The most obvious way is hijacking the network communications.

Based on my experience, [Fiddler 4](https://www.telerik.com/fiddler) (Free) and [Charles Proxy](https://www.charlesproxy.com/) (Commercial) capture HTTPS communication.
The prerequisite is that you will need to install a root certificate on your mobile phone of which the tutorials can be found via Google Search.

After using the right tool and right configuration for you mobile proxy (to your PC's Fiddler or Charles Proxy),
you are able to view the plain text of every HTTPS request and response.

The process is roughly as follows:

1. Send register request with a UUID, get username and password.
2. Send login request using the username and password, get login status.
3. Send login status verification request, get user info and status.
4. Send IP list request, get IP list with payloads.
5. Send password request by passing server id, get shadowsocks password.

*Note that, the password request requires a client side certification.*

### Crack the client-side certification

From the `apk` file, we can find a keystore in path `assets/transocksv1.bks`.
But the issue is that we do not know the password for this Android keystore.

So, I used Xposed framework to hook the Android system function `java.security.KeyStore.load()`.
Here's the reference code: https://git.io/fNGtv

Then, I easily find out the password is 123456 which is simply stupid.

### Extract certificates

`Bks` is Android keystore file format, and it's not easy to extract key file outside the Android runtime.
Therefore I found a tool called [Portecle](http://portecle.sourceforge.net/) doing this.

It can load the Android keystore file and extract the certificates,
and we are able to use this certificates via any programming languages.

Here's the reference code in Python:

    r = requests.post(
        "https://" + ipaddr + "/api/1/user-line-association/" + str(userid) + "/" + str(
            ipchannel) + "?mac=" + new_uuid + "&device=Android&org=transocks", headers=headers, data=payload,
        verify=False, cert=(CERT_FILE, CERT_FILE_DEC))
    print(repr(r.json()))

### Test with the shadowsocks password

Using `sslocal -c configuration.json` where the `configuration.json` is the response content from previous `get password` request.

Here's an example:

```
{
  "local_address":"127.0.0.1",
  "method":"aes-128-cfb",
  "server":"122.226.102.117",
  "local_port":"1080",
  "password":"6gJ6Z7TDs4IRv4AvFe",
  "server_port":11426,
  "timeout":60,
  "alias":""
}
```

## Disclaimer

I am not posting or publishing any detailed communication protocol or API.
As well, I will **NOT** release anything like `Transocks PC client`.
