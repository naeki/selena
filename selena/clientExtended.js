var results = require("./results");
var selena = {};


selena.addModule = function(client, module){
    // Command for module excution
    results["modules"][module.name] = {tests: {}};

    client.addCommand(module.name, function(){
        return this
            .moduleSetup().then(
                function(){
                    results["modules"][module.name]["setup"].result = 1;
                    return module.call.apply(this, arguments)
                },
                function(err){
                    results["modules"][module.name]["setup"].result = 0;
                }
            )
            .moduleClean().then(
                function(){
                    results["modules"][module.name]["clean"].result = 1;
                },
                function(err){
                    results["modules"][module.name]["clean"].result = 0;
                }
            ); 
    }, true);



                        

    // Commands for module setup/clean
    selena.addFunction(client, "moduleSetup", function(){
        selena.work = results["modules"][module.name]["setup"] = {};
        return module.setup.apply(this, arguments);
    }, true);
    

    selena.addFunction(client, "moduleClean", function(){
        selena.work = results["modules"][module.name]["clean"] = {};
        return module.clean.apply(this, arguments);
    }, true);






    // Commands for test setup/clean
    selena.addFunction(client, "testSetup", function(testName){
        selena.work = results["modules"][module.name]["tests"][testName]["setup"] = {};
        return module.testSetup.apply(this, arguments);
    }, true);


    selena.addFunction(client, "testClean", function(testName){
        selena.work = results["modules"][module.name]["tests"][testName]["clean"] = {};
        return module.testClean.apply(this, arguments)
    }, true);






    // Commands for tests execution
    for (var i in module.tests){
        var test = module.tests[i];
        results["modules"][module.name]["tests"][i] = {message: test.message};
        selena.addTest(module, client, i, test);
    }


    // Add module to client call
    client.modulesCall = client.modulesCall ? client.modulesCall.then(client[module.name]) : client[module.name];
    client.addCommand("modulesCall", client.modulesCall, true);
}



selena.addTest = function(module, client, name, test){
    client.addCommand(name, function(){
        if (selena.skip){
            results["modules"][module.name]["tests"][name]["result"] = "skip";
            return client;
        }

        return client
            .testSetup(name)
            .then(
                function(){
                    // Указываем, что сейчас выполняется
                    selena.work = results["modules"][module.name]["tests"][name];

                    if (selena.skip) {
                        return client;
                    }

                    // Записываем результат выполнения сетапа
                    results["modules"][module.name]["tests"][name]["setup"].result = 1;

                    // Вызываем выполнение теста
                    return test.call.apply(this, arguments)
                        .then(
                            // Записываем результат выполнения теста
                            function(){
                                results["modules"][module.name]["tests"][name]["result"] = 1;
                            }, 
                            function(){
                                results["modules"][module.name]["tests"][name]["result"] = 0;
                            }
                        );

                }.bind(this)
            )   
            .testClean(name).then(
                function(){
                    results["modules"][module.name]["tests"][name]["clean"]["result"] = 1;
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

    selena.work["actions"].push({message: message, result: result});
    selena.skip = skip;
}






module.exports = selena;


