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
        .circleCreateNew()
        .circleRename(circleNameBefore, circleNameAfter)
        .circleDelete()
        ;  
    },
    setup : function(){
        return this
            .login(LOGIN1, PASS)
                .waitForVisible("[role='circlesButton']", TIMEOUT)
                    .pause(3000)
    },
    clean : function(){
        return this
            .logout()
    },

    testSetup : function(){
        return this
            .circleListOpen()
                .then(
                    function(){selena.regActionResult("Открытие списка кругов", 1)},
                    function(e){selena.regActionResult("Открытие списка кругов " + e.message, 0)}
                )
    },
    testClean : function(){},

    tests : {}
}


testModule.tests.circleCreateNew = {
    call : function() {
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
    },
    message : "Создание круга"
}

testModule.tests.circleRename = {
    call : function(circleNameBefore, circleNameAfter) {
        // console.log("intest ", arguments)

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
                        function(){selena.regActionResult("Круг " + circleNameBefore + " переименован " + " в " + circleNameAfter, 1)},
                        function(e){selena.regActionResult("Переименование круга " + e.message, 0)}
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
                .isExisting("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
                    .then(
                        function(){selena.regActionResult("Круг " + circleName + " удален", 1)},
                        function(e){selena.regActionResult("Удаление круга " + e.message, 0)}
                    );
    },
    message : "Удаление круга"
}



module.exports = testModule;