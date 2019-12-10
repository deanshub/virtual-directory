import {configFileExists, parseConfigFile} from './lib/configurations'
import {cleanDir, createRealDirectories, createLinkedDirectory} from './lib/fileSystem'

(async function(){
    if (configFileExists()) {
        const config = parseConfigFile()
        await cleanDir(config)
        await createRealDirectories(config)
        await createLinkedDirectory(config)
    }
})()


// get source dir
// get exclusions
// generate directories for exclusions
// walk through source dir
//      if exists, don't do anything and recursive in
//      if not, link
