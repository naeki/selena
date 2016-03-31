var selena = require("./clientExtended");
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

fn.logout = function() {
    return this
    .circleListOpen()
    .click(".logout-button")
        .waitForExist(".login-button", TIMEOUT)
};

fn.circleListOpen = function() {
    return this
    .click("[role='circlesButton']")
        .waitForExist("[role='circleCreateButton']", TIMEOUT)
}

fn.circleSettingsOpen = function(circleName) {
    return this
    .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
/*            .then(function(isExisting) {
                    console.log(" " + isExisting, "Круг " + circleName + " существует");
            })*/
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]")
        .waitForExist("[role='role']", TIMEOUT)
/*            .then(function(isExisting) {
                    console.log(" " + isExisting, "Открытие параметров круга " + circleName);
            })*/
}

fn.circleCreateNew = function() {
    return this
    .click("[role='circleCreateButton']")
        .waitForVisible("[role='newCircleName']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие формы создания нового круга", 1)},
                function(e){selena.regActionResult("Открытие формы создания нового круга " + e.message, 0)}
            )
    .setValue("[role='newCircleName']", circleName)    
    .click("[role='newCircleSave']")
        .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Круг " + circleName + " создан", 1)},
                function(e){selena.regActionResult(e.message, 0)}
            );
}


fn.circleDelete = function() {
    return this
    .click("[role='circleDelete']")
    .keys(["Space"])
    .circleListOpen()
        .isExisting("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Круг " + circleName + " удален", 1)},
                function(e){selena.regActionResult("Удаление круга " + e.message, 0)}
            );
}

 
// client.addCommand("sessionEndAll", function() {
//     console.log(" ");
//     console.log("All Sessions is closed.");
//     console.log(" "); 
//     return this
//         .endAll();
// })





module.exports = fn;