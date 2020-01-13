import fs from 'fs-extra'
import path from 'path'
import util from 'util'
import chokidar from 'chokidar'
import chalk from 'chalk'
import { Configuration } from '../types'
import rimraf from 'rimraf'

const rmrf = util.promisify(rimraf)

export async function cleanDir(
  config: Configuration,
  imidiate: boolean = false
) {
  try {
    if (!imidiate) {
      const destDirExists = await fs.pathExists(config.dest)
      if (destDirExists) {
        console.warn(
          chalk.yellow(
            `Warning, directory "${config.dest}" is going to be overwritten!`
          )
        )
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    }
    return rmrf(config.dest)
  } catch (e) {
    return e
  }
}

export async function createRealDirectories(config: Configuration) {
  return Promise.all(
    config.exclusions.map(exclusion => {
      return fs.ensureDir(path.join(config.dest, exclusion, '..'))
    })
  )
}

async function deepSymlink(dir: string, config: Configuration) {
  if (config.exclusions.length === 0) {
    return fs.ensureSymlink(
      path.join(config.src, dir),
      path.join(config.dest, dir)
    )
  }
  const paths = await fs.readdir(path.join(config.src, dir))
  const symlinks = paths.map(async p => {
    // if not in exclusion and doesn't exists in the dest dir link it
    const relPath = path.join(dir, p)
    if (!config.exclusions.includes(relPath)) {
      const destPath = path.join(config.dest, relPath)
      try {
        await fs.lstat(destPath)
      } catch (e) {
        // console.log(path.join(config.src, relPath),destPath);
        return fs.ensureSymlink(path.join(config.src, relPath), destPath)
      }
      return deepSymlink(relPath, config)
    }
  })
  return Promise.all(symlinks)
}

export async function createLinkedDirectory(config: Configuration) {
  return deepSymlink('.', config)
}

export function watcher(config: Configuration) {
  chokidar
    .watch('.', { cwd: config.src, ignoreInitial: true })
    .on('add', async (relPath: string) => {
      if (!config.exclusions.includes(relPath)) {
        const destPath = path.join(config.dest, relPath)
        try {
          await fs.lstat(destPath)
        } catch (e) {
          //console.log(path.join(config.src, relPath),destPath);
          return fs.symlink(path.join(config.src, relPath), destPath)
        }
        return deepSymlink(relPath, config)
      }
    })
    .on('unlink', (relPath: string) => {
      rmrf(path.join(config.dest, relPath))
    })
}

export function setupCleanup(config: Configuration) {
  ;[
    `exit`,
    `SIGINT`,
    `SIGUSR1`,
    `SIGUSR2`,
    `uncaughtException`,
    `SIGTERM`,
  ].forEach(eventType => {
    process.on(eventType as any, async () => {
      console.log(chalk.yellow('cleaning up...'))
      await cleanDir(config, true)
      process.exit()
    })
  })
}
