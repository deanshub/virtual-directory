import fs from 'fs-extra'
import path from 'path'
import rimraf from 'rimraf'
import chokidar from 'chokidar'
import chalk from 'chalk'
import {Configuration} from '../types'
import {FileNames} from './constants'

export async function cleanDir(config: Configuration, imidiate: boolean = false) {
    const paths = await fs.readdir(config.dest)

    if (!imidiate) {
        console.warn(chalk.yellow('Warning, this directory is going to be deleted!'))
        await new Promise(resolve=>setTimeout(resolve, 3000))
    }

    return Promise.all(
        paths
            .map(
                p=>new Promise((resolve, reject) => 
                    rimraf(path.join(config.dest, p), (err)=>err ? reject(err) : resolve(p))
                )
            )
    )
}

export async function createRealDirectories(config: Configuration) {
    return Promise.all(config.exclusions.map(async (exclusion)=>{
        const realDir = path.relative(config.src, path.join(exclusion, '..'))
        if (realDir) {
            await fs.ensureDir(path.join(config.dest,realDir))
        }
    }))
}

async function deepSymlink(dir: string, config: Configuration) {
    const paths = await fs.readdir(path.join(config.src, dir))
    const symlinks = paths
        .filter(p=>p!==FileNames.CONFIG)
        .map(async p=>{
        // if not in exclusion and doesn't exists in the dest dir link it
        const relPath = path.join(dir, p)
        if (!config.exclusions.includes(relPath)){
            const destPath = path.join(config.dest, relPath)
            try{
                await fs.lstat(destPath)
            }catch(e) {
                //console.log(path.join(config.src, relPath),destPath);
                return fs.symlink(path.join(config.src, relPath), destPath)
            }
            return deepSymlink(relPath, config)
        }
    })
    return Promise.all(symlinks)
}

export async function createLinkedDirectory(config: Configuration) {
    return deepSymlink('.', config)
}

export function watcher(config: Configuration, cleanup: boolean = false) {
    chokidar
        .watch('.', {cwd:config.src, ignoreInitial: true})
        .on('add', async (relPath: string) => {
            if (!config.exclusions.includes(relPath)){
                const destPath = path.join(config.dest, relPath)
                try{
                    await fs.lstat(destPath)
                }catch(e) {
                    //console.log(path.join(config.src, relPath),destPath);
                    return fs.symlink(path.join(config.src, relPath), destPath)
                }
                return deepSymlink(relPath, config)
            }
        })
        .on('unlink', (relPath: string) => {
            rimraf(path.join(config.dest, relPath),console.error)
        })
    
    if (cleanup) {
        [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
            process.on(eventType as any, async () => {
                console.log(chalk.yellow('cleaning up...'))
                await cleanDir(config, true)
                process.exit()
            })
        })
    }
}
