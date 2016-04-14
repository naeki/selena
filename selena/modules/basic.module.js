var selena = require("../clientExtended");

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
      
        .taskCreateTest(taskName)
        .taskDeleteTest(taskName)
        
        .taskDDOpenTest(taskName)
        
        ;  
    },
    setup : function(){
        return this
            .loginCorrect(LOGIN1, PASS)
            .secondWindow()
            ;
    },
    clean : function(){
        return this
            .logout()
    },

    testSetup : function(){
    },
    testClean : function(){
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
        .QCLOpen()
        .click("[role='createSphere']")
            .waitForExist('.new-sphere-name', TIMEOUT)
                .then(
                    function(){selena.regActionResult("Появление формы создания сферы", 1)},
                    function(e){selena.regActionResult("Появление формы создания сферы " + e.message, 0, true)}
                )
        .setValue(".new-sphere-name", sphereName)
        .keys(["Enter"])
            .waitForExist("//div[contains(text(),'" + sphereName + "')]", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Форма создания сферы закрылась", 1)},
                    function(e){selena.regActionResult("Форма создания сферы закрылась " + e.message, 0, true)}
                )
        .switchTabAndCallback(tabMap.second)
        .sphereListOpen()
            .waitForExist("//span[contains(text(),'" + sphereName + "')]")
                .then(
                    function(){selena.regActionResult("Создание сферы " + sphereName, 1)},
                    function(e){selena.regActionResult("Создание сферы " + sphereName + " " + e.message, 0, true)}
                )
        .keys(["Escape"])
        .switchTabAndCallback(tabMap.first)
        
        ;
    },
    message : "Создание сферы"
}

testModule.tests.sphereDeleteTest = {
    call : function(sphereName) {
        return this
        .sphereListOpen()
        .sphereSettingsOpen(sphereName)
        .sphereListOpen("Повторное открытие сайдбара для проверки исчезновения сферы при удалении, так как при открытии настроек сферы сайдбар закрывается")
            .waitForExist("[role='sphereDelete']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Кнопка удаления сферы доступна", 1)},
                    function(e){selena.regActionResult("Кнопки удаления сферы не доступна " + e.message, 0, true)}
                )
        .click("[role='sphereDelete']")
            .waitForExist("//*[contains(@class,'dialog-buttons')]", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Клик на кнопку удаления сферы: Диалог удаления сферы " + sphereName + " появился", 1)},
                    function(e){selena.regActionResult("Клик на кнопку удаления сферы: Диалог удаления сферы " + sphereName + " не появился " + e.message, 0, true)}
                )
        .keys(["Space"])
            .waitForExist("//*[contains(@class,'dialog-buttons')]", TIMEOUT, true)
                    .then(
                        function(){selena.regActionResult("Нажатие пробела: Диалог удаления сферы " + sphereName + " закрылся", 1)},
                        function(e){selena.regActionResult("Нажатие пробела: Диалог удаления сферы " + sphereName + " не закрылся " + e.message, 0, true)}
                    )
        .keys(["Escape"])
        .switchTabAndCallback(tabMap.second)
        .sphereListOpen("Открытие сайдбара для проверки наличия сферы")
            .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
                .then(
                    function(){selena.regActionResult("Сфера " + sphereName + " удалена (пропала в списке сфер)", 1)},
                    function(e){selena.regActionResult("Сфера " + sphereName + " не удалена (не пропала в списке сфер)" + e.message, 0, true)}
                )
        .keys(["Escape"])
        .switchTabAndCallback(tabMap.first)
        
        ;
    },
    message : "Удаление сферы"
}

testModule.tests.taskCreateTest = {
    call : function(taskName) {
        return this
        .taskCreate(taskName)
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

testModule.tests.taskDDOpenTest = {
    call : function(taskName) {
        return this
        .taskCreate(taskName)
        .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]")
            .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Наведение на карточку " + taskName, 1)},
                    function(e){selena.regActionResult("Не появилась кнопка параметров (меню) карточки " + taskName + " " + e.message, 0, true)}
                )
        .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']")
            .waitForVisible("[role='menuDropdown']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Клик на ••• и открытие контекстного меню " + taskName, 1)},
                    function(e){selena.regActionResult("При клике на ••• не появлилось контекстное меню карточки " + taskName + " " + e.message, 0, true)}
                )
        .taskDelete(taskName)
        
        ;
    },
    message : "Открытие контекстного меню карточки"
}






module.exports = testModule;