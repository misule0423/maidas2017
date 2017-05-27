var mongoose = require('mongoose');
var schema = mongoose.Schema;

var daySchema = new schema({
    date : String,
    morning  : {
        imagePath : String,
        mainMenu1 : String,
        mainMenu2 : String,
        mainMenu3 : String,
        mainMenu4 : String,
        mainMenu5 : String,
        sideMenu : String
    },
    lunch : {
        imagePath : String,
        mainMenu1 : String,
        mainMenu2 : String,
        mainMenu3 : String,
        mainMenu4 : String,
        mainMenu5 : String,
        sideMenu : String
    },
    dinner : {
        imagePath : String,
        mainMenu1 : String,
        mainMenu2 : String,
        mainMenu3 : String,
        mainMenu4 : String,
        mainMenu5 : String,
        sideMenu : String
    }
});

module.exports = mongoose.model('Day',daySchema);