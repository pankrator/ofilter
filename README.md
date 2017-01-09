# process-filter
[![Build Status](https://travis-ci.org/pankrator/ofilter.svg?branch=master)](https://travis-ci.org/pankrator/ofilter)


## Introduction
Ever wondering how to filter your process' output which is enormous in order to find the 1-line message you are looking for. I am sure you have used `grep` or something similar. But the problem with grep is that if you want to change the text you are looking for you have to stop the process and re-run it with the new grep regex.

This Node.js CLI tool comes to you to allow online (without re-run) filtering of process' output.

## Install

What you need: Node.js version >= 4.0.0

```
npm install process-filter --global
```

## Usage

```
ofilter <your_process_runner> [anything_else_needed_to_your_process]
```

For example:

```
ofilter node index.js
```

## Hotkeys

* ESC - Pauses and buffers the output. While in this mode you can change filtering message. Just type in the console what text you want to filter on and press ENTER. When you press ESC again the output will be resumed and whatever is buffered will be displayed through the filter.
