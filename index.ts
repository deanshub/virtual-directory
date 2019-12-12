import { program } from '@soundtype/commander'
import {configFileExists, parseConfigFile, parseCliConfig} from './lib/configurations'
import {cleanDir, createRealDirectories, createLinkedDirectory, watcher} from './lib/fileSystem'
import manifest from './package.json'

const prog = program(manifest.name, manifest.version)
    .option({
        name: 'src',
        shorthand: 's',
        description: 'source directory',
        default: '',
        parse: x=>x,
    })
    .option({
        name: 'dest',
        shorthand: 'd',
        description:'destination directory (virtual)',
        default: '',
        parse: x=>x,
    })
    .option({
        name: 'exclusions',
        shorthand: 'e',
        description: 'list of exclusions from the virtual directory',
        default: '',
        parse: x=>x,
    })
    .option({
        name: 'watch',
        shorthand: 'w',
        description: 'watch mode',
        default: false,
    })
    .build()
    
const args = prog.parse(process.argv)
let config = parseCliConfig(args)

// get source dir
// get exclusions
// generate directories for exclusions
// walk through source dir
//      if exists, don't do anything and recursive in
//      if not, link

;(async function(){
    if (configFileExists()) {
        config = parseConfigFile()
    }
    await cleanDir(config)
    await createRealDirectories(config)
    await createLinkedDirectory(config)
    if (args.watch) {
        console.log('watch mode on')
        watcher(config)
    }
})()
