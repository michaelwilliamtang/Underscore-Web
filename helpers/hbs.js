const moment = require('moment');

module.exports = {
    truncate: (str, len) => {
        if (str.length < len) return str;
        if (len == 0) return "";
        return str.substr(0, len) + "...";
    },
    formatDate: (date, format) => {
        return moment(date).format(format);
    },
    select: (selected, options) => {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected + '</option>'), ' selected="selected" $&');
    },
    accessIcons: (postUser, loggedUser) => {
        return postUser && loggedUser && postUser.id == loggedUser.id;
    }
}