const moment = require('moment');

module.exports = {
    truncate: (str, len) => {
        if (str.length < len) return str;
        if (len == 0) return "";
        return str.substr(0, len) + "...";
    },
    formatDate: (date, format) => {
        return moment(date).format(format);
    }
}