import {parseCliConfig, validate} from './lib/configurations'
import {cleanDir, createRealDirectories, createLinkedDirectory, watcher, setupCleanup} from './lib/fileSystem'

async function virtualDirectory(src: string, dest: string, exclusions: Array<string> = [], watch: boolean = false, cleanup: boolean = false) {
    const config = parseCliConfig({src, dest, exclusions: exclusions.join(' ')})
    validate(config)
    await cleanDir(config)
    await createRealDirectories(config)
    const linkPromise = createLinkedDirectory(config)
    if (cleanup) {
        setupCleanup(config)
    }
    if (watch) {
        await linkPromise
        watcher(config)
    }else {
        return linkPromise
    }
    
}

export default virtualDirectory
