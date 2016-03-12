// "use strict";
//
// const fs = require('fs')
// const path = require('path')
// const currentPath = path.resolve(__dirname)
//
// const out = ['export const emoji = { \n']
// fs.readdir(currentPath, (err, data) => {
//   if (err) console.log(err)
//
//   data.forEach(item => {
//     const name = item.split('.')[0]
//     out.push(`  '${name}': require('./${item}'),\n`)
//   })
//
//   out.push('}')
//
//   fs.open(`${currentPath}/emoji.js`, "wx", function (err, fd) {
//       // handle error
//
//       fs.writeFile(`${currentPath}/emoji.js`, out.join(''), function(err) {
//           if(err) {
//               return console.log(err);
//           }
//
//           console.log("The file was saved!");
//       });
//       fs.close(fd, function (err) {
//           // handle error
//       });
//   });
// })
// function getExtension(file) {
//   return file.slice((file.lastIndexOf(".") - 1 >>> 0) + 2)
// }
