'user strict';

client = require("../functions");

client.addCommand("chatHistoryMessageDDOpen", function (chatMessage) {
    return this
    .waitForExist(".message_fadein", TIMEOUT, true)
    .pause(100)
    .moveToObject(`//*[@role='messageHistory' and contains(text(),'${chatMessage}')]`)
    .waitForVisible("[role='messageSettings']", TIMEOUT).then(result =>
        result.should.equal(true, "Индикатор вызова контекстого меню сообщения не появился") )
    .click("[role='messageSettings']")
    .waitForVisible("[role='dropdown']", TIMEOUT).then(result =>
        result.should.equal(true, "Дропдаун не появился") )
})


describe('Чат', function () {
    this.timeout(99999999)
    
    before( () => client.loginCorrect(LOGIN1, PASS) )

    afterEach( 'sync()', () => client.sync().pause(PAUSE) )

    after( 'logout()', () => client.logout() )
    
    describe('Написание сообщения в чат', () => {
    
        before('(A) Создание карточки, ее открытие и поиск инпута чата', () =>
            browserA
            .taskCreate(taskName)
            .then( () => browserB.taskCardOpen(taskName) )
            .taskCardOpen(taskName)
            .waitForVisible("//*[@role='messageInput']", TIMEOUT)
        )
        
        after('(A) Удаление карточки', () => {
            client.escape()
            return browserA.deleteAll('tasks')
        })
                
        it('(A) Ввод сообщения', () =>
            browserA
            .keys(chatMessage)
            .getText("//*[@role='messageInput']").then( text =>
                 text.should.equal(chatMessage, "Введеное сообщение не соответствует") )
        )
        
        it('(A) Отправка сообщения', () =>
            browserA
            .keys(["Enter"])
            .waitForVisible(`//*[@role='messageInput'][contains(text(),'${chatMessage}')]`, TIMEOUT, true)
        )

        it('(AB) Проверка', () =>
            client
            .waitForVisible(`//*[@role='messageHistory' and contains(text(),'${chatMessage}')]`, TIMEOUT)
                .then(result => {
                    result.browserA.should.equal(true, 'Сообщение в чате не найдено')
                    result.browserB.should.equal(true, 'Сообщение в чате не найдено')
                })
        )
    })
    
    describe('Контекстное меню отправленного сообщения', () => {
        
        before('(A) Создание карточки, ее открытие, поиск инпута чата и отправка сообщения', () =>
            browserA
            .taskCreate(taskName)
            .taskCardOpen(taskName)
            .waitForVisible("//*[@role='messageInput']", TIMEOUT)
            .keys(chatMessage)
            .keys(["Enter"])
            .waitForVisible(`//*[@role='messageHistory' and contains(text(),'${chatMessage}')]`, TIMEOUT)
        )
        
        after('(A) Удаление карточки', () => {
            client.escape()
            return browserA.deleteAll('tasks')
        })
        
        describe('Открытие меню', () => {
            
            it('(A) Дожидаемся получения подтверждения с сервера отправки сообщения', () =>
                browserA
                .waitForVisible(`.message_fadein`, TIMEOUT, true).then(result =>
                    result.should.equal(true, "Сообщение осталось неподтвержденным от сервера (бледным)") )
            )

            it('(A) Наводим на сообщение, ждем появления индикатора контекстного меню', () =>
                browserA
                .moveToObject(`//*[@role='messageHistory' and contains(text(),'${chatMessage}')]`)
                .waitForVisible("[role='messageSettings']", TIMEOUT).then(result =>
                    result.should.equal(true, "Индикатор вызова контекстого меню сообщения не появился") )
            )

            it('(A) Кликаем на индикатор и ждем контекстного меню', () =>
                browserA
                .click("[role='messageSettings']")
                .waitForVisible("[role='dropdown']", TIMEOUT).then(result =>
                    result.should.equal(true, "Дропдаун не появился") )
            )
        })
        
        describe('Пункты меню (наличие)', () => {
            let params = [
              , { testName : 'Edit', selector : '[title="Edit"]' }
              , { testName : 'Remove', selector : '[title="Remove"]' }
              , { testName : 'New card', selector : '[title="New card"]' }
              , { testName : 'Add to this card', selector : '[title="Add to this card"]' }
            ];

            params.forEach( (arr) => {
                it(arr.testName, () =>
                    browserA
                    .isExisting(arr.selector).then(result =>
                        result.should.equal(true, `Пункт ${arr.testName} не найден`) )

                )
            })
        })
    })
    
    describe('Редактирование отправленного сообщения', () => {
        let chatMessageBefore = MESSAGE1
          , chatMessageAfter = MESSAGE2
          ;
    
        before('(A) Создание карточки, ее открытие, поиск инпута чата, отправка сообщения и открытие контекстного меню',  () =>
            browserA
            .taskCreate(taskName)
            .then( () => browserB.taskCardOpen(taskName) )
            .taskCardOpen(taskName)
            .waitForVisible("//*[@role='messageInput']", TIMEOUT)
            .keys(chatMessageBefore)
            .keys(["Enter"])
            .waitForVisible(`//*[@role='messageHistory' and contains(text(),'${chatMessageBefore}')]`, TIMEOUT)
            .chatHistoryMessageDDOpen(chatMessageBefore)
        )
        
        after('(A) Удаление карточки', () => {
            client.escape()
            return browserA.deleteAll('tasks')
        })
    
        it('(A) Начало редактирования (клик на Edit)', () =>
            browserA
            .click("//*[@role='dropdown']//*[@title='Edit']")
            .waitForVisible("//*[@contenteditable='true' and @role='messageHistory']", TIMEOUT).then(result =>
                result.should.equal(true, "Редактирование отправленного сообщения не началось") )
            .getText("//*[@contenteditable='true' and @role='messageHistory']").then( text =>
                text.should.equal(chatMessageBefore, "Текст в сообщении не соответствует") )
        )
        
        it('(A) Очищаем и вписываем новое сообщение', () =>
            browserA
            .clearElement("//*[@contenteditable='true' and @role='messageHistory']")
            .keys(chatMessageAfter)
            .getText("//*[@contenteditable='true' and @role='messageHistory']").then( text =>
                text.should.equal(chatMessageAfter, "Текст в инпуте редактирования не соответствует") )
        )
                
        it('(A) Сохраняем изменения', () =>
            browserA
            .keys(["Enter"]).keys(["Enter"])
            .waitForVisible("//*[@contenteditable='true' and @role='messageHistory']", TIMEOUT, true).then(result =>
                result.should.equal(true, "Редактирование не завершено") )
        )
        
        it('(AB) Проверяем сохраненное сообщение', () =>
            client
            .waitForVisible(`//*[@role='messageHistory' and contains(text(),'${chatMessageAfter}')]`, TIMEOUT).then(result => {
                result.browserA.should.equal(true, "Отредактирование сообщение не сохранилось")
                result.browserB.should.equal(true, "Отредактирование сообщение не сохранилось")
            })
        )
        
    })
    
    describe('Удаление отправленного сообщения', () => {
        
        describe('Через пункт контекстного меню', () => {
    
            before('(A) Создание карточки, ее открытие, поиск инпута чата, отправка сообщения и открытие контекстного меню', () =>
                browserA
                .taskCreate(taskName)
                .then( () => browserB.taskCardOpen(taskName) )
                .taskCardOpen(taskName)
                .waitForVisible("//*[@role='messageInput']", TIMEOUT)
                .keys(chatMessage)
                .keys(["Enter"])
                .waitForVisible(`//*[@role='messageHistory' and contains(text(),'${chatMessage}')]`, TIMEOUT)
                .chatHistoryMessageDDOpen(chatMessage)
            )

            after('(A) Удаление карточки', () => {
                client.escape()
                return browserA.deleteAll('tasks')
            })

            it('(A) Клик на Remove и закрытие контекстного меню', () =>
                browserA
                .click("//*[@role='dropdown']//*[@title='Remove']")
                .waitForExist("//*[@role='dropdown']//*[@title='Remove']", TIMEOUT, true).then(result =>
                    result.should.equal(true, "Дропдаун не закрылся") )
            )

            it('(AB) Проверка удаления', () =>
                client
                .waitForVisible("[class*='deleted']", TIMEOUT).then(result => {
                    result.browserA.should.equal(true, "Отметка об удаленном сообщении не появилась")
                    result.browserB.should.equal(true, "Отметка об удаленном сообщении не появилась")
                })
            )
        })
        
        describe('Через сохранение пустого сообщения', () => {
    
            before('(A) Создание карточки, ее открытие, поиск инпута чата, отправка сообщения, открытие контекстного меню и активация редактирования', () =>
                browserA
                .taskCreate(taskName)
                .then( () => browserB.taskCardOpen(taskName) )
                .taskCardOpen(taskName)
                .waitForVisible("//*[@role='messageInput']", TIMEOUT)
                .keys(chatMessage)
                .keys(["Enter"])
                .waitForVisible(`//*[@role='messageHistory' and contains(text(),'${chatMessage}')]`, TIMEOUT)
                .chatHistoryMessageDDOpen(chatMessage)
                .click("//*[@role='dropdown']//*[@title='Edit']")
                .waitForVisible("//*[@contenteditable='true' and @role='messageHistory']", TIMEOUT).then(result =>
                    result.should.equal(true, "Редактирование отправленного сообщения не началось") )
            )

            after('(A) Удаление карточки', () => {
                client.escape()
                return browserA.deleteAll('tasks')
            })
                    
            it('(A) Очищаем', () =>
                browserA
                .clearElement("//*[@contenteditable='true' and @role='messageHistory']")
                .getText("//*[@contenteditable='true' and @role='messageHistory']").then( text =>
                    text.should.equal('', "Инпут редактируемого сообщения не очистился") )
            )

            it('(A) Сохраняем изменения', () =>
                browserA
                .keys(["Enter"]).keys(["Enter"])
                .waitForVisible("//*[@contenteditable='true' and @role='messageHistory']", TIMEOUT, true).then(result =>
                    result.should.equal(true, "Редактирование не завершено") )
            )

            it('(AB) Проверка удаления', () =>
                client
                .waitForVisible("[class*='deleted']", TIMEOUT).then(result => {
                    result.browserA.should.equal(true, "Отметка об удаленном сообщении не появилась")
                    result.browserB.should.equal(true, "Отметка об удаленном сообщении не появилась")
                })
            )
        })

    })
    
    describe('Создание карточки из отправленного сообщения', () => {
    
        before('(A) Создание карточки, ее открытие, поиск инпута чата, отправка сообщения и открытие контекстного меню', () =>
            browserA
            .taskCreate(taskName)
            .then( () => browserB.taskCardOpen(taskName) )
            .taskCardOpen(taskName)
            .waitForVisible("//*[@role='messageInput']", TIMEOUT)
            .keys(chatMessage)
            .keys(["Enter"])
            .waitForVisible(`//*[@role='messageHistory' and contains(text(),'${chatMessage}')]`, TIMEOUT)
            .chatHistoryMessageDDOpen(chatMessage)
        )
        
        after('(A) Удаление карточки', () => {
            client.escape()
            return browserA.deleteAll('tasks')
        })

        it('(A) Клик на пункт и закрытие контекстного меню', () =>
            browserA
            .click("//*[@role='dropdown']//*[@title='New card']")
            .waitForExist("//*[@role='dropdown']//*[@title='New card']", TIMEOUT, true).then(result =>
                result.should.equal(true, "Дропдаун не закрылся") )
        )

        it('(A) Переход в созданного ребенка', () =>
            browserA
            .waitForVisible(`//*[@role='cardTitle' and contains(text(),'${chatMessage}')]`, TIMEOUT).then(result =>
                result.should.equal(true, "Новая карточка не открылась") )
        )

        it('(B) Появление карточки в хистори родителя', () =>
            browserB
            .waitForVisible(`//*[@role='title' and contains(text(),'${chatMessage}')]`, TIMEOUT).then(result =>
                result.should.equal(true, "Ребенок (карточка) не появился в хистории") )
        )
    })

    describe.skip('Другие кейсы', () => {
    
        before('(A) Создание карточки, ее открытие и поиск инпута чата', () => {
            browserA
            .taskCreate(taskName)
            .taskCardOpen(taskName)
            .then( () => browserB.taskCardOpen(taskName) )
        })
        
        after('(A) Удаление карточки', () => {
            client.escape()
            return browserA.deleteAll('tasks')
        })
    
        it('Архивация/Разархивация карточки первого уровня и проверка изменения состояния в чате сферы', () =>
            client
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
        )

        it('Удаление/восстановление карточки первого уровня и проверка изменения состояния в чате сферы', () =>
            client
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
                    () =>{selena.regActionResult("Клик на Recover. Cменилась на Delete", 1)},
                    function (e){selena.regActionResult("Клик на Recover. Не сменилась на Delete", e.message, 0)}
                )

            .switchTabAndCallback(tabMap.second)
            .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT) // Проверка в чате сферы: Карточка " + taskName + " восстановилась

            .escape()
            .switchTabAndCallback(tabMap.first)
            .escape()
        )
    })
})