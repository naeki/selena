var selena = require("../clientExtended");

var LOGIN1 = 'vadim+0001@levelup.ru',
    PASS = '123123',
    CIRCLE1 = 'CIRCLE1',
    CIRCLE2 = 'CIRCLE2',
    TIMEOUT = 4000,
    circleNameBefore = 'СircleNameBefore',
    circleNameAfter = 'circleNameAfter'
;


// Test module
testModule = {
    name : "checkCircle",
    call : function(){
      return this
        .circleCreateNew(CIRCLE1)
        .circleRename(CIRCLE1, CIRCLE2)
        .circleDelete(CIRCLE2)
        ;  
    },
    setup : function(){
        return this
            .login(LOGIN1, PASS)
    },
    clean : function(){
        return this
            .logout()
    },

    testSetup : function(){},
    testClean : function(){},

    tests : {}
}


testModule.tests.circleCreateNew = {
    call : function() {
        return this
            .circleListOpen()
            .click("[role='circleCreateButton']")
                .waitForVisible("[role='newCircleName']", TIMEOUT)
                    .then(
                        function(){selena.regActionResult("Форма создания нового круга открылась", 1)},
                        function(e){selena.regActionResult(e.message, 0, false)}
                    )
            .setValue("[role='newCircleName']", circleName)    
            .click("[role='newCircleSave']")
                .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
                    .then(
                        function(){selena.regActionResult("Круг " + circleName + " создан", 1)},
                        function(e){selena.regActionResult(e.message, 0, false)}
                    );
    },
    message : "Создание круга"
}

testModule.tests.circleRename = {
    call : function() {
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
                        function(){selena.regActionResult("Круг " + СircleNameBefore + " переименован " + " в " + circleNameAfter, 1)},
                        function(e){selena.regActionResult(e.message, 0, false)}
                    );
    },
    message : "Переименование круга"
}

testModule.tests.circleDelete = {
    call : function() {
        return this
            .circleSettingsOpen(circleName)
            .click("[role='circleDelete']")
            .keys(["Space"])
            .circleListOpen()
                .isExisting("//*[@role='circleName'][contains(text(),'" + circleName + "')]")
                    .then(
                        function(){selena.regActionResult("Круг " + circleName + " удален", 1)},
                        function(e){selena.regActionResult(e.message, 0, false)}
                    );
    },
    message : "Удаление круга"
}



module.exports = testModule;