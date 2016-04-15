

var webdriverio = require('webdriverio');
    
    // URL = 'http://tm.hub-head.com/',
    global.LOGIN1 = 'vadim+0001@levelup.ru';
    global.LOGIN2 = 'vadim+0002@levelup.ru';
    global.PASS = '123123';
    global.WRONGLOGINPASS = 'mail@mail.mail';

    global.TIMEOUT = 4000;
    global.dateNow1 = Date.now()+1;
    global.MEMBERRANDOM = 'vadim+' + Date.now() + '@levelup.ru';
    global.MEMBERRANDOMNAME = Date.now();
    global.MEMBER2 = LOGIN2;
    global.MEMBER1NAME = 'Vadim 0001';
    global.MEMBER2NAME = 'Vadim 0002';

    global.circleName = 'C'+Date.now();
    global.circleNameBefore = circleName;
    global.circleNameAfter = 'C' + dateNow1;

    global.taskName = 'T' + Date.now();
    global.taskNameBefore = taskName;
    global.taskNameAfter = 'T' + dateNow1;

    global.sphereName = 'S' + Date.now();
    global.sphereNameBefore = sphereName;
    global.sphereNameAfter = 'S'+dateNow1;

    global.chatMessage = 'm'+Date.now();
    global.MESSAGE1 = '123';
    global.MESSAGE2 = '321';

    global.tagName = 't' + Date.now();
    global.tagNameNew = tagName;
    global.tagNameOld = 'TAG1';

//    TASK1 = 'TASK-FOR-UNFOLLOW',
//    TASK2 = 'TASK-FOR-DELETE',
//    TASK3 = 'TASK3',
//    TASK4 = 'TASK-FOR-ARCHIVE',
//    TASK5 = 'TASK-FOR-RENAME',
//    TASK6 = 'RENAMED-TASK',
//    task_names = [TASK1, TASK2, TASK3, TASK4, TASK5],
//    TAG1 = 'TAG1',
//    i = 0,
//    SCREENSHOTPATH = '/Users/vadimnechaev/Desktop/',
//    MESSAGE = 'Сообщение'
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
selena.addModule(client, require("./modules/login.module"));              // checkLogin
selena.addModule(client, require("./modules/basic.module"));              // checkBasic
selena.addModule(client, require("./modules/circle.module"));             // checkCircle
selena.addModule(client, require("./modules/circleMembers.module"));      // checkCircleMembers
selena.addModule(client, require("./modules/sphere.module"));             // checkSphere
selena.addModule(client, require("./modules/sphereContextMenu.module"));  // checkSphereContextMenu
selena.addModule(client, require("./modules/task.module"));               // checkTask
selena.addModule(client, require("./modules/taskContextMenu.module"));    // checkTaskContextMenu
selena.addModule(client, require("./modules/chat.module"));               // checkChat



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
        .checkLogin()
        .checkBasic()
        .checkCircle()
        .checkCircleMembers()
        .checkSphere()
        .checkSphereContextMenu()
        .checkTask()
        .checkTaskContextMenu()
        .checkChat()
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