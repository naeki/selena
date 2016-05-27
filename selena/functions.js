var selena = require("./clientExtended");
var fn = {};
var env = process.env;
// var env = require('./env');


fn.sessionStart = function() {
    global.tabMap = {};
    return this
    .init()
    .getCurrentTabId()
        .then(function(tabId) {
            global.tabMap.first = tabId;
            global.tabMap[tabId] = 'FIRST';
        })
    .url(env.url)
    .windowHandleSize({width: 900, height: 1200})
    .windowHandlePosition({x: 0, y: 0})
    .waitForExist("[name='login']", TIMEOUT)
        .then(
            function(){selena.regActionResult("Открытие страницы " + env.url, 1)},
            function(e){selena.regActionResult("Открытие страницы " + env.url + e.message, 0, true)}
        )
};

fn.secondWindow = function() {
  if (!tabMap.second){
    return this
      .newWindow(env.url)
        .waitForVisible("[role='mainButton']", TIMEOUT)
          .then(null, function() {
            selena.regActionResult("Второй таб: Не подключился сокет (завис прелоадер)", 1);
            return this
              .pageRefresh()
              .waitForVisible("[role='mainButton']", TIMEOUT)
          })
      .getCurrentTabId()
        .then(function(tabId) {
          global.tabMap.second = tabId;
          global.tabMap[tabId] = 'SECOND';
        })
      .windowHandlePosition({x: 900, y: 5})
        .then(
          function(){selena.regActionResult("Открытие второго таба с адресом " + env.url, 1)},
          function(e){selena.regActionResult("Открытие второго таба с адресом " + env.url + e.message, 0, true)}
        )
      .switchTab(tabMap.first)
  } else {
      return this
        .switchTab(tabMap.second)
        .pageRefresh()
        .switchTab(tabMap.first)
  }
};

fn.sessionEnd = function() {
    console.log(" ");
    console.log("Session is done.");
    console.log(" "); 
    return this
        .end();
};

fn.pageRefresh = function() {
    return this
    .pause(500)
    .refresh()
    .waitForVisible("[role='circlesButton']", TIMEOUT).then(
        function(){selena.regActionResult("Рефреш страницы ", 1)},
        function(e){selena.regActionResult("Рефреш страницы " + e.message, 0, true)}
    );
};

fn.login = function(email, pass) {
  return this
    .setValue("[type='email']", email)
      .waitForValue("[type='email']", TIMEOUT)
//        .then(
//          function(){selena.regActionResult("Ввод " + email + " в поле email", 1)},
//          function(e){selena.regActionResult(email + " в поле email не ввелось " + e.message, 0, true)}
//        )
    .setValue("[type='password']", pass)
      .waitForValue("[type='password']", TIMEOUT)
//        .then(
//          function(){selena.regActionResult("Ввод " + pass + " в поле password", 1)},
//          function(e){selena.regActionResult(pass + " в поле password не ввелось " + e.message, 0, true)}
//        )
    .click(".login-button")
      .then(
        function(){selena.regActionResult("Авторизация с " + email + " и " + pass, 1)}
      )
};

fn.loginCorrect = function(email, pass) {
    return this
    .login(email, pass)
    .waitForVisible("[role='mainButton']", TIMEOUT).then(
        function(){
        selena.regActionResult("Успешая авторизация и открытие системы (появление кнопки '+')", 1)
        },
        function(e){
        selena.regActionResult("Завис прелоадер (не подключился сокет) " + e.message, 0)
        
            return this
            .pageRefresh()
            .waitForVisible("[role='mainButton']", TIMEOUT).then(
                function(){selena.regActionResult("Успешая авторизация и открытие системы (появление кнопки '+')", 1)},
                function(e){selena.regActionResult("Второй раз зависший прелоадер " + e.message, 0, true)}
            )
    })

    .pause(500)
};

fn.logout = function() {
    return this
    .circleListOpen()
    .click(".logout-button")
    .waitForExist(".login-button", TIMEOUT).then(
        function(){selena.regActionResult("Логаут и появления формы авторизации", 1)},
        function(e){selena.regActionResult("Логаут и появления формы авторизации " + e.message, 0, true)}
    )
};

fn.circleListOpen = function() {
    var message = arguments[0] || "Список кругов открылся";
    return this
    .QCLOpen()
    .waitForVisible("[role='circlesButton']", TIMEOUT).then(
        null
        //          function(){selena.regActionResult("Кнопка открытия списка кругов доступна. Кликаем.", 1)}
        ,
        function(e){selena.regActionResult("Кнопка открытия списка кругов не доступна " + e.message, 0)}
    )
    .click("[role='circlesButton']")
    .waitForVisible("[role='circleCreateButton']", TIMEOUT).then(
        function(){selena.regActionResult(message, 1)},
        function(e){selena.regActionResult("Список кругов не открылся. " + e.message, 0, true)}
    )
}

fn.circleSettingsOpen = function(circleName) {
  return this
    .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
      .then(
        null,/*function(){selena.regActionResult("Круг " + circleName + " найден в списке кругов. Кликаем по нему.", 1)},*/
        function(e){selena.regActionResult("Круг " + circleName + " не найден в списке кругов. " + e.message, 0, true)}
      )
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]")
        .waitForExist("[role='role']", TIMEOUT)
          .then(
            function(){selena.regActionResult("Настройки круга " + circleName + " открылись.", 1)},
            function(e){selena.regActionResult("Настройки круга " + circleName + " не открылись. " + e.message, 0, true)}
          )
}

fn.circleCreateNew = function(circleName) {
    return this
    .click("[role='circleCreateButton']")
    .waitForVisible("[role='newCircleName']", TIMEOUT)
    //        .then(
    //          function(){selena.regActionResult("Открытие формы создания нового круга", 1)},
    //          function(e){selena.regActionResult("Открытие формы создания нового круга " + e.message, 0, true)}
    //        )
    .setValue("[role='newCircleName']", circleName)    
    .click("[role='newCircleSave']")
    .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT).then(
        function(){selena.regActionResult("Круг " + circleName + " создан", 1)},
        function(e){selena.regActionResult("Круг " + circleName + " не создан " + e.message, 0, true)}
    )
    .keys(["Escape"]);
}

fn.circleDelete = function(circleName) {
  console.log(circleName);
  return this
  .circleSettingsOpen(circleName)
  .click("[role='circleDelete']")
  .keys(["Space"])
  .circleListOpen()
    .isExisting("//*[@role='circleName' and contains(text(),'" + circleName + "')]", TIMEOUT).then(
        function(){selena.regActionResult("Круг " + circleName + " удален ", 1)},
        function(e){selena.regActionResult("Круг " + circleName + " не удален " + e.message, 0, true)}
      );
}

fn.circleMemberInvite = function(circleName, memberLogin) {
  return this

  .circleListOpen()
  .circleSettingsOpen(circleName)
  .click("[role='addUser']")
    .waitForExist("[role='findUser']", TIMEOUT)
  .setValue("[role='findUser']", memberLogin)
    .waitForExist("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
  .click("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]")
    .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT).then(
        function(){selena.regActionResult("Зарегистрированный юзер " + memberLogin + " приглашен в круг " + circleName, 1)},
        function(e){selena.regActionResult("Зарегистрированный юзер " + memberLogin + " не приглашен в круг " + circleName + " " + e.message, 0)}
      )
  .keys(["Escape"])
  ;
}

fn.QCLOpen = function() {
    return this
    .moveToObject("[role='mainButton']")
    .waitForVisible("[role='createSphere']", TIMEOUT).then(
        null
//                function(){selena.regActionResult("Наведение на «+» и появление кнопок создания сферы/карточек", 1)}
        ,
        function(e){selena.regActionResult("Наведение на «+» и появление кнопок создания сферы/карточек " + e.message, 0, true)}
    )
    ;
}

fn.sphereListOpen = function() {
    var message = arguments[0] || "Открываем список сфер";
    return this
    .waitForVisible("[role='spheresListButton']", TIMEOUT).then(
        null/*function(){selena.regActionResult("Кнопка открытия списка сфер доступна. Кликаем.", 1)}*/,
        function(e){selena.regActionResult("Кнопка открытия списка сфер не доступна " + e.message, 0, true)}
    )
    .click("[role='spheresListButton']")
    .waitForExist("[role='sphereName']", TIMEOUT).then(
        function(){selena.regActionResult(message, 1)},
        function(e){selena.regActionResult("Список сфер не открылся " + e.message, 0, true)}
    )
    ;
}
 
fn.sphereDDOpen = function(sphereName) {
    return this
    .waitForVisible("//*[@role='sphereName' and contains(text(),'" + sphereName + "')]", TIMEOUT).then(
        null/*function(){selena.regActionResult("Сфера присутствует " + sphereName + " в списке сфер", 1)}*/,
        function(e){selena.regActionResult("Сфера отсутствует " + sphereName + " в списке сфер " + e.message, 0, true)}
    )
    .click("//*[@role='sphereName' and contains(text(),'" + sphereName + "')]/../../*[@role='sphereMenu']")
    .waitForVisible("[title*='Settings']", TIMEOUT).then(
        function(){selena.regActionResult("Открываем контекстное меню сферы " + sphereName, 1)},
        function(e){selena.regActionResult("Контекстное меню сферы " + sphereName + " не открылось " + e.message, 0, true)}
    )
    ;
}
 
fn.sphereSettingsOpen = function(sphereName) {
    return this
    .sphereDDOpen(sphereName)
    .click("[title*='Settings']")
    .waitForVisible("//*[@role='sphereCard']//*[@role='sphereName' and contains(text(),'" + sphereName + "')]", TIMEOUT).then(
        function(){selena.regActionResult("Открываем настройки сферы " + sphereName, 1)},
        function(e){selena.regActionResult("Настройки сферы " + sphereName + " открылись " + e.message, 0, true)}
    );
}
 
fn.switchTabAndCallback = function(windowName) {
  return this
    .switchTab(windowName)
      .then(
        function(){selena.regActionResult("Переключение в таб " + global.tabMap[windowName], 1)},
        function(e){selena.regActionResult("Переключение в таб " + global.tabMap[windowName] + " " + e.message, 0, true)}
      );
}
  
fn.switchUser = function(email, pass) {
  return this
    .switchTab(tabMap.first)
    .logout()
    .loginCorrect(email, pass)
/*    .switchTab(tabMap.second)
    .pageRefresh()
    .switchTab(tabMap.first)*/
      .then(
        function(){selena.regActionResult("ПЕРЕЛОГИН в " + email, 1)},
        function(e){selena.regActionResult("ПЕРЕЛОГИН в " + email + " " + e.message, 0, true)}
      );
}
 
fn.sphereCreate = function(sphereName) {
    return this
    .QCLOpen()
    .click("[role='createSphere']")
        .waitForExist('.new-sphere-name', TIMEOUT)
    .setValue(".new-sphere-name", sphereName)
    .keys(["Enter"])
    .waitForExist("//div[contains(text(),'" + sphereName + "')]", TIMEOUT).then(
        function(){selena.regActionResult("Сфера " + sphereName + " создана", 1)},
        function(e){selena.regActionResult("Сфера " + sphereName + " не создана  " + e.message, 0, true)}
    )
    ;
}
 
fn.sphereDelete = function(sphereName) {
    return this
        .sphereSettingsOpen(sphereName)
        .sphereListOpen()
        .waitForExist("[role='sphereDelete']", TIMEOUT)
        .click("[role='sphereDelete']")
        .waitForExist("//*[contains(@class,'dialog-buttons')]", TIMEOUT)
        .keys(["Space"])
        .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true).then(
            function(){selena.regActionResult("Сфера " + sphereName + " удалена", 1)},
            function(e){selena.regActionResult("Сфера " + sphereName + " не удалена " + e.message, 0, true)}
        )
    //    .keys(["Escape"])

    ;
}
 
fn.sphereDeleteAny = function() {
    var sphereName;
    return this
    .sphereListOpen()
    .getText("//*[@role='spheresRecent']//*[@role='sphereName']")        
        .then(
            function(text) {
            sphereName = text[0];
            return this
                .sphereDelete(sphereName)
        })
    ;
}

fn.sphereChatOpenCurrent = function() {
    return this
    .click("[role='chat-button']")
    .waitForVisible("[role='sphereFocus']", TIMEOUT).then(
        function(){selena.regActionResult("Чат текущей сферы открылся", 1)},
        function(e){selena.regActionResult("Чат текущей сферы не открылся " + e.message, 0, true)}
    )
}

fn.notifListOpen = function() {
    return this
    .click("[role='notifListButton']")
    .waitForVisible("[role='notifList']", TIMEOUT).then(
        function(){selena.regActionResult("Список нотификейшенов открыт", 1)},
        function(e){selena.regActionResult("Список нотификейшенов открыт " + e.message, 0, true)}
    )
}

fn.TaskCreateFormOpen = function() {
    console.log("TaskCreateFormOpen");
    return this
        .click("[role='mainButton']")
            .waitForExist("[role='form']", TIMEOUT)
                .then(
                    function(){selena.regActionResult("Открываем форму создания карточки", 1)},
                    function(e){selena.regActionResult("Форма создания карточки не открылась. " + e.message, 0, true)}
                )
}

fn.taskCreate = function(taskName) {
    console.log("taskCreate", taskName);
    return this
        .TaskCreateFormOpen()
        .keys(taskName)
        .click("[role='mainButton']")
        .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT).then(
            function(){selena.regActionResult("Создаем карточку " + taskName, 1)},
            function(e){selena.regActionResult("Карточка " + taskName + " не создалась. " + e.message, 0, true)}
        )
}

fn.taskDDOpen = function(taskName) {
  return this
    .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]")
      .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']", TIMEOUT)
    .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']")
      .waitForVisible("[role='menuDropdown']", TIMEOUT).then(
      function(){selena.regActionResult("Контекстное меню карточки " + taskName + " открылось", 1)},
      function(e){selena.regActionResult("Контекстное меню карточки " + taskName + " не открылось " + e.message, 0, true)}
    )
}

fn.taskDelete = function(taskName) {
  return this
    .taskDDOpen(taskName)
    .click("[title='Delete']")
      .waitForExist("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT, true)
        .then(
          function(){selena.regActionResult("Карточка " + taskName + " удалена", 1)},
          function(e){selena.regActionResult("Карточка " + taskName + " не удалилась " + e.message, 0, true)}
        )
}

fn.taskDeleteAll = function() {
  return this
    .keys(["Escape"])
    .getText("//*[@role='task']//*[@role='title']") 
      .then(
        function(text) {
          var dfd = this;

          if (typeof text === "string") text = [text];

          for (var i = 0; text[i]; i++) {
            dfd = dfd.then(function(name){
              return this.taskDelete(name);
            }.bind(dfd, text[i]));
            console.log("~~~~~ Task delete ", i, text[i])
          }    

          return dfd;
        }
        )
    ;
}

fn.circleDeleteAll = function() {
    return this
    .circleListOpen()
    .getText("//*[@role='test']//*[@role='circleName']") 
        .then(
        function(text) {
            var dfd = this;
            if (typeof text === "string") text = [text];
            for (var i = 0; text[i]; i++) {
                dfd = dfd.then(function(name){
                    console.log("all", name, text);
                    return this.circleDelete(name);
                }.bind(dfd, text[i]));
                console.log("~~~~~ Circle delete ", i, text[i])
            }    

            return dfd;
            }
        )
    ;
}
 
fn.sphereDeleteAll = function() {
  return this
  .sphereListOpen()
  .getText("//*[@role='spheresRecent']//*[@role='sphereName']")        
    .then(
      function(text) {
        var dfd = this;
        if (typeof text === "string") text = [text];
        for (var i = 0; text[i]; i++) {
          dfd = dfd.then(function(name){
            return this.sphereDelete(name);
          }.bind(dfd, text[i]));
          console.log("~~~~~ Sphere delete ", i, text[i])
        }    
        return dfd;
      }
    )
  ;
}

fn.taskCardOpen = function(taskName) {
  return this
      .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]", TIMEOUT)
    .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]")
      .waitForVisible("[role='gotoTree']", TIMEOUT)
        .then(
          function(){selena.regActionResult("Карточка " + taskName + " открылась", 1)},
          function(e){selena.regActionResult("Карточка " + taskName + " не открылась " + e.message, 0, true)}
        )
}

// client.addCommand("sessionEndAll", function() {
//     console.log(" ");
//     console.log("All Sessions is closed.");
//     console.log(" "); 
//     return this
//         .endAll();
// })

fn.contextMenu_check = function(title) {
    return this
        .waitForVisible("[title='" + title +"']", TIMEOUT).then(
          function(){selena.regActionResult("Пункт " + title + " присутствует в контекстном меню", 1)},
          function(e){selena.regActionResult("Пункт " + title + " отсутствует в контекстном меню " + e.message, 0, true)}
        )
}

fn.contextMenu_click = function(title) {
    return this
        .click("[title='" + title + "']")
}





module.exports = fn;