#!/usr/bin/env node

import * as yargs from 'yargs';
import * as inquirer from 'inquirer';
import * as chalk from 'chalk';
import * as figlet from 'figlet';
import * as functionsCommand from './utils/functionsCommand';
import * as shell from 'shelljs';

const argv = yargs
  .usage(chalk.hex('#0066cc').bold(figlet.textSync('SHORTCUT-CLI')))
  .help('h')
  .alias('e', 'exec')
  .describe('e', 'Execute Comand')
  .alias('n', 'new')
  .describe('n', 'New comand')
  .alias('l', 'log')
  .describe('l', 'Log Comand')
  .alias('d', 'delete')
  .describe('d', 'Delete Comand')
  .argv;


const QUESTIONS = [
  {
    name: 'commands',
    type: 'input',
    message: 'Command:',
    when: () => !yargs.argv['commands'],
  },
  {
    name: 'description',
    type: 'input',
    message: 'Description:',
    when: () => !yargs.argv['description'],
  }
];

functionsCommand.checkCommandsFile()

const choices = functionsCommand.choiceCommands();

const QUESTIONSDELETE = [
  {
    type: 'list',
    name: 'idDelete',
    message: 'Which do you want to delete?',
    choices: choices
  },
];

const QUESTIONSEXECUTE = [
  {
    type: 'list',
    name: 'idDelete',
    message: 'Which do you want to execute?',
    choices: choices
  },
];

async function getArgs() {
  if (argv.new) {
    const answers = await inquirer.prompt(QUESTIONS);
    const { commands, description }: any = Object.assign({}, answers, yargs.argv);

    await functionsCommand.writeCommands({
      commands, description
    });
  }

  if (argv.delete) {
    const answersDelete = await inquirer.prompt(QUESTIONSDELETE);
    const { idDelete }: any = Object.assign({}, answersDelete, yargs.argv);

    await functionsCommand.deleteCommands(idDelete);
  }

  if (argv.log) {
    functionsCommand.logCommands();
  }

  if ((!argv.log && !argv.delete && !argv.new) || argv.exec) {
    const answersDelete = await inquirer.prompt(QUESTIONSEXECUTE);
    const { idDelete }: any = Object.assign({}, answersDelete, yargs.argv);

    await functionsCommand.executeCommands(idDelete);
  }

}

shell.echo(chalk.hex('#0066cc').bold(figlet.textSync('SHORTCUT-CLI')));
getArgs();
