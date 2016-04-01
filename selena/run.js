

var webdriverio = require('webdriverio');
    
    // URL = 'http://tm.hub-head.com/',
var LOGIN1 = 'vadim+0001@levelup.ru',
    LOGIN2 = 'vadim+0002@levelup.ru',
    MEMBERRANDOM = 'vadim+'+Date.now()+'@levelup.ru',
    MEMBERRANDOMNAME = Date.now(),
    MEMBER2 = LOGIN2/*'vadim+0002@levelup.ru'*/,
    MEMBER1NAME = 'Vadim 0001'
    MEMBER2NAME = 'Vadim 0002'
    PASS = '123123',
    WRONGLOGINPASS = 'mail@mail.mail',
    TASK1 = 'TASK-FOR-UNFOLLOW',
    TASK2 = 'TASK-FOR-DELETE',
    TASK3 = 'TASK3',
    TASK4 = 'TASK-FOR-ARCHIVE',
    TASK5 = 'TASK-FOR-RENAME',
    TASK6 = 'RENAMED-TASK',
    task_names = [TASK1, TASK2, TASK3, TASK4, TASK5],
    TIMEOUT = 4000,
    TAG1 = 'TAG1',
    i = 0,
    SCREENSHOTPATH = '/Users/vadimnechaev/Desktop/',
    MESSAGE = 'Сообщение'
;

var options = {
    desiredCapabilities: {
        browserName: 'firefox'
    },
    logLevel: 'silent'
};






// Service
var client = webdriverio.remote(options);
var selena = require("./clientExtended");
var results = require("./results");

//client.modulesCall = null;  //Modules callstack - объявляется просто чтобы знать, что такой есть

var fn = require("./functions");
for (var i in fn){client.addCommand(i, fn[i])} // можно переделать, где-то там создавать команды сразу






// Global Setup & Clean
selena.addFunction(client, "globalSetup", function(){
    return this.sessionStart();
}, true);

selena.addFunction(client, "globalClean", function(){
    console.log("globalClean")
    return this.sessionEnd();
}, true);


client.addCommand("sendResults", function(){
    process.send(JSON.stringify(results));
    return this;
})



// Мы можем не просто добавлять подряд, а в сложном порядке. Сначала добавляем в массив, а уже потом ставим в некоторм порядке в колстек.
// Modules
selena.addModule(client, require("./modules/login.module"));  // checkLogin
selena.addModule(client, require("./modules/circle.module"));  // checkCircle
selena.addModule(client, require("./modules/sphere.module"));  // checkSphere



client.addCommand("modulesCall", function(){
    function run(name){
        if (!selena.process) selena.process = this;
        selena.process[name].call(this);
    }

    for(var i=0; selena.modulesCall[i]; i++){
        results["tests"] = selena.modulesCall;
        run.call(this, selena.modulesCall[i]);
    }
    
    return selena.process;
}, true);



client
    .globalSetup().then(
        function(){
            results["setup"] = 1;
            return this
//                .checkLogin()
//                .checkCircle()
                .checkSphere()
            ;    
        },
        function(err){
            results["setup"] = 0;
        }
    )
    .globalClean().then(
        function(){
            results["clean"] = 1;
        },
        function(){
            results["clean"] = 0;
        }
    )
    .sendResults();