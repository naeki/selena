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
            .then(
                function(){selena.regActionResult("Открытие страницы " + env.url, 1)},
                function(e){selena.regActionResult("Открытие страницы " + env.url + e.message, 0)}
            )
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
            .then(
                function(){selena.regActionResult("Ввод " + email + " в поле email", 1)},
                function(e){selena.regActionResult("Ввод " + email + " в поле email " + e.message, 0)}
            )
    .setValue("[type='password']", pass)
        .waitForValue("[type='password']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Ввод " + pass + " в поле password", 1)},
                function(e){selena.regActionResult("Ввод " + pass + " в поле password " + e.message, 0)}
            )
    .click(".login-button")
};

fn.logout = function() {
    return this
    .circleListOpen()
    .click(".logout-button")
        .waitForExist(".login-button", TIMEOUT)
            .then(
                function(){selena.regActionResult("Логаут и появления формы авторизации", 1)},
                function(e){selena.regActionResult("Логаут и появления формы авторизации " + e.message, 0)}
            )
};

fn.circleListOpen = function() {
    return this
    .click("[role='circlesButton']")
        .waitForExist("[role='circleCreateButton']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие списка кругов", 1)},
                function(e){selena.regActionResult("Открытие списка кругов " + e.message, 0)}
            )
}

fn.circleSettingsOpen = function(circleName) {
    return this
    .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
        .then(
            function(){selena.regActionResult("Проверка наличия круг " + circleName + " в списке кругов", 1)},
            function(e){selena.regActionResult("Проверка наличия круг " + circleName + " в списке кругов" + e.message, 0)}
        )
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]")
        .waitForExist("[role='role']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие настроек круга " + circleName, 1)},
                function(e){selena.regActionResult("Открытие настроек круга " + circleName + " " + e.message, 0)}
            )
}

fn.circleCreateNew = function(circleName) {
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
                function(){selena.regActionResult("Создание круга " + circleName, 1)},
                function(e){selena.regActionResult("Создание круга " + circleName + " " + e.message, 0)}
            );
}

fn.circleDelete = function(circleName) {
    return this
    .circleSettingsOpen(circleName)
    .click("[role='circleDelete']")
    .keys(["Space"])
    .circleListOpen()
        .isExisting("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Удаление круга " + circleName + " ", 1)},
                function(e){selena.regActionResult("Удаление круга " + circleName + " " + e.message, 0)}
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