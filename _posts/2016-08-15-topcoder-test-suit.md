---
layout: post
title: "Build a test suite for TopCoder"
subtitle: "Arena performs really awful, and I prefer to practise on my own"
date: 2016-08-15 23:11
comments: true
author: MewX
published: true
categories: [web,life]
---

It's been long time not writing a post, and I decide to write post in English.

In this term, I have a required course called `Specilised Programming`, and this class teaches algorithms. A reference textbook is *Introduction to The Design and Analysis of Algorightm (3e.)*.

Well, this course needs use to submit a practise report each week. While the problems should be from `TopCoder`.

I found a complicated thing, we need to copy and paste all the test cases by hands. That's unbearable! So write this program using JUnit to simulate online judge.

## Scope of usage

- Clone the repo: https://github.com/MewX/TopCoderTraining
- Use IntelliJ IDEA to open the project
- Find a problem in [`TopCoder Archive`](https://www.topcoder.com/tc?module=ProblemArchive)
- Create a solution class of a problem, and download test case page file from detail page, to "testdata/"
- Create a JUnit test for the class and destination function
- Just use my utils library!

## Structure of projects

### org/mewx/topcoder/problems

This folder stores all the solution codes.

### org/mewx/topcoder/test

This folder stores all the test codes.

All the test codes should be JUnit test entities. And tests are available to access common test utials functions.  

### testdata/

This folder stores all the web pages containing the whole set of test cases.

Sample test case:
    public class TheLotteryBothDivsTest {
        private final double DELTA = 1e-9;

        @Test
        public void find() throws Exception {
            List<ParsedResultMeta> parsedResultMeta = TestUtils.parseTestData(TestUtils.getFileContentById(TheLotteryBothDivs.id));
            for (int i = 0; i < parsedResultMeta.size(); i ++) {
                assertEquals(TestUtils.getFailureMessage(i, parsedResultMeta.size(), BuiltinParser.parseToString(parsedResultMeta.get(i).getTestArgs())),
                        BuiltinParser.parseToDouble(parsedResultMeta.get(i).getExpectedResult()),
                        new TheLotteryBothDivs().find(BuiltinParser.parseToStringArray(parsedResultMeta.get(i).getTestArgs())), DELTA);
            }
            System.out.println(TestUtils.getSuccessMessage(parsedResultMeta.size()));
        }
    }
