/* handlebars helper functions */

var moment = require('moment');

module.exports = function(hbs) {
    // compares two strings or numbers for equivalence
    hbs.registerHelper('isEq', function (str1, str2, options) {
        return (str1 == str2) ? options.fn(this) : '';
    });
    // opposite of above
    hbs.registerHelper('isNotEq', function (str1, str2, options) {
        return (str1 != str2) ? options.fn(this) : '';
    });
    // if one string contains another
    hbs.registerHelper('contains', function (str1, str2, options) {
        return (str1.indexOf(str2) !== -1) ? options.fn(this) : '';
    });
    // uses moment.js to format date
    hbs.registerHelper('formatDate', function (date, format) {
        return moment(date).format(format);
    });
    // for 1-indexing arrays
    hbs.registerHelper('plusOne', function (number) {
        return number + 1;
    });
}