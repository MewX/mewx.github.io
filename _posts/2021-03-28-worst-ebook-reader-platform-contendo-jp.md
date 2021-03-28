---
layout: post
title: "Cracking the worst ebook platform - ConTenDo.jp"
subtitle: "I purchased a book, but I can't use other apps to read it! So I hacked the reader app - ConTenDo Viewer."
date: 2021-03-31 01:56
comments: true
author: MewX
published: true
categories: [life, crack, java]
---

## TL;DR

- **Do not buy any books from [ConTenDo.jp](https://contendo.jp/); otherwise check this article on how to remove the encryptions.**
- **千万不要在 ConTenDo.jp 上买书，但是买了的话看本教程可以破解书籍加密！**
- **ConTenDo.jp から本を購入しないでください。 それ以外の場合は、暗号化を削除する方法についてこの記事を確認してください。**

If you are frustrated with the same thing and want to download the unencrypted books you purchased?
Please feel free to leave a comment and I think I can help you.

I might consider releasing a dedicated tool for this platform,
which entirely depends on my spare time, unfortunately.
Here's the [**proof-of-concept codes**](https://github.com/MewX/contendo-viewer-decryptor)
I used to decrypt my purchased books. **(Please understand before using.)**

The apps are made of:
- Desktop apps (Windows/Linux/MacOS v1.6.3): Java 12 + JavaFX.
- Mobile apps (Android/iOS v1.2.2): Cordova + JNI.

Encryptions used by the platform (apps):
- most files in `<user_dir>/<user_name>/.ConTenDoViewer/`: Not encrypted.
- `<user_dir>/<user_name>/.ConTenDoViewer/info`: a serialized Java 12 object,
  containing book data decryption keys (encrypted by AES and different for each book),
  a random int64 number of which the MD5 checksum is your AES private key,
  and more account info (e.g. login status, expiry date, etc.).
- book files (`*.pdf` and `*.epub`):
  - EPUB: zip archive, encryption applies to each single file entry
  - PDF: whole file
  - Encryption for file:
    - less than 1024 bytes: not encrypted
    - otherwise: maybe encrypted, using custom XORs and Bitwise-shifts
      (encrypted file magic numbers in Big-Endian: `0x43444546` or `0x49474546`)
- Other book formats: not supported

Tools I used:
- VSCode on WSL 2 to search codes.
- [JD-GUI](http://java-decompiler.github.io/) v1.6.6 to decompile JAR packages.
- [CFR](https://github.com/leibnitz27/cfr) v0.151 to decompile JAR packages differently.
- 010 Editor: hex editor.
- Fiddler: capturing network packages and providing proxies.

Codes are obfuscated and they make copy&paste harder to work here
(for example, Java package names conflict with the same class names). :-(

## How it all happened?

I was learning Japanese recently and I was looking for an ideal textbook as a begin.
Since I am a native Mandarin Speaker, textbooks in Mandarin would be more preferred.

### Looking for the textbook

There are some popular textbooks for preparing for JLPT (Japanese-Language Proficiency Test).
However, I am not learning for the tests. I am just learning to unlock the ability.
The books are (for the reference):
- 「みんなの日本語」 (a.k.a 《大家的日语》)
- 《新版 标准日本语》

After digging around, I found another book that looked more suitable for me:
- 「ニュー・システムによる日本語」 and 「ニュー・システムによる日本語　続編」
- In English: _New System Japanese (English Edition)_ and _New System Japanese Sequel (English Edition)_
- In Traditional Chinese: 《ニュー・システムによる日本語（中国語・英語版）》
- In Simplified Chinese: 《海老原日本語》 (Discontinued)

These books teach Japanese in a _new system_ obviously,
mainly focusing on teaching the verbs more practically
which are said to be the most difficult part in learning Japanese.
The author is 海老原 峰子, who is a Japanese educator teaching in Singapore.

### Looking for sample pages and purchase

Since I have the target, I tried to look for some sample pages
so that I can double-check if it was the one I was looking for.
However, these books are not as popular as the other two books.

Checking the price on Amazon, they sell JPY ¥3080 and do not support international delivery.
Apparently, I cannot use Amazon Japan this time.

<center><img src="{{ site.cdn }}imgs/202103/amazon-co-jp.png" style="max-width:100%;"/></center>

Heard from a [YouTuber](https://www.youtube.com/watch?v=UYOnEsBg2hQ)
saying they also sold digital versions.
So, I successfully found their [official digital shops](https://newsystemjapanese.wixsite.com/patented/textbooks),
which was open on a platform called _the base_, similar to eBay.

JPY ¥1870 is quite cheap for error tolerance. So, I tried to purchase one.
However, the official website rejected my Travel Money Card...
Also, tried to phone the bank, 40 minutes passed and no human actually answered.

Therefore, I tried to find other sellers, and ConTenDo was the one...

### ConTenDo ebook platform

ConTenDo.jp (電子書籍サイト \[コンテン堂\]) is an e-book platform,
including selling, renting, reading e-books.

I found the book also available on ConTenDo with the same price,
so I purchased the book with my newly registered accounts.
The good news was that they accepted my visa card.

That was how everything began. Their website said the size of the book,
so I thought I should at least be able to download the book.

<center><img src="{{ site.cdn }}imgs/202103/contendo-shop.png" style="max-width:100%;"/></center>

However, they did not allow me to download my ebook.
Instead, I had to use their apps to read.
That was fine actually if the app was good enough.
The thing is that I usually liked to print out those books and make notes.

For me, the app was very useless:
- The book I purchased was entirely in pictures, so I cannot select/copy contents.
- The app does not support print/copy functions.
- The app is very laggy and buggy.
- The Android app is not even available on the Australian Play Store!

Look at the UI:

<center><img src="{{ site.cdn }}imgs/202103/contendo-viewer.png" style="max-width:100%;"/></center>

All these reasons made me very unhappy. So, I tried to get a refund.
And as you can imagine, they said a refund was impossible at all.

So, I was not happy and I wanted to get my book back digitally.

## How to get your books back?

Screenshots!!!

Yes, it worked for me.
I spent 10 minutes using [Snapaste](https://www.snipaste.com/) to take screenshots for each page.
I set up the shortcuts:

1. F1 - start screenshot
2. Enter - full screen screenshot
3. RightArrow - Next page

<center><img src="{{ site.cdn }}imgs/202103/screenshot-approach.png" style="max-width:100%;"/></center>

and then use ImageMagick to crop the screenshots:

``` shell
$ convert Snipaste/Snipaste_2021-03-27_22-15-37.png -crop 985x1394+787+3 "New System English (English + Chinese)/Snipaste_2021-03-27_22-15-37.png"
$ convert Snipaste/Snipaste_2021-03-27_22-19-17.png -crop 985x1394+787+3 "New System English (English + Chinese)/Snipaste_2021-03-27_22-19-17.png"
$ convert Snipaste/Snipaste_2021-03-27_22-21-08_0.png -crop 985x1394+787+3 "New System English (English + Chinese)/Snipaste_2021-03-27_22-21-08_0.png"
$ convert Snipaste/Snipaste_2021-03-27_22-15-42.png -crop 985x1394+787+3 "New System English (English + Chinese)/Snipaste_2021-03-27_22-15-42.png"
$ convert Snipaste/Snipaste_2021-03-27_22-19-18.png -crop 985x1394+787+3 "New System English (English + Chinese)/Snipaste_2021-03-27_22-19-18.png"
...
```

## Analysis

### General

The initial idea was to find the downloaded files first.

Since I was using Windows 10, I looked for:
- `<user_dir>\AppData\Local`: usually where most apps store their data.
- `<app_install_dir>`: shouldn't be the case as it requires Admin permission to write.
- `<user_dir>\.config\`: popular new \*nix-like systems.
- `<user_dir>\<hidden_dir>`: popular old \*nix-like systems.

So, the dir was `<user_dir>/.ConTenDoViewer/`. The file structure is like:

```
.ConTenDoViewer/
├── books
│   ├── user
│   │   ├── J<numbers>.S.epub
│   │   └── ... more books
│   └── web
│       └── user_mailprovider.com
│           ├── J<numbers>
│           │   └── thumb_small
│           ├── ... more books
│           │   └── thumb_small
│           ├── items
│           └── sort
├── config
├── fonts
│   └── ... more fonts
├── info
└── pid
```

So, the encrypted files were:
- ./info
- ./books/../\*.epub

Initially, I didn't realise the epub files were encrypted as I could use unzip to read the file.
However, when I tried to use several different epub readers
(Adobe Digital Editions and Moon+ Reader Pro), they all didn't work.

So, I unzipped the EPUB file and looked into each file.
I saw the single files were encrypted.
On top of each file, there seemed to have some key texts:

<center><img src="{{ site.cdn }}imgs/202103/encrypted-header.png" style="max-width:100%;"/></center>

### Network capturing

The first thing I could think of the encryption definitely was related to some key exchange algorithms.

So, I set up Fiddler on Windows to capture the texts.
However, the packages could not be captured as experimented.

Therefore, I looked deeper into the installed files.
There was a JDK directory inside!

I also used 7-zip to check what the executable looks like.
It turned out to be a jar package.
That makes things much easier because I could just use `java -jar <proxy> *.jar` to set up the proxy.

However, I do not have JDK installed on my windows.
My JDK was installed on WSL 2. ;-(

I also used RDP to connect to my WSL 2 to try running it within WSL 2.
My installed JDK 11 did not contain JavaFX, so it could not be executed directly.

Considering the proxy setup between Windows host and WSL 2 is also another complicated work,
I gave up this path.

### Java Decompilation

Since it was a JAR package, using [JD-GUI](http://java-decompiler.github.io/) was intuitive.
It was good to see [the codes](https://github.com/MewX/contendo-viewer-v1.6.3) were obfuscated.

_I like challenges!_

It wasn't easy to navigate to the entry point.
Luckily JavaFX requires similar obfuscator settings like Android to not include activity classes.

So, in `package net.zamasoft.reader.shelf`, there are several controller classes.
These classes are like Android activity classes.
Also, if you are familiar JavaFX, there are layout files as well named `*.fxml`.
I didn't upload them but you could simply unzip
[the jar file](https://github.com/MewX/contendo-viewer-v1.6.3/releases/tag/v1.6.3) to see them.

This took quite a long time to figure out what actually went on
as JD-GUI was really hard to use for finding cross-references.
I essentially debugged the function call stack on my brain LMAO.
Here's how it looked like:

<center><img src="{{ site.cdn }}imgs/202103/jd-gui-debugging.png" style="max-width:100%;"/></center>

One thing I would like to note here was that JD-GUI sometimes decompiled wrongly.
So, I used another tool called [CFR](https://github.com/leibnitz27/cfr) as an N+1 reference.
That was how CFR look like when using VSCode:

<center><img src="{{ site.cdn }}imgs/202103/vs-code-while-debugging.png" style="max-width:100%;"/></center>

### Mobile debugging

You know, debugging these obfuscated codes was really painful,
I also checked the Android application to see if would be easier.

I used dex2jar and jd-gui, and it seemed that the Android app is every more complicated for me.
It used Cordova which I was not familiar with.

Plus, it used many JNI libraries, which made it harder to transcode on my [proof-of-concept](https://github.com/MewX/contendo-viewer-decryptor).

So, I ended up giving up this approach.

One interesting is that, Play Store reviews were the same as I thought:

<center><img src="{{ site.cdn }}imgs/202103/play-store-reviews.png" style="max-width:80%;"/></center>

### How the encryption works

As I mentioned previously, there are two parts of the saved files encrypted.

The PoC (Proof of Concept) codes and decryption tools can be found here:
[https://github.com/MewX/contendo-viewer-decryptor](https://github.com/MewX/contendo-viewer-decryptor).

#### info file

The `info` file stores the user login information and decryption keys for each book.
Essentially, it is a _keystore_.

Each book takes a different key to decrypt.
The ConTenDo Viewer app checks this keystore when seeing an encrypted file.

The keystore structure is a hashmap:

```java
// The map can look like this:
// {
//   "3c9b6643958814859e22aef293d807ec": {..., encryption_key = "..."},
//   "c566fb3127e5b49b299e388924db71e6": {..., encryption_key = "..."},
// }
HashMap<String, String> bookIdToDecryptionKeyMap;
```

The book ID is from 0x1C to 0x3B (included):
```
# Example 1 ID: 3c9b6643958814859e22aef293d807ec
0000h: 43 44 45 46 01 00 00 00 00 00 00 00 63 36 38 30  CDEF........c680 
0010h: 66 66 35 64 63 36 38 30 66 66 35 64 33 63 39 62  ff5dc680ff5d3c9b 
0020h: 36 36 34 33 39 35 38 38 31 34 38 35 39 65 32 32  6643958814859e22 
0030h: 61 65 66 32 39 33 64 38 30 37 65 63 01 03 04 01  aef293d807ec.... 

# Example 2 ID: c566fb3127e5b49b299e388924db71e6
0000h: 49 47 45 46 02 00 00 00 00 00 00 00 ED 03 00 00  IGEF........í... 
0010h: 80 00 00 00 00 01 00 00 00 00 00 00 63 35 36 36  €...........c566 
0020h: 66 62 33 31 32 37 65 35 62 34 39 62 32 39 39 65  fb3127e5b49b299e 
0030h: 33 38 38 39 32 34 64 62 37 31 65 36 00 00 00 00  388924db71e6.... 
```

Then there's a random Long number at the beginning of the `info` file.
That's the AES encryption secret key used to decode the keystore.

Detailed codes can be found [here](https://github.com/MewX/contendo-viewer-decryptor/blob/b6af72d2a139770ec929725fc29d3f7251039894/Main.java#L52-L61):

```java
// Note, the key changes everytime because it's random.
// It's at the beginning of info file.
byte[] builtSecretKey = buildSecretKey(6874628185188049249L);
MessageDigest messageDigest = MessageDigest.getInstance("MD5");
SecretKeySpec secretKeySpec = new SecretKeySpec(messageDigest.digest(builtSecretKey), "AES");
Cipher cipher = Cipher.getInstance("AES");
cipher.init(2, secretKeySpec);
ObjectInputStream objectInputStream = new ObjectInputStream(new CipherInputStream(fileInputStream, cipher));

long secretKey = objectInputStream.readLong();
HashMap<String, com.b.a.b.a> n = (HashMap<String, com.b.a.b.a>) objectInputStream.readObject();
// Note: com.b.a.b.a.a.f() is the decryption key.
```

#### Book file

Since we have the decryption key for the book, we can decrypt the book file.

ConTenDo Viewer supports EPUB and PDF files only. The codes check the file size first.
- If the file size is less than 1024, then there is no encryption.
- If the file does not have a magic number, then there is no encryption.

The magic numbers are in Big-Endian:
- `0x43444546` (CDEF in text) or
- `0x49474546` (IGEF in text).

The encryption used a code table in the first 1024 bytes in each encrypted file.
For each file in the same EPUB, `0x3C` to `0x400` (exclusive) are always the same.
Plus the decryption key, we can decrypt the file.

The implementation codes are [here](https://github.com/MewX/contendo-viewer-decryptor/blob/b6af72d2a139770ec929725fc29d3f7251039894/com/b/a/a/a/c/a.java#L63-L77).
To use it:

```java
// https://github.com/MewX/contendo-viewer-decryptor/blob/b6af72d2a139770ec929725fc29d3f7251039894/Decrypt.java#L57-L68
net.zamasoft.reader.book.a.b randomAccessFile = new net.zamasoft.reader.book.a.b(file);
ArrayList<Byte> bytes = new ArrayList<>();
while (!randomAccessFile.isEOF()) {
    byte b = (byte) randomAccessFile.read();
    bytes.add(b);
}
assert randomAccessFile.length() == bytes.size();
byte[] bs = new byte[bytes.size()];
for (int ii = 0; ii < bs.length; ii++) {
    bs[ii] = bytes.get(ii);
}
return bs;
```

### Verifying

Since we have the [tools](https://github.com/MewX/contendo-viewer-decryptor)
to decrypt encrypted files, we can verify if it actually works.

I tried the book I purchased. Before:

<center><img src="{{ site.cdn }}imgs/202103/new-system-book-encrypted.png" style="max-width:80%;"/></center>

After:

<center><img src="{{ site.cdn }}imgs/202103/new-system-book-decrypted.png" style="max-width:100%;"/></center>

Note: the texts are encoded in UTF-8. Thus, don't panic if you see weird texts.

<center><img src="{{ site.cdn }}imgs/202103/charset-settings.png" style="max-width:100%;"/></center>

Here's another example (with a different decryption key):

```shell
$ java Decrypt /mnt/r/comic.S /mnt/r/asdf2
```

<center><img src="{{ site.cdn }}imgs/202103/another-decryption.png" style="max-width:100%;"/></center>

## Some takeaways

Please feel free to leave a comment below if this article helped you
or if you would need my help to decrypt your books voluntarily.

For me, I'll double-check if a platform works as I expect before I purchase from them.
