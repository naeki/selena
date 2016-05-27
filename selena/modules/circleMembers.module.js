var selena = require("../clientExtended");

// Test module
// сделаны в одном окне, так как во второе окно не приходит email приглашенного. Проверять по другим критериям пока нет желания.

testModule = {
    name : "checkCircleMembers",
    call : function(){
        return this
            .circleMemberInviteNew(circleName, MEMBERRANDOM)
            .circleMemberInviteCurrent(circleName, LOGIN2)
            .circleMemberDelete(circleName, LOGIN2)
            .circleInviteCancel(circleName, LOGIN2)
            .circleInviteAccept(circleName, LOGIN2)
            .circleLeave(circleName, LOGIN2)
            .circleMemberOwnerTransfer(circleName, LOGIN2) // ставить только последним тестом, чтобы после него была разавторизация, так как овнерство круга передано юзеру c LOGIN2.
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
            .circleListOpen()
            .circleCreateNew(circleName)
    },
    testClean : function(){
        return this
            .circleDeleteAll()
    },

    tests : {}
}

testModule.tests.circleMemberInviteNew = {
    call : function(circleName, memberLogin) {
    return this
    
      .circleListOpen()
      .circleSettingsOpen(circleName)
      .click("[role='addUser']")
        .waitForExist("[role='findUser']", TIMEOUT).then(
            function(){selena.regActionResult("Панель поиска пользователей активирована. Ищем " + memberLogin, 1)},
            function(e){selena.regActionResult("Панель поиска пользователей не активирована " + e.message, 0, true)}
          )
      .setValue("[role='findUser']", memberLogin)
        .waitForExist("[role='userInvite']", TIMEOUT).then(
            function(){selena.regActionResult(memberLogin + " не найден среди существующих. Приглашаем. ", 1)},
            function(e){selena.regActionResult(memberLogin + " найден среди существующих пользователей " + e.message, 0, true)} // подумать над формулировкой
          )
      .click("[role='userInvite']")
        .waitForExist("[role='userInviteName']", TIMEOUT).then(
            function(){selena.regActionResult("Панель для ввода имени нового юзера появилась. Вводим " + memberLogin, 1)},
            function(e){selena.regActionResult("Панель для ввода имени нового юзера не появилась " + e.message, 0)}
          )
      .setValue("[role='userInviteName']", memberLogin)
      .keys(["Enter"])
        .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT).then(
            function(){selena.regActionResult("Незарегистированный юзер " + memberLogin + " приглашен в круг " + circleName, 1)},
            function(e){selena.regActionResult("Незарегистированный юзер " + memberLogin + " не приглашен в круг " + circleName + " " + e.message, 0)}
          )
      .keys(["Escape"])
    
    },
    message : "Приглашение незарегистрированного юзера в круг"
}

testModule.tests.circleMemberInviteCurrent = {
    call : function(circleName, memberLogin) {
    return this
    
      .circleListOpen()
      .circleSettingsOpen(circleName)
      .click("[role='addUser']")
        .waitForExist("[role='findUser']", TIMEOUT)
          .then(
            function(){selena.regActionResult("Панель поиска пользователей активирована. Ищем " + memberLogin, 1)},
            function(e){selena.regActionResult("Панель поиска пользователей не активирована " + e.message, 0, true)}
          )
      .setValue("[role='findUser']", memberLogin)
        .waitForExist("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
          .then(
            function(){selena.regActionResult(memberLogin + " найден среди существующих. Приглашаем. ", 1)},
            function(e){selena.regActionResult(memberLogin + " не найден среди существующих пользователей " + e.message, 0, true)}
          )  // выделить функцию приглашения нового/существующего юзера в круг
      .click("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]")
        .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
          .then(
            function(){selena.regActionResult("Зарегистрированный юзер " + memberLogin + " приглашен в круг " + circleName, 1)},
            function(e){selena.regActionResult("Зарегистрированный юзер " + memberLogin + " не приглашен в круг " + circleName + " " + e.message, 0)}
          )
      .keys(["Escape"])
    
    },
    message : "Приглашение зарегистрированного юзера системы в круг"
}

testModule.tests.circleMemberDelete = {
  call : function(circleName, memberLogin) {
  return this

    .circleMemberInvite(circleName, memberLogin)
    .circleListOpen()
    .circleSettingsOpen(circleName)
      .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
        .then(
          function(){selena.regActionResult("Юзер " + memberLogin + " найден в круге. Наводим на него." , 1)},
          function(e){selena.regActionResult("Юзер " + memberLogin + " не найден в круге " + circleName + " " + e.message, 0, true)}
        )
    .moveToObject("//*[@role='email'][contains(text(),'" + memberLogin + "')]")
      .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]/../*[@role='role']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Контрол для удаления " + memberLogin + " появился. Кликаем на него.", 1)},
          function(e){selena.regActionResult("Контрол для удаления " + memberLogin + " не появился " + e.message, 0, true)}
        )
    .click("//*[@role='email'][contains(text(),'" + memberLogin + "')]/../*[@role='delete']")
      .waitForExist("[label='Cancel']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Диалог для подтверждения появился. Нажимаем Enter.", 1)},
          function(e){selena.regActionResult("Диалог для подтверждения не появился " + e.message, 0, true)}
        )
    .keys(["Enter"])
      .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT, true)
        .then(
          function(){selena.regActionResult("Юзер " + memberLogin + " удален (пропал из списка юзеров в настройках круга " + circleName + ")", 1)},
          function(e){selena.regActionResult("Юзер " + memberLogin + " не удален (не пропал из списка юзеров в настройках круга " + circleName + "). " + e.message, 0, true)}
        )
    .keys(["Escape"])
  },
  message : "Удаление мембера круга"
}

testModule.tests.circleInviteCancel = {
  call : function(circleName, memberLogin) {
  return this

    .circleMemberInvite(circleName, memberLogin)
    .switchUser(memberLogin, PASS)

    .circleListOpen("Открываем список кругов для отмены приглашения.")
      .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='decline']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Приглашение в круг " + circleName + " найдено. Отклоняем.", 1)},
          function(e){selena.regActionResult("Приглашение в круг " + circleName + " не найдено. " + e.message, 0, true)}
        )
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='decline']")
      .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT, true)
        .then(
          function(){selena.regActionResult("Приглашение в круг " + circleName + " отклонено. Круг пропал.", 1)},
          function(e){selena.regActionResult("Приглашение в круг " + circleName + " не отклонено. Круг не пропал. " + e.message, 0, true)}
        )
  .keys(["Escape"])
  .switchUser(LOGIN1, PASS)

  },
  message : "Отказ от приглашения в круг"
}

testModule.tests.circleInviteAccept = {
  call : function(circleName, memberLogin) {
  return this

    .circleMemberInvite(circleName, memberLogin)
    .switchUser(memberLogin, PASS)

    .circleListOpen("Открываем список кругов для подтверждения приглашения приглашения.")
      .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Приглашение в круг " + circleName + " найдено. Принимаем.", 1)},
          function(e){selena.regActionResult("Приглашение в круг " + circleName + " не найдено. " + e.message, 0, true)}
        )
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']")
      .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT, true)
        .then(
          function(){selena.regActionResult("Приглашение в круг " + circleName + " Принято. Кнопка Accept пропала.", 1)},
          function(e){selena.regActionResult("Приглашение в круг " + circleName + " не принято. Кнопка Accept не пропала " + e.message, 0, true)}
        )
  .keys(["Escape"])
  .switchUser(LOGIN1, PASS)

  },
  message : "Принятие приглашения в круг"
}

testModule.tests.circleLeave = {
  call : function(circleName, memberLogin) {
  return this
    
    .circleMemberInvite(circleName, memberLogin)
    .switchUser(memberLogin, PASS)
    
    .circleListOpen("Открываем список кругов для принятия приглашения.")
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']")
      .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT, true)
        .then(
          function(){selena.regActionResult("Приглашение в круг " + circleName + " принято. Кнопка Accept пропала.", 1)},
          function(e){selena.regActionResult("Приглашение в круг " + circleName + " не принято. Кнопка Accept не пропала " + e.message, 0, true)}
        )
    
    .circleSettingsOpen(circleName)
      .waitForExist("[role='circleLeave']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Кнопка выхода из круга " + circleName + " найдена. Кликаем ее.", 1)},
          function(e){selena.regActionResult("Кнопка выхода из круга " + circleName + " не найдена. " + e.message, 0, true)}
        )
    .click("[role='circleLeave']")
      .waitForExist("[label='Cancel']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Диалог для подтверждения появился. Нажимаем Space.", 1)},
          function(e){selena.regActionResult("Диалог для подтверждения не появился. " + e.message, 0, true)}
        )
    .keys(["Space"])
    .circleListOpen("Открываем список кругов для проверки, что круг пропал.")
      .waitForVisible("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT, true)
        .then(
          function(){selena.regActionResult("Круг " + circleName + " пропал из списка кругов юзера " + memberLogin + ".", 1)},
          function(e){selena.regActionResult("Круг " + circleName + " не пропал из списка кругов юзера " + memberLogin + "." + e.message, 0, true)}
        )
  .keys(["Escape"])
  
  .switchUser(LOGIN1, PASS)
  .circleListOpen()
  .circleSettingsOpen(circleName)
    .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT, true)
      .then(
        function(){selena.regActionResult("Проверка настроек круга овнером круга. Юзер " + memberLogin + " не найден в круге " + circleName + ".", 1)},
        function(e){selena.regActionResult("Проверка настроек круга овнером круга. Юзер " + memberLogin + " найден в круге " + circleName + ". " + e.message, 0, true)}
      )
//  .keys(["Escape"])
  
  },
  message : "Выход из круга"
}

testModule.tests.circleMemberOwnerTransfer = {
  call : function(circleName, memberLogin) {
  return this
  
    .circleMemberInvite(circleName, memberLogin)
    .switchUser(memberLogin, PASS)
  
    .circleListOpen("Открываем список кругов для подтверждения приглашения.")
        .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT)
          .then(
            null
  //          function(){selena.regActionResult("Приглашение в круг " + circleName + " найдено. Принимаем.", 1)}
            ,
            function(e){selena.regActionResult("Приглашение в круг " + circleName + " не найдено. " + e.message, 0, true)}
          )
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']")
      .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT, true)
        .then(
          function(){selena.regActionResult("Приглашение в круг " + circleName + " Принято. Кнопка Accept пропала.", 1)},
          function(e){selena.regActionResult("Приглашение в круг " + circleName + " не принято. Кнопка Accept не пропала. " + e.message, 0, true)}
        )
    .keys(["Escape"])
  
    .switchUser(LOGIN1, PASS)
    .circleListOpen()
    .circleSettingsOpen(circleName)
      .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
        .then(
          function(){selena.regActionResult("Юзер " + memberLogin + " найден в круге. Кликаем на роль." , 1)},
          function(e){selena.regActionResult("Юзер " + memberLogin + " не найден в круге " + circleName + " " + e.message, 0, true)}
        )
    .click("//*[@role='email'][contains(text(),'" + memberLogin + "')]/..//*[@role='role']")
      .waitForExist("//*[@role='dropdown']//*[@title='Owner']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Дропдаун с ролями открылся. Кликаем на Owner." , 1)},
          function(e){selena.regActionResult("Дропдаун с ролями не открылся. " + e.message, 0, true)}
        )
    .click("//*[@role='dropdown']//*[@title='Owner']")
      .waitForExist(".dialog-buttons", TIMEOUT)
        .then(
          function(){selena.regActionResult("Диалог для подтверждения передачи Owner открылся. Нажимаем пробел." , 1)},
          function(e){selena.regActionResult("Диалог для подтверждения передачи Owner не открылся. " + e.message, 0, true)}
        )
    .keys(["Space"])
      .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]/..//*[@role='role'][contains(text(),'O')]", TIMEOUT)
        .then(
          function(){selena.regActionResult("Индикатор роли юзера " + memberLogin + " поменялся на «O». Owner передан.", 1)},
          function(e){selena.regActionResult("Индикатор роли юзера " + memberLogin + " поменялся на «O». Owner не передан юзеру. " + e.message, 0, true)}
        )
    .keys(["Escape"])
    .switchUser(memberLogin, PASS)
/*// возвращаем овнера, чтобы нормально сработал clean для удаления круга
  
  .circleSettingsOpen(circleName)
      .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
        .then(
          null
//          function(){selena.regActionResult("Юзер " + memberLogin + " найден в круге. Кликаем на роль." , 1)}
          ,
          function(e){selena.regActionResult("Юзер " + memberLogin + " не найден в круге " + circleName + " " + e.message, 0, true)}
        )
    .click("//*[@role='email'][contains(text(),'" + memberLogin + "')]//*[@role='role']")
      .waitForExist("//*[@role='dropdown']//*[title='Owner']", TIMEOUT)
        .then(
          null
//          function(){selena.regActionResult("Дропдаун с ролями открылся. Кликаем на Owner." , 1)}
          ,
          function(e){selena.regActionResult("Дропдаун с ролями не открылся. " + e.message, 0, true)}
        )
    .click("//*[@role='dropdown']//*[title='Owner']")
      .waitForExist(".dialog-buttons", TIMEOUT)
        .then( 
          null
//          function(){selena.regActionResult("Диалог для подтверждения передачи Owner открылся. Нажимаем пробел." , 1)}
          ,
          function(e){selena.regActionResult("Диалог для подтверждения передачи Owner не открылся. " + e.message, 0, true)}
        )
    .keys(["Space"])
      .waitForExist("li[title='Owner']", TIMEOUT, true)
        .then(
          null
//          function(){selena.regActionResult("Дропдаун с выбором ролей закрылся." , 1)}
          ,
          function(e){selena.regActionResult("Дропдаун с выбором ролей не закрылся. " + e.message, 0, true)}
        )
      .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]/..//*[@role='role'][contains(text(),'O')]", TIMEOUT)
        .then(
          function(){selena.regActionResult("Возврат Owner " + LOGIN1 + " успешен.", 1)},
          function(e){selena.regActionResult("Возврат Owner " + LOGIN1 + " не успешен. " + e.message, 0, true)}
        )
    .keys(["Escape"])
  
    .switchUser(LOGIN1, PASS)*/
  
    
  },
  message : "Передача овнерства круга"
}

module.exports = testModule;