import ora from "ora";
import inquirer from "inquirer";
import { getTagList, getRepoList } from "./http.js";
import path from 'path';
import util from 'util';
import chalk from "chalk";
import downloadGitRepo from 'download-git-repo';

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message);
    // 开始加载动画
    spinner.start();
  
    try {
      // 执行传入方法 fn
      const result = await fn(...args);
      // 状态为修改为成功
      spinner.succeed();
      return result; 
    } catch (error) {
      // 状态为修改为失败
      spinner.fail('Request failed, refetch ...')
    } 
}

class Generator {
    constructor(name, targetDir) {
        this.name = name;
        this.targetDir = targetDir;

        this.downloadGitRepo = util.promisify(downloadGitRepo);
    }

    async getRepo() {
        // 1）从远程拉取模板数据
        const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
        if (!repoList) return;
    
        // 过滤我们需要的模板名称
        const repos = repoList.map(item => item.name);
    
        // 2）用户选择自己新下载的模板名称
        const { repo } = await inquirer.prompt({
          name: 'repo',
          type: 'list',
          choices: repos,
          message: 'Please choose a template to create project'
        })
    
        // 3）return 用户选择的名称
        return repo;
    }

    async getTag(repo) {
        // 1）基于 repo 结果，远程拉取对应的 tag 列表
        const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo);
        if (!tags) return;
        
        // 过滤我们需要的 tag 名称
        const tagsList = tags.map(item => item.name);
    
        // 2）用户选择自己需要下载的 tag
        const { tag } = await inquirer.prompt({
          name: 'tag',
          type: 'list',
          choices: tagsList,
          message: 'Place choose a tag to create project'
        })
    
        // 3）return 用户选择的 tag
        return tag
    }

    // 下载远程模板
    // 1）拼接下载地址
    // 2）调用下载方法
    async download(repo, tag){

        // 1）拼接下载地址
        const requestUrl = `ilatte-cli/${repo}${tag?'#'+tag:''}`;

        // 2）调用下载方法
        await wrapLoading(
            this.downloadGitRepo, // 远程下载方法
            'waiting download template', // 加载提示信息
            requestUrl, // 参数1: 下载地址
            path.resolve(process.cwd(), this.targetDir)
        ) // 参数2: 创建位置
    }

    async create() {
        // 1）获取模板名称
        const repo = await this.getRepo()

        // 2) 获取 tag 名称
        const tag = await this.getTag(repo)
        
            // 3）下载模板到模板目录
        await this.download(repo, tag)
        
        // 4）模板使用提示
        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
        console.log('  npm run dev\r\n')
    }
}

export default Generator;
