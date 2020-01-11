import virtualDirectory from '../index'
import fs from 'fs-extra'
import path from 'path'

const join = path.join
const SRC = './__tests__/srcProject'
const DEST = './__tests__/destProject'

async function isSymlink(path: string) {
  const stat = await fs.lstat(path)
  return stat.isSymbolicLink()
}
async function fileExists(path: string) {
  try {
    const stat = await fs.lstat(path)
    return stat.isFile()
  } catch (err) {
    return false
  }
}
async function dirExists(path: string) {
  try {
    const stat = await fs.lstat(path)
    return stat.isDirectory()
  } catch (err) {
    return false
  }
}

describe('node api', () => {
  test('linking', async () => {
    await virtualDirectory(SRC, DEST)
    expect(await isSymlink(DEST)).toBe(true)
  })

  test('linking with file exclusion', async () => {
    await virtualDirectory(SRC, DEST, ['file1'])
    expect(await isSymlink(DEST)).toBe(false)
    expect(await fileExists(join(DEST, 'file1'))).toBe(false)
  })

  test('linking with dir exclusion', async () => {
    await virtualDirectory(SRC, DEST, ['dir1'])
    expect(await isSymlink(DEST)).toBe(false)
    expect(await dirExists(join(DEST, 'dir1'))).toBe(false)
  })
  test('linking with all exclusions', async () => {
    await virtualDirectory(SRC, DEST, ['dir1/dir1.1', 'dir1/file1.1'])
    expect(await isSymlink(DEST)).toBe(false)
    expect(await isSymlink(join(DEST, 'file1'))).toBe(true)
    expect(await dirExists(join(DEST, 'dir1/dir1.1'))).toBe(false)
    expect(await dirExists(join(DEST, 'dir1/file1.1'))).toBe(false)
  })
})

/*
const exclusions=['node_modules/a1/a1.b1/a1.b1.c1', 'node_modules/a1/a1.b2', 'node_modules/a2']
describe('exclusions', ()=>{
    test('sorting', ()=>{
        expect(exclusions.sort()).toBe(exclusions)
    })
})
*/
