---
layout: post
title: "命令行编译运行Hadoop接口的Java的程序"
subtitle: "才不要什么臃肿的Eclipse或者IDEA呢！"
date: 2015-03-26 23:56
comments: true
author: MewX
published: true
categories: [hadoop, java]
---

　　这学期开设了Hadoop的课程，最近也是在做这方面的实验。

　　新机器是双硬盘，Linux安在机械硬盘里面就一直没怎么用。一直在用win8.1，觉得win8.1的设计确实很赞！

　　于是上机课自然就没有装eclipse，只有Hadoop-2.6.0官方提供的包，内置了jar库，但是没有IDE确实编译起来很麻烦。

　　这边尝试了一些，发现Hadoop的库全部在share/hadoop里面。

　　写了一段程序测试，通过网上检索Exception终于调过编译命令。

<br/>

**测试程序**

<?prettify lang=java?>

    import java.io.InputStream;
    import java.net.MalformedURLException;
    import java.net.URL;
    import java.net.URLConnection;
    import org.apache.hadoop.fs.FsUrlStreamHandlerFactory;
    import org.apache.hadoop.io.IOUtils;

    public class TestRead {
      public static final String HDFS_PATH = "hdfs://localhost:9000/20150324/test20150324.txt";

      public static void main( String[] args ) throws Exception {
        URL.setURLStreamHandlerFactory( new FsUrlStreamHandlerFactory( ) );
        URL url = new URL( HDFS_PATH );

        final InputStream in = url.openStream();

        IOUtils.copyBytes( in, System.out, 1024, true );

      }
    }

<br/>

**编译参数**

<?prettify lang=shell?>

    javac -cp /home/mewx/Programs/hadoop-2.6.0/share/hadoop/common/hadoop-common-2.6.0.jar $1.java
    java  -cp /home/mewx/Programs/hadoop-2.6.0/share/hadoop/common/*:/home/mewx/Programs/hadoop-2.6.0/share/hadoop/common/lib/*:/home/mewx/Programs/hadoop-2.6.0/share/hadoop/hdfs/hadoop-hdfs-2.6.0.jar:. -Djava.protocol.handler.pkgs=org.apache.hadoop.util.protocols $1

<br/>

**几点说明**

- \-cp是调用制定classpath的参数，后面跟classpath。运行的时候需要加上":."，目的是引用JRE的默认运行库的目录。其中冒号是Linux连接符，在.bashrc文件也经常要用到。

- \-Djava.protocol.handler.pkgs=org.apache.hadoop.util.protocols 作用是导入hdfs的handler，不然URL是无法识别"hdfs://"的。

- 以上参数是写在一个bash脚本里面的，直接运行脚本然后跟上一个类名参数即可编译运行了。

- 如果需要编写复杂的程序，还是建议使用Eclipse这样的IDE来完成，比如import就会方便太多！

<br/>
