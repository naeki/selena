fn.sphereListOpen = function () {
    if (debug) { this.checkWindow('sphereListOpen') }
    return this
    
    .isVisible("[role='spheresListButton']", TIMEOUT).then(result => {
        result.should.equal(true, 'Кнопка открытия сайдбара не найдена') })
//    .isVisible("[role='dropdown']", TIMEOUT)
//        .then(result => { if result { return this.escape() } })
    .isVisible("//*[@role='sphereName' and contains(text(), 'My sphere')]", TIMEOUT)
        .then(result => {
            if (!result) { return this.click("[role='spheresListButton']") }
        })
    .waitForExist('[role="mySphere"]', TIMEOUT).then(result => {
        result.should.equal(true, 'Сайдбар не открылся') })
}

/*fn.sphereListOpen = function () {
    if (debug) { this.checkWindow('sphereListOpen') }
    return this
    .isVisible('[role="mySphere"]')
        .then(function () { console.log('Mysphere visible'); this.escape().click("[role='spheresListButton']") }
            , function () { console.log('Mysphere invisible'); this.click("[role='spheresListButton']") })
//    .isVisible("[role='spheresListButton']", TIMEOUT)
//        .then(result => { result.should.equal(true, 'Кнопка открытия сайдбара не найдена') })
//    .click("[role='spheresListButton']")
    .waitForExist('[role="mySphere"]', TIMEOUT).then(result => {
        result.should.equal(true, 'Сайдбар не открылся') })
}*/

fn.sphereDDOpen = function (sphereName) {
    var sphereNameMenuSeletor = "//*[@role='sphereName' and contains(text(),'" + sphereName + "')]/../../*[@role='sphereMenu']"
    if (debug) { this.checkWindow('sphereDDOpen ' + sphereName) }
    return this
    .waitForVisible(sphereNameMenuSeletor, TIMEOUT).then(result => {
        result.should.equal(true, 'Сфера ' + sphereName + ' не найдена') })
    .click(sphereNameMenuSeletor)
    .waitForVisible("[title*='Settings']", TIMEOUT).then(result => {
        result.should.equal(true, 'Контекстное меню сферы ' + sphereName + ' не открылось') })
}

fn.sphereSettingsOpen = function (sphereName) {
    if (debug) { this.checkWindow('sphereSettingsOpen ' + sphereName) }
    return this
    .click("[title*='Settings']")
    .waitForVisible("//*[@role='sphereCard']//*[@role='sphereName' and contains(text(),'" + sphereName + "')]", TIMEOUT).then(result => {
        result.should.equal(true, 'Карточка сферы' + sphereName + 'не открылась') })
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
    .waitForExist('.new-sphere-name', TIMEOUT).then(result => {
        result.should.equal(true, 'Кнопка создания новой сферы не найдена в QCL') })
    .setValue(".new-sphere-name", sphereName)
    .getValue(".new-sphere-name").then( value => {
        value.should.equal(sphereName, 'Новое название не введено') })
    .keys(["Enter"])
    .waitForExist("//div[contains(text(),'" + sphereName + "')]", TIMEOUT).then(result => {
        result.should.equal(true, 'Создание сферы не завершилось. Карточка сферы' + sphereName + 'не окрылась') })
}

fn.sphereDelete = function (sphereName) {
    if (debug) { this.checkWindow('sphereDelete ' + sphereName) }
    return this
    .sphereListOpen()
    .sphereDDOpen(sphereName)
    .sphereSettingsOpen(sphereName)
    .waitForExist("[role='sphereDelete']", TIMEOUT).then(result => {
        result.should.equal(true, 'Кнопка удаления сферы не найдена') })
    .click("[role='sphereDelete']")
    .waitForExist(".dialog-buttons", TIMEOUT).then(result => {
        result.should.equal(true, 'Диалог подтверждения удаления сферы не появился') })
    .keys(["Space"])
    .waitForExist(".dialog-buttons", TIMEOUT, true).then(result => {
        result.should.equal(true, 'Диалог подтверждения удаления сферы не пропал') })
    .sphereListOpen()
    .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)  .then(result => {
        result.should.equal(true, ``) })
    .escape()
}

fn.sphereDeleteAny = function () {
    if (debug) { this.checkWindow('sphereDeleteAny') }
    var sphereName;
    return this
    .sphereListOpen()
    .getText("//*[@role='spheresRecent']//*[@role='sphereName']")
    .then(
        text => {
            sphereName = text[0];
            return this.sphereDelete(sphereName)
        });
}

fn.sphereChatOpenCurrent = function () {
    if (debug) { this.checkWindow('sphereChatOpenCurrent') }
    return this
    .click("[role='chat-button']")
    .waitForVisible("[role='sphereFocus']", TIMEOUT).then(result => {
        result.should.equal(true, 'Чат сферы не открылся') })
}


// for (var i in fn) {
//     client.addCommand(i, fn[i])
// }

module.exports = fn;
