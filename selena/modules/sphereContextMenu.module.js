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
      .sphereDDOpen(sphereName)
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
      .waitForVisible("[title='Follow']", TIMEOUT)
        .then(
          null/*function(){selena.regActionResult("Пункт Follow присутствует в контекстном меню", 1)}*/,
          function(e){selena.regActionResult("Пункт Follow отсутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title='Follow']")
      .waitForVisible("[title='Unfollow']", TIMEOUT)
        .then(
          function(){selena.regActionResult("В первом табе: Выполнен Follow сферы " + sphereName + ". Follow сменился на Unfollow.", 1)},
          function(e){selena.regActionResult("В первом табе: Follow сферы " + sphereName + " не выполнен. Follow не сменился на Unfollow. " + e.message, 0)}
        )
    .keys(["Escape"])
    .keys(["Escape"])

    .switchTabAndCallback(tabMap.second)
    .sphereListOpen()
    .sphereDDOpen(sphereName)
      .waitForVisible("[title='Unfollow']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Во втором табе: Пункт Unfollow присутствует в контекстном меню", 1)},
          function(e){selena.regActionResult("Во втором табе: Пункт Unfollow отсутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title='Unfollow']")
        .waitForVisible("[title='Follow']", TIMEOUT)
          .then(
            function(){selena.regActionResult("Во втором табе: Выполнен Unfollow сферы " + sphereName + ". Unfollow сменился на Follow.", 1)},
            function(e){selena.regActionResult("Во втором табе: Unfollow сферы " + sphereName + " не выполнен. Unfollow не сменился на Follow. " + e.message, 0)}
          )
    .keys(["Escape"])
    .keys(["Escape"])
    
    .switchTabAndCallback(tabMap.first)
    .sphereListOpen()
    .sphereDDOpen(sphereName)
      .waitForVisible("[title='Follow']", TIMEOUT)
        .then(
          function(){selena.regActionResult("В первом табе: Выполнен Unfollow сферы " + sphereName + ". Unfollow сменился на Follow.", 1)},
          function(e){selena.regActionResult("В первом табе: Unfollow сферы " + sphereName + " не выполнен. Unfollow не сменился на Follow." + e.message, 0)}
        )
    .keys(["Escape"])
    .keys(["Escape"])
    ;
  },
  message : "Follow/Unfollow сферы"
}

testModule.tests.sphereStarredAddRemove = {
  call : function(sphereName) {
  return this
      .waitForVisible("[title*='Add to starred']", TIMEOUT)
        .then(
          null/*function(){selena.regActionResult("Пункт Add to starred присутствует в контекстном меню", 1)}*/,
          function(e){selena.regActionResult("Пункт Add to starred отсутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title*='Add to starred']")
      .waitForExist("//*[@role='spheresRecent']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)    
        .then(
          function(){selena.regActionResult("В первом табе: Сфера " + sphereName + " добавлена в избранное. Пропала из группы Recent.", 1)},
          function(e){selena.regActionResult("В первом табе: Сфера " + sphereName + " не добавлена в избранное. Не пропала из группы Recent. " + e.message, 0)}
        )
    .keys(["Escape"])
  
    .switchTabAndCallback(tabMap.second)
    .sphereListOpen()
      .waitForExist("//*[@role='spheresStarred']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT)    
        .then(
          function(){selena.regActionResult("Во втором табе: Сфера " + sphereName + " добавлена в избранное. Появилась в группе Starred.", 1)},
          function(e){selena.regActionResult("Во втором табе: Сфера " + sphereName + " не добавлена в избранное. Не появилась в группе Starred. " + e.message, 0)}
        )
    .sphereDDOpen(sphereName)
      .waitForVisible("[title*='Remove star']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Пункт Remove star присутствует в контекстном меню", 1)},
          function(e){selena.regActionResult("Пункт Remove star отсутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title*='Remove star']")
      .waitForExist("//*[@role='spheresStarred']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
        .then(
          function(){selena.regActionResult("В первом табе: Сфера " + sphereName + " удалена из избранного. Пропала из группы Starred.", 1)},
          function(e){selena.regActionResult("В первом табе: Сфера " + sphereName + " не удалена из избранного. Не пропала из группы Starred. " + e.message, 0)}
        )
    .keys(["Escape"])
  
    .switchTabAndCallback(tabMap.first)
    .sphereListOpen()
      .waitForExist("//*[@role='spheresRecent']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT)
        .then(
          function(){selena.regActionResult("Во втором табе: Сфера " + sphereName + " удалена из избранного. Появилась в группе Recent.", 1)},
          function(e){selena.regActionResult("Во втором табе: Сфера" + sphereName + " не удалена из избранного. Не появилась в группе Recent. " + e.message, 0)}
        )
    .keys(["Escape"])
    
    ;
  },
  message : "Add/Remove starred сферы"
}

testModule.tests.sphereQCLAddRemove = {
    call : function(sphereName) {
    return this
    
      .waitForVisible("[title*='Show in quick create list']", TIMEOUT)
        .then(
          null/*function(){selena.regActionResult("Пункт Show in quick create list присутствует в контекстном меню", 1)}*/,
          function(e){selena.regActionResult("Пункт Show in quick create list отсутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title*='Show in quick create list']")
      .waitForExist("//*[@title='Remove from quick create list']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Сфера " + sphereName + " добавлена в QCL (смена состояния пункта в DD сферы)", 1)},
          function(e){selena.regActionResult("Сфера " + sphereName + " не добавлена в QCL (смена состояния пункта в DD сферы) " + e.message, 0)}
        )
    .keys(["Escape"])
    .keys(["Escape"])

    .switchTabAndCallback(tabMap.second)
    .moveToObject("[role='mainButton']")
      .waitForExist("//*[@class='quick-sphere' and contains(text(),'S')]", TIMEOUT)
        .then(
          function(){selena.regActionResult("Сфера " + sphereName + " появилась в QCL", 1)},
          function(e){selena.regActionResult("Сфера " + sphereName + " не появилась в QCL " + e.message, 0)}
        )
    .sphereListOpen()
    .sphereDDOpen(sphereName)
      .waitForVisible("[title*='Remove from quick create list']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Во втором табе: Пункт Remove from quick create list присутствует в контекстном меню", 1)},
          function(e){selena.regActionResult("Во втором табе: Пункт Remove from quick create list отсутствует в контекстном меню " + e.message, 0)}
        )
    .click("[title*='Remove from quick create list']")
      .waitForExist("[title*='Show in quick create list']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Во втором табе: Сфера " + sphereName + " удалена из QCL (смена состояния пункта в DD сферы)", 1)},
          function(e){selena.regActionResult("Во втором табе: Сфера " + sphereName + " не удалена из QCL (смена состояния пункта в DD сферы) " + e.message, 0)}
        )
    .keys(["Escape"])
    .keys(["Escape"])

    .switchTabAndCallback(tabMap.first)
    .moveToObject("[role='mainButton']")
      .isExisting("//*[@class='quick-sphere' and contains(text(),'S')]")
        .then(
          function(){selena.regActionResult("В первом табе: Сфера " + sphereName + " пропала из QCL", 1)},
          function(e){selena.regActionResult("В первом табе: Сфера " + sphereName + " не пропала из QCL " + e.message, 0)}
        )
    .keys(["Escape"])
    .keys(["Escape"])
;
    },
    message : "Add/Remove сферы в QCL"
}


module.exports = testModule;