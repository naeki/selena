var selena = require("../clientExtended");

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
                    .then(function(isExisting) {
                            console.log(" " + isExisting, "Форма создания нового круга открылась");
                        })
            .setValue("[role='newCircleName']", circleName)    
            .click("[role='newCircleSave']")
                .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
                    .then(function (isExisting) {
                            console.log(" " + isExisting, "Круг " + circleName + " создан");
                    })


                .then(
                    function(){selena.regActionResult("Wait for wrong type message", 1)},
                    function(){selena.regActionResult("Wait for wrong type message", 0)}
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
                    .then(function(isExisting) {
                            console.log(" " + isExisting, "Круг переименован");
                    })
            
                .then(
                    function(){selena.regActionResult("Wait for wrong type message", 1)},
                    function(){selena.regActionResult("Wait for wrong type message", 0)}
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
                    .then(function(isExisting) {
                            console.log("Круг", circleName, "удален", isExisting, "false = ok");
                    })
        
                .then(
                    function(){selena.regActionResult("Wait for wrong type message", 1)},
                    function(){selena.regActionResult("Wait for wrong type message", 0)}
                );
    },
    message : "Переименование круга"
}



module.exports = testModule;