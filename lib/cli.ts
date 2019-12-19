#!/usr/bin/env node

import program from 'commander'
import chalk from 'chalk'
import manifest from '../package.json'
import {configFileExists, parseConfigFile, parseCliConfig, validate} from './configurations'
import {cleanDir, createRealDirectories, createLinkedDirectory, watcher, setupCleanup} from './fileSystem'


program
    .version(manifest.version)
    .option('-D, --debug', 'print debugging stack', false)
    .option('-s, --src <path>', 'source directory')
    .option('-d, --dest <path>', 'destination directory (virtual)')
    .option('-e, --exclusions <paths>', 'list of exclusions from the virtual directory','')
    .option('-w, --watch', 'watch mode', false)
    .option('--cleanup', 'deletes all symlinks once watc mode breaks', false)
    .parse(process.argv)

let config = parseCliConfig(program)
if (configFileExists()) {
    config = parseConfigFile()
}

;(async function(){
    try {
        validate(config)
        await cleanDir(config)
        await createRealDirectories(config)
        await createLinkedDirectory(config)
        console.log(chalk.green(`virtual-directory linked directory to "${config.dest}", enjoy`))
        if (program.cleanup) {
            setupCleanup(config)
        }
        if (program.watch) {
            console.log(chalk.green(`Watch mode on${program.cleanup?' (with cleanup)':''}`))
            watcher(config)
        }
    } catch(e) {
        if (program.debug) {
            throw e
        }else {
            console.error(chalk.red(e.message))
        }
    }
})()
