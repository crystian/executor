# eXecutor
### **_A powerful "short-cutter" to your console to you and your team!!_**

[![npm](https://img.shields.io/npm/v/executor.svg?style=flat-square)](https://www.npmjs.com/package/executor) 
[![CircleCI](https://circleci.com/gh/crystian/executor/tree/master.svg?style=shield)](https://circleci.com/gh/crystian/executor/tree/master)
[![Codacy grade](https://img.shields.io/codacy/grade/d3f65a1bc7604109843a0b9bda912c3b.svg?style=flat-square)](https://www.codacy.com/app/crystian/executor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=crystian/executor&amp;utm_campaign=Badge_Grade)
[![Codacy coverage](https://img.shields.io/codacy/coverage/d3f65a1bc7604109843a0b9bda912c3b.svg?style=flat-square)](https://www.codacy.com/app/crystian/executor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=crystian/executor&amp;utm_campaign=Badge_Coverage)
[![npm](https://img.shields.io/npm/dm/executor.svg?style=flat-square)](https://www.npmjs.com/package/executor)
[![HitCount](http://hits.dwyl.com/crystian/executor.svg)](http://hits.dwyl.com/crystian/executor)

[![license](https://img.shields.io/npm/l/executor.svg?style=flat-square)](https://raw.githubusercontent.com/crystian/executor/master/LICENSE)
[![David](https://img.shields.io/david/crystian/executor.svg?style=flat-square)](https://github.com/crystian/executor/blob/master/package.json)
[![Gitter](https://img.shields.io/gitter/room/crystian/executor.svg?style=flat-square)](https://gitter.im/crystian/executor/??utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[ english ] [ [spanish](docs/README-ES.md) ]

---

## TL;DR

This tool allows you to save a lot of time writing commands with totally custom shortcuts, that you can share on the project with your "human" team or machines, with a unique code on the same place. #agile #needForSpeed. 
 
> Like `scripts` of `package.json` but with _steroids_.

**Notes:** The idea is not to leave to use the console; it's for optimising it!
  
### Features

* Multi-platform: An only code that works on all platforms. Powered by [nodejs](https://nodejs.org)
* Templates to easy to reused
* Does not matter what kind of project is, if you write commands this tool can be helpful for you
* There are five source types of variables: Predefined, environment, package.json, templates and shortcuts.
* Devs and DevOps can be friends with it because they can share their scripts.
* Typo on long command lines are past problems!
* Stop with one thousand of similar scripts on your `package.json`!  
(`build`, `build-ci`, `build-prod`, `build-prod-ci`, `build-qa`, `build-qa-ci`, `build-ci-cache`, etc...)
* The `scripts` on the `package.json` was modified and have to `rebuild` your docker image, never more!
* **Without dependencies from other modules!**

![](docs/img/jake.gif)

---
## Documentation

### Spoiler

##### Before
On `package.json`

```
"scripts": {
  "build": "docker run --rm -it -p 4200:4200 -v /choclo:... --name myProject-dev myProject ng build",
  "build-prod": "docker run --rm -it -p 4200:4200 -v /choclo:... --name myProject-dev myProject ng build --prod",
  "server": "docker run --rm -it -p 4200:4200 -v /choclo:... --name myProject-dev myProject ng serve"
}
```
##### Executor
```
"templates": {
  "docker-common": "docker run --rm -it -p 4200:4200 -v /choclo:... --name ${pkg.name}-dev ${pkg.name}" 
},
"shortcuts": {
  "build": "${docker-common} ng build",
  "build-prod": "${docker-common} ng build --prod",
  "server": "${docker-common} ng serve"
}
```

### Table of content

* [Intro](https://github.com/crystian/executor/wiki/Home)
* [Why?](https://github.com/crystian/executor/wiki/1-why#why)
* [Installation](https://github.com/crystian/executor/wiki/2-installation#installation)
* [Configuration](https://github.com/crystian/executor/wiki/3-configuration#configuration)
  * [sources](https://github.com/crystian/executor/wiki/3-configuration#sources)
  * [configuration](https://github.com/crystian/executor/wiki/3-configuration#configuration-1)
    * [options](https://github.com/crystian/executor/wiki/3-configuration#options)
    * [data](https://github.com/crystian/executor/wiki/3-configuration#data)
      * [predefined (def)](https://github.com/crystian/executor/wiki/3-configuration#predefined-def)
      * [environments (env)](https://github.com/crystian/executor/wiki/3-configuration#environments-env)
      * [package.json (pkg)](https://github.com/crystian/executor/wiki/3-configuration#packagejson-pkg)
      * [templates](https://github.com/crystian/executor/wiki/3-configuration#templates)
      * [shortcuts](https://github.com/crystian/executor/wiki/3-configuration#shortcuts)
* [Bonus track](https://github.com/crystian/executor/wiki/4-bonus)
* [contributing](https://github.com/crystian/executor/wiki/5-contributing)

---

* [Changelog](CHANGELOG.md)
* [Coming soon](#coming-soon)


And remember: RTFM! :)

## Installation

```
npm i -g executor
```

Test for check the installation:

```
x hello
```

Should show a message with installed version number.

[More info about installation.](https://github.com/crystian/executor/wiki/2-installation#installation)

---

# Coming soon

* Documentation in english
* Doc: Video of 5' as demo
* Playground: Tool
* Feature: **global**!

---

MIT © 2018 [Crystian](https://github.com/crystian), made with love for you <3!
