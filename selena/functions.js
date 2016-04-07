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
    .windowHandleSize({width: 900, height: 1200})
    .windowHandlePosition({x: 0, y: 0})
    .waitForExist("[name='login']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Открытие страницы " + env.url, 1)},
            function(e){selena.regActionResult("Открытие страницы " + env.url + e.message, true)}
        )
};

fn.secondWindow = function() {
    return this
    .newWindow(env.url)
        .waitForVisible("[role='mainButton']", TIMEOUT)
            .then(null, function() {
                selena.regActionResult("Второй таб: Не подключился сокет (завис прелоадер)", 1);
                return this
                    .pageRefresh()
                    .waitForVisible("[role='mainButton']", TIMEOUT)
            })
    .getCurrentTabId()
        .then(function(tabId) {
            global.tabMap.second = tabId;
            global.tabMap[tabId] = 'SECOND';
        })
    .windowHandlePosition({x: 900, y: 5})
        .then(
            function(){selena.regActionResult("Открытие второго таба с адресом " + env.url, 1)},
            function(e){selena.regActionResult("Открытие второго таба с адресом " + env.url + e.message, true)}
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
            function(e){selena.regActionResult("Рефреш страницы " + e.message)}
        );
};

fn.login = function(email, pass) {
    return this
    .setValue("[type='email']", email)
        .waitForValue("[type='email']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Ввод " + email + " в поле email", 1)},
                function(e){selena.regActionResult(email + " в поле email не ввелось " + e.message)}
            )
    .setValue("[type='password']", pass)
        .waitForValue("[type='password']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Ввод " + pass + " в поле password", 1)},
                function(e){selena.regActionResult(pass + " в поле password не ввелось " + e.message)}
            )
    .click(".login-button")
        .then(
            function(){selena.regActionResult("Клик по кнопке Login", 1)}
        )
};

fn.loginCorrect = function(email, pass) {
    return this
    .login(email, pass)
        .waitForVisible("[role='mainButton']", TIMEOUT)
            .then(
                function(){
                    selena.regActionResult("Успешая авторизация и открытие системы (появление кнопки '+')", 1)
                },
                function(e){
                    selena.regActionResult("Завис прелоадер (не подключился сокет) " + e.message, 0);
                    return this
                        .pageRefresh()
                        .waitForVisible("[role='mainButton']", TIMEOUT)
                            .then(
                                function(){selena.regActionResult("Успешая авторизация и открытие системы (появление кнопки '+')", 1)},
                                function(e){selena.regActionResult("Второй раз зависший прелоадер " + e.message)}
                            )
                })

        .pause(500)
};

fn.logout = function() {
    return this
    .circleListOpen()
    .click(".logout-button")
        .waitForExist(".login-button", TIMEOUT)
            .then(
                function(){selena.regActionResult("Логаут и появления формы авторизации", 1)},
                function(e){selena.regActionResult("Логаут и появления формы авторизации " + e.message)}
            )
};

fn.circleListOpen = function() {
    return this
    .click("[role='circlesButton']")
        .waitForExist("[role='circleCreateButton']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие списка кругов", 1)},
                function(e){selena.regActionResult("Открытие списка кругов " + e.message, true)}
            )
}

fn.circleSettingsOpen = function(circleName) {
    return this
    .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
        .then(
            function(){selena.regActionResult("Проверка наличия круг " + circleName + " в списке кругов", 1)},
            function(e){selena.regActionResult("Проверка наличия круг " + circleName + " в списке кругов" + e.message)}
        )
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]")
        .waitForExist("[role='role']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие настроек круга " + circleName, 1)},
                function(e){selena.regActionResult("Открытие настроек круга " + circleName + " " + e.message, true)}
            )
}

fn.circleCreateNew = function(circleName) {
    return this
    .click("[role='circleCreateButton']")
        .waitForVisible("[role='newCircleName']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Открытие формы создания нового круга", 1)},
                function(e){selena.regActionResult("Открытие формы создания нового круга " + e.message)}
            )
    .setValue("[role='newCircleName']", circleName)    
    .click("[role='newCircleSave']")
        .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Круг " + circleName + " создан", 1)},
                function(e){selena.regActionResult("Круг " + circleName + " не создан " + e.message, true)}
            );
}

fn.circleDelete = function(circleName) {
    return this
    .click("[role='circleDelete']")
    .keys(["Space"])
    .circleListOpen()
        .isExisting("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Удаление круга " + circleName + " ", 1)},
                function(e){selena.regActionResult("Удаление круга " + circleName + " " + e.message)}
            );
}

fn.QCLOpen = function() {
    return this
    .moveToObject("[role='mainButton']")
        .waitForVisible("[role='createSphere']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Наведение на «+» и появление кнопок создания сферы/карточек", 1)},
                function(e){selena.regActionResult("Наведение на «+» и появление кнопок создания сферы/карточек " + e.message, true)}
            );
}

fn.sphereListOpen = function() {
    var message = arguments[0] || "Список сфер открылся";
    
    return this
    .click("[role='spheresListButton']")
        .waitForExist("[role='sphereName']", TIMEOUT)
            .then(
                function(){selena.regActionResult(message, 1)},
                function(e){selena.regActionResult("Список сфер не открылся " + e.message, true)}
            );
}
 
fn.sphereDDOpen = function(sphereName) {
    return this
    .isExisting("//*[@role='sphereName' and contains(text(),'" + sphereName + "')]")
        .then(
            function(){selena.regActionResult("Сфера присутствует " + sphereName + " в списке сфер", 1)},
            function(e){selena.regActionResult("Сфера отсутствует " + sphereName + " в списке сфер " + e.message)}
        )
    .click("//*[@role='sphereName' and contains(text(),'" + sphereName + "')]/../../*[@role='sphereMenu']")
        .waitForVisible("[title*='Settings']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Контекстное меню сферы " + sphereName + " открылось", 1)},
                function(e){selena.regActionResult("Контекстное меню сферы " + sphereName + " не открылось " + e.message)}
            );
}
 
fn.sphereSettingsOpen = function(sphereName) {
    return this
    .sphereDDOpen(sphereName)
    .click("[title*='Settings']")
        .waitForVisible("//*[@role='sphereCard']//*[@role='sphereName' and contains(text(),'" + sphereName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Настройки сферы " + sphereName + " открылись", 1)},
                function(e){selena.regActionResult("Настройки сферы " + sphereName + " открылись " + e.message, true)}
            );
}
 
fn.switchTabAndCallback = function(windowName) {
    return this
    .switchTab(windowName)
            .then(
                function(){selena.regActionResult("Переключение в таб " + global.tabMap[windowName], 1)},
                function(e){selena.regActionResult("Переключение в таб " + global.tabMap[windowName] + " " + e.message)}
            );
}
 
fn.sphereCreate = function(sphereName) {
    return this
    .QCLOpen()
    .click("[role='createSphere']")
        .waitForExist('.new-sphere-name', TIMEOUT)
    .setValue(".new-sphere-name", sphereName)
    .keys(["Enter"])
        .waitForExist("//div[contains(text(),'" + sphereName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Сфера " + sphereName + " создана", 1)},
                function(e){selena.regActionResult("Сфера " + sphereName + " не создана  " + e.message, true)}
            )
    
    ;
}
 
fn.sphereDelete = function(sphereName) {
    return this
    .sphereSettingsOpen(sphereName)
    .sphereListOpen()
        .waitForExist("[role='sphereDelete']", TIMEOUT)
    .click("[role='sphereDelete']")
        .waitForExist("//*[contains(@class,'dialog-buttons')]", TIMEOUT)
    .keys(["Space"])
        .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Сфера " + sphereName + " удалена", 1)},
                function(e){selena.regActionResult("Сфера " + sphereName + " не удалена " + e.message)}
            )
    .keys(["Escape"])
    
    ;
}
 
fn.sphereDeleteAny = function() {
    var sphereName;
    return this
    .sphereListOpen()
    .getText("//*[@role='spheresRecent']//*[@role='sphereName']")        
        .then(
            function(text) {
            sphereName = text[0];
            return this
                .sphereDelete(sphereName)
        })
    ;
}
 
fn.sphereDeleteAll = function() {
    return this
    .sphereListOpen()
    .getText("//*[@role='spheresRecent']//*[@role='sphereName']")        
        .then(
            function(text) {
                var dfd = this;
                
                if (typeof text === "string") text = [text];
                
                for (var i = 0; text[i]; i++) {
                    dfd = dfd.then(function(name){
                        return this.sphereDelete(name);
                    }.bind(dfd, text[i]));
                    console.log("~~~~~ Sphere delete ", i, text[i])
                }    

                return dfd;
            }
        )
    ;
}

fn.notifListOpen = function() {
    return this
    .click("[role='notifListButton']")
        .waitForVisible("[role='notifList']", TIMEOUT)
            .then(
            function(){selena.regActionResult("Список нотификейшенов открыт", 1)},
            function(e){selena.regActionResult("Список нотификейшенов открыт " + e.message)}
        )
}

fn.TaskCreateFormOpen = function() {
    console.log("TaskCreateFormOpen");
    return this
        .click("[role='mainButton']")
            .waitForExist("[role='form']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Форма создания карточки открылась", 1)},
                    function(e){selena.regActionResult("Форма создания карточки не открылась " + e.message, true)}
                )
}

fn.taskCreate = function(taskName) {
    console.log("taskCreate", taskName);
    return this
        .TaskCreateFormOpen()
        .keys(taskName)
        .click("[role='mainButton']")
            .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT)
                .then(
                function(){selena.regActionResult("Карточка " + taskName + " создана", 1)},
                function(e){selena.regActionResult("Карточка " + taskName + " не создалась " + e.message, true)}
            )
}

fn.taskDDOpen = function(taskName) {
    return this
        .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]")
            .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']", TIMEOUT)
        .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']")
            .waitForVisible("[role='menuDropdown']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Контекстное меню карточки " + taskName + " открытось", 1)},
                    function(e){selena.regActionResult("Контекстное меню карточки " + taskName + " не открытось " + e.message)}
                )
}

fn.taskDelete = function(taskName) {
    return this
    .taskDDOpen(taskName)
    .click("[title='Delete']")
        .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Карточка " + taskName + " удалена", 1)},
                function(e){selena.regActionResult("Карточка " + taskName + " не удалилась " + e.message)}
            )
}

fn.taskDeleteAll = function(taskName) {
    return this
    .keys(["Escape"])
    .getText("//*[@role='task']//*[@role='title']") 
        .then(
            function(text) {
                var dfd = this;
                
                if (typeof text === "string") text = [text];
                
                for (var i = 0; text[i]; i++) {
                    dfd = dfd.then(function(name){
                        return this.taskDelete(name);
                    }.bind(dfd, text[i]));
                    console.log("~~~~~ Task delete ", i, text[i])
                }    

                return dfd;
            }
        )
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