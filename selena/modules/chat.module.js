var selena = require("../clientExtended");

// Test module
testModule = {
    name : "Chat",
    call : function(){
    return this
        .chatMessageWriteDraft(taskName, chatMessage)
        .chatMessageSend(taskName, chatMessage)
        .chatChildArchiveExtract(taskName)
        .chatChildDeleteRecover(taskName)
        .chatMessageEdit(taskName, MESSAGE1, MESSAGE2)
        .chatHistoryCardCreate(taskName, chatMessage)
        .chatHistoryMessageDelete(taskName, chatMessage)
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
            .taskCardOpen(taskName)
    },
    testClean : function(){
        return this
            .keys(["Escape"])
            .taskDeleteAll()
    },

    tests : {}
}

testModule.tests.chatMessageWriteDraft = {
  call : function(taskName, chatMessage) {
  return this

        .waitForVisible("//*[@role='messageInput']", TIMEOUT)
    .keys(chatMessage)
        .waitForVisible("//*[@role='messageInput'][contains(text(),'" + chatMessage + "')]", TIMEOUT)
        .then(
            function(){selena.regActionResult("Cообщение " + chatMessage + " введено в инпут. Закрываем карточку для сохранения драфта.", 1)},
            function(e){selena.regActionResult("Cообщение " + chatMessage + " не введено в инпут", e.message, 0)}
        )
    .keys(["Escape"])

    .switchTabAndCallback(tabMap.second)
    .taskCardOpen(taskName)
        .waitForVisible("[role='draft']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Проверка во втором табе: Индикатор draft появился в чате карточки " + taskName, 1)},
            function(e){selena.regActionResult("Проверка во втором табе: Индикатор draft не появился в чате карточки " + taskName + "", e.message, 0)}
        )
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)

    ;
    },
    message : "Написание сообщения в чат и сохранение драфта сообщения"
}

testModule.tests.chatMessageSend = {
  call : function(taskName, chatMessage) {
  return this

  .keys(chatMessage)
    .waitForVisible("//*[@role='messageInput'][contains(text(),'" + chatMessage + "')]", TIMEOUT)
      .then(
        function(){selena.regActionResult("Cообщение " + chatMessage + " введено в инпут. Нажимаем Send.", 1)},
        function(e){selena.regActionResult("Cообщение " + chatMessage + " не введено в инпут", e.message, 0)}
      )
  .keys(["Enter"])
    .waitForVisible("//*[@role='messageInput'][contains(text(),'" + chatMessage + "')]", TIMEOUT, true)
      .then(
        function(){selena.regActionResult("Cообщение " + chatMessage + " пропало из инпута", 1)},
        function(e){selena.regActionResult("Cообщение " + chatMessage + " не пропало из инпута", e.message, 0)}
      )
  .keys(["Escape"])

  .switchTabAndCallback(tabMap.second)
  .taskCardOpen(taskName)
    .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
      .then(
        function(){selena.regActionResult("Проверка во втором табе: Сообщение " + chatMessage + " появилось в истории карточки " + taskName, 1)},
        function(e){selena.regActionResult("Проверка во втором табе: Сообщение " + chatMessage + " появилось в истории карточки " + taskName + "", e.message, 0)}
      )
  .keys(["Escape"])
  .switchTabAndCallback(tabMap.first)

  ;
  },
  message : "Написание сообщения в чат и отправка"
}

testModule.tests.chatChildArchiveExtract = {
    call : function(taskName) {
    return this
    
        .waitForVisible("[role='archive']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Кнопка архивации доступна", 1)},
                function(e){selena.regActionResult("Кнопка архивации не доступна", e.message, 0)}
            )
    .click("[role='archive']")
        .waitForVisible("[role='extract']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Клик на Archive. Cменилась на Extract", 1)},
                function(e){selena.regActionResult("Клик на Archive. Не сменилась на Extract", e.message, 0)}
            )
    
    .switchTabAndCallback(tabMap.second)
    .sphereChatOpenCurrent()
        .waitForExist("//*[@role='task' and contains(@class,'task_archived')]//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка в чате сферы: Карточка " + taskName + " заархивировалась", 1)},
                function(e){selena.regActionResult("Проверка в чате сферы: Карточка " + taskName + " не заархивировалась", e.message, 0)}
            )
    
    .switchTabAndCallback(tabMap.first)
    .click("[role='extract']")
        .waitForVisible("[role='archive']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Клик на Extract. Cменилась на Archive", 1)},
                function(e){selena.regActionResult("Клик на Extract. Не сменилась на Archive", e.message, 0)}
            )
    
    .switchTabAndCallback(tabMap.second)
    .waitForExist("//*[@role='task' and contains(@class,'task_archived')]//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Проверка в чате сферы: Карточка " + taskName + " разархивировалась", 1)},
                function(e){selena.regActionResult("Проверка в чате сферы: Карточка " + taskName + " не разархивировалась", e.message, 0)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Архивация/Разархивация карточки первого уровня и проверка изменения состояния в чате сферы"
}

testModule.tests.chatChildDeleteRecover = {
    call : function(taskName) {
    return this
    
        .waitForVisible("[role='delete']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Кнопка удаления доступна", 1)},
                function(e){selena.regActionResult("Кнопка удаления не доступна", e.message, 0)}
            )
    .click("[role='delete']")
        .waitForVisible("[role='recover']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Клик на Delete. Cменилась на Recover", 1)},
                function(e){selena.regActionResult("Клик на Delete. Не сменилась на Recover", e.message, 0)}
            )
    
    .switchTabAndCallback(tabMap.second)
    .sphereChatOpenCurrent()
        .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Проверка в чате сферы: Карточка " + taskName + " удалилась", 1)},
                function(e){selena.regActionResult("Проверка в чате сферы: Карточка " + taskName + " не удалилась", e.message, 0)}
            )
    
    .switchTabAndCallback(tabMap.first)
    .click("[role='recover']")
        .waitForVisible("[role='delete']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Клик на Recover. Cменилась на Delete", 1)},
                function(e){selena.regActionResult("Клик на Recover. Не сменилась на Delete", e.message, 0)}
            )
    
    .switchTabAndCallback(tabMap.second)
        .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка в чате сферы: Карточка " + taskName + " восстановилась", 1)},
                function(e){selena.regActionResult("Проверка в чате сферы: Карточка " + taskName + " не восстановилась", e.message, 0)}
            )
    
    .keys(["Escape"])
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Удаление/восстановление карточки первого уровня и проверка изменения состояния в чате сферы"
}

testModule.tests.chatMessageEdit = {
    call : function(taskName, chatMessageBefore, chatMessageAfter) {
    return this
    
    .keys(chatMessageBefore)
    .keys(["Enter"])
        .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessageBefore + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Сообщение " + chatMessageBefore + " отправлено и появилось в истории карточки " + taskName, 1)},
                function(e){selena.regActionResult("Сообщение " + chatMessageBefore + " не появилось в истории карточки " + taskName + "", e.message, 0)}
            )

    .chatHistoryMessageDDOpen(chatMessageBefore, "Edit")
    
    .click("//*[@role='dropdown']//*[@title='Edit']")
        .waitForVisible("//*[@contenteditable='true' and contains(text(),'" + chatMessageBefore + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Клик на пункте Edit. Редактирование сообщения " + chatMessageBefore + " активировалось.", 1)},
                function(e){selena.regActionResult("Клик на пункте Edit. Редактирование сообщения " + chatMessageBefore + " не активировалось.", e.message, 0)}
            )
    .click("//*[@role='messageHistory' and contains(text(),'" + chatMessageBefore + "')]")
    .keys(chatMessageAfter)
    .keys(["Enter"])
    .keys(["Enter"])
        .waitForVisible("//*[@contenteditable='true' and contains(text(),'" + chatMessageBefore + "')]", TIMEOUT, true)
            .then(
                function(){selena.regActionResult("Ввод " + chatMessageAfter + ". Сообщение " + chatMessageBefore + chatMessageAfter + " сохранилось.", 1)},
                function(e){selena.regActionResult("Ввод " + chatMessageAfter + ". Сообщение " + chatMessageBefore + chatMessageAfter + " не сохранилось.", e.message, 0)}
            )
    
    .switchTabAndCallback(tabMap.second)
    .taskCardOpen(taskName)
        .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessageBefore + chatMessageAfter + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Отредактированное сообщение " + chatMessageBefore + chatMessageAfter + " сохранилось.", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Отредактированное сообщение " + chatMessageBefore + chatMessageAfter + " не сохранилось.", e.message, 0)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Редактирование отправленного сообщения"
}

testModule.tests.chatHistoryCardCreate = {
    call : function(taskName, chatMessage) {
    return this
    
    .keys(chatMessage)
    .keys(["Enter"])
        .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Сообщение " + chatMessage + " отправлено и появилось в истории карточки " + taskName, 1)},
                function(e){selena.regActionResult("Сообщение " + chatMessage + " не появилось в истории карточки " + taskName + "", e.message, 0)}
            )

    .chatHistoryMessageDDOpen(chatMessage, "New card")
    
    .click("//*[@role='dropdown']//*[@title='New card']")
        .waitForVisible("//*[@role='cardTitle' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Клик на пункте New Card. Новой карточка с тайтлом " + chatMessage + " создалась.", 1)},
                function(e){selena.regActionResult("Клик на пункте New Card. Новой карточка с тайтлом " + chatMessage + " не создалась.", e.message, 0)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.second)
    .taskCardOpen(taskName)
        .waitForVisible("//*[@role='title' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка во втором табе: Карточка " + chatMessage + " в чате родителя " + taskName + " найдена.", 1)},
                function(e){selena.regActionResult("Проверка во втором табе: Карточка " + chatMessage + " в чате родителя " + taskName + " не найдена.", e.message, 0)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Создание карточки из отправленного сообщения"
}

testModule.tests.chatHistoryMessageDelete = {
    call : function(taskName, chatMessage) {
    return this
    
    .keys(chatMessage)
    .keys(["Enter"])
        .waitForVisible("//*[@role='messageHistory' and contains(text(),'" + chatMessage + "')]", TIMEOUT)
            .then(
                function(){selena.regActionResult("Сообщение " + chatMessage + " отправлено и появилось в истории карточки " + taskName, 1)},
                function(e){selena.regActionResult("Сообщение " + chatMessage + " не появилось в истории карточки " + taskName + "", e.message, 0)}
            )

    .chatHistoryMessageDDOpen(chatMessage, "Remove")
    
    .click("//*[@role='dropdown']//*[@title='Remove']")
    
    .switchTabAndCallback(tabMap.second)
    .taskCardOpen(taskName)
        .waitForVisible("[class*='deleted']", TIMEOUT)
            .then(
                function(){selena.regActionResult("Проверка по втором окне. Сообщение " + chatMessage + " удалено.", 1)},
                function(e){selena.regActionResult("Проверка по втором окне. Сообщение " + chatMessage + " не удалено.", e.message + "\n" + e.stack)}
            )
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.first)
    .keys(["Escape"])
    
    ;
    },
    message : "Удаление отправленного сообщения"
}


module.exports = testModule;