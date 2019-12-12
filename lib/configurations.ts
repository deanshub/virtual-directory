import fs from 'fs-extra'
import path from 'path'
import {FileNames} from './constants'
import {Configuration} from '../types'

const configFilePath =  path.join(process.cwd(), FileNames.CONFIG)

export function configFileExists(): boolean {
    return fs.existsSync(configFilePath)
}

function parseExclusions(src: string, exclusions: Array<string>): Array<string> {
    return exclusions.map(p=>{
        if (p.includes('=>')){
            return p.split('=>')[0]
        }else{
            return path.relative(src, p)
        }
    })
}

export function parseConfigFile(): Configuration {
    const configurationFile = fs.readFileSync(configFilePath,{encoding: 'utf-8'})
    const paths = configurationFile.split('\n').filter(Boolean)
    const src = path.resolve(paths.shift())
    const dest = path.resolve(process.cwd())
    return {src, dest, exclusions: parseExclusions(src, paths)}
}

export function parseCliConfig(args): Configuration {
    const src = path.resolve(args.src)
    const dest = path.resolve(args.dest)
    return {
        src,
        dest,
        exclusions: parseExclusions(src, args.exclusions.split(' '))
    }
}
