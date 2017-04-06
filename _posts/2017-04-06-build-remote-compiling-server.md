---
layout: post
title: "Build Remote Compiling Server"
subtitle: "Don't want to install 2GB LaTeX software, so I used GitHub, ssh, scp to make a remote compiling server"
date: 2017-04-06 21:37
comments: true
author: MewX
published: true
categories: [linux]
---

I have a LaTeX assignment, but I don't want to install `tex live` on my own laptop because it contains thousands of small files. Maybe it can slightly protect my hard driver. Then I have to find a way to compile the LaTeX files.

Firsly, I choose to use `Overleaf` - a online LaTeX toolset. It works quite good at uni, but when I get home it generally overwrites my texts with an old version because of my slow network speed. That means it's unstable in poor network environment.

So, I began to think about directly using my uni's shared server which is installed with `tex live` in the last year.

## No-passwork access

Using `ssh` or `scp` requires password everytime, that makes one-click solution not work. So, the first step is to remove the passwork verification. So, the method is like `git push key`.

    cd ~/.ssh
    cat id_rsa.pub

*Note, if you don't have this file or folder, please check this [post](https://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key).*

After this, I can see the public key. Then, copy/append them into uni's shared server, in this file: `~/.ssh/authorized_keys`. **(Note: the key only has one line)**

Now, I can access that server without entering passwork any more.

## Automatic process

The next thing is to make everything work automatically.

### Process

The process is like this:

    Me: push to GitHub
    Uni: pull from GitHub
    Uni: compile
    Me: Pull from uni

### Access to private git repo

The idea is, GitHub provides each project a deploy key settings, which allow user to set ssh keys with `pull` permission only. Uni's shared server is not trusted, so I don't want to give all my account's access to that server. 

### Execute scripts in my PC

I want to pass command into `ssh` command directly. So I searched for [that](http://stackoverflow.com/a/2732991/4206925),

    ssh user@remote 'bash -s' < local_script.sh

With this command, I can run local commands on remote server directly.

## Scripts

Here are the file contents.

### remote_old.sh

    cd ~/Codes/ec-groupwork/reports/report1
    git pull
    pdflatex main.tex

### pull_old.sh

    ssh user@remote 'sh -s' < remote_old.sh
    scp user@remote:~/Codes/ec-groupwork/reports/report1/main.pdf main.pdf

----

A newer version just skip the GitHub server.

### remote.sh

    cd ~/Codes/ec-groupwork/reports/report1
    pdflatex main.tex

### pull.sh

    scp main.tex user@remote:~/Codes/ec-groupwork/reports/report1/
    ssh user@remote 'sh -s' < remote.sh
    scp user@remote:~/Codes/ec-groupwork/reports/report1/main.pdf main.pdf

**Note: I didn't use bash because uni's server is running CShell.**

So far, I can run `./pull.sh` to compile & pull back the `.pdf` file easily~~~ Rejoice for saving my hard driver ;) !
