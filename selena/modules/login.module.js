var selena = require("../clientExtended");

// Test module
testModule = {
    name : "checkLogin",
    call : function(){
      return this
        .loginEmptyFields()
        .loginIncorrect()
        // .loginCorrect(LOGIN1, PASS)
        ;  
    },
    setup : function(){},
    clean : function(){},

    testSetup : function(){
        return this
                .waitForExist("//*[contains(text(),'pack type')]").then(
                    function(){selena.regActionResult("Wait for wrong type message", 1)},
                    function(e){selena.regActionResult(e.message, 0, true)}
                );
    },
    testClean : function(){
        return this
            .waitForExist("//*[contains(text(),'or')]").then(
                    function(){selena.regActionResult("Wait for or message", 1)},
                    function(e){selena.regActionResult(e.message, 0, true)}
            )
            .waitForExist("//*[contains(text(),'pack type')]").then(
                    function(){selena.regActionResult("Wait for wrong type message", 1)},
                    function(e){selena.regActionResult(e.message, 0, true)}
                );
    },

    tests : {
        loginEmptyFields : {},
        loginIncorrect : {}        
    }
}


testModule.tests.loginEmptyFields = {
    call : function() {
        return this
            .login(PASS, PASS)
            .waitForExist("//*[contains(text(),'wrong type')]").then(
                    function(){selena.regActionResult("Wait for wrong type message", 1)}
                );
    },
    message : "Попытка логина с пустыми полями"
}

testModule.tests.loginIncorrect = {
    call : function() {
        return this
            .login(WRONGLOGINPASS, WRONGLOGINPASS)
                .waitForExist("//*[contains(text(),'Не верный')]", TIMEOUT)
    },
    message : "Неверный логин или пароль"
}





// addTest("loginCorrect", function(login, pass) {
//     return this
//     .login(LOGIN1, PASS)
//         .waitForVisible("[role='circlesButton']", TIMEOUT)
// }, "Логин с правильными полями");




module.exports = testModule;