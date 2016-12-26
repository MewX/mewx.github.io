---
layout: post
title: "Building My Offline Downloading Server"
subtitle: "Uni's accademy VPS doesn't provide root access, but I can bypass it :P"
date: 2016-12-26 23:39
comments: true
author: MewX
published: true
categories: [linux,life]
---

Offline-downloading is very well-known word in China. It's a service to allow you to set downloading tasks and a server will prepare the downloaded file for you to fetch at a high speed.

However, the problem is that I don't like the client itself. It's full of ads, and I don't even want to use it. Some net disk service does not allow you to use a third-party client to download, so you cannot use general offline downloading method to download a large file in a net disk. As well, it's a kind of monopoly. Just take `Baidu Netdisk` as an example, its downwards bandwidth is limited to 256KBps. If you want to download a large file, you have to keep your computer on and use their client to download your file. It's immoral, but they provide free service.

Today, I will make offline downloading available for files in `Baidu Netdisk`. The tool I'm using is [`BaiduPCS`](https://github.com/GangZhuo/BaiduPCS) and `Linux screen`.

----

## Make BaiduPCS run on non-root access Linux system

As the document on GitHub, it requires some packages like `openSSL`. But the accademy VPS doesn't allow me to install the package using system package manager.

At first, I thought I could make a `static compile` from another Linux computer. But I changed my mind because that meant I had to maintain the `makefile` which is not an easy job.

As a result, I decided to find a way to use a user library path, which I found is by `setting LD_LIBRARY_PATH env var`. More details are [here](http://www.tldp.org/HOWTO/Program-Library-HOWTO/).

----

At the beginning, I make the project on my Linux, and I copied the executable to uni's accademy VPS via SCP. I ran it, but it shows cannot find xxxx version number. So used such command to copy it from an existing device.

    cd /
    find | grep libcrypto.so.1.0.0

And then I got the full path, SCP again and again until the dependency problem fixed.

All my runtime libraries are stored in `~/libs` so I have to specify the library path and the environment variable.

Because the Linux is using `CShell`, I have to edit `.cshrc` and add one line:

    setenv LD_LIBRARY_PATH /....../libs
    source ~/.cshrc

Then the application should be able to work. In my case, I copied all the libraries files from a certain directory from the compiling system and it worked.

## Start offline downloading

To offline downloading, we need to start a `screen` method. Generally, I like to run:

    screen -R baidu/xxxx xxxxx

Then just follow the user namual, you should know how to download a file.


