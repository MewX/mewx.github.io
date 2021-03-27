---
layout: post
title: "Cracking the worst ebook platform - ConTenDo.jp"
subtitle: "I purchased a book, but I can't use other apps to read it! So I hacked the reader app - ConTenDo Viewer (obviously)."
date: 2021-03-31 01:56
comments: true
author: MewX
published: true
categories: [life, crack, java]
---

## TL;DR

If you are struggling the same thing and want to download the unencrypted books you purchased?
Please feel free to leave a comment and I think I can help you.

I might consider releasing a dedicated tools for this platform,
which entirely depends on my spare times unfortunately.

The apps are made of:
- Desktop apps (Windows/Linux/MacOS v1.6.3): Java 12 + JavaFX.
- Mobile apps (Android/iOS v1.2.2): Cordova + JNI.

Encryptions used by the platform (apps):
- most files in `<user_dir>/<user_name>/.ConTenDoViewer/`: Not encrypted.
- `<user_dir>/<user_name>/.ConTenDoViewer/info`: a serialized Java 12 object,
  containing your data decryption key (encrypted by AES),
  a random int64 number of which the MD5 checksum is your AES private key,
  and more account info (e.g. login status, expiry date, etc.).
- book files (`*.pdf` and `*.epub`):
  - EPUB: zip archive, encryption applies to each single file entry
  - PDF: whole file
  - Encryption for file:
    - less than 1024 bytes: not encrypted
    - otherwise: maybe encrypted, using custom XORs and Bitwise-shifts
      (encrypted file magic numbers in Big-Endian: `0x43444546` or `0x73716970`)
- Other book formats: not supported

Tools I used:
- VSCode on WSL 2 to search codes.
- [JD-GUI](http://java-decompiler.github.io/) v1.6.6 to decompile JAR packages.
- [CFR](https://github.com/leibnitz27/cfr) v0.151 to decompile JAR packages in a different way.
- Fiddler: capturing network packages and providing proxies.

Codes are obfuscated and they make copy&paste harder to work here
(for example, Java package names conflict with same class names). :-(

## More details

TODO: need time to write :)
