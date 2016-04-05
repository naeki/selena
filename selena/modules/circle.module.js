var selena = require("../clientExtended");

var LOGIN1 = 'vadim+0001@levelup.ru',
    PASS = '123123',
    CIRCLE1 = 'CIRCLE1',
    CIRCLE2 = 'CIRCLE2',
    TIMEOUT = 4000,
    circleName = 'C'+Date.now(),
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
            .circleCreateNew(circleNameBefore)
    },
    testClean : function(){
        return this
            .circleSettingsOpen(circleNameAfter)
            .circleDelete(circleNameAfter)
    },

    tests : {}
}

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


module.exports = testModule;