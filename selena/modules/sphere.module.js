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
    return this
    .sphereListOpen()
    .click("//*[@role='sphereCard']//*[@role='sphereName']")
    .clearElement("//*[@role='sphereCard']//*[@role='sphereName']")
    .keys(sphereNameAfter)
    .keys(["Delete"])
    .keys(["Enter"])
    .pause(100)
    .keys(["Enter"])
        .waitForExist("//*[@role='sphereCard']//*[@role='sphereName'][contains(text(),'" + sphereNameAfter + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Сфера " + sphereName + " переименована в " + sphereNameAfter, 1)},
                function(e){selena.regActionResult("Сфера " + sphereName + " переименована в " + sphereNameAfter + " " + e.message, 0)}
            )
    ;
    },
    message : "Переименование сферы"
}



module.exports = testModule;