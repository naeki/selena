var selena = require("../clientExtended");

// Test module
testModule = {
  name : "checkSphereContextMenu",
  call : function(){
      
        selena.addFunction(this, "task_check", function(title, options) {
            options || (options = {});
            var positive = options.silent ? null : function(){selena.regActionResult("Пункт " + title + " присутствует в контекстном меню", 1)}
            
            return this
                .waitForVisible("[title*='" + title + "']", TIMEOUT).then(
                    positive,
                    function(e){selena.regActionResult("Пункт " + title + " отсутствует в контекстном меню " + e.message, 0, true)}
                )
        }, true);
        
        selena.addFunction(this, "task_click", function(title) {
            return this
                .click("[title*='" + title + "']")
                .then(
                      function(){selena.regActionResult("Клик на пункт " + title + " в контектном меню", 1)}
                )
        }, true);
      
      
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
        .task_check('Follow', {silent : true})
        .task_click('Follow')
        .task_check('Unfollow', {silent : false})
        .keys(["Escape"])
        .keys(["Escape"])

        .switchTabAndCallback(tabMap.second)
        .sphereListOpen()
        .sphereDDOpen(sphereName)
        .task_check('Unfollow', {silent : false})
        .task_click('Unfollow')
        .task_check('Follow', {silent : false})
        .keys(["Escape"])
        .keys(["Escape"])

        .switchTabAndCallback(tabMap.first)
        .sphereListOpen()
        .sphereDDOpen(sphereName)
        .task_check('Follow', {silent : false})
        .keys(["Escape"])
        .keys(["Escape"])
        ;
        },
    message : "Follow/Unfollow сферы"
}

testModule.tests.sphereStarredAddRemove = {
    call : function(sphereName) {
        return this
        .task_check('Add to starred', {silent : true})
        .task_click('Add to starred')
        .waitForExist("//*[@role='spheresRecent']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true).then(
            function(){selena.regActionResult("В первом табе: Сфера " + sphereName + " добавлена в избранное. Пропала из группы Recent.", 1)},
            function(e){selena.regActionResult("В первом табе: Сфера " + sphereName + " не добавлена в избранное. Не пропала из группы Recent. " + e.message, 0)}
        )
        .keys(["Escape"])

        .switchTabAndCallback(tabMap.second)
        .sphereListOpen()
        .waitForExist("//*[@role='spheresStarred']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT).then(
            function(){selena.regActionResult("Во втором табе: Сфера " + sphereName + " добавлена в избранное. Появилась в группе Starred.", 1)},
            function(e){selena.regActionResult("Во втором табе: Сфера " + sphereName + " не добавлена в избранное. Не появилась в группе Starred. " + e.message, 0)}
        )
        .sphereDDOpen(sphereName)
        .task_check('Remove star', {silent : false})
        .task_click('Remove star')
        .keys(["Escape"])

        .switchTabAndCallback(tabMap.first)
        .sphereListOpen()
        .waitForExist("//*[@role='spheresRecent']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT).then(
            function(){selena.regActionResult("Во втором табе: Сфера " + sphereName + " удалена из избранного. Появилась в группе Recent.", 1)},
            function(e){selena.regActionResult("Во втором табе: Сфера" + sphereName + " не удалена из избранного. Не появилась в группе Recent. " + e.message, 0)}
        )
        .keys(["Escape"])

        ;
    },
    message : "Add/Remove starred сферы"
}

testModule.tests.sphereQCLAddRemove = {
    call : function(sphereName) {
        return this

        .task_check('Show in quick create list', {silent : true})
        .task_click('Show in quick create list')
        .task_check('Remove from quick create list', {silent : false})
        .keys(["Escape"])
        .keys(["Escape"])

        .switchTabAndCallback(tabMap.second)
        .moveToObject("[role='mainButton']")
        .waitForExist("//*[@class='quick-sphere' and contains(text(),'S')]", TIMEOUT).then(
            function(){selena.regActionResult("Сфера " + sphereName + " появилась в QCL", 1)},
            function(e){selena.regActionResult("Сфера " + sphereName + " не появилась в QCL " + e.message, 0)}
        )
        .sphereListOpen()
        .sphereDDOpen(sphereName)
        .task_check('Remove from quick create list', {silent : false})
        .task_click('Remove from quick create list')
        .task_check('Show in quick create list', {silent : false})
        .keys(["Escape"])
        .keys(["Escape"])

        .switchTabAndCallback(tabMap.first)
        .moveToObject("[role='mainButton']")
        .isExisting("//*[@class='quick-sphere' and contains(text(),'S')]").then(
            function(){selena.regActionResult("В первом табе: Сфера " + sphereName + " пропала из QCL", 1)},
            function(e){selena.regActionResult("В первом табе: Сфера " + sphereName + " не пропала из QCL " + e.message, 0)}
        )
        .keys(["Escape"])
        .keys(["Escape"])
        ;
    },
    message : "Add/Remove сферы в QCL"
}


module.exports = testModule;