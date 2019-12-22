virtual directory
=================

input
*  src directory
*  exclusions
*  output directory

output
*  a virtual directory symlinked without the exclusions
  

## cli usage
`virtual-directory --dest virtual-project --src my-project --exclusions "node_modules/execa node_modules/express"`

## `.virtualdirectory` file usage
create `.virtualdirectory` file in the source directory in the correct format and just run the command `virtual-directory` from that directory

### .virtualdirectory format
```
/dest/directory

/src/directory/exclusion/1
/src/directory/exclusion/2
/src/directory/exclusion/3 -> /different/src/directory/3
/src/directory/very/very/very/deep/exclusion
```

## node api usage
```ts
import virtualDirectory from 'virtual-directory'

await virtualDirectory(
    'src/directory/',
    'dest/directory',
    ['node_modules/@types/react', 'node_modules/@types/react-dom'],
)
```

## watch mode
enable watch mode by adding `--watch` flag


# what it does
let's say you have this file structure
```
project/
|- node_modules/
   |- @babel
      |- ...
   |- @types
      |- ...
   |- express
      |- ...
   |- react
      |- ...
|- src
   |- index.ts
   |- executor.ts
   |- types.ts
|- .nvmrc
|- tsconfig.json
```

but for some reason you don't want the .nvmrc file, react and express,

write the command

`virtual-directory virtual-project project .nvmrc node_modules/express node_modules/react`

which will generate this file structure

```
virtual-project/
|- node_modules/
   |- @babel (linked to project/node_modules/@babel)
      |- ...
   |- @types (linked to project/node_modules/@types)
      |- ...
|- src (linked to project/src)
|- tsconfig.json (linked to project/tsconfig.json)
```
