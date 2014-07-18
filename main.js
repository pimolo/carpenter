// UTILITIES
var fs = require('fs');

// console.log('Welcome to mysandbox.js, your favorite tool to test fastly your little projects !')
console.log('Begin enter source files to create :')

var files = [], userIndex = 1;
process.stdin.setEncoding('utf8');
process.stdout.write(userIndex + '° ' + 'filename : ')
process.stdin.on('readable', function() {
  var fileName = process.stdin.read();
  if (fileName !== null && fileName !== '' && fileName !== 'stop\n') {
    // process.stdout.write(typeof fileName)
    fileName = fileName.replace(/(\n)/,'');
    files.push(fileName);
    userIndex++;
    process.stdout.write(userIndex + '° ' + 'filename : ')
  }
  if (fileName == 'stop\n') {
    process.stdin.pause();
    var namesToWrite = files.join('\n');
    console.log('your files :\n' + namesToWrite);
    console.log(files);
  }
});
