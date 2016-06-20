fn.TaskCreateFormOpen = function () {
    if (debug) { this.checkWindow('TaskCreateFormOpen') }
    return this
    .click("[role='mainButton']")
    .waitForVisible("[role='form']", TIMEOUT).then(result => {
        result.should.equal(true, 'Форма создания карточки не открылась') })
}

fn.taskCreate = function (taskName) {
    var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
    if (debug) { this.checkWindow('taskCreate ' + taskName) }
    
    return this
    .TaskCreateFormOpen()
    .getText("[role='title'].in-edit").then( text => {
        text.should.equal('', 'Тайтл не пустой') })               
    .keys(taskName)
    .waitForText("[role='title'].in-edit", TIMEOUT).then(result => {
        result.should.equal(true, 'When error') })
    .getText("[role='title'].in-edit").then( text => {
        text.should.equal(taskName, 'Название не введено') })
//    .click("[role='mainButton']") // временно, пока нет кнопки завершения создания
    .keys(['Command', 'Enter']).keys(['Command'])
    .waitForVisible(cardTitleInTree, TIMEOUT).then(result => {
        result.should.equal(true, 'Карточка не создалась') })
}

fn.taskDDOpen = function (taskName) {
    var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
    if (debug) { this.checkWindow('taskDDOpen ' + taskName) }
    return this
    .isExisting(cardTitleInTree).then(result => {
        result.should.equal(true, 'Карточка ' + taskName + ' не найдена') })
    .moveToObject(cardTitleInTree)
    .waitForVisible(cardTitleInTree + "/../../../*[@role='menuButton']", TIMEOUT).then(result => {
        result.should.equal(true, '••• не появились при наведении на ' + taskName) })
    .click(cardTitleInTree + "/../../../*[@role='menuButton']")
    .waitForVisible("[role='menuDropdown']", TIMEOUT).then(result => {
        result.should.equal(true, 'Контекстное меню не появилось') })
}

fn.taskDelete = function (taskName) {
    var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
    if (debug) { this.checkWindow('taskDelete ' + taskName) }
    return this
    .selectorExecute(cardTitleInTree, function (els) { els[0].scrollIntoView() })
    .waitForVisible(cardTitleInTree, TIMEOUT).then(result => {
        result.should.equal(true, "Карточка не в зоне видимости") })
    .taskDDOpen(taskName)
    .click("[title='Delete']")
    .waitForExist(cardTitleInTree, TIMEOUT, true).then(result => {
        result.should.equal(true, 'Карточка не удалилась') })
    
}

fn.taskCardOpen = function (taskName) {
    var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
    if (debug) { this.checkWindow('taskCardOpen ' + taskName) }
    
    return this
    .waitForVisible(cardTitleInTree, TIMEOUT).then(result => {
        result.should.equal(true, 'Карточка не найдена в дереве') })
    .click(cardTitleInTree)
    .waitForVisible("[role='gotoTree']", TIMEOUT).then(result => {
        result.should.equal(true, 'Карточка не открылась') })
}

/*fn.taskCardOpen = function (taskName) { // открытие карточки через кнопку открытия карточки в попапе
    if (debug) { this.checkWindow('taskCardOpen ' + taskName) }
    return this
    .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]")
    .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[@role='editButton']", TIMEOUT).then(result => {
        result.should.equal(true, '«Карандаш не появился»') })
    .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[@role='editButton']")

    .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[@role='editButton']")
    .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[contains(@class,'task-popup-button')]", TIMEOUT).then(result => {
        result.should.equal(true, 'Кнопка открытие карточки в попапе не появилась') })
    .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[contains(@class,'task-popup-button')]")
    .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]/../../../*[contains(@class,'task-popup-button')]")
    .waitForVisible("[role='gotoTree']", TIMEOUT).then(result => {
        result.should.equal(true, ``) })
}*/

// fn.addCommand("sessionEndAll", function () {
//     console.log(" ");
//     console.log("All Sessions is closed.");
//     console.log(" "); 
//     return this
//         .endAll();
// })

module.exports = fn;
