# executor
### **_A powerful "short-cutter" to your console for you and your team!_**

[English version (under construction)](README.md)

---
## TL;DR

Este software te va a permitir ahorrar gran cantidad de tiempo de escritura de comandos con atajos totalmente personalizados, con la finalidad de compartirlo con un proyecto, tanto para que lo usen personas como maquinas, manteniendose unificado y en un unico lugar. #agile #needForSpeed.  
Como `scripts` de `package.json` pero con _magia_.
  
### Features

* Multiplataforma: Unico codigo, funciona en todas las plataformas. Powered by [nodejs](https://nodejs.org)
* Multiconfiguracion, con multiples niveles de anidamiento.
* Templates para su facil reutilizacion.
* No importa el tipo de proyecto, si escribis comandos esta herramienta te puede ser util.
* Utilizacion de variables predefinidas, ambiente, template y de otros 'shortcuts'.
* Devs y DevOps pueden ser amigos con esta tool, ya que comparten sus comandos.
* Errores de tipeos en comandos largos, son problemas del pasado!
* Pare de sufrir! Basta de mil scripts similares en tu `package.json`!  
(`build`, `build-ci`, `build-prod`, `build-prod-ci`, `build-qa`, `build-qa-ci`, `build-ci-cache`, etc...)
* Modificaste `scripts` del `package.json` y tenes que 'rebuilder' tu imagen de docker... nunca mas!
* **Sin dependencias de otros modulos de node!**

![](docs/img/jake.gif)

---

## Table of content
* [TL;DR](#tl-dr)
	+ [Features](#features)
* [Concepts](#concepts)
* [Extended version](#extended-version)
	+ [Typical scenario](#typical-scenario)
		- [Problem](#problem)
		- [Solution](#solution)
* [Instalation](#instalation)
* [Executor](#executor)
* [Configuration](#configuration)
	+ [Json structure](#json-structure)
		- [config](#config)
		- [environments](#environments)
		- [templates](#templates)
		- [shortcuts](#shortcuts)
		- [predefined](#predefined)
* [Bonus track](#bonus-track)
* [colaboration](#colaboration)
* [coming soon](#coming-soon)

## Concepts

* **Tool:** Este software/herramienta, puntualmente el comando "`e`"
* **CWD:** Current Working Directory = directorio actual
* **Comando:** Programa ejecutable con posibilidad de enviarle multiples argumentos  
* **Consola:** Ventana desde donde se puede ejecutar comandos
* **CLI:** [Command line Interface](https://en.wikipedia.org/wiki/Command-line_interface) = Interfaz de linea de comando.  

## Extended version

Esta tool cuenta con deliciosos features el cual nos deberia ahorra mucho tipeo (y errores de) que al final del dia cuenta, pero la gracia es que se pueda compartir con todo el equipo y en un unico lugar: "el repo".


### Typical scenario

#### Problem

Vamos a los bifes con un **ejemplo** rapido asi se entiende mejor el concepto:

Simulemos que tenemos dos comandos recurrentes:
```
docker run --rm -it --name dev dev ash
docker run --rm -it --name prod prod ash
```
Constantemente tenes que escribir lo anterior, y se pone mas divertido con los mapeos:
```
docker run --rm -it -p 4200:4200 -p 49153:49153 -v /choclo:... --name dev dev ash 
docker run --rm -it -p 4200:4200 -p 49153:49153 -v /choclo:... --name prod prod ash  
```

Para esto llego `scripts` de npm en el `package.json`! Nos deberia quedar algo asi:
```
"runDev": "docker run --rm -it -p 4200:4200 -p 49153:49153 -v /choclo:... --name dev dev ash"
"runProd": "docker run --rm -it -p 4200:4200 -p 49153:49153 -v /choclo:... --name prod prod ash" 
```
Para luego ejectuar: `npm run runDev` o `npm run runProd`
 
Pero como vemos, hay "codigo" repetido, y si multiplicamos por variables, podrian ser muchas lineas con pequeñas diferencias y si cambiamos algo en alguna de ellas potencialmente tenes que replicarlo en el resto, y como buenos programadores que somos evitamos el duplicado (no?)

#### Solution
Necesitamos algo mas dinamico que permita escalar mejor. El _approach_ elegido para solucionar esto es el de "templetear", con una configuracion similar a esta:

```
"templateCommon"="docker run --rm -it -p 4200:4200 -p 49153:49153 -v /choclo:... --name"
"runDev"=${templateCommon} dev dev ash
"runProd"=${templateCommon} prod prod ash
```
Y luego ejectuaria con: `e runDev` o `e runProd`

Ahora, imaginemos que todo el equipo de trabajo tiene la misma configuracion, comandos rapidos y normalizados, hablariamos el mismo idioma y podriamos sentirnos como en "casa" frente a otra maquina!

_Esto es solo una parte del potencial de este software._ 

  
## Instalation

### Requirements

* [Node/npm](https://nodejs.org)
* `executor.json`: **archivo de configuracion** de atajos (ya veremos como se construye).

### global

Lo ideal es instalarlo globalmente, de otra manera deberias ejecutar `node_modules\.bin\e`, lo cual dejaria de ser un atajo :P

* npm: `npm install -g executor`
* yarn: `yarn add global executor` (de preferencia)

El executable que deberia quedar en el [path](https://en.wikipedia.org/wiki/PATH_(variable)) es la simple vocal: `e`

Para comprobar que fue instalado, ejecutemos en la consola: `e`, no importa donde, deberia devolverte un error como este:
```
[executor] [config] File not found: "executor.json"
```

### Notes
Este comando (`e`) es un CLI que se ejecuta en el contexto donde es ejecutado, o sea, que lee los archivos del directorio actual donde se ejecute, por ende pretendera encontrar el archivo de configuracion en el mismo directorio de ejecucion, por esto el "error" anterior.

## Executor

Simplemente el comando `e` mas los shortcuts configurados en el archivo de configuracion.  
Ejemplo: `e shortcut1`


## Configuration

A.k.a: `executor.json`

Toda la magia se configura desde este archivo. Como mencione antes **no es necesario un proyecto "node"**, esta tool sirve para cualquier tipo de proyecto en el que quieras tener atajos de comandos.

### Json structure

Ramas principales:
```
+ config
+ environments
+ templates
+ shortcuts
```

#### config

Configuracion adicional para la ejecucion de los shortcuts

* `dry`: (_boolean_ = false) Permite ejecutar esta tool pero no ejecuta el comando, util para debuguear y armar nuevos comandos.
* `showTime`: (_boolean_ = true) Muestra el tiempo total de ejecicion al final del mismo.
* `showCommand`: (_boolean_ = true) Muestra el comando a ejecutar.  
Nota: Si `dry` esta activo, se mostrara el comando.
* `useColors`: (_boolean_ = true) La salida de la consola se mostrara con colores, si interfiere con los colores de tu consola, podes cancelarlo con `false`
* `colors`: {`primary`, `secondary`, `alert`} Se pueden customizar estos colores, utilizar esta [tabla](https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color).

#### environments

Variables del ambiente que se quieran "importar", el formato aceptado es `string` u objeto key-value (`{key: value}`), donde luego podremos usar como variable a `${key}`

Ejemplos:
```
environments: {
	'path', // traeria todo el path de la maquina en ejecucion
	{currentFolder: 'pwd'} // leera la variable pwd (CWD de linux) y la asignara a "currentFolder"
}
```

Luego se expondran para que los templates/shortcuts puedan utilizar esta info utilizando el objeto environments.  
Ejemplo: `"PATH: ${environments.path} and ${environments.currentFolder}"`  

#### templates

Son los `string`s que pueden servir para armar varios shortcuts, con la consiguiente reutilizacion y facil mantenimiento.

##### Use  
Se "interpola" con el delimitaror: '`${ }`', esto permite armar `string`s en formato de "template", donde habra "placeholders" que seran reemplazados por el valor de la variable dentro del delimitador.  

Ejemplo:
```
templates: {
		"variable1": "foo",
		"variable2": "${variable1} bar" 
}
```
El resultado sera: `foo bar`


##### Features
 
* Se pueden hacer templates con templates anidados.  
Ejemplo: `templates: {templateUnion: "${template1} and ${template2}"}`
* Se pueden usar variables de ambiente como comentaba el apartado anterior.  
Ejemplo: `templates: {template1: "PATH: ${environments.path} and ${environments.currentFolder}"}` 
* Se pueden crear sub-objetos para tenerlo mejor organizado  
Ejemplo: `imageName` 
```
templates: {
		"project": "myProject",
		"imageName": {
			"base": "${project}-base",
			"dev": "${project}-dev",
			"prod": "${project}-prod"
		}
}
```
* Se puede acceder a sub-objetos utilizando el operador: '`.`'  
Ejemplo: `Imagen: ${imageName.prod}`
* Soporta infinito numero de sub-objetos


**Notes:**  
1) No se interpola utilizando el feature de ECMAScript, se realiza un replace.  
2) El orden es importante, los templates deben definirse antes de utilizarse, incluyendo los anidados. 


#### shortcuts

Llegamos a los famosos "shortcuts", se interpola de la misma manera que los templates, con lo cual hereda sus features, y agrega:

* Cada sub-objeto no solo sirve como separador como en el caso de templates, si no que tambien es un separador de argumentos.  
Ejemplo (disculpas por lo burdo, es para que se entienda): 
```
templates: {
		"project": "myProject",
		"imageName": {
			"prod": "${project}-prod"
		}
}
shortcuts: {
	changeDir: "cd ${imageName.prod}", // argumento 1
	removeDir: "rm ${imageName.prod}", // argumento 1
	dir: { // argumento 1
		change: "cd ${imageName.prod}",  // argumento 2
		remove: "rm ${imageName.prod}"   // argumento 2 
	},
	showCommandChangeDir: "echo ${dir.change}" // ejecutaria: "echo cd myProyect-prod" 
}
```
Los shortcuts listos para ejecutar serian:
```
> e changeDir
> e removeDir
> e dir change
> e dir remove
> e showCommandChangeDir
```

En este ejemplo podemos ver tres casos:
1) Ejecucion con 1 solo argumento
2) Ejecucion con 2 argumentos
3) Ejecucion con 1 solo argumento, pero intermanente lo armo con el operador de '`.`' como si fuese un template.
  
Como notamos aqui queda a nuestro exclusivo criterio como queremos formarlo, dando total flexibilidad.

**Tip:** En mi caso particular, prefiero: "subject + verb" en 2 argumentos. Si bien no es gramaticalmente correcto, me es mas util para alternar comandos ya que lo que mas me cambia son los verbos entre comandos (generalizando obviamente). Como el caso de `e dir change`

#### predefined

Tambien tenemos algunos valores predefinidos (read-only) para poder usar en los templates, por el momento solo el `cwd`, luego la lista ira creciendo "on demand".  
Ejemplo: `echo este es el folder actual: ${predefined.cwd}`


#### Summary

Con lo cual, para conformar los shortcuts y sin repetir "codigo" tenes 4 fuentes en este orden:

1) `environments`
2) `predefined`
3) `tempaltes`
4) `shortcuts`

Los parametros siguientes al ultimo argumento se enviaran al shortcut tal cual fueron enviados.
Ejemplo: `e shortcut1 -watch` 


## Bonus track
De yapa, si por X causa no te gusta el nombre del archivo "executor.json" o lo queres poner en otro directorio, podes hacerlo configurandolo desde el `package.json` (ahora si estamos hablando de un proyecto node), agregando este atributo:  
```
"executor": {
	"configFile": "folder1/newConfig.json"
}
```

## colaboration

TO-DO

## coming soon

* Video de 5' demostrando funcionalidad
* Utilizacion de un `executor.json` **global**!

---

MIT © 2016 [Crystian](https://github.com/crystian), hecho con amor para vos <3!
