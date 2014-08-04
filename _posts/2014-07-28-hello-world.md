---
layout: testpage
title: "Hello, World!"
date: 2014-07-28 10:00
comments: true
author: MewX
published: true
categories: [WebSite, Test]
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

<!-- more -->

Second Blog Test

{{ page.date | date_to_string }}
