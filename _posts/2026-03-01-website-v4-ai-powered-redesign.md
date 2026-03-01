---
layout: post-v4
title: "Website v4: AI-Powered Redesign with Kiro"
subtitle: "How I rebuilt my entire website within two hours using Claude Sonnet 4.5 and Kiro IDE"
date: 2026-03-01 23:30
comments: true
author: MewX
published: true
categories: [web, life, ai]
---

Today marks a significant milestone for this website - the launch of version 4! What makes this update special isn't just the modern design, but how it was built: entirely through collaboration with AI.

## Why Today?

Three things aligned perfectly to make today the day to start this upgrade:

1. **Kiro's free 500 credits**: I wanted to try out Kiro's AI-powered development experience, and they offer 500 free credits to start
2. **End of month**: Use it or lose it - those credits expire at the end of the month
3. **Material Design Lite is dead**: The final push came when I discovered that Google's Material Design Lite (which powered v3) now returns 403 Forbidden errors. All official CDNs are down, and even [getmdl.io](https://web.archive.org/web/20260216004907/https://getmdl.io/) is completely gone. It was time to move on.

The funny thing is, I had already planned this redesign years ago when working on v3. I even prepared the background images back then! But I was too lazy to hand-code everything. Now, with AI assistance, what would have taken weeks of manual work was done in two hours.

## The AI Development Experience

I used [Kiro](https://kiro.dev/), an AI-powered IDE, with Claude Sonnet 4.5 to redesign and rebuild the entire website in just two hours. This wasn't about AI writing code while I watched - it was a true collaborative process where I provided design direction and feedback as a PM, and the AI handled the implementation details.

The workflow was remarkably smooth:
1. I'd describe what I wanted (e.g., "move the logo to the top half and let content start from the bottom half")
2. Kiro would understand the context, read the relevant files, and make the changes
3. I'd review and provide feedback
4. We'd iterate until it was perfect

## What's New in v4

The redesign brings a fresh, modern aesthetic while maintaining the personality of previous versions:

### Visual Design
- **Split-screen hero layout**: Logo and animations in the top half, content starting from the bottom half
- **Gradient overlays**: Transparent-to-blue gradients that enhance the background images
- **Consistent page headers**: All pages now feature centered headers in the hero section
- **Improved typography**: Larger, bolder headers with better font stacks including emoji support

### Technical Improvements
- **Modern CSS architecture**: Clean, maintainable styles with CSS custom properties
- **Responsive design**: Optimized layouts for desktop, tablet, and mobile
- **Better mobile navigation**: Fixed mobile menu functionality across all pages
- **Cross-platform emoji support**: Added system emoji fonts for consistent rendering
- **Smooth animations**: Conditional anime.js loading for pages that need it
- **No more MDL dependency**: Built with vanilla CSS and modern web standards

### Layout Updates
- Redesigned homepage with overlapping content sections
- Updated archive, timeline, projects, friends, and about pages
- Consistent v4 design language across all pages
- Improved spacing and visual hierarchy

## The Power of AI-Assisted Development

What struck me most was how natural the development process felt. Instead of:
- Manually searching through files
- Writing boilerplate code
- Debugging CSS issues
- Ensuring consistency across pages

I could focus on:
- Design decisions
- User experience
- Creative direction
- Overall vision

The AI handled the tedious parts while I stayed in the creative flow. When I noticed the mobile menu wasn't working, I just mentioned it, and Kiro identified the missing JavaScript file and fixed it. When I wanted bigger headers, it adjusted the typography across all breakpoints consistently.

## Reflections on the Blogging Era

Looking at my [friends list](/friends/), I noticed something bittersweet: most of those pages are gone now. Those links were added back in the 2010s, during the golden age of GitHub Pages. When GitHub Pages first launched, there was a rush of excitement - everyone was creating their own static sites. My friends and I were part of that wave, all setting up our personal blogs and sharing links.

But maintaining a blog turned out to be harder than starting one. The barrier to entry was low, but the commitment required was high. Over the years, one by one, those pages disappeared. Some domains expired, others were abandoned, and a few just stopped updating.

It's a reminder that while technology makes it easy to start something, sustaining it requires genuine passion. Those of us still maintaining our blogs in 2026 are the survivors of that era - a testament to the enduring appeal of having your own corner of the internet.

## Looking Back at v3

Looking back at my [v3 announcement](/blog/201801/website-v3/) from 2018, I talked about learning Material Design Lite and anime.js. Back then, I hand-coded everything, learning from W3Schools and reading source code from other websites.

Today's experience was fundamentally different. The technical knowledge is still important - I needed to understand web design principles to guide the AI effectively. But the implementation barrier has essentially disappeared. Ideas can become reality almost as fast as you can articulate them.

This isn't replacing developers; it's amplifying them. I still made all the design decisions, provided feedback, and ensured quality. But I could iterate 10x faster than before.

## Looking Forward

Version 4 represents not just a visual refresh, but a glimpse into the future of web development. As AI tools become more sophisticated, the gap between imagination and implementation continues to shrink.

I'm excited to see where this technology goes. For now, I'm just happy to have a beautiful new website that I built in a day with my AI pair programmer.

You can check out all the changes in the [GitHub repository](https://github.com/MewX/mewx.github.io). The entire v4 redesign happened in today's commits!

## Version History

For those interested in the evolution:
- v1: [2015 Archive](http://web.archive.org/web/20150717081556/http://www.mewx.org:80/)
- v2: [2017 Archive](http://web.archive.org/web/20171028094804/https://www.mewx.org/)
- v3: [2026 Archive](https://web.archive.org/web/20260206225416/https://www.mewx.org/)
- v4: What you're seeing now!

---

*Built with ❤️ and 🤖 using Kiro and Claude Sonnet 4.5*

*P.S. This entire blog post was generated by an LLM based on our conversation today. Even the writing is AI-powered! 😄 How lazy I am now!*
