---
layout: post
title: "Hello, World!"
subtitle: "Just a general 'hello world' post!"
date: 2014-07-28 10:00
comments: true
author: MewX
published: true
categories: [web, Test]
---
　　{{ page.title }}
　　  
　　First Blog Test
　　

| Name | Description          |
| ------------- | ----------- |
| Help      | ~~Display the~~ help window.|
| Close     | _Closes_ a window     |

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -----:|
| col 3 is      | some wordy text | $1600 |
| col 2 is      | centered        |   $12 |
| zebra stripes | are neat        |    $1 |

<!-- more --><br>

* Second Blog Test

<br>
**Code** *Here*
<br>

<?prettify lang=c?>
    #include <stdio.h>
    #include <math.h>

    int main( )
    {
        double a, d, x = 0.0, y = 0.0, temp = 0.0;
        int n, i;
        scanf( "%lf%lf%d", &a, &d, &n );

        for( i = 0; i < n; i ++ ) {
            // temp += d;
            // if( temp > 4.0 * a ) temp = fmod( temp, 4.0 * a );
            temp = fmod( temp + d, 4.0 * a );

            if( temp < a ) {
                x = temp;
                y = 0.0;
            }
            else if( temp < a + a ) {
                x = a;
                y = temp - a;
            }
            else if( temp < a + a + a ) {
                x = a - ( temp - a - a );
                y = a;
            }
            else {
                x = 0.0;
                y = a - ( temp - a - a - a );
            }
            printf( "%.10lf %.10lf\n", x, y );
        }

        return 0;
    }

<br>
Code End
