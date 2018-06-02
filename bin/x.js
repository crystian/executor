#!/usr/bin/env node

/**
 * This is "the executor" a.k.a: "x"
 *
 * Please, read the README.md, about this project and how to configure it, and surprise with the magic!
 *
 * With love by Pusher and RTFM! :)
 */


const { spawn } = require('child_process');
const { messages } = require('../lib/i18n');
const { buildCommand } = require('../lib/builders');

process.title = messages.app.name;

let argv = process.argv,
	result;

argv = argv.slice(2); // executable and this file will be removed
const shortcut = argv.join(' ');

const timestamp = new Date();

try {
	// main an only entry point to the tool!
	result = buildCommand(shortcut);
} catch(e) {
	console.log(`\n${e.message}\n`);
	process.exit(1);
}

if (!result.config.dry) {
	const command = result.command.split(' ');
	const child = spawn(command.shift(), command, {
		timeout: 1000 * 60 * 5,
		shell: true,
		stdio: 'inherit'
	});

	child.on('exit', function(code, signal) {
		if (result.config.showTime) {
			console.primary(`[${messages.app.name}]`, `Done in: ${(new Date() - timestamp) / 1000}s`);
		}

		process.on('exit', function() {
			if (signal) {
				process.kill(process.pid, signal);
			} else {
				process.exit(code);
			}
		});
	});

	process.on('SIGINT', function() {
		child.kill('SIGINT');
		child.kill('SIGTERM');
	});

}
