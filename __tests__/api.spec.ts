import virtualDirectory from '../index'

process.on('unhandledRejection',(e) => {
    console.error(e)
    throw e
})
virtualDirectory('__tests__/srcProject','__tests__/destProject',['dir1/dir1.1'])