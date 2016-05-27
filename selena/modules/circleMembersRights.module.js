var selena = require("../clientExtended");

// Test module
// сделаны в одном окне, так как во второе окно не приходит email приглашенного. Проверять по другим критериям пока нет желания.

testModule = {
    name : "checkCircleMembersRights",
    call : function(){
        return this
            .circleLeave2(circleName, LOGIN2)
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

testModule.tests.circleLeave2 = {
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

module.exports = testModule;