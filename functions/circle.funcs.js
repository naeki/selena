fn.circleListOpen = function () {
    if (debug) { this.checkWindow('circleListOpen') }
    return this
    .click("[role='circlesButton']")
    .waitForExist("[role='circleCreateButton']", TIMEOUT)
        .then(result => { result.should.equal(true, 'Список кругов не открылся') })
}

/*fn.circleListOpen = function () {
    if (debug) { this.checkWindow('circleListOpen') }
    return this
    .click("[role='test']")
        .then(function () { if (debug) { this.checkWindow('Список кругов виден') } }
            , function () { if (debug) { this.checkWindow('Список кругов не виден. Открываем') }
                return this.click("[role='circlesButton']")
                    .waitForExist("[role='circleCreateButton']", TIMEOUT)
                        .then(result => { result.should.equal(true, 'Список кругов не открылся') })
        })
}*/

fn.circleSettingsOpen = function (circleName) {
    if (debug) { this.checkWindow('circleSettingsOpen ' + circleName) }
    return this
    .selectorExecute("//*[@role='circleName'][contains(text(),'" + circleName + "')]", function (els) { els[0].scrollIntoView() })
    .waitForVisible("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT).then(result => {
        result.should.equal(true, 'Круг не найден') })
    .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]")
    .waitForVisible("[role='role']", TIMEOUT).then(result => {
        result.should.equal(true, 'Попап настроек круга не открылся') })
}

fn.circleCreateNew = function (circleName) {
    if (debug) { this.checkWindow('circleCreateNew ' + circleName) }
    return this
    .selectorExecute("[role='circleCreateButton']", function (els) { els[0].scrollIntoView() })
    .waitForVisible("[role='circleCreateButton']", TIMEOUT).then(result => {
        result.should.equal(true, 'Кнопка создания круга отсутствует') })
    .click("[role='circleCreateButton']")
    .waitForVisible("[role='newCircleName']", TIMEOUT).then(result => {
        result.should.equal(true, 'Поле для ввода названия нового круга не найдено') })
    .setValue("[role='newCircleName']", circleName)
    .click("[role='newCircleSave']")
    .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT).then(result => {
        result.should.equal(true, 'Новый круг не появился в списке кругов (не создан)') })
    .escape();
}

fn.circleDelete = function (circleName) {
    if (debug) { this.checkWindow('circleDelete ' + circleName) }
    return this
    .circleSettingsOpen(circleName)
    .click("[role='circleDelete']")
    .keys(["Space"])
    .waitForExist("//*[@role='circleName' and contains(text(),'" + circleName + "')]", TIMEOUT, true).then(result => {
        result.should.equal(true, 'Круг найден (не удален)') })
}

fn.circleMemberInvite = function (circleName, memberLogin) {
    if (debug) { this.checkWindow('circleMemberInvite') }
    return this
    .click("[role='addUser']")
    .waitForExist("[role='findUser']", TIMEOUT).then(result => {
        result.should.equal(true, ``) })
    .setValue("[role='findUser']", memberLogin)
    .waitForExist("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]", TIMEOUT).then(result => {
        result.should.equal(true, ``) })
    .click("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]")
    .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT).then(result => {
        result.should.equal(true, ``) })
    .escape();
}

module.exports = fn;