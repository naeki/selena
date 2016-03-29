
var fn = {};
var env = process.env;
// var env = require('./env');


fn.sessionStart = function() {
    return this
        .init()
        .getCurrentTabId()
            .then(function(tabId) {
                global.First = tabId;
            })
        .url(env.url)
        .windowHandleSize({width: 800, height: 1200})
        .windowHandlePosition({x: 0, y: 0})
        .waitForExist("[name='login']", TIMEOUT)
};

fn.sessionEnd = function() {
    console.log(" ");
    console.log("Session is done.");
    console.log(" "); 
    return this
        .end();
};

fn.login = function(email, pass) {
    return this
    .setValue("[type='email']", email)
        .waitForValue("[type='email']", TIMEOUT)
    .setValue("[type='password']", pass)
        .waitForValue("[type='password']", TIMEOUT)
    .click(".login-button")
};




 
// client.addCommand("sessionEndAll", function() {
//     console.log(" ");
//     console.log("All Sessions is closed.");
//     console.log(" "); 
//     return this
//         .endAll();
// })





module.exports = fn;