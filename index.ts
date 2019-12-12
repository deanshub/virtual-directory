#!/usr/bin/env node

import program from 'commander'
import {configFileExists, parseConfigFile, parseCliConfig} from './lib/configurations'
import {cleanDir, createRealDirectories, createLinkedDirectory, watcher} from './lib/fileSystem'
import manifest from './package.json'

program
    .version(manifest.version)
    .option('-s, --src <path>', 'source directory')
    .option('-d, --dest <path>', 'destination directory (virtual)')
    .option('-e, --exclusions <paths>', 'list of exclusions from the virtual directory')
    .option('-w, --watch', 'watch mode')
    .parse(process.argv)

let config = parseCliConfig(program)

;(async function(){
    if (configFileExists()) {
        config = parseConfigFile()
    }
    await cleanDir(config)
    await createRealDirectories(config)
    await createLinkedDirectory(config)
    if (program.watch) {
        console.log('watch mode on')
        watcher(config)
    }
})()
