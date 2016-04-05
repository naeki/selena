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
    name : "checkSphereContextMenu",
    call : function(){
    return this
        .sphereUnfollowFollow(sphereName)
        .sphereStarredAddRemove(sphereName)
        .sphereQCLAddRemove(sphereName)
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
            .switchTabAndCallback(tabMap.second)
            .sphereListOpen()
            .switchTabAndCallback(tabMap.first)
    },
    testClean : function(){
        return this
            .sphereDeleteAll()
    },

    tests : {}
}

testModule.tests.sphereUnfollowFollow = {
    call : function(sphereName) {
    return this
    .sphereDDOpen(sphereName)
    .waitForVisible("[title='Follow']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт Follow присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт Follow присутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title='Follow']")
        .waitForVisible("[title='Unfollow']", TIMEOUT)
            .then(
                function(){selena.regActionResult("В первом табе: Follow сферы " + sphereName, 1)},
                function(e){selena.regActionResult("В первом табе: Follow сферы " + sphereName + " " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.second)
    .sphereDDOpen(sphereName)
        .waitForVisible("[title='Unfollow']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Во втором табе: Follow сферы " + sphereName, 1)},
                function(e){selena.regActionResult("Во втором табе: Follow сферы " + sphereName + " " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    
    .sphereListOpen()
    .sphereDDOpen(sphereName)
    .waitForVisible("[title='Unfollow']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт Unfollow присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт Unfollow присутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title='Unfollow']")
        .waitForVisible("[title='Follow']", TIMEOUT)
            .then(
                function(){selena.regActionResult("В первом табе: Unfollow сферы " + sphereName, 1)},
                function(e){selena.regActionResult("В первом табе: Unfollow сферы " + sphereName + " " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.second)
    .sphereListOpen()
    .sphereDDOpen(sphereName)
        .waitForVisible("[title='Follow']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Во втором табе: Unfollow сферы " + sphereName, 1)},
                function(e){selena.regActionResult("Во втором табе: Unfollow сферы " + sphereName + " " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    ;
    },
    message : "Follow/Unfollow сферы"
}

testModule.tests.sphereStarredAddRemove = {
    call : function(sphereName) {
    return this
    .sphereDDOpen(sphereName)
    .waitForVisible("[title*='Add to starred']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт Add to starred присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт Add to starred присутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title*='Add to starred']")
        .waitForExist("//div[2][@class='spheres-list-group']//span[contains(text(),'" + sphereName + "')]", TIMEOUT)    
            .then(
                function(){selena.regActionResult("В первом табе: Добавление сферы " + sphereName + " в избранное", 1)},
                function(e){selena.regActionResult("В первом табе: Добавление сферы " + sphereName + " в избранное " + e.message, 0)}
            )
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//div[2][@class='spheres-list-group']//span[contains(text(),'" + sphereName + "')]", TIMEOUT)    
            .then(
                function(){selena.regActionResult("Во втором табе: Добавление сферы " + sphereName + " в избранное", 1)},
                function(e){selena.regActionResult("Во втором табе: Добавление сферы " + sphereName + " в избранное " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    
    .sphereListOpen()
    .sphereDDOpen(sphereName)
    .waitForVisible("[title*='Remove star']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт Remove star присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт Remove star присутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title*='Remove star']")
        .waitForExist("//div[2][@class='spheres-list-group']//span[contains(text(),'" + sphereName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("В первом табе: Удаление сферы " + sphereName + " из избранного", 1)},
                function(e){selena.regActionResult("В первом табе: Удаление сферы " + sphereName + " из избранного " + e.message, 0)}
            )
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.second)
    .sphereListOpen()
        .waitForExist("//div[2][@class='spheres-list-group']//span[contains(text(),'" + sphereName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Во втором табе: Удаление сферы " + sphereName + " из избранного", 1)},
                function(e){selena.regActionResult("Во втором табе: Удаление сферы " + sphereName + " из избранного " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    ;
    },
    message : "Add/Remove starred сферы"
}

testModule.tests.sphereQCLAddRemove = {
    call : function(sphereName) {
    return this
    .sphereDDOpen(sphereName)
    .waitForVisible("[title*='Add to starred']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт Show in quick create list присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт Show in quick create list присутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title*='Show in quick create list']")
        .waitForExist("//*[@title='Remove from quick create list']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Добавление " + sphereName + " в QCL (смена состояния пункта в DD сферы)", 1)},
                function(e){selena.regActionResult("Добавление " + sphereName + " в QCL (смена состояния пункта в DD сферы) " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
    .moveToObject("[role='mainButton']")
        .waitForExist("//*[@class='quick-sphere' and contains(text(),'S')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Сфера " + sphereName + " появилась в QCL", 1)},
                function(e){selena.regActionResult("Сфера " + sphereName + " появилась в QCL " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    
    .sphereListOpen()
    .sphereDDOpen(sphereName)
        .waitForVisible("[title*='Remove from quick create list']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Пункт Remove from quick create list присутствует в контекстном меню", 1)},
                function(e){selena.regActionResult("Пункт Remove from quick create list присутствует в контекстном меню " + e.message, 0)}
            )
    .click("[title*='Remove from quick create list']")
        .waitForExist("[title*='Show in quick create list']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Удаление " + sphereName + " из QCL (смена состояния пункта в DD сферы)", 1)},
                function(e){selena.regActionResult("Удаление " + sphereName + " из QCL (смена состояния пункта в DD сферы) " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])

    .switchTabAndCallback(tabMap.second)
    .moveToObject("[role='mainButton']")
        .isExisting("//*[@class='quick-sphere' and contains(text(),'S')]")
            .then(
                function(){selena.regActionResult("Сфера " + sphereName + " пропала из QCL", 1)},
                function(e){selena.regActionResult("Сфера " + sphereName + " пропала из QCL " + e.message, 0)}
            )
    .keys(["Escape"])
    .keys(["Escape"])
;
    },
    message : "Add/Remove starred сферы"
}


module.exports = testModule;