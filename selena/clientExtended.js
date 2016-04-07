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

        client.addCommand("testCall", function(){
            // Указываем, что сейчас выполняется
            if (selena.skip) {
                return client;
            }
            console.log("test call input")
            selena.work = testResult;

            // Вызываем выполнение теста
            return test.call.apply(client, arguments)
        }, true)
        


        var step1 = client
            .testSetup(name)
                .then(
                    function(){
                        // Записываем результат выполнения сетапа
                        console.log("setup output")
                        selena.regActionResult(null, 1);
                    }
                );

        return step1
            .testCall.apply(step1, arguments).then(
                            function(){
                                // Записываем результат выполнения теста
                                selena.regActionResult(null, 1);
                            },
                            function(err){
                                selena.regActionResult(err.message, 0);
                            }
                        ) 
            .testClean(name).then(
                function(){
                    selena.regActionResult(null, 1, false);
                },
                function(err){
                    console.log(name, "clean end")
                    selena.regActionResult(err.message, 0, true);
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

    if (message) {
        console.log(message)

        if (!selena.work["actions"]) 
            selena.work["actions"] = [];

        selena.work["actions"].push({message: message, result: result});
        // console.log(selena.work, "work")
    }

    selena.work.result = result in selena.work ? selena.work.result && result : result;

    if ((skip === false && result) || (skip == true && !result)) 
        selena.skip = skip;
}






module.exports = selena;


