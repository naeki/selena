client = require("../functions");

describe('Карточка', function () {
//    this.retries(2)
		this.timeout(99999999)
    
    before(function () {
        return client
        .sessionStart().loginCorrect(LOGIN1, PASS)
        })


    afterEach('sync() после каждого теста', function () {
        return client.sync().pause(PAUSE)
    })
    
    after('end()', function () {
        return client.end()
    })

    describe('Простые действия', function () {
        var cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"
        
        describe('Создание карточки', function () {
            
            it('(A) Открываем форму создания карточки', function () {
                return browserA
                .click("[role='mainButton']")
                .waitForVisible("[role='form']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Форма создания карточки не открылась') })                
            })
                        
            it('(A) Проверяем, что тайтл в форме пустой', function () {
                return browserA
                .getText("[role='form'] [role='title'].in-edit")
                    .then(function (text) { text.should.equal('', 'Тайтл не пустой') })               
            })
            
            it('(A) Вводим название', function () {
                return browserA
                .keys(taskName)
                .getText("[role='form'] [role='title'].in-edit")
                    .then(function (text) { text.should.equal(taskName, 'Название не введено') })
            })
            
            it('(A) Создаем карточку', function () {
                return browserA
//                .click("[role='mainButton']") // пока нет кнопки завершения
                .keys(['Command', 'Enter']).keys(['Command'])
                .waitForVisible("[role='form'] [role='title']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Форма не закрылась') })
            })

            it('(AB) Проверяем', function () {
                return client
                .waitForVisible(cardTitleInTree, TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Карточка не создалась') })
            })
        })

        describe('Удаление карточки (созданной предыдущим тестом)', function () {
            
            before('(B) Открываем ДД карточки ' + taskName, function () {
                return browserB.taskDDOpen(taskName)
            })
            
            it('(B) Удаляем карточку', function () {
                return browserB
                .click("[title='Delete']")
                .waitForVisible("[role='menuDropdown']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'ДД не пропал') })
            })

            it('(AB) Проверяем, что пропала в дереве', function () {
                return client
                .waitForVisible(cardTitleInTree, TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Карточка не пропала в дереве') })
            })
        })
        
        describe('Переименование карточки', function () {
            var cardTitleInTreeBefore = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameBefore + "')]"
              , cardTitleInTreeAfter = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskNameAfter + "')]"
              , editButton =  "/../../../*[@role='editButton']"
              , titleInEdit =  "[role='task'] [role='title'].in-edit"
              ;
            
            before('(A) Создание карточки', function () {
                return browserA.taskCreate(taskName)
            })
            
            after('(A) Очистка после переименования', function () {
                return browserA.deleteAll('tasks')
            })
            
            it('(A) Наводим на карточку и ждем появление «карандаша»', function () {
                return browserA
                .moveToObject(cardTitleInTreeBefore)
                .waitForVisible(cardTitleInTreeBefore + editButton, TIMEOUT)
                    .then(function (result) { result.should.equal(true, '«Карандаш не появился»') })
            })
            
            it('(A) Начинаем редактирование', function () {
                return browserA
                .click(cardTitleInTreeBefore + editButton)
                .waitForVisible(titleInEdit, TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Режим редактирования не активировался') })
            })
            
            it('(A) Очищаем тайтл', function () {
                return browserA
                .clearElement(titleInEdit)
                .getText(titleInEdit)
                    .then(function (text) { text.should.equal('', 'Тайтл не очищен') })
            })
            
            it('(A) Вводим новое название', function () {
                return browserA
                .keys(taskNameAfter)
                .getText(titleInEdit)
                    .then(function (text) { text.should.equal(taskNameAfter, 'Новое название не введено') })
            })
            
            it('(A) Завершаем редактирование', function () {
                return browserA
                .keys(['Command', 'Enter']).keys(['Command'])
                .waitForVisible(titleInEdit, TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Редактирование не завершилось') })
            })

            it('(AB) Проверка на новое названия', function () {
                return client
                .waitForVisible(cardTitleInTreeAfter, TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Карточка не переименовалась') })
            })
            
        })
        
        describe('Проверка всяких кнопок в открытой карточке', function () {
            
            var params = [
                , { testName : 'Breadcrumbs', selector : '[role="cardCrumbs"]' }
                , { testName : 'Title', selector : '[role="cardTitle"]' }
//                , { testName : 'Description', selector : '[role="cardDescription"]' }
//                , { testName : 'Members', selector : '[role="member"]' }
//                , { testName : 'Tags', selector : '[role="tags"]' }
//                , { testName : 'Tag', selector : '[role="tag"]' }
//                , { testName : 'Files', selector : '[role="files"]' }
                , { testName : 'Focus button', selector : '[role="focus"]' }
                , { testName : 'Reminder', selector : '[role="reminder"]' }
                , { testName : 'Unfollow button', selector : '[role="unfollow"]' }
                , { testName : 'Archive button', selector : '[role="archive"]' }
                , { testName : 'Delete button', selector : '[role="delete"]' }
                , { testName : 'Go to tree button', selector : '[role="gotoTree"]' }
                , { testName : 'Menu button', selector : '[role="cardMenu"]' }
                

            ];
        
            before('(A) создание и открытие карточки', function () {
                return browserA
                .taskCreate(taskName)
                .taskCardOpen(taskName)
            })
            
            after('(A) Очистка после проверки наличия элементов открытой карточки', function () {
                return browserA.deleteAll('tasks')
            })
                    
            params.forEach(function (arr) {
                it('(A) ' + arr.testName, function() {
                    return browserA
                    .isExisting(arr.selector)
                        .then(function (result) { result.should.equal(true, arr.testName + ' not found') })

                })
            })
            
            describe('Проверка контекстного меню открытой карточки', function () {
                
                var params = [
                  , { testName : 'Colors', selector : '[role="colors"]' }
                  , { testName : 'Deadline Tomorrow', selector : '[role="deadline"][title="Tomorrow"]' }
                  , { testName : 'Deadline Today', selector : '[role="deadline"][title="Today"]' }
                  , { testName : 'Deadline Custom', selector : '[role="deadline"][title="Custom"]' }
                  , { testName : 'Members', selector : '[role="member"]' }
//                  , { testName : 'Теги', selector : '[role="tag"]' }
                  , { testName : 'Input для создания тэга', selector : '[role="tagInput"]' }

                ];
            
                before('(A) открытие контекстного меню', function () {
                    return browserA
                    .waitForExist('[role="cardMenu"]', TIMEOUT)
                        .then(function (result) { result.should.equal(true, "Кнопка меню не найдена") })
                    .waitForVisible('[role="cardMenu"]', TIMEOUT)
                        .then(function (result) { result.should.equal(true, "Кнопка меню не видна") })
                    .click('[role="cardMenu"]').click('[role="cardMenu"]')
                    .waitForVisible('[role="menuDropdown"],[role="dropdown"]', TIMEOUT)
                        .then(function (result) { result.should.equal(true, "Дропдаун контекстного меню не открылся") })
                })
                
                after('(A) escape()', function () {
                    return browserA.escape2()
                })
                
                params.forEach(function (arr) {
                    it('(A) ' + arr.testName, function() {
                        return browserA
                        .isExisting(arr.selector)
                            .then(function (result) { result.should.equal(true, arr.testName + ' not found') })

                    })
                })
            
            })
        
        })

    })
    
    describe('Удаление/восстановление из открытой карточки', function () {
        var taskName = global.taskName + 'd'
          , cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"

        describe('Удаление', function () {
            
            before('(A) Создание карточки', function () {
                return browserA.taskCreate(taskName).taskCardOpen(taskName)
            })

/*            it('(A) Открываем карточку', function () {
                return browserA
            })*/

            it('(A) Проверяем наличие пункта Delete и кликаем на него', function () {
                return browserA
                .waitForVisible("[role='delete']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Пункт delete не найден') })
                .click("[role='delete']")
            })

            it('(A) Delete -> Recover', function () {
                return browserA
                .waitForVisible("[role='delete']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Delete не пропал') })
                .waitForVisible("[role='recover']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Recover не появился') })
            })

            it('(B) Карточка пропала в дереве', function () {
                return browserB
                .waitForVisible(cardTitleInTree, TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Карточка не пропала') })
            })
            
        })
            
        describe('Восстановление', function () {
            
            after('(A) Очистка после восстановления', function () {
                return browserA.deleteAll('tasks')
            })
            
            it('(A) Восстанавливаем', function () {
                return browserA
                .click("[role='recover']")
                .waitForVisible("[role='recover']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Recover не пропал') })
                .waitForVisible("[role='delete']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Delete не появился') })
                .escape()
            })

            it('(AB) Карточка появилась в дереве', function () {
                return client
                .waitForVisible(cardTitleInTree, TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Карточка не видна в дереве') })
            })
            
        })
    })

    describe('Архивация/разархиваиця из открытой карточки', function () {
        var taskName = global.taskName + 'a'
          , cardTitleInTree = "//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]"

        describe('Архивация', function () {

            before('(A) Создание карточки', function () {
                return browserA
                .taskCreate(taskName)
                .taskCardOpen(taskName)
            })

            it('(A) Архивируем', function () {
                return browserA
                .waitForVisible("[role='archive']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Archive отсутствует') })
                .click("[role='archive']")
                .waitForVisible("[role='archive']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Archive не пропал') })
                .waitForVisible("[role='extract']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Extract не появился') })
            })

            it('(B) Проверка во втором окне', function () {
                return browserB
                .waitForVisible(cardTitleInTree, TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Карточка не пропала') })
            })

        })

        describe('Разархиваиця', function () {

            after('(A) Очистка после разархивации', function () {
                return browserA
                    .deleteAll('tasks')
            })

            it('(A) Разархивируем', function () {
                return browserA
                .waitForVisible("[role='extract']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Extract отсутсвует') })
                .click("[role='extract']")
            })

            it('(A) Проверяем пункт в карточке', function () {
                return browserA
                .waitForVisible("[role='extract']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Extract не пропал') })
                .waitForVisible("[role='archive']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Archive не появился') })
                .escape()
            })

            it('(AB) Проверка во втором окне', function () {
                return client
                .waitForVisible(cardTitleInTree, TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Карточка не появилась') })
            })


        })
    })
})
