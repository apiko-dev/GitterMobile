"use strict";

const fs = require('fs')
const path = require('path')
const currentPath = path.resolve(__dirname)

const out = ['export const emoji = { \n']
const pathToFolder = currentPath + '/emoji'
fs.readdir(pathToFolder, (err, data) => {
  if (err) console.log(err)

  data.forEach(item => {
    const name = item.split('.')[0]
    const itemPath = `${pathToFolder}/${item}`
    const normalizedName = name.replace('-', '_')
    out.push(`  '${name}': require('image!ic_${normalizedName}.png'),\n`)

    fs.rename(itemPath, `${pathToFolder}/${normalizedName}.png`, err => {
      if (err) console.log('ERROR: ' + err)
    })
  })

  out.push('}')

  fs.open(`${currentPath}/emoji.js`, "wx", function (err, fd) {
      // handle error

      fs.writeFile(`${currentPath}/emoji.js`, out.join(''), function(err) {
          if(err) {
              return console.log(err);
          }

          console.log("The file was saved!");
      });
      fs.close(fd, function (err) {
          // handle error
      });
  });
})
function getExtension(file) {
  return file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2)
}
