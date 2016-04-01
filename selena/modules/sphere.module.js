var selena = require("../clientExtended");

var LOGIN1 = 'vadim+0001@levelup.ru',
    PASS = '123123',
    SPHERE1 = 'SPHERE1',
    SPHERE2 = 'SPHERE2',
//    SPHERE3 = 'SPHERE3',
//    sphere_names = [SPHERE1, SPHERE2/*, SPHERE3*/],
    SPHEREGROUP1 = 'GROUP 1',
    SPHEREGROUP2 = 'GROUP 2',
    SPHEREGROUP3 = 'GROUP 3',
    TIMEOUT = 4000,
    sphereName = 'S'+Date.now(),
    sphereNameBefore = sphereName,
    sphereNameAfter = sphereName+1
;


// Test module
testModule = {
    name : "checkSphere",
    call : function(){
      return this
        .sphereRename(sphereNameBefore, sphereNameAfter)
        .sphereColorChange(sphereName)
        ;  
    },
    setup : function(){
        return this
//            .loginTwoWindow()
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
        return this
            .sphereCreate(sphereName)
            .sphereListOpen()
            .sphereSettingsOpen(sphereName)
    },
    testClean : function(){
        return this
            .sphereDeleteAny()
    },

    tests : {}
}

testModule.tests.sphereColorChange = {
    call : function(sphereName) {
    return this
    .isExisting(".sphere-settings-popup__icon", TIMEOUT)
    .click(".sphere-settings-popup__icon")
        .waitForExist(".color-picker-grid", TIMEOUT)
/*            .then(function(isExisting) {
                console.log(" " + isExisting, "ДД смены цвета сферы " +  sphereName + " открыт")
            })*/
    .click(".color-picker-grid-item[data-color='#00e9b6']")
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.second)
    .sphereListOpen()
        .waitForExist(".sphere-icon[style*='rgb(0, 233, 182)']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Сфера " + sphereName + " покрашена", 1)},
                function(e){selena.regActionResult("Сфера " + sphereName + " покрашена " + " " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    ;
    },
    message : "Смена цвета сферы"
}

testModule.tests.sphereRename = {
    call : function(sphereNameBefore, sphereNameAfter) {
    var sphereNameClear;
    return this
    .click("//*[@role='sphereCard']//*[@role='sphereName']")
        .waitForExist("//*[@contenteditable='true'][contains(text(),'" + sphereNameBefore + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Активация переименования сферы", 1)},
                function(e){selena.regActionResult("Активация переименования сферы " + e.message, 0)}
            )
    .clearElement("//*[@role='sphereCard']//*[@role='sphereName']")
    .getText("//*[@role='sphereCard']//*[@role='sphereName']")        
        .then(
            function(text) {
            console.log(text);  
            sphereNameClear = text;
        })
        .then(
            function(){selena.regActionResult("Поле с именем сферы чистое. В кавычках его содержимое '" + sphereNameClear +  "'", 1)},
            function(e){selena.regActionResult("Поле с именем сферы чистое. В кавычках его содержимое '" + sphereNameClear +  "' " + e.message, 0)}
        )
    .keys(sphereNameAfter)
        .waitForExist("//*[@contenteditable='true'][contains(text(),'" + sphereNameAfter + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Ввод нового имени " + sphereNameAfter + " сферы", 1)},
                function(e){selena.regActionResult("Ввод нового имени " + sphereNameAfter + " сферы " + e.message, 0)}
            )
    .keys(["Delete"])
    .keys(["Enter"])
    .pause(100)
    .keys(["Enter"])
        .waitForExist("//*[@contenteditable='false'][contains(text(),'" + sphereNameAfter + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Завершение редактирования названия сферы", 1)},
                function(e){selena.regActionResult("Завершение редактирования названия сферы" + e.message, 0)}
            )
        .waitForExist("//*[@role='sphereCard']//*[@role='sphereName'][contains(text(),'" + sphereNameAfter + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка в карточке. Сфера " + sphereNameBefore + " переименована в " + sphereNameAfter, 1)},
                function(e){selena.regActionResult("Проверка в карточке. Сфера " + sphereNameBefore + " переименована в " + sphereNameAfter + " " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.second)
    .sphereListOpen()
        .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereNameAfter + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка в сайдбаре второго таба. Сфера " + sphereNameBefore + " переименована в " + sphereNameAfter, 1)},
                function(e){selena.regActionResult("Проверка в сайдбаре второго таба. Сфера " + sphereNameBefore + " переименована в " + sphereNameAfter + " " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    ;
    },
    message : "Переименование сферы"
}



module.exports = testModule;