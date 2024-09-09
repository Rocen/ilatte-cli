import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import Generator from './Generator.js';

export default async function (name, options) {
    console.log('>>>> create.js', name, options);

    const cwd = process.cwd();

    const targetDir = path.join(cwd, name);

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir);
        }else {
            let { action } = await inquirer.prompt([
                {
                  name: 'action',
                  type: 'list',
                  message: 'Target directory already exists Pick an action:',
                  choices: [
                    {
                      name: 'Overwrite',
                      value: 'overwrite'
                    },{
                      name: 'Cancel',
                      value: false
                    }
                  ]
                }
            ])
            
            if (!action) {
                return;
            } else if (action === 'overwrite') {
                // 移除已存在的目录
                console.log(`\r\nRemoving...`)
                await fs.remove(targetDir)
            }
        }
    }

    const generator = new Generator(name, targetDir);

    generator.create();

    
}