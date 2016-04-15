var selena = require("../clientExtended");

// Test module
testModule = {
    name : "Login",
    call : function(){
        return this
        .loginEmptyFields()
        .loginIncorrect()
        // .loginCorrect(LOGIN1, PASS)
    ;  
    },
    setup : function(){},
    clean : function(){},

    testSetup : function(){},
    testClean : function(){},

    tests : {
        loginEmptyFields : {},
        loginIncorrect : {}        
    }
}


testModule.tests.loginEmptyFields = {
    call : function() {
        return this
            .login(PASS, PASS)
            .waitForExist("//*[contains(text(),'wrong type')]")
                .then(
                    function(){selena.regActionResult("Появление надписи Empty fields or wrong type", 1)}, 
                    function(){selena.regActionResult("Появление надписи Empty fields or wrong type " + e.message, 0)}
                );
    },
    message : "Попытка логина с пустыми полями"
}

testModule.tests.loginIncorrect = {
    call : function() {
        return this
            .login(WRONGLOGINPASS, WRONGLOGINPASS)
                .waitForExist("//*[contains(text(),'Не верный')]", TIMEOUT)
                    .then(
                        function(){selena.regActionResult("Появление надписи 'Не верный логин или пароль!' ", 1)}, 
                        function(){selena.regActionResult("Появление надписи 'Не верный логин или пароль!' " + e.message, 0)}
                    );
    },
    message : "Неверный логин или пароль"
}





// addTest("loginCorrect", function(login, pass) {
//     return this
//     .login(LOGIN1, PASS)
//         .waitForVisible("[role='circlesButton']", TIMEOUT)
// }, "Логин с правильными полями");




module.exports = testModule;