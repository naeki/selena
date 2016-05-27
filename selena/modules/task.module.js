var selena = require("../clientExtended");

// Test module
testModule = {
    name : "checkTask",
    call : function(){
        
        selena.addFunction(this, "task_check", function(role) {
            return this
                .waitForVisible("[role='" + role + "']", TIMEOUT)
                    .then(
                        function(){selena.regActionResult("Пункт " + role + " присутствует в карточке", 1)},
                        function(e){selena.regActionResult("Пункт " + role + " отсутствует в карточке " + e.message, 0, true)}
                    )
        }, true);
        
        selena.addFunction(this, "task_click", function(role) {
            return this
                .click("[role='" + role + "']")
                    .then(
                          function(){selena.regActionResult("Клик на пункт " + role + " в контектном меню", 1)}
                    )
        }, true);
        
    return this
        .taskRename(taskNameBefore, taskNameAfter)
        .taskDeleteRecover(taskName)
        .taskArchiveExtract(taskName)
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
    },
    testClean : function(){
        return this
            .taskDeleteAll()
    },

    tests : {}
}


testModule.tests.taskRename = {
    call : function(taskNameBefore, taskNameAfter) {
    return this
    
    .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]")
        .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[@role='editButton']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Кнопка редактирования карточки " + taskNameBefore + " появилась при наведении на карточку", 1)},
                function(e){selena.regActionResult("Кнопка редактирования карточки " + taskNameBefore + " не появилась при наведении на карточку " + e.message, 0, true)}
            )
    .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[@role='editButton']")
        .waitForVisible(".in-edit", TIMEOUT)
            .then(
                function(){selena.regActionResult("Клик по кнопке редактирования карточки " + taskNameBefore + ". Начало редактирования (инпут активен)", 1)},
                function(e){selena.regActionResult("Клик по кнопке редактирования карточки " + taskNameBefore + ". Редактирование не началось (инпут неактивен) " + e.message, 0, true)}
            )
    .clearElement("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]")
    .keys(taskNameAfter)
            .then(
                function(){selena.regActionResult("Новое название " + taskNameAfter + " введено", 1)}
            )
    .circleListOpen("Открытие списка кругов для блюра и завершения редактирования карточки")
    
    .switchTabAndCallback(tabMap.second)
        .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameAfter + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка в дереве во втором табе: Карточка " + taskNameBefore + " переименована в " + taskNameAfter, 1)},
                function(e){selena.regActionResult("Проверка в дереве во втором табе: Карточка " + taskNameBefore + " не переименована в " + taskNameAfter + e.message, 0, true)}
            )
    .switchTabAndCallback(tabMap.first)
    
    ;
    },
    message : "Переименование карточки"
}

testModule.tests.taskDeleteRecover = {
    call : function(taskName) {
    return this
        
    .taskCardOpen(taskName)
    .task_check('delete')
    .task_click('delete')
    .task_check('recover')
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Карточка " + taskName + " пропала из дерева", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Карточка " + taskName + " не пропала из дерева " + e.message, 0, true)}
            )
    
    .switchTabAndCallback(tabMap.first)
    .task_click('recover')
    .task_check('delete')
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Карточка " + taskName + " появилась в дереве", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Карточка " + taskName + " не появилась в дереве " + e.message, 0, true)}
            )
    
    .switchTabAndCallback(tabMap.first)
    
    ;
    },
    message : "Удаление/Восстановление карточки из открытой карточки"
}

testModule.tests.taskArchiveExtract = {
    call : function(taskName) {
    return this
        
    .taskCardOpen(taskName)
    .task_check('archive')
    .task_click('archive')
    .task_check('extract')
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Карточка " + taskName + " пропала из дерева", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Карточка " + taskName + " не пропала из дерева " + e.message, 0, true)}
            )
    
    .switchTabAndCallback(tabMap.first)
    .task_click('extract')
    .task_check('archive')
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Карточка " + taskName + " появилась в дереве", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Карточка " + taskName + " не появилась в дереве " + e.message, 0, true)}
            )
    
    .switchTabAndCallback(tabMap.first)
    
    ;
    },
    message : "Архивация/Разархиваиця карточки из открытой карточки"
}



module.exports = testModule;