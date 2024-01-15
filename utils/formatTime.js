const moment = require('moment');

// const formatTime = (timestamp)=>{
//     moment(timestamp).format('MMMM Do YYYY, h:mm:ss A')
// };

module.exports = (timestamp)=>{
    return moment(timestamp).format('MMMM Do YYYY, h:mm:ss A')
}