const moment = require('moment');

const formatTime = (timestamp)=>{
    moment(timestamp).format('MMMM Do YYYY, h:mm:ss A')
};

module.exports = formatTime;