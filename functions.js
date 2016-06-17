var webdriverio = require('webdriverio') 
//  , requireDir = require('require-dir') // https://github.com/aseemk/requireDir
  , chai = require('chai').should()
  , fn = {}
  , debug = false
  , A
  , B


//  , roles = require('/Volumes/Files/vadim.task.dev-lds.ru/public/js/roles.js')


    client = webdriverio.multiremote({
        browserA: { desiredCapabilities: { browserName: 'firefox' } }
      , browserB: { desiredCapabilities: { browserName: 'firefox' } }
//      , browserB: { desiredCapabilities: { browserName: 'phantomjs' } }
    })
  , browserA = client.select('browserA')
  , browserB = client.select('browserB')

  , URL = 'http://tm.hub-head.com/'
  , LOGIN1 = 'vadim+0001@levelup.ru'
  , LOGIN2 = 'vadim+0002@levelup.ru'
  , PASS = '123123'
  , WRONGLOGINPASS = 'mail@mail.mail'

  , TIMEOUT = 4000
  , PAUSE = 0
  , dateNow1 = Date.now() + 1

  , MEMBERRANDOM = 'vadim+' + Date.now() + '@levelup.ru'
  , MEMBERRANDOMNAME = Date.now()
  , MEMBER2 = LOGIN2
  , MEMBER1NAME = 'Vadim 0001'
  , MEMBER2NAME = 'Vadim 0002'

  , circleName = 'C' + Date.now()
  , circleNameBefore = circleName
  , circleNameAfter = 'C' + dateNow1

  , taskName = 'T' + Date.now()
  , taskNameBefore = taskName
  , taskNameAfter = 'T' + dateNow1

  , sphereName = 'S' + Date.now()
  , sphereNameBefore = sphereName
  , sphereNameAfter = 'S' + dateNow1

  , chatMessage = 'm' + Date.now()
  , MESSAGE1 = '123'
  , MESSAGE2 = '321'

  , tagName = 't' + Date.now()
  , tagNameNew = tagName
  , tagNameOld = 'TAG1'
  , tabID = ''
  ;

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
//    if (debug) { this.checkWindow('') }
    return this
        .init()
        .url(URL)
        .windowHandleSize( { width: 900, height: 1200 } )
        .then(function () {
            browserA.windowHandlePosition( { x: 0   , y: 0 } )
            browserB.windowHandlePosition( { x: 900 , y: 0 } )
        })
        .waitForExist("[name='login']", TIMEOUT)
            .then(function (result) { result.should.equal(true, '') })
}

fn.checkWindow = function (funcName) {
    return this
    .getTabIds().then(function (result) {
        return A == result[0] ? '(A)' : '(B)';
    }).then(function(funcName, ret){
        console.log(ret, funcName)
    }.bind(this, funcName))
}

fn.pageRefresh = function () {
    if (debug) { this.checkWindow('pageRefresh') }
    return this
    .pause(500)
    .refresh()
    .waitForVisible("[role='circlesButton']", TIMEOUT)
        .then(function (result) { result.should.equal(true, '') })
};

fn.login = function (email, pass) {
    if (debug) { this.checkWindow('login ' + email + pass) }
    return this
    .setValue("[name='login']", email)
//        .waitForValue("[name='login']", TIMEOUT)
//            .then(function (result) { result.should.equal(true, '') })
    .setValue("[name='password']", pass)
//    .waitForValue("[type='password']", TIMEOUT)
//        .then(function (result) { result.should.equal(true, '') })
    .click(".login-button")
};

fn.loginCorrect = function (email, pass) {
//    if (debug) { this.checkWindow('loginCorrect') }
    return this
    .login(email, pass)
    .waitForExist('.loader', 6000)
        .then(function (result) { result.should.equal(true, 'Loading screen не появился') })
    .waitForExist('.loader', TIMEOUT, true)
        .then(function (result) { result.should.equal(true, 'Loading screen не пропал') }
            , function (error) { if (debug) this.checkWindow('Завис прелоадер')
                  return this
                      .pageRefresh()
                      .waitForExist('.loader', TIMEOUT, true)
                      .then(function (result) { result.should.equal(true, 'Система не грузится. Прелоадер не пропал после рефреша') })
            })
    .waitForVisible("[role='mainButton']", TIMEOUT)
        .then(
            function (result) { result.should.equal(true, 'Главная кнопка не появилась') })
}

fn.logout = function () {
    if (debug) this.checkWindow('logout')
    return this
    .circleListOpen()
    .click(".logout-button")
    .waitForVisible(".login-button", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Логаут не выполнен. Страница авторизации не открылась') })
}

fn.circleListOpen = function () {
    if (debug) { this.checkWindow('circleListOpen') }
    return this
    .click("[role='test']")
        .then(function () { if (debug) { this.checkWindow('Список кругов виден') } }
            , function () { if (debug) { this.checkWindow('Список кругов не виден. Открываем') }
                return this.click("[role='circlesButton']")
                    .waitForExist("[role='circleCreateButton']", TIMEOUT)
                        .then(function (result) { result.should.equal(true, 'Список кругов не открылся') })
        })
}

fn.circleSettingsOpen = function (circleName) {
    if (debug) { this.checkWindow('circleSettingsOpen ' + circleName) }
    return this
    .selectorExecute("//*[@role='circleName'][contains(text(),'" + circleName + "')]", function(els) { els[0].scrollIntoView() })
    .waitForVisible("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Круг не найден') })
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]")
    .waitForVisible("[role='role']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Попап настроек круга не открылся') })
}

fn.circleCreateNew = function (circleName) {
    if (debug) { this.checkWindow('circleCreateNew ' + circleName) }
    return this
    .selectorExecute("[role='circleCreateButton']", function(els) { els[0].scrollIntoView() })
    .waitForVisible("[role='circleCreateButton']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Кнопка создания круга отсутствует') })
    .click("[role='circleCreateButton']")
    .waitForVisible("[role='newCircleName']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Поле для ввода названия нового круга не найдено') })
    .setValue("[role='newCircleName']", circleName)
    .click("[role='newCircleSave']")
    .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Новый круг не появился в списке кругов (не создан)') })
    .escape();
}

fn.circleDelete = function (circleName) {
    if (debug) { this.checkWindow('circleDelete ' + circleName) }
    return this
    .circleSettingsOpen(circleName)
    .click("[role='circleDelete']")
    .keys(["Space"])
    .waitForExist("//*[@role='circleName' and contains(text(),'" + circleName + "')]", TIMEOUT, true)
        .then(function (result) { result.should.equal(true, 'Круг найден (не удален)') })
}

fn.circleMemberInvite = function (circleName, memberLogin) {
    if (debug) { this.checkWindow('circleMemberInvite') }
    return this
    .click("[role='addUser']")
    .waitForExist("[role='findUser']", TIMEOUT)
        .then(function (result) { result.should.equal(true, '') })
    .setValue("[role='findUser']", memberLogin)
    .waitForExist("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
        .then(function (result) { result.should.equal(true, '') })
    .click("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]")
    .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
        .then(function (result) { result.should.equal(true, '') })
    .escape();
}

fn.QCLOpen = function () {
    if (debug) { this.checkWindow('QCLOpen') }
    return this
    .moveToObject("[role='mainButton']")
    .waitForVisible("[role='qclForm']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'QCL не появился при наведении на (+)') })
}

fn.sphereListOpen = function () {
    if (debug) { this.checkWindow('sphereListOpen') }
    return this
    
    .isVisible("[role='spheresListButton']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Кнопка открытия сайдбара не найдена') })
//    .isVisible("[role='dropdown']", TIMEOUT)
//        .then(function (result) { if (result) { return this.escape() } })
    .isVisible("//*[@role='sphereName' and contains(text(), 'My sphere')]", TIMEOUT)
        .then(function (result) {
            if (!result) { return this.click("[role='spheresListButton']") }
        })
    .waitForExist('[role="mySphere"]', TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Сайдбар не открылся') })
}

/*fn.sphereListOpen = function () {
    if (debug) { this.checkWindow('sphereListOpen') }
    return this
    .isVisible('[role="mySphere"]')
        .then(function () { console.log('Mysphere visible'); this.escape().click("[role='spheresListButton']") }
            , function () { console.log('Mysphere invisible'); this.click("[role='spheresListButton']") })
//    .isVisible("[role='spheresListButton']", TIMEOUT)
//        .then(function (result) { result.should.equal(true, 'Кнопка открытия сайдбара не найдена') })
//    .click("[role='spheresListButton']")
    .waitForExist('[role="mySphere"]', TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Сайдбар не открылся') })
}*/

fn.sphereDDOpen = function (sphereName) {
    var sphereNameMenuSeletor = "//*[@role='sphereName' and contains(text(),'" + sphereName + "')]/../../*[@role='sphereMenu']"
    if (debug) { this.checkWindow('sphereDDOpen ' + sphereName) }
    return this
    .waitForVisible(sphereNameMenuSeletor, TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Сфера ' + sphereName + ' не найдена') })
    .click(sphereNameMenuSeletor)
    .waitForVisible("[title*='Settings']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Контекстное меню сферы ' + sphereName + ' не открылось') })
}

fn.sphereSettingsOpen = function (sphereName) {
    if (debug) { this.checkWindow('sphereSettingsOpen ' + sphereName) }
    return this
    .click("[title*='Settings']")
    .waitForVisible("//*[@role='sphereCard']//*[@role='sphereName' and contains(text(),'" + sphereName + "')]", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Карточка сферы' + sphereName + 'не открылась') })
}

fn.switchUser = function (email, pass) {
    if (debug) { this.checkWindow('switchUser') }
    return this
    .logout()
    .loginCorrect(email, pass)
}

fn.sphereCreate = function (sphereName) {
    if (debug) { this.checkWindow('sphereCreate ' + sphereName ) }
    return this
    .QCLOpen()
    .click("[role='createSphere']")
    .waitForExist('.new-sphere-name', TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Кнопка создания новой сферы не найдена в QCL') })
    .setValue(".new-sphere-name", sphereName)
    .getValue(".new-sphere-name")
        .then(function (value) { value.should.equal(sphereName, 'Новое название не введено') })
    .keys(["Enter"])
    .waitForExist("//div[contains(text(),'" + sphereName + "')]", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Создание сферы не завершилось. Карточка сферы' + sphereName + 'не окрылась') })
}

fn.sphereDelete = function (sphereName) {
    if (debug) { this.checkWindow('sphereDelete ' + sphereName) }
    return this
    .sphereListOpen()
    .sphereDDOpen(sphereName)
    .sphereSettingsOpen(sphereName)
    .waitForExist("[role='sphereDelete']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Кнопка удаления сферы не найдена') })
    .click("[role='sphereDelete']")
    .waitForExist(".dialog-buttons", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Диалог подтверждения удаления сферы не появился') })
    .keys(["Space"])
    .waitForExist(".dialog-buttons", TIMEOUT, true)
        .then(function (result) { result.should.equal(true, 'Диалог подтверждения удаления сферы не пропал') })
    .sphereListOpen()
    .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)  
        .then(function (result) { result.should.equal(true, '') })
    .escape()
}

fn.sphereDeleteAny = function () {
    if (debug) { this.checkWindow('sphereDeleteAny') }
    var sphereName;
    return this
    .sphereListOpen()
    .getText("//*[@role='spheresRecent']//*[@role='sphereName']")
    .then(
        function (text) {
            sphereName = text[0];
            return this.sphereDelete(sphereName)
        });
}

fn.sphereChatOpenCurrent = function () {
    if (debug) { this.checkWindow('sphereChatOpenCurrent') }
    return this
    .click("[role='chat-button']")
    .waitForVisible("[role='sphereFocus']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Чат сферы не открылся') })
}

fn.notifListOpen = function () {
    if (debug) { this.checkWindow('notifListOpen') }
    return this
    .click("[role='notifListButton']")
    .waitForVisible("[role='notifList']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Список нотификейшенов не открылся') })
}

fn.TaskCreateFormOpen = function () {
    if (debug) { this.checkWindow('TaskCreateFormOpen') }
    return this
    .click("[role='mainButton']")
    .waitForVisible("[role='form']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Форма создания карточки не открылась') })
}

fn.taskCreate = function (taskName) {
    var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
    if (debug) { this.checkWindow('taskCreate ' + taskName) }
    
    return this
    .TaskCreateFormOpen()
    .getText("[role='title'].in-edit")
        .then(function (text) { text.should.equal('', 'Тайтл не пустой') })               
    .keys(taskName)
    .waitForText("[role='title'].in-edit", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'When error') })
    .getText("[role='title'].in-edit")
        .then(function (text) { text.should.equal(taskName, 'Название не введено') })
//    .click("[role='mainButton']") // временно, пока нет кнопки завершения создания
    .keys(['Command', 'Enter']).keys(['Command'])
    .waitForVisible(cardTitleInTree, TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Карточка не создалась') })
}

fn.taskDDOpen = function (taskName) {
    var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
    if (debug) { this.checkWindow('taskDDOpen ' + taskName) }
    return this
    .isExisting(cardTitleInTree)
        .then(function (result) { result.should.equal(true, 'Карточка ' + taskName + ' не найдена') })
    .moveToObject(cardTitleInTree)
    .waitForVisible(cardTitleInTree + "/../../../*[@role='menuButton']", TIMEOUT)
        .then(function (result) { result.should.equal(true, '••• не появились при наведении на ' + taskName) })
    .click(cardTitleInTree + "/../../../*[@role='menuButton']")
    .waitForVisible("[role='menuDropdown']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Контекстное меню не появилось') })
}

fn.taskDelete = function (taskName) {
    var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
    if (debug) { this.checkWindow('taskDelete ' + taskName) }
    return this
    .selectorExecute(cardTitleInTree, function(els) { els[0].scrollIntoView() })
    .waitForVisible(cardTitleInTree, TIMEOUT)
        .then(function (result) { result.should.equal(true, "Карточка не в зоне видимости") })
    .taskDDOpen(taskName)
    .click("[title='Delete']")
    .waitForExist(cardTitleInTree, TIMEOUT, true)
        .then(function (result) { result.should.equal(true, 'Карточка не удалилась') })
    
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

fn.taskDeleteAll = function () {
    return this
    .escape()
    .isExisting("//*[@role='task']//*[@role='title']")
        .then(function (result) {
            return this
                .getText("//*[@role='task']//*[@role='title']")
                .then(
                    function (text) {
                        if (text.lenght !== 0) {
                            var dfd = this;

                            if (typeof text === "string") text = [text];

                            for (var i = 0; text[i]; i++) {
                                dfd = dfd.then(function (name) {
                                    return this.taskDelete(name);
                                }.bind(dfd, text[i]));
                                //                       console.log("~~~~~ Task delete ", i, text[i])
                            }

                            return dfd;
                        }
                    }
                );
        })
}

fn.circleDeleteAll = function () {
    return this
    .circleListOpen()
    .getText("//*[@role='test']//*[@role='circleName']")
    .then(
        function (text) {
            var dfd = this;
            if (typeof text === "string") text = [text];
            for (var i = 0; text[i]; i++) {
                dfd = dfd.then(function (name) {
                    console.log("all", name, text);
                    return this.circleDelete(name);
                }.bind(dfd, text[i]));
//                    console.log("~~~~~ Circle delete ", i, text[i])
            }

            return dfd;
        }
    );
}

fn.sphereDeleteAll = function () {
    return this
    .sphereListOpen()
    .getText("//*[@role='spheresRecent']//*[@role='sphereName']")
    .then(
        function (text) {
            var dfd = this;
            if (typeof text === "string") text = [text];
            for (var i = 0; text[i]; i++) {
                dfd = dfd.then(function (name) {
                    return this.sphereDelete(name);
                }.bind(dfd, text[i]));
//                    console.log("~~~~~ Sphere delete ", i, text[i])
            }
            return dfd;
        }
    );
}

fn.taskCardOpen = function (taskName) {
    var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
    if (debug) { this.checkWindow('taskCardOpen ' + taskName) }
    
    return this
    .waitForVisible(cardTitleInTree, TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Карточка не найдена в дереве') })
    .click(cardTitleInTree)
    .waitForVisible("[role='gotoTree']", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Карточка не открылась') })
}

/*fn.taskCardOpen = function (taskName) { // открытие карточки через кнопку открытия карточки в попапе
    if (debug) { this.checkWindow('taskCardOpen ' + taskName) }
    return this
    .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]")
    .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[@role='editButton']", TIMEOUT)
        .then(function (result) { result.should.equal(true, '«Карандаш не появился»') })
    .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[@role='editButton']")

    .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[@role='editButton']")
    .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[contains(@class,'task-popup-button')]", TIMEOUT)
        .then(function (result) { result.should.equal(true, 'Кнопка открытие карточки в попапе не появилась') })
    .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[contains(@class,'task-popup-button')]")
    .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[contains(@class,'task-popup-button')]")
    .waitForVisible("[role='gotoTree']", TIMEOUT)
        .then(function (result) { result.should.equal(true, '') })
}*/

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

module.exports = client;

before('start()', function() {
    this.timeout(99999999);
    return client.sessionStart()
}, 3)

after('end()', function() {
    return client.end()
})  