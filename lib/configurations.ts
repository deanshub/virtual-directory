import fs from 'fs-extra'
import path from 'path'
import {FileNames} from './constants'
import {Configuration} from '../types'

const configFilePath =  path.join(process.cwd(), FileNames.CONFIG)

export function configFileExists(): boolean {
    return fs.existsSync(configFilePath)
}

export function parseConfigFile(): Configuration {
    const configurationFile = fs.readFileSync(configFilePath,{encoding: 'utf-8'})
    const paths = configurationFile.split('\n').filter(Boolean)
    const src = paths.shift()
    const dest = process.cwd()
    return {src, dest, exclusions: paths.map(p=>path.relative(src, p))}
}

export function parseCliConfig(args): Configuration {
    return {src: path.resolve(args.src), dest: path.resolve(args.dest), exclusions: args.exclusions.split(' ')}
}
