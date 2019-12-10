import fs from 'fs-extra'
import path from 'path'
import {Configuration} from '../types'
import {configFileExists} from './configurations'
import {FileNames} from './constants'
import rimraf from 'rimraf'


export async function cleanDir(config: Configuration) {
    if (configFileExists()) {
        const paths = await fs.readdir(config.dest)

        console.warn('We\'re going to delete this directory!');
        await new Promise(resolve=>setTimeout(resolve, 3000))

        return Promise.all(
            paths
                .filter(p=>p!==FileNames.CONFIG)
                .map(
                    p=>new Promise((resolve, reject)=>rimraf(p,(err)=>err ? reject(err) : resolve(p)))
                )
        )
    }
}

export async function createRealDirectories(config: Configuration) {
    return Promise.all(config.exclusions.map(async (exclusion)=>{
        const realDir = path.relative(config.src, path.join(exclusion, '..'))
        if (realDir) {
            await fs.ensureDir(realDir)
        }
    }))
}

async function deepSymlink(dir: string, config: Configuration) {
    const paths = await fs.readdir(path.join(config.src, dir))
    const symlinks = paths.map(async p=>{
        // if not in exclusion and doesn't exists in the dest dir link it
        const relPath = path.join(dir, p)
        if (!config.exclusions.includes(relPath)){
            const destPath = path.join(config.dest, relPath)
            try{
                await fs.lstat(destPath)
            }catch(e) {
                console.log(destPath);
                return fs.symlink(path.join(config.src, relPath), destPath)
            }
            return deepSymlink(relPath, config)
        }
    })
    return Promise.all(symlinks)
}

export async function createLinkedDirectory(config: Configuration) {
    return deepSymlink('.', config)
    // const paths = await fs.readdir(config.src)
    // const promises = paths.map(async p=>{
    //     // if not in exclusion and doesn't exists in the dest dir link it
    //     if (!config.exclusions.includes(p)){
    //         const destPath = path.join(config.dest, p)
    //         const stat = await fs.lstat(destPath)
    //         if (!stat.isDirectory()) {
    //             return fs.symlink(p, destPath)
    //         }else {
    //             return deepSymlink(p)
    //         }
    //     }
    // })
}

