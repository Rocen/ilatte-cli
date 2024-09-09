#! /usr/bin/env node

import { program } from "commander";
import figlet from 'figlet';

import create from "../lib/create.js";
import packageJson from '../package.json' assert { type: 'json' };

program
    .command('create <app-name>')
    .description('create a new project')
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
        console.log('options: ', options);
        console.log('project name is ' + name);

        create(name, options);
    })

program
    .version(`v${packageJson?.version}`)
    .usage('<command> [option]')

program
    .command('ui')
    .description('start add open ilatte-cli ui')
    .option('-p, --port <port>', 'Port used for the UI server')
    .action((option) => {
        console.log(option)
    })

program.on('--help', () => {

    console.log('\r\n' + figlet.textSync('ilatte', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
    }));

    console.log(`\r\nRun ${chalk.cyan(`ilatte-cli <command> --help`)} for detailed usage of given command\r\n`)
})

program.parse(process.argv);