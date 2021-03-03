const fs = require('fs')
module.exports ={
    readAndWriteFile:function(singleImg, newPath) {
        fs.readFile(singleImg.path , function(err,data) {
            fs.writeFile(newPath,data, function(err) {
                if (err)  return console.log('ERRRRRR!! :'+err);
            })
        })
}
}