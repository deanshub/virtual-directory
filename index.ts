import {configFileExists, parseConfigFile, parseCliConfig, validate} from './lib/configurations'
import {cleanDir, createRealDirectories, createLinkedDirectory, watcher} from './lib/fileSystem'

async function virtualDirectory(src: string, dest: string, exclusions: Array<string> = [], watch: boolean = false, cleanup: boolean = false) {
    const config = parseCliConfig({src, dest, exclusions: exclusions.join(' ')})
    validate(config)
    await cleanDir(config)
    await createRealDirectories(config)
    await createLinkedDirectory(config)
    if (watch) {
        watcher(config, cleanup)
    }
}

export default virtualDirectory
