var selena = require("../clientExtended");

// Test module
testModule = {
    name : "Sphere",
    call : function(){
      return this
        .sphereRename(sphereNameBefore, sphereNameAfter)
        .sphereColorChange(sphereName)
        ;  
    },
    setup : function(){
        return this
//            .loginTwoWindow()
            .switchTabAndCallback(tabMap.first)
            .loginCorrect(LOGIN1, PASS)
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
    .isExisting(".sphere-settings-popup__icon")
        .then(
            function(){selena.regActionResult("Проверка на кнопку смены цвета", 1)},
            function(e){selena.regActionResult("Проверка на кнопку смены цвета " + e.message, 0)}
        )
    .click(".sphere-settings-popup__icon")
        .waitForExist(".color-picker-grid", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка на появление color picker", 1)},
                function(e){selena.regActionResult("Проверка на появление color picker " + e.message, 0)}
            )
    .click(".color-picker-grid-item[data-color='#00e9b6']")
        .waitForExist(".sphere-settings-popup__icon[style*='rgb(0, 233, 182)']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка в первом табе в карточке сферы. Сфера " + sphereName + " покрашена", 1)},
                function(e){selena.regActionResult("Проверка в первом табе в карточке сферы. Сфера " + sphereName + " покрашена " + e.message, 0)}
            )
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.second)
    .sphereListOpen()
        .waitForExist(".sphere-icon[style*='rgb(0, 233, 182)']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка во втором табе в сайдбаре. Сфера " + sphereName + " покрашена", 1)},
                function(e){selena.regActionResult("Проверка во втором табе в сайдбаре. Сфера " + sphereName + " покрашена " + " " + e.message, 0)}
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