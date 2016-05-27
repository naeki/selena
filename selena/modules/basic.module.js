var selena = require("../clientExtended");

// Test module
testModule = {
    name : "checkBasic",
    call : function(){
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
        .circleListOpen()
        .circleDelete(circleName)
        ;
    },
    message : "Удаление круга (созданного предыдущим тестом)"
}

testModule.tests.sphereCreateTest = {
    call : function(sphereName) {
        return this
        .QCLOpen()
        .click("[role='createSphere']")
            .waitForExist('.new-sphere-name', TIMEOUT)
                .then(
                    function(){selena.regActionResult("Форма создания сферы открылась. Вводим " + sphereName + " и нажимаем Enter.", 1)},
                    function(e){selena.regActionResult("Форма создания сферы не открылась. " + e.message, 0, true)}
                )
        .setValue(".new-sphere-name", sphereName)
        .keys(["Enter"])
            .waitForExist("//div[contains(text(),'" + sphereName + "')]", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Форма создания сферы закрылась", 1)},
                    function(e){selena.regActionResult("Форма создания сферы закрылась " + e.message, 0, true)}
                )
        .switchTabAndCallback(tabMap.second)
        .sphereListOpen("Открываем список сфер для проверки, что созданная сфера появилась в нем.")
            .waitForExist("//span[contains(text(),'" + sphereName + "')]")
                .then(
                    function(){selena.regActionResult("Сфера " + sphereName + " создалась.", 1)},
                    function(e){selena.regActionResult("Сфера " + sphereName + " не создалась. " + e.message, 0, true)}
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
                    function(){selena.regActionResult("Кнопка удаления сферы доступна. Кликаем на нее.", 1)},
                    function(e){selena.regActionResult("Кнопки удаления сферы не доступна " + e.message, 0, true)}
                )
        .click("[role='sphereDelete']")
            .waitForExist("//*[contains(@class,'dialog-buttons')]", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Диалог подтверждения удаления сферы " + sphereName + " появился. Нажимаем пробел.", 1)},
                    function(e){selena.regActionResult("Диалог подтверждения удаления сферы " + sphereName + " не появился. " + e.message, 0, true)}
                )
        .keys(["Space"])
            .waitForExist("//*[contains(@class,'dialog-buttons')]", TIMEOUT, true)
                    .then(
                        function(){selena.regActionResult("Диалог удаления сферы " + sphereName + " закрылся. Переключаемся во второй таб.", 1)},
                        function(e){selena.regActionResult("Диалог удаления сферы " + sphereName + " не закрылся. " + e.message, 0, true)}
                    )
        .keys(["Escape"])
        .switchTabAndCallback(tabMap.second)
        .sphereListOpen("Открываем сайдбар для проверки наличия сферы")
            .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
                .then(
                    function(){selena.regActionResult("Сфера " + sphereName + " удалена (отсутсвует в списке сфер)", 1)},
                    function(e){selena.regActionResult("Сфера " + sphereName + " не удалена (присутствует в списке сфер)" + e.message, 0, true)}
                )
        .keys(["Escape"])
        .switchTabAndCallback(tabMap.first)
        
        ;
    },
    message : "Удаление сферы (созданной предыдущим тестом)"
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
    message : "Удаление карточки (созданной предыдущим тестом)"
}

testModule.tests.taskDDOpenTest = {
    call : function(taskName) {
        return this
        .taskCreate(taskName)
        .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]")
            .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Наводим на карточку " + taskName + " и ждем появление кнопки •••.", 1)},
                    function(e){selena.regActionResult("При наведенении на карточку " + taskName + " не появилась кнопка (•••) параметров (меню) карточки " + taskName + " " + e.message, 0, true)}
                )
        .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']")
            .waitForVisible("[role='menuDropdown']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Клик на ••• и открытие контекстного меню " + taskName, 1)},
                    function(e){selena.regActionResult("При клике на ••• не появлилось контекстное меню карточки " + taskName + " " + e.message, 0, true)}
                )
        .keys(["Escape"])
        .taskDelete(taskName)
        
        ;
    },
    message : "Открытие контекстного меню карточки"
}






module.exports = testModule;