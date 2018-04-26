var mongoose = require('mongoose');
//model/config.js内部有mongodb的连接属性
var config = require('./config.js');

//连接mongodb
//mongoose.connect(config.mongodb);

//检测连接情况
/**
 * 连接成功
 */
mongoose.connection.on("open", function() {
    console.log("Mongoose connection succeeded : " + config.mongodb);
});

/**
 * 连接异常
 */
mongoose.connection.on("error", function() {
    console.log("Mongoose connection failed:" + error);
});

/**
 * 连接断开
 */
mongoose.connection.on("disconnect", function() {
    console.log("Mongoose connection disconnected");
})

module.exports = mongoose;
