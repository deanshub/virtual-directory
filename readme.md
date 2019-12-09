virtual directory
=================

input
*  src directory
*  exclusions
*  output directory

output
*  a virtual directory symlinked without the exclusions
  

## cli usage
`virtual-directory virtual-project my-project node_modules/execa node_modules/express`

## .virtualdirectory usage
create `.virtualdirectory` file in the requested directory in the correct format and just insert the command `virtual-directory`

### .virtualdirectory format
```
/src/directory
/src/directory/exclusion/1
/src/directory/exclusion/2
/src/directory/exclusion/3
/src/directory/very/very/very/deep/exclusion
```

## watch mode
