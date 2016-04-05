var selena = require("../clientExtended");

var LOGIN1 = 'vadim+0001@levelup.ru',
    PASS = '123123',
    TIMEOUT = 4000,
    sphereName = 'S'+Date.now(),
    circleName = 'C'+Date.now()
;


// Test module
testModule = {
    name : "checkBasic",
    call : function(){
      console.log("module call");
      return this
        .circleCreateTest(circleName)
      
        .circleDeleteTest(circleName)
      
        .sphereCreateTest(sphereName)
      
        .sphereDeleteTest(sphereName)
      
//        .taskCreateTest(taskName)
      
//        .taskDeleteTest(taskName)
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
            .secondWindow()
            ;
    },
    clean : function(){
        return this
            .logout()
    },

    testSetup : function(){
//        return this;
    },
    testClean : function(){
//        return this
    },

    tests : {}
}

testModule.tests.circleCreateTest = {
    call : function(circleName) {
        console.log("test call");
        return this
        .circleListOpen()
        .circleCreateNew(circleName)
        ;
    },
    message : "Создание круга"
}


testModule.tests.circleDeleteTest = {
    call : function(circleName) {
        return this
        .circleSettingsOpen(circleName)
        .circleDelete(circleName)
        ;
    },
    message : "Удаление круга"
}

testModule.tests.sphereCreateTest = {
    call : function(sphereName) {
        return this
        .sphereCreate(sphereName)
        ;
    },
    message : "Создание сферы"
}


testModule.tests.sphereDeleteTest = {
    call : function(sphereName) {
        return this
        .sphereListOpen()
        .sphereDelete(sphereName)
        ;
    },
    message : "Удаление сферы"
}

testModule.tests.taskCreateTest = {
    call : function(taskName) {
        return this
        .taskCreateNew(taskName)
        ;
    },
    message : "Создание карточки"
}


testModule.tests.taskDeleteTest = {
    call : function(taskName) {
        return this
        .taskDelete(taskName)
        ;
    },
    message : "Удаление карточки"
}





module.exports = testModule;