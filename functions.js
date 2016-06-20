fn = {}

//  , roles = require('/Volumes/Files/vadim.task.dev-lds.ru/public/js/roles.js')
let webdriverio = require('webdriverio') 

  , client = webdriverio.multiremote({
        browserA: { desiredCapabilities: { browserName: 'firefox' } }
      , browserB: { desiredCapabilities: { browserName: 'firefox' } }
    })


chai = require('chai')
should = chai.should()
expect = chai.expect
assert = chai.assert
browserA = client.select('browserA')
browserB = client.select('browserB')

URL = 'http://tm.hub-head.com/'
LOGIN1 = 'vadim+0001@levelup.ru'
LOGIN2 = 'vadim+0002@levelup.ru'
PASS = '123123'
WRONGLOGINPASS = 'mail@mail.mail'

TIMEOUT = 4000
PAUSE = 0
debug = false
dateNow1 = Date.now() + 1

MEMBERRANDOM = 'vadim+' + Date.now() + '@levelup.ru'
MEMBERRANDOMNAME = Date.now()
MEMBER2 = LOGIN2
MEMBER1NAME = 'Vadim 0001'
MEMBER2NAME = 'Vadim 0002'

circleName = 'C' + Date.now()
circleNameBefore = circleName
circleNameAfter = 'C' + dateNow1

taskName = 'T' + Date.now()
taskNameBefore = taskName
taskNameAfter = 'T' + dateNow1

sphereName = 'S' + Date.now()
sphereNameBefore = sphereName
sphereNameAfter = 'S' + dateNow1

chatMessage = 'm' + Date.now()
MESSAGE1 = '123'
MESSAGE2 = '321'

tagName = 't' + Date.now()
tagNameNew = tagName
tagNameOld = 'TAG1'
tabID = ''
  ;

let requiredir = require('requiredir')
  , imports = requiredir("./functions")
  , A
  , B

console.log("Number of imports: " + imports.length);
// console.log("Modules can be accessed as properties to the imports variable: " + imports.myRoutes.name);
// console.log("Modules can also be accessed by Array to access them in order of importing: " + imports.toArray().length);


client.sessionStart = function () {
    if (debug) { this.checkWindow('sessionStart') }
    return client
        .then(function () {
            return _sessionStart.call(browserB).getTabIds().then(function (tabId) { B = tabId[0] })
                .then(function () {
                    return _sessionStart.call(browserA).getTabIds().then(function (tabId) { A = tabId[0] })
                })
        })
}

function _sessionStart () {
//    if (debug) { this.checkWindow(``) }
    return this
        .init()
        .url(URL)
        .windowHandleSize( { width: 900, height: 1200 } )
        .then(function () {
            browserA.windowHandlePosition( { x: 0   , y: 0 } )
            browserB.windowHandlePosition( { x: 900 , y: 0 } )
        })
        .waitForExist("[name='login']", TIMEOUT)
            .then(result => { result.should.equal(true, ``) })
}

fn.checkWindow = function (funcName) {
    return this
    .getTabIds().then(result => {
        return A == result[0] ? '(A)' : '(B)';
    }).then(function (funcName, ret){
        console.log(ret, funcName)
    }.bind(this, funcName))
}

fn.pageRefresh = function () {
    if (debug) { this.checkWindow('pageRefresh') }
    return this
    .pause(500)
    .refresh()
    .waitForVisible("[role='circlesButton']", TIMEOUT).then(result => 
        result.should.equal(true, ``) )
}

fn.login = function (email, pass) {
    if (debug) { this.checkWindow('login ' + email + pass) }
    return this
    .setValue("[name='login']", email)
//        .waitForValue("[name='login']", TIMEOUT)
//            .then(result => { result.should.equal(true, ``) })
    .setValue("[name='password']", pass)
//    .waitForValue("[type='password']", TIMEOUT)
//        .then(result => { result.should.equal(true, ``) })
    .click(".login-button")
}

fn.loginCorrect = function (email, pass) {
//    if (debug) { this.checkWindow('loginCorrect') }
    return this
    .login(email, pass)
    .waitForExist('.loader', 6000).then(result => {
        result.should.equal(true, 'Loading screen не появился') })
    .waitForExist('.loader', TIMEOUT, true).then( function (result) {
        result.should.equal(true, 'Loading screen не пропал') }
            , function (error) { if (debug) this.checkWindow('Завис прелоадер')
                  return this
                      .pageRefresh()
                      .waitForExist('.loader', TIMEOUT, true)
                      .then(result => { result.should.equal(true, 'Система не грузится. Прелоадер не пропал после рефреша') })
            })
    .waitForVisible("[role='mainButton']", TIMEOUT).then(result => {
        result.should.equal(true, 'Главная кнопка не появилась') })
}

fn.logout = function () {
    if (debug) this.checkWindow('logout')
    return this
    .circleListOpen()
    .click(".logout-button")
    .waitForVisible(".login-button", TIMEOUT).then(result => {
        result.should.equal(true, 'Логаут не выполнен. Страница авторизации не открылась') })
}

fn.QCLOpen = function () {
    if (debug) { this.checkWindow('QCLOpen') }
    return this
    .moveToObject("[role='mainButton']")
    .waitForVisible("[role='qclForm']", TIMEOUT).then(result => {
        result.should.equal(true, 'QCL не появился при наведении на (+)') })
}

fn.notifListOpen = function () {
    if (debug) { this.checkWindow('notifListOpen') }
    return this
    .click("[role='notifListButton']")
    .waitForVisible("[role='notifList']", TIMEOUT).then(result => {
        result.should.equal(true, 'Список нотификейшенов не открылся') })
}


fn.deleteAll = function (content) {
    if (debug) { this.checkWindow('deleteAll ' + content) }
    var deleteMethod, contentSelector, pipe;
    
    switch(content) {
        case 'circles':
            contentSelector = "[role='test'] [role='circleName']";
            deleteMethod = "circleDelete";
            pipe = this.circleListOpen();
            break;
    
        case 'spheres':
            contentSelector = "[role='spheresRecent'] [role='sphereName']";
            deleteMethod = "sphereDelete";
            pipe = this.sphereListOpen();
            break;
                
        case 'tasks':
            contentSelector = "[role='task'] [role='title']";
            deleteMethod = "taskDelete";
            pipe = this.escape();
            break;
            
    }
    
    return pipe
        .getText(contentSelector)
        .then(
            function (text) {
                if (debug) console.log(content, text);
                if (text.lenght !== 0) {
                    var dfd = this;

                    if (typeof text === "string") text = [text];

                    for (var i = 0; text[i]; i++) {
                        dfd = dfd.then(function (name) {
                            return this[deleteMethod](name);
                        }.bind(dfd, text[i]));
//                        console.log("~~~~~ " + content + " delete ", i, text[i])
                    }

                    return dfd;
                }
            }
        );
    }

// fn.addCommand("sessionEndAll", function () {
//     console.log(" ");
//     console.log("All Sessions is closed.");
//     console.log(" "); 
//     return this
//         .endAll();
// })

fn.escape2 = function () {
    if (debug) this.checkWindow('escape2')
    return this.escape().escape()
}

fn.escape = function () {
    if (debug) {
        this.getCommandHistory()
            .then(function (history) {
                historyStep = history.slice(-3, -1); /*console.log(historyStep[0].name, historyStep[0].args[0]);*/
                this.checkWindow('escape <- ' + historyStep[0].name + '("' + historyStep[0].args + '") <- ' + historyStep[1].name + '("' + historyStep[1].args + '")')
            })
    }
    return this.keys(['Escape'])
}


for (var i in fn) {
    client.addCommand(i, fn[i])
}

// for (var i in sphere) {
//     client.addCommand(i, sphere[i])
// }

module.exports = client;

before('start()', function () {
    this.timeout(99999999);
    return client.sessionStart()
}, 3)

after('end()', () => client.end() )