client = require("../functions");

client.addCommand("chatHistoryMessageDDOpen", function (chatMessage) {
    return this
    .waitForExist(".message_fadein", TIMEOUT, true)
    .pause(100)
    .moveToObject("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]")
    .waitForVisible("[role='messageSettings']", TIMEOUT)
        .then(function (result) { result.should.equal(true, "Индикатор вызова контекстого меню сообщения не появился") })
    .click("[role='messageSettings']")
    .waitForVisible("[role='dropdown']", TIMEOUT)
        .then(function (result) { result.should.equal(true, "Дропдаун не появился") })
})


describe('Чат', function() {
		this.timeout(99999999);
    
    before(function() {
        return client
        .sessionStart()
        .loginCorrect(LOGIN1, PASS)
    })


    afterEach('sync() ', function () {
        return client.sync().pause(PAUSE)
    })
     
    after('end()', function() {
        return client.end()
    })
    
    
    describe('Написание сообщения в чат', function () {
    
        before('(A) Создание карточки, ее открытие и поиск инпута чата', function() {
            return browserA
            .taskCreate(taskName)
            .taskCardOpen(taskName)
            .waitForVisible("//*[@role='messageInput']", TIMEOUT)
            .then(function () {
                return browserB.taskCardOpen(taskName)
            })
        })
        
        after('(A) Удаление карточки', function () {
            client.escape()
            return browserA.deleteAll('tasks')
        })
                
        it('(A) Ввод сообщения', function() {
            return browserA
            .keys(chatMessage)
            .getText("//*[@role='messageInput']")
                 .then(function (text) { text.should.equal(chatMessage, "Введеное сообщение не соответствует") })
        })
        
        it('(A) Отправка сообщения', function() {
            return browserA
            .keys(["Enter"])
            .waitForVisible("//*[@role='messageInput'][contains(text(),'" + chatMessage + "')]", TIMEOUT, true)
        })

        it('(AB) Проверка', function () {
            return client
            .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
        })
    })
    
    describe('Контекстное меню отправленного сообщения', function () {
        
        before('(A) Создание карточки, ее открытие, поиск инпута чата и отправка сообщения', function() {
            return browserA
            .taskCreate(taskName)
            .taskCardOpen(taskName)
            .waitForVisible("//*[@role='messageInput']", TIMEOUT)
            .keys(chatMessage)
            .keys(["Enter"])
            .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
        })
        
        after('(A) Удаление карточки', function () {
            client.escape()
            return browserA.deleteAll('tasks')
        })
        
        describe('Открытие меню', function () {
            
            it('(A) Дожидаемся получения подтверждения с сервера отправки сообщения', function() {
                return browserA
                .waitForVisible(".message_fadein", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, "Сообщение осталось неподтвержденным от сервера (бледным)") })
            })

            it('(A) Наводим на сообщение, ждем появления индикатора контекстного меню', function() {
                return browserA
                .moveToObject("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]")
                .waitForVisible("[role='messageSettings']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, "Индикатор вызова контекстого меню сообщения не появился") })
            })

            it('(A) Кликаем на индикатор и ждем контекстного меню', function() {
                return browserA
                .click("[role='messageSettings']")
                .waitForVisible("[role='dropdown']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, "Дропдаун не появился") })
            })
        })
        
        describe('Пункты меню (наличие)', function () {
            var params = [
              , { testName : 'Edit', selector : '[title="Edit"]' }
              , { testName : 'Remove', selector : '[title="Remove"]' }
              , { testName : 'New card', selector : '[title="New card"]' }
              , { testName : 'Add to this card', selector : '[title="Add to this card"]' }
            ];

            params.forEach(function (arr) {
                it(arr.testName, function() {
                    return browserA
                    .isExisting(arr.selector)
                        .then(function (result) { result.should.equal(true, 'Пункт ' + arr.testName + ' не найден') })

                })
            })
        })
    })
    
    describe('Редактирование отправленного сообщения', function () {
        var chatMessageBefore = MESSAGE1
          , chatMessageAfter = MESSAGE2
          ;
    
        before('(A) Создание карточки, ее открытие, поиск инпута чата, отправка сообщения и открытие контекстного меню', function() {
            return browserA
            .taskCreate(taskName)
            .taskCardOpen(taskName)
            .waitForVisible("//*[@role='messageInput']", TIMEOUT)
            .keys(chatMessageBefore)
            .keys(["Enter"])
            .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessageBefore + "')]", TIMEOUT)
            .chatHistoryMessageDDOpen(chatMessageBefore)
            .then(function () {
                return browserB.taskCardOpen(taskName)
            })
        })
        
        after('(A) Удаление карточки', function () {
            client.escape()
            return browserA.deleteAll('tasks')
        })
    
        it('(A) Начало редактирования (клик на Edit)', function() {
            return browserA
            .click("//*[@role='dropdown']//*[@title='Edit']")
            .waitForVisible("//*[@contenteditable='true' and @role='messageHistory']", TIMEOUT)
                .then(function (result) { result.should.equal(true, "Редактирование отправленного сообщения не началось") })
            .getText("//*[@contenteditable='true' and @role='messageHistory']")
                .then(function (text) { text.should.equal(chatMessageBefore, "Текст в сообщении не соответствует") })
        })
        
        it('(A) Очищаем и вписываем новое сообщение', function() {
            return browserA
            .clearElement("//*[@contenteditable='true' and @role='messageHistory']")
            .keys(chatMessageAfter)
            .getText("//*[@contenteditable='true' and @role='messageHistory']")
                .then(function (text) { text.should.equal(chatMessageAfter, "Текст в инпуте редактирования не соответствует") })
        })
                
        it('(A) Сохраняем изменения', function() {
            return browserA
            .keys(["Enter"]).keys(["Enter"])
            .waitForVisible("//*[@contenteditable='true' and @role='messageHistory']", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, "Редактирование не завершено") })
        })
        
        it('(AB) Проверяем сохраненное сообщение', function() {
            return client
            .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessageAfter + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, "Отредактирование сообщение не сохранилось") })
        })
        
    })
    
    describe('Удаление отправленного сообщения', function () {
        
        describe('Через пункт контекстного меню', function () {
    
            before('(A) Создание карточки, ее открытие, поиск инпута чата, отправка сообщения и открытие контекстного меню', function() {
                return browserA
                .taskCreate(taskName)
                .taskCardOpen(taskName)
                .waitForVisible("//*[@role='messageInput']", TIMEOUT)
                .keys(chatMessage)
                .keys(["Enter"])
                .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
                .chatHistoryMessageDDOpen(chatMessage)
                .then(function () {
                    return browserB.taskCardOpen(taskName)
                })
            })

            after('(A) Удаление карточки', function () {
                client.escape()
                return browserA.deleteAll('tasks')
            })

            it('(A) Клик на Remove и закрытие контекстного меню', function() {
                return browserA
                .click("//*[@role='dropdown']//*[@title='Remove']")
                .waitForExist("//*[@role='dropdown']//*[@title='Remove']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, "Дропдаун не закрылся") })
            })

            it('(AB) Проверка удаления', function() {
                return browserA
                .waitForVisible("[class*='deleted']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, "Отметка об удаленном сообщении не появилась") })
            })
        })
        
        describe('Через сохранение пустого сообщения', function () {
    
            before('(A) Создание карточки, ее открытие, поиск инпута чата, отправка сообщения, открытие контекстного меню и активация редактирования', function() {
                return browserA
                .taskCreate(taskName)
                .taskCardOpen(taskName)
                .waitForVisible("//*[@role='messageInput']", TIMEOUT)
                .keys(chatMessage)
                .keys(["Enter"])
                .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
                .chatHistoryMessageDDOpen(chatMessage)
                .click("//*[@role='dropdown']//*[@title='Edit']")
                .waitForVisible("//*[@contenteditable='true' and @role='messageHistory']", TIMEOUT)
                .then(function (result) { result.should.equal(true, "Редактирование отправленного сообщения не началось") })
                .then(function () {
                    return browserB.taskCardOpen(taskName)
                })
            })

            after('(A) Удаление карточки', function () {
                client.escape()
                return browserA.deleteAll('tasks')
            })
                    
            it('(A) Очищаем', function() {
                return browserA
                .clearElement("//*[@contenteditable='true' and @role='messageHistory']")
                .getText("//*[@contenteditable='true' and @role='messageHistory']")
                    .then(function (text) { text.should.equal('', "Инпут редактируемого сообщения не очистился") })
            })

            it('(A) Сохраняем изменения', function() {
                return browserA
                .keys(["Enter"]).keys(["Enter"])
                .waitForVisible("//*[@contenteditable='true' and @role='messageHistory']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, "Редактирование не завершено") })
            })

            it('(AB) Проверка удаления', function() {
                return browserA
                .waitForVisible("[class*='deleted']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, "Отметка об удаленном сообщении не появилась") })
            })
        })

    })
    
    describe('Создание карточки из отправленного сообщения', function () {
    
        before('(A) Создание карточки, ее открытие, поиск инпута чата, отправка сообщения и открытие контекстного меню', function() {
            return browserA
            .taskCreate(taskName)
            .taskCardOpen(taskName)
            .waitForVisible("//*[@role='messageInput']", TIMEOUT)
            .keys(chatMessage)
            .keys(["Enter"])
            .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
            .chatHistoryMessageDDOpen(chatMessage)
            .then(function () {
                return browserB.taskCardOpen(taskName)
            })
        })
        
        after('(A) Удаление карточки', function () {
            client.escape()
            return browserA.deleteAll('tasks')
        })

        it('(A) Клик на пункт и закрытие контекстного меню', function() {
            return browserA
            .click("//*[@role='dropdown']//*[@title='New card']")
            .waitForExist("//*[@role='dropdown']//*[@title='New card']", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, "Дропдаун не закрылся") })
        })

        it('(A) Переход в созданного ребенка', function() {
            return browserA
            .waitForVisible("//*[@role='cardTitle' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, "Новая карточка не открылась") })
        })

        it('(B) Появление карточки в хистори родителя', function() {
            return browserB
            .waitForVisible("//*[@role='title' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, "Ребенок (карточка) не появился в хистории") })
        })
    })

    describe.skip('Другие кейсы', function () {
    
        before('(A) Создание карточки, ее открытие и поиск инпута чата', function() {
            return browserA
            .taskCreate(taskName)
            .taskCardOpen(taskName)
            .then(function () {
                return browserB.taskCardOpen(taskName)
            })
        })
        
        after('(A) Удаление карточки', function () {
            client.escape()
            return browserA.deleteAll('tasks')
        })
    
        it('Архивация/Разархивация карточки первого уровня и проверка изменения состояния в чате сферы', function() {
            return client
            .waitForVisible("[role='archive']", TIMEOUT)
            .click("[role='archive']")
            .waitForVisible("[role='extract']", TIMEOUT)

            .switchTabAndCallback(tabMap.second)
            .sphereChatOpenCurrent()
                .waitForExist("//*[@role='task' and contains(@class,'task_archived')]//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT)

            .switchTabAndCallback(tabMap.first)
            .click("[role='extract']")
            .waitForVisible("[role='archive']", TIMEOUT)

            .switchTabAndCallback(tabMap.second)
            .waitForExist("//*[@role='task' and contains(@class,'task_archived')]//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT, true)
            .escape()

            .switchTabAndCallback(tabMap.first)
            .escape()
        })

        it('Удаление/восстановление карточки первого уровня и проверка изменения состояния в чате сферы', function() {
            return client
            .waitForVisible("[role='delete']", TIMEOUT)
            .click("[role='delete']")
            .waitForVisible("[role='recover']", TIMEOUT)

            .switchTabAndCallback(tabMap.second)
            .sphereChatOpenCurrent()
                .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT, true) // Проверка в чате сферы: Карточка " + taskName + " удалилась

            .switchTabAndCallback(tabMap.first)
            .click("[role='recover']")
            .waitForVisible("[role='delete']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Клик на Recover. Cменилась на Delete", 1)},
                    function(e){selena.regActionResult("Клик на Recover. Не сменилась на Delete", e.message, 0)}
                )

            .switchTabAndCallback(tabMap.second)
            .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT) // Проверка в чате сферы: Карточка " + taskName + " восстановилась

            .escape()
            .switchTabAndCallback(tabMap.first)
            .escape()
        })
    })
})