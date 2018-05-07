#!/usr/bin/env node

/**
 * This is "the executor" a.k.a: "e"
 *
 * Please, read the README.md, about this project and how to configure it, and surprise with the magic!
 *
 * With love by Pusher and RTFM! :)
 */

const { spawn } = require('child_process');
const { messages } = require('../lib/i18n');
const { buildCommand } = require('../lib/command');

process.title = messages.app.name;

let argv = process.argv,
	result;

argv = argv.slice(2);   // executable and this file will be removed
let shortcut = argv.join(' ');

let timestamp = new Date();

try {
	result = buildCommand(shortcut);
} catch(e) {
	console.log(`\n[${messages.app.name}]`,`${e.message}\n`);
	process.exit(1);
}

if (!result.config.config.dry) {
	let command = result.command.split(' ');
	const child = spawn(command.shift(), command, {
		timeout: 1000 * 60 * 5,
		shell: true,
		stdio: 'inherit'
	});

	child.on('close', (code) => {
		if(result.config.config.showTime){
				console.primary(`[${messages.app.name}]`, `Done in: ${(new Date() - timestamp) / 1000}s`);
		}
		process.exit(code);
	});
}
