var selena = require("./clientExtended");
var fn = {};
var env = process.env;
// var env = require('./env');


fn.sessionStart = function() {
    global.tabMap = {};
    return this
    .init()
    .getCurrentTabId()
        .then(function(tabId) {
            global.tabMap.first = tabId;
            global.tabMap[tabId] = 'FIRST';
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

fn.secondWindow = function() {
    return this
    .newWindow(env.url)
    .getCurrentTabId()
        .then(function(tabId) {
            global.tabMap.second = tabId;
            global.tabMap[tabId] = 'SECOND';
        })
    .windowHandlePosition({x: 800, y: 5})
        .then(
            function(){selena.regActionResult("Открытие второго таба с адресом " + env.url, 1)},
            function(e){selena.regActionResult("Открытие второго таба с адресом " + env.url + e.message, 0)}
        )
    .switchTabAndCallback(tabMap.first)
};

fn.sessionEnd = function() {
    console.log(" ");
    console.log("Session is done.");
    console.log(" "); 
    return this
        .end();
};

fn.pageRefresh = function() {
    return this
    .pause(500)
    .refresh()
        .waitForVisible("[role='circlesButton']", TIMEOUT)
            .then(
            function(){selena.regActionResult("Рефреш страницы ", 1)},
            function(e){selena.regActionResult("Рефреш страницы " + e.message, 0)}
        );
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

fn.QCLOpen = function() {
    return this
    .moveToObject("[role='mainButton']")
        .waitForVisible("[role='createSphere']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие формы 'быстрого создания'", 1)},
                function(e){selena.regActionResult("Открытие формы 'быстрого создания' " + e.message, 0)}
            );
}

fn.sphereListOpen = function() {
    return this
    .click("[role='spheresListButton']")
        .waitForExist("[role='sphereName']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие списка сфер", 1)},
                function(e){selena.regActionResult("Открытие списка сфер " + e.message, 0)}
            );
}
 
fn.sphereDDOpen = function(sphereName) {
    return this
    .isExisting("//*[@role='sphereName' and contains(text(),'" + sphereName + "')]")
        .then(
            function(){selena.regActionResult("Сфера " + sphereName + " в списке присутствует", 1)},
            function(e){selena.regActionResult("Сфера " + sphereName + " в списке присутствует " + e.message, 0)}
        )
    .click("//*[@role='sphereName' and contains(text(),'" + sphereName + "')]/../../*[@role='sphereMenu']")
        .waitForVisible("[title*='Settings']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие контекстного меню сферы " + sphereName, 1)},
                function(e){selena.regActionResult("Открытие контекстного меню сферы " + sphereName + " " + e.message, 0)}
            );
}
 
fn.sphereSettingsOpen = function(sphereName) {
    return this
    .sphereDDOpen(sphereName)
    .click("[title*='Settings']")
        .waitForVisible("//*[@role='sphereCard']//*[@role='sphereName' and contains(text(),'" + sphereName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие карточки (настроек) сферы " + sphereName, 1)},
                function(e){selena.regActionResult("Открытие карточки (настроек) сферы " + sphereName + " " + e.message, 0)}
            );
}
 
fn.switchTabAndCallback = function(windowName) {
    return this
    .switchTab(windowName)
            .then(
                function(){selena.regActionResult("Переключение в таб " + global.tabMap[windowName], 1)},
                function(e){selena.regActionResult("Переключение в таб " + global.tabMap[windowName] + " " + e.message, 0)}
            );
}
 
fn.sphereCreate = function(sphereName) {
    return this
    .QCLOpen()
    .click("[role='createSphere']")
        .waitForExist('.new-sphere-name', TIMEOUT)
            .then(
                function(){selena.regActionResult("Появление формы создания сферы", 1)},
                function(e){selena.regActionResult("Появление формы создания сферы " + e.message, 0)}
            )
    .setValue(".new-sphere-name", sphereName)
    .keys(["Enter"])
        .waitForExist("//div[contains(text(),'" + sphereName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Форма создания сферы закрылась", 1)},
                function(e){selena.regActionResult("Форма создания сферы закрылась " + e.message, 0)}
            )
    .switchTabAndCallback(tabMap.second)
    .sphereListOpen()
        .waitForExist("//span[contains(text(),'" + sphereName + "')]")
            .then(
                function(){selena.regActionResult("Сфера " + sphereName + " создана", 1)},
                function(e){selena.regActionResult("Сфера " + sphereName + " создана " + " " + e.message, 0)}
            )
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    ;
}
 
fn.sphereDelete = function(sphereName) {
    return this
    .sphereSettingsOpen(sphereName)
    .click("[role='sphereDelete']")
    .keys(["Space"])
    .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
        .then(
            function(){selena.regActionResult("Сфера " + sphereName + " удалена", 1)},
            function(e){selena.regActionResult("Сфера " + sphereName + " удалена " + " " + e.message, 0)}
        )
    ;
}
 
fn.sphereDeleteAny = function() {
    var sphereName;
    return this
    .sphereListOpen()
    .getText("//*[@role='spheresRecent']//*[@role='sphereName']")        
        .then(
            function(text) {
            console.log(text);  
            console.log(text[0]);  
            sphereName = text[0];
        })
    .then(function(){
        return this
        .sphereSettingsOpen(sphereName)
        .click("[role='sphereDelete']")
            .waitForExist("//*[contains(@class,'dialog-buttons')]")
                .then(
                    function(){selena.regActionResult("Появление диалога удаления сферы " + sphereName, 1)},
                    function(e){selena.regActionResult("Появление диалога удаления сферы " + " " + e.message, 0)}
                )
        .keys(["Space"])
        .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Сфера " + sphereName + " удалена", 1)},
                function(e){selena.regActionResult("Сфера " + sphereName + " удалена " + " " + e.message, 0)}
            )
    })
    ;
}


// client.addCommand("sessionEndAll", function() {
//     console.log(" ");
//     console.log("All Sessions is closed.");
//     console.log(" "); 
//     return this
//         .endAll();
// })





module.exports = fn;