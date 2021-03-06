import * as chalk from 'chalk';
import * as fs from 'fs';
import * as shell from 'shelljs';
const Table = require('cli-table');
import * as path from 'path';

export interface TemplateCommands {
  commands: string,
  description: string,
  id?: number
}

const table = new Table({
  head: [chalk.blue('Commands'), chalk.blue('Description')],
  colWidths: [50, 50],
  chars: {
    'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
    , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
    , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
    , 'right': '║', 'right-mid': '╢', 'middle': '│'
  }
});

const filename = path.join(__dirname, '..', 'commands.json');

export async function writeCommands(data: TemplateCommands) {
  const commands = await loadCommands();
  let lastId = 1;

  if (commands.length > 0) {
    lastId = Number(commands[commands.length - 1].id) + 1;
  }

  data.id = lastId;

  commands.push(data);

  await fs.writeFileSync(filename, JSON.stringify(commands));
  shell.echo(chalk.green('\nSaved successfully\n'));
}

export async function deleteCommands(id: number) {
  const commands = await loadCommands();
  const newComands = commands.filter((item: any) => item.id != id);

  await fs.writeFileSync(filename, JSON.stringify(newComands));
  shell.echo(chalk.red('\nDeleted successfully\n'));
}

export async function executeCommands(id: number) {

  const commands = await loadCommands();
  const comandExecute = commands.filter((item: any) => item.id === id);

  shell.echo(chalk.underline.yellow('\n Log Command:\n'));
  if (comandExecute.length > 0) {
    try {
      shell.exec(comandExecute[0].commands);
      shell.echo('\n');
    } catch (err) {
      shell.echo(err);
    }
  }

}

export function checkCommandsFile() {
  if (!shell.test('-f', filename)) {
    shell.touch(filename);
    shell.echo('[]').to(filename)
  };
}

function loadCommands() {
  const jsonString = fs.readFileSync(filename, "utf8");
  const commands = JSON.parse(jsonString);
  return commands;
}

export function logCommands() {
  const commands = loadCommands();
  commands.forEach(({ commands, description }: TemplateCommands) => {
    table.push([
      commands,
      description
    ]);
  })

  shell.echo(table.toString());
}

export function choiceCommands() {
  const commands = loadCommands();
  const choices: Array<Object> = [];
  commands.forEach(({ commands, id }: TemplateCommands) => {
    choices.push(
      {
        name: commands,
        value: id
      }
    );
  });

  return choices;
}