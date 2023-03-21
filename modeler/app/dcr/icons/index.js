var fs = require("fs");


var iconDcr = fs.readFileSync(__dirname + '/palette-icons/开始游戏.png', 'base64');


module.exports.iconDcr = 'data:image/png;base64,' + iconDcr;


