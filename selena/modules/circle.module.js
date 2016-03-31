var selena = require("../clientExtended");

var LOGIN1 = 'vadim+0001@levelup.ru',
    PASS = '123123',
    CIRCLE1 = 'CIRCLE1',
    CIRCLE2 = 'CIRCLE2',
    TIMEOUT = 4000,
    circleName = 'Circle'+Date.now(),
    circleNameBefore = circleName,
    circleNameAfter = circleName+1
;


// Test module
testModule = {
    name : "checkCircle",
    call : function(){
      return this
        .circleRename(circleNameBefore, circleNameAfter)
        ;  
    },
    setup : function(){
        return this
            .login(LOGIN1, PASS)
                .waitForVisible("[role='mainButton']", TIMEOUT)
                .pause(500)
                    .then(
                        function(){selena.regActionResult("Авторизация и открытие системы", 1)},
                        function(e){selena.regActionResult("Авторизация и открытие системы " + e.message, 0)}
                    )
            ;
    },
    clean : function(){
        return this
            .logout()
    },

    testSetup : function(){
        return this
            .circleListOpen()
            .circleCreateNew(circleName)
    },
    testClean : function(){
        return this
            .circleDelete(circleNameAfter)
    },

    tests : {}
}


/*testModule.tests.circleCreateNew = {
    call : function(circleName) {
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
                        function(e){selena.regActionResult("Создание круга " + circleName + e.message, 0)}
                    );
    },
    message : "Создание круга"
}*/

testModule.tests.circleRename = {
    call : function(circleNameBefore, circleNameAfter) {
        return this
            .circleSettingsOpen(circleNameBefore)
            .click("//*[@role='circleName'][contains(text(),'" + circleNameBefore + "')]")
            .clearElement(".in-edit")
            .keys(circleNameAfter)
            .keys(["Enter"])
            .keys(["Escape"])
            .circleListOpen()
                .waitForExist("//*[@role='circleName'][contains(text(),'" + circleNameAfter + "')]", TIMEOUT)
                    .then(
                        function(){selena.regActionResult("Переименование круга " + circleNameBefore + " в " + circleNameAfter, 1)},
                        function(e){selena.regActionResult("Переименование круга " + circleNameBefore + " в " + circleNameAfter + " " + e.message, 0)}
                    );
    },
    message : "Переименование круга"
}

/*testModule.tests.circleDelete = {
    call : function(circleName) {
        return this
            .circleSettingsOpen(circleName)
            .click("[role='circleDelete']")
            .keys(["Space"])
            .circleListOpen()
                .isExisting("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
                    .then(
                        function(){selena.regActionResult("Круг " + circleName + " удален", 1)},
                        function(e){selena.regActionResult("Удаление круга " + e.message, 0)}
                    );
    },
    message : "Удаление круга"
}*/



module.exports = testModule;