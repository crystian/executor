# eXecutor
### **_Una poderosa herramienta de atajos para ti como para tu equipo!_**

[![npm](https://img.shields.io/npm/v/executor.svg?style=flat-square)](https://www.npmjs.com/package/executor) 
[![CircleCI](https://circleci.com/gh/crystian/executor/tree/master.svg?style=shield)](https://circleci.com/gh/crystian/executor/tree/master)
[![Codacy grade](https://img.shields.io/codacy/grade/d3f65a1bc7604109843a0b9bda912c3b.svg?style=flat-square)](https://www.codacy.com/app/crystian/executor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=crystian/executor&amp;utm_campaign=Badge_Grade)
[![Codacy coverage](https://img.shields.io/codacy/coverage/d3f65a1bc7604109843a0b9bda912c3b.svg?style=flat-square)](https://www.codacy.com/app/crystian/executor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=crystian/executor&amp;utm_campaign=Badge_Coverage)
[![npm](https://img.shields.io/npm/dm/executor.svg?style=flat-square)](https://www.npmjs.com/package/executor)
[![HitCount](http://hits.dwyl.com/crystian/executor.svg)](http://hits.dwyl.com/crystian/executor)

[![license](https://img.shields.io/npm/l/executor.svg?style=flat-square)](https://raw.githubusercontent.com/crystian/executor/master/LICENSE)
[![David](https://img.shields.io/david/crystian/executor.svg?style=flat-square)](https://github.com/crystian/executor/blob/master/package.json)
[![Gitter](https://img.shields.io/gitter/room/crystian/executor.svg?style=flat-square)](https://gitter.im/crystian/executor/??utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[ [english (under construction)](../README.md) ] [ spanish ]

---

## TL;DR

Este herramienta te va a permitir ahorrar gran cantidad de tiempo de escritura de comandos con atajos totalmente personalizados, con la finalidad de compartirlo con un proyecto, tanto para que lo usen personas como máquinas, manteniéndose unificado y en un único lugar. #agile #needForSpeed. 
 
> Como `scripts` de `package.json` pero con _esteroides_.

**Notes:** La idea **no** es dejar de usar la consola, es la de optimizarla.
  
### Features

* Multi-plataforma: Único código, funciona en todas las plataformas. Powered by [nodejs](https://nodejs.org)
* Templates para su fácil reutilización.
* No importa el tipo de proyecto, si escribís comandos esta herramienta te puede ser útil.
* Utilización de variables predefinidas, ambiente, package.json, template y de otros 'shortcuts' (atajos).
* Devs y DevOps pueden ser amigos con esta tool, ya que comparten sus comandos.
* Errores de tipeos en comandos largos, son problemas del pasado!
* Pare de sufrir! Basta de cientos de `scripts` similares en tu `package.json`!  
(`build`, `build-ci`, `build-prod`, `build-prod-ci`, `build-qa`, `build-qa-ci`, `build-ci-cache`, etc...)
* **Sin dependencias de otros módulos de node!**


![](docs/img/jake.gif)

---
## Documentation

### Spoiler

##### Antes
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
  "docker-common": "docker run --rm -it -p 4200:4200 -v /choclo:... --name ${pkg.name}-dev ${pkg.name}", 
}
"shortcuts": {
  "build": "${docker-common} ng build",
  "build-prod": "${docker-common} ng build --prod",
  "server": "${docker-common} ng serve"
}
```

### Table of content

- [intro](https://github.com/crystian/executor/wiki/Home)
- [Why?](https://github.com/crystian/executor/wiki/1-why#why)
- [Installation](https://github.com/crystian/executor/wiki/2-installation#installation)
- [Configuration](https://github.com/crystian/executor/wiki/3-configuration#configuration)
  * [sources](https://github.com/crystian/executor/wiki/3-configuration#sources)
  * [configuration](https://github.com/crystian/executor/wiki/3-configuration#configuration-1)
    + [options](https://github.com/crystian/executor/wiki/3-configuration#options)
    + [data](https://github.com/crystian/executor/wiki/3-configuration#data)
      - [predefined (def)](https://github.com/crystian/executor/wiki/3-configuration#predefined-def)
      - [environments (env)](https://github.com/crystian/executor/wiki/3-configuration#environments-env)
      - [package.json (pkg)](https://github.com/crystian/executor/wiki/3-configuration#packagejson-pkg)
      - [templates](https://github.com/crystian/executor/wiki/3-configuration#templates)
      - [shortcuts](https://github.com/crystian/executor/wiki/3-configuration#shortcuts)
- [Bonus track](https://github.com/crystian/executor/wiki/4-bonus)
- [contributing](https://github.com/crystian/executor/wiki/5-contributing)
- [Changelog](CHANGELOG.md)
- [Coming soon](#coming-soon)


And remember: RTFM! :)

## Installation

```
npm i -g --engine-strict executor
```

Test de correcta instalación y funcionamiento:

```
x hello
```

Debería mostrar un mensaje con la versión instalada.

---

# Coming soon

* Documentación
* Doc: Video de 5' demostrando funcionalidad
* Doc: Ingles
* Playground: Tool visual para armar configuraciones.
* Feature: Utilización de **global**!

---

MIT © 2018 [Crystian](https://github.com/crystian), hecho con amor para vos <3! y espero que te sea tan útil como lo es para mi.
