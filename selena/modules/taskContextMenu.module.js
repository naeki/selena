var selena = require("../clientExtended");

var LOGIN1 = 'vadim+0001@levelup.ru',
    PASS = '123123',
    TIMEOUT = 4000,
    taskName = 'T'+Date.now(),
    taskNameBefore = taskName,
    taskNameAfter = taskName+1,
    memberName = 'Vadim 0001',
    tagName = 't' + Date.now()
;


// Test module
testModule = {
    name : "checkTaskContextMenu",
    call : function(){
    return this
        .taskFocusUnFocus(taskName)
        .taskUnfollowFollow(taskName)
        .taskColorChange(taskName)
        .taskDeadlineAddTomorrow(taskName)
        .taskDeadlineAddToday(taskName)
        .taskDeadlineRemove(taskName)
        .taskMemberAddRemove(taskName, memberName)
        .taskTagAddRemove(taskName, tagName)
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
        return this
            .taskCreate(taskName)
            .taskDDOpen(taskName)
    },
    testClean : function(){
        return this
            .taskDeleteAll()
    },

    tests : {}
}

testModule.tests.taskFocusUnFocus = {
    call : function(taskName) {
    return this
    .waitForVisible("[title='Focus']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт Focus присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт Focus отсутствует в контекстном меню " + e.message)}
        )
    .click("[title='Focus']")
        .waitForExist("[title='Unfocus']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Карточка " + taskName + " добавлена в Focus (смена состояния пункта в DD карточки)", 1)},
                function(e){selena.regActionResult("Карточка " + taskName + " не добавлена в Focus (смена состояния пункта в DD карточки) " + e.message)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
    .notifListOpen()
        .waitForVisible("//*[@role='notifTitle' and contains(text(),'" + taskName + "')]/../../..//em[contains(text(),'F')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Наличие индикатора Focus у карточки " + taskName + " в списке нотификейшенов", 1)},
                function(e){selena.regActionResult("Наличие индикатора Focus у карточки " + taskName + " в списке нотификейшенов " + e.message)}
            )
    
    .click("//*[@role='notifTitle' and contains(text(),'" + taskName + "')]/../../..//em[contains(text(),'F')]")
        .waitForVisible("//*[@role='notifTitle' and contains(text(),'" + taskName + "')]/../../..//em[contains(text(),'F')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Клик на индикатор Focus у карточки " + taskName + " в списке нотификейшенов", 1)},
                function(e){selena.regActionResult("Клик на индикатор Focus у карточки " + taskName + " в списке нотификейшенов " + e.message)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.first)
    .taskDDOpen(taskName)
        .waitForVisible("[title='Focus']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Пункт изменился на Focus в контекстном меню карточки " + taskName, 1)},
                function(e){selena.regActionResult("Пункт не изменился на Focus в контекстном меню карточки" + taskName + " " + e.message)}
            )
    .keys(["Escape"])
    
    ;
    },
    message : "Focus/Unfocus карточки"
}

testModule.tests.taskUnfollowFollow = {
    call : function(taskName) {
    return this
    .waitForVisible("[title='Unfollow']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт Unfollow присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт Unfollow отсутствует в контекстном меню " + e.message)}
        )
    .click("[title='Unfollow']")
        .waitForVisible("[title='Follow']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка в первом табе: Пункт Unfollow сменился на Follow в контекстном меню карточки " + taskName, 1)},
                function(e){selena.regActionResult("Проверка в первом табе: Пункт Unfollow не сменился на Follow в контекстном меню карточки " + taskName + " " + e.message)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
    .taskDDOpen(taskName)
        .waitForVisible("[title='Follow']")
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Пункт Unfollow сменился на Follow в контекстном меню карточки " + taskName, 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Пункт Unfollow не сменился на Follow в контекстном меню карточки " + taskName + " " + e.message)}
            )
    .click("[title='Follow']")
        .waitForVisible("[title='Unfollow']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Пункт Follow сменился на Unfollow в контекстном меню карточки " + taskName, 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Пункт Follow не сменился на Unfollow в контекстном меню карточки " + taskName + " " + e.message)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.first)
    .taskDDOpen(taskName)
        .waitForVisible("[title='Unfollow']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка в первом табе: Пункт Follow сменился на Unfollow в контекстном меню карточки " + taskName, 1)},
                function(e){selena.regActionResult("Проверка в первом табе: Пункт Follow не сменился на Unfollow в контекстном меню карточки " + taskName + " " + e.message)}
            )
    .keys(["Escape"])
    
    ;
    },
    message : "Unfollow/Follow карточки"
}

testModule.tests.taskColorChange = {
    call : function(taskName) {
    return this
    .waitForVisible("em[data-value='2']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт выбора цвета присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт выбора цвета отсутствует в контекстном меню " + e.message)}
        )
    .click("em[data-value='2']")
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task' and contains(@style,'255, 103, 75')]//*[contains(text(),'" + taskName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Карточка " + taskName + " покрашена", 1)},
                function(e){selena.regActionResult("Карточка " + taskName + " не покрашена " + e.message)}
            )
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Смена цвета карточки"
}

testModule.tests.taskDeadlineAddTomorrow = {
    call : function(taskName) {
    return this
    .waitForVisible("//*[@role='menuDropdown']//*[@role='deadline' and @title='Tomorrow']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Пункт выставления дедлайна Tomorrow присутствует в контекстном меню", 1)},
            function(e){selena.regActionResult("Пункт выставления дедлайна Tomorrow отсутствует в контекстном меню " + e.message)}
        )
    .click("//*[@role='menuDropdown']//*[@role='deadline' and @title='Tomorrow']")
        .waitForVisible("//*[@role='menuDropdown']//*[@role='deadline' and @title='Tomorrow']", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Проверка в первом табе: Выбор дедлайна пропал из контекстного меню", 1)},
                function(e){selena.regActionResult("Проверка в первом табе: Выбор дедлайна не пропал из контекстного меню " + e.message)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='deadline']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Карточке " + taskName + " выставлен дедлайн Tomorrow", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Карточке " + taskName + " не выставлен дедлайн Tomorrow " + e.message)}
            )
    .switchTabAndCallback(tabMap.first)
    
    ;
    },
    message : "Выставление дедлайна Tomorrow"
}

testModule.tests.taskDeadlineAddToday = {
    call : function(taskName) {
    return this
        .waitForVisible("//*[@role='menuDropdown']//*[@role='deadline' and @title='Today']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Пункт выставления дедлайна Today присутствует в контекстном меню", 1)},
                function(e){selena.regActionResult("Пункт выставления дедлайна Today отсутствует в контекстном меню " + e.message)}
            )
    .click("//*[@role='menuDropdown']//*[@role='deadline' and @title='Today']")
        .waitForVisible("//*[@role='menuDropdown']//*[@role='deadline' and @title='Today']", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Проверка в первом табе: Выбор дедлайна пропал из контекстного меню", 1)},
                function(e){selena.regActionResult("Проверка в первом табе: Выбор дедлайна не пропал из контекстного меню " + e.message)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='deadline']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Карточке " + taskName + " выставлен дедлайн Today", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Карточке " + taskName + " не выставлен дедлайн Today " + e.message)}
            )
    .switchTabAndCallback(tabMap.first)
    
    ;
    },
    message : "Выставление дедлайна Today"
}

testModule.tests.taskDeadlineRemove = {
    call : function(taskName) {
    return this
    .click("//*[@role='menuDropdown']//*[@role='deadline' and @title='Today']")
        .waitForVisible("//*[@role='menuDropdown']//*[@role='deadline' and @title='Today']", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Дедлайна Today выставлен", 1)},
                function(e){selena.regActionResult("Дедлайна Today не выставлен " + e.message)}
            )
        
    .click("//*[@role='task']//*[@role='deadline']")
        .waitForExist("//*[@role='calendar']//*[@role='timeDrop']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Клик по дедлайну. Календарь открылся", 1)},
                function(e){selena.regActionResult("Клик по дедлайну. Календарь не открылся " + e.message)}
            )
    
    .click("//*[@role='calendar']//*[@role='timeDrop']")
        .waitForExist("//*[@role='calendar']", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Проверка в первом табе: Клик по крестику для удаления дедлайна и закрытие календаря", 1)},
                function(e){selena.regActionResult("Проверка в первом табе: Календарь не закрылся после клика по крестику " + e.message)}
            )
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='deadline']", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Дедлайн пропал у карточки в дереве", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Дедлайн не пропал у карточки в дереве " + e.message)}
            )
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Удаление дедлайна с предварительным его выставлением"
}

testModule.tests.taskMemberAddRemove = {
    call : function(taskName, memberName) {
    return this

        .waitForVisible("//*[@role='menuDropdown']//*[@role='member' and @title='" + memberName + "']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Мембер " + memberName + " присутствует в контекстном меню", 1)},
                function(e){selena.regActionResult("Мембер " + memberName + " отсутствует в контекстном меню " + e.message)}
            )
    .click("//*[@role='menuDropdown']//*[@role='member' and @title='" + memberName + "']")
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='member']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Member " + memberName + " добавлен к карточке " + taskName, 1)},
                function(e){selena.regActionResult("Member " + memberName + " не добавлен " + e.message)}
            )
    
    .switchTabAndCallback(tabMap.first)
    .click("//*[@role='task']//*[@role='member']")
        .waitForExist("//*[@role='task']//*[@role='member']", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Member " + memberName + " удален у карточки " + taskName, 1)},
                function(e){selena.regActionResult("Member " + memberName + " не удален " + e.message)}
            )
    
    ;
    },
    message : "Добавление и удаление мембера"
}

testModule.tests.taskTagCreate = {
    call : function(taskName, tagName) {
    return this

        .waitForVisible("[role='tagInput']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Инпут для создания нового тега присутствует в контекстном меню", 1)},
                function(e){selena.regActionResult("Инпут для создания нового тега отсутствует в контекстном меню " + e.message)}
            )
    .click("[role='tagInput']")
    .keys(tagName)
    .keys(["Enter"])
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='tag' and @title='" + tagName + "']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Тег " + tagName + " создан и добавлен к карточке " + taskName, 1)},
                function(e){selena.regActionResult("Инпут для создания нового тега отсутствует в контекстном меню " + e.message)}
            )
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Создание и добавление тега"
}

testModule.tests.taskTagAddRemove = {
    call : function(taskName, tagName) {
    return this

        .waitForVisible("//*[@role='menuDropdown']//*[@role='member' and @title='" + memberName + "']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Мембер " + memberName + " присутствует в контекстном меню", 1)},
                function(e){selena.regActionResult("Мембер " + memberName + " отсутствует в контекстном меню " + e.message)}
            )
    .click("//*[@role='menuDropdown']//*[@role='tag' and @title='" + tagName + "']")
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='tag']", TIMEOUT)
            .then(
                function(isExisting) {
                    console.log(isExisting, "Тег " + tagName + " добавлен к таску " + taskName);
                },
                function(error) {
                    console.log("taskTagAdd", error);
                }
            )
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Добавление и удаление тега"
}



module.exports = testModule;