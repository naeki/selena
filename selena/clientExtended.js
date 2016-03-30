var results = require("./results");
var selena = {};


selena.addModule = function(client, module){
    // Command for module excution

    client.addCommand(module.name, function(){

        var moduleResult = results["modules"][module.name] = {tests: {}};


        if (selena.skip){
            moduleResult.result = "skip";
            return client;
        }



        // Commands for module setup/clean
        selena.addFunction(client, "moduleSetup", function(){
            selena.work = moduleResult["setup"] = {};

            return module.setup.apply(this, arguments);
        }, true);
        

        selena.addFunction(client, "moduleClean", function(){
            selena.work = moduleResult["clean"] = {};

            return module.clean.apply(client, arguments);
        }, true);



        // Commands for test setup/clean
        selena.addFunction(client, "testSetup", function(testName){
            selena.work = moduleResult["tests"][testName]["setup"] = {};

            return module.testSetup.apply(this, arguments);
        }, true);


        selena.addFunction(client, "testClean", function(testName){
            selena.work = moduleResult["tests"][testName]["clean"] = {};

            return module.testClean.apply(this, arguments)
        }, true);



        // Commands for tests execution
        for (var i in module.tests){
            var test = module.tests[i];
            selena.addTest(module, client, i, test);
        }



        return client
            .moduleSetup().then(
                function(){
                    moduleResult["setup"].result = 1;

                    return module.call.apply(this, arguments)
                        .then(function(){}, function(err){
                            selena.regActionResult(err.message, 0)
                        });
                },
                function(err){
                    selena.regActionResult(err.message, 0, true);
                }
            )
            .moduleClean().then(
                function(){
                    selena.regActionResult(null, 1, false);
                },
                function(err){
                    selena.regActionResult(err.message, 0, true);
                }
            ); 
    }, true);

    


     // Add module to client call
    if (selena.modulesCall) selena.modulesCall.push(module.name)
    else selena.modulesCall = [module.name];
}




selena.addTest = function(module, client, name, test){
    client.addCommand(name, function(){
        var testResult = results["modules"][module.name]["tests"][name] = {message: test.message};

        if (selena.skip){
            testResult["result"] = "skip";
            return client;
        }

        return client
            .testSetup(name)
            .then(
                function(){
                    // Указываем, что сейчас выполняется
                    selena.work = testResult;

                    if (selena.skip) {
                        return client;
                    }

                    // Записываем результат выполнения сетапа
                    selena.regActionResult(null, 1);

                    // Вызываем выполнение теста
                    return test.call.apply(this, arguments)
                        .then(
                            // Записываем результат выполнения теста
                            function(){
                                testResult["result"] = 1;
                            }, 
                            function(err){
                                selena.regActionResult(err.message, 0);
                            }
                        );

                }.bind(this)
            )   
            .testClean(name).then(
                function(){
                    testResult["clean"].result = 1;
                }
            )
    })
}



selena.addFunction = function(client, name, callback, rewrite){
    client.addCommand(name, function(){
        return (callback.apply(this, arguments) || client)
            .then(
                function(){},
                function(e){
                    selena.regActionResult(e.message, 0, true);
                }
            );
    }, rewrite);
}



selena.regActionResult = function(message, result, skip){
    if (!selena.work) return;
    if (!selena.work["actions"]) selena.work["actions"] = [];

    if (message) selena.work["actions"].push({message: message, result: result});

    selena.work.result = result in selena.work ? selena.work.result && result : result;

    if ((skip === false && result) || (skip === true && !result)) 
        selena.skip = skip;
}






module.exports = selena;


