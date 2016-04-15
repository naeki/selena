var selena = require("../clientExtended");

// Test module
testModule = {
  name : "Circle",
  call : function(){
    return this
      .circleRename(circleNameBefore, circleNameAfter)
      ;  
    },
    setup : function(){
      return this
        .loginCorrect(LOGIN1, PASS)
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

testModule.tests.circleRename = {
  call : function(circleNameBefore, circleNameAfter) {
    return this
      .circleListOpen()
      .circleSettingsOpen(circleNameBefore)
      .click("//*[@role='circleName'][contains(text(),'" + circleNameBefore + "')]")
      .clearElement(".in-edit")
      .keys(circleNameAfter)
      .keys(["Enter"])
      .keys(["Escape"])
      .circleListOpen()
        .waitForExist("//*[@role='circleName'][contains(text(),'" + circleNameAfter + "')]", TIMEOUT)
          .then(
            function(){selena.regActionResult("Круг " + circleNameBefore + " переименован в " + circleNameAfter, 1)},
            function(e){selena.regActionResult("Круг " + circleNameBefore + " не переименован " + e.message, 0)}
          )
      .keys(["Escape"])
    ;
  },
  message : "Переименование круга"
}

module.exports = testModule;