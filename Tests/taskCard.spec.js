'user strict';

client = require("../functions");

describe('Карточка', function () {
    this.timeout(99999999)

    before(`(AB) LOGIN1`, () => client.loginCorrect(LOGIN1, PASS) )


    afterEach( 'sync()', () => client.sync().pause(PAUSE) )

    after( 'logout()', () => client.logout() )

    describe('Простые действия', () => {
        let cardTitleInTree = `//*[@role='task']//*[@role='title'][contains(text(),'${taskName}')]`
        
        describe('Создание карточки', () => {
            
            it('(A) Открываем форму создания карточки', () =>
                browserA
                .click("[role='mainButton']")
                .waitForVisible("[role='form']", TIMEOUT).then(result =>
                    result.should.equal(true, 'Форма создания карточки не открылась') )
            )
                        
            it('(A) Проверяем, что тайтл в форме пустой', () =>
                browserA
                .getText("[role='form'] [role='title'].in-edit").then(text =>
                    text.should.equal('', 'Тайтл не пустой') )
            )
            
            it('(A) Вводим название', () =>
                browserA
                .keys(taskName)
                .getText("[role='form'] [role='title'].in-edit").then(text =>
                    text.should.equal(taskName, 'Название не введено') )
            )
            
            it('(A) Создаем карточку', () =>
                browserA
//                .click("[role='mainButton']") // пока нет кнопки завершения
                .keys(['Command', 'Enter']).keys(['Command'])
                .waitForVisible("[role='form'] [role='title']", TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Форма не закрылась') )
            )

            it('(AB) Проверяем', () =>
                client
                .waitForVisible(cardTitleInTree, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, 'Карточка не создалась')
                    result.browserB.should.equal(true, 'Карточка не создалась')
                })
            )
        })

        describe('Удаление карточки (созданной предыдущим тестом)', () => {
            
            before('(B) Открываем ДД карточки ' + taskName, () =>
                browserB.taskDDOpen(taskName)
            )
            
            it('(B) Удаляем карточку', () =>
                browserB
                .click("[title='Delete']")
                .waitForVisible("[role='menuDropdown']", TIMEOUT, true).then(result =>
                    result.should.equal(true, 'ДД не пропал') )
            )

            it('(AB) Проверяем, что пропала в дереве', () =>
                client
                .waitForVisible(cardTitleInTree, TIMEOUT, true).then(result => {
                    result.browserA.should.equal(true, 'Карточка не пропала в дереве')
                    result.browserB.should.equal(true, 'Карточка не пропала в дереве')
                })
            )
        })
        
        describe('Переименование карточки', () => {
            let cardTitleInTreeBefore = `//*[@role='task']//*[@role='title'][contains(text(),'${taskNameBefore}')]`
              , cardTitleInTreeAfter = `//*[@role='task']//*[@role='title'][contains(text(),'${taskNameAfter}')]`
              , editButton =  "/../../../*[@role='editButton']"
              , titleInEdit =  "[role='task'] [role='title'].in-edit"
              ;
            
            before('(A) Создание карточки', () => browserA.taskCreate(taskName) )
            
            after('(A) Очистка после переименования', () => browserA.deleteAll('tasks') )
            
            it('(A) Наводим на карточку и ждем появление «карандаша»', () =>
                browserA
                .moveToObject(cardTitleInTreeBefore)
                .waitForVisible(cardTitleInTreeBefore + editButton, TIMEOUT).then(result =>
                    result.should.equal(true, '«Карандаш не появился»') )
            )
            
            it('(A) Начинаем редактирование', () =>
                browserA
                .click(cardTitleInTreeBefore + editButton)
                .waitForVisible(titleInEdit, TIMEOUT).then(result =>
                    result.should.equal(true, 'Режим редактирования не активировался') )
            )
            
            it('(A) Очищаем тайтл', () =>
                browserA
                .clearElement(titleInEdit)
                .getText(titleInEdit).then(text =>
                    text.should.equal('', 'Тайтл не очищен') )
            )
            
            it('(A) Вводим новое название', () =>
                browserA
                .keys(taskNameAfter)
                .getText(titleInEdit).then(text =>
                    text.should.equal(taskNameAfter, 'Новое название не введено') )
            )
            
            it('(A) Завершаем редактирование', () =>
                browserA
                .keys(['Command', 'Enter']).keys(['Command'])
                .waitForVisible(titleInEdit, TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Редактирование не завершилось') )
            )

            it('(AB) Проверка на новое названия', () => {
                client
                .waitForVisible(cardTitleInTreeAfter, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, 'Карточка не переименовалась')
                    result.browserB.should.equal(true, 'Карточка не переименовалась')
                })
            })
            
        })
        
        describe('Проверка всяких кнопок в открытой карточке', () => {
            
            let params = [
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
        
            before('(A) создание и открытие карточки', () => browserA.taskCreate(taskName) .taskCardOpen(taskName) )
            
            after('(A) Очистка после проверки наличия элементов открытой карточки', () => browserA.deleteAll('tasks') )
                    
            params.forEach( (arr) => {
                it(`(A) ${arr.testName}`, () =>
                    browserA
                    .isExisting(arr.selector).then(result =>
                        result.should.equal(true, `${arr.testName} not found`) )
                )
            })
            
            describe('Проверка контекстного меню открытой карточки', () => {
                
                let params = [
                  , { testName : 'Colors', selector : '[role="colors"]' }
                  , { testName : 'Deadline Tomorrow', selector : '[role="deadline"][title="Tomorrow"]' }
                  , { testName : 'Deadline Today', selector : '[role="deadline"][title="Today"]' }
                  , { testName : 'Deadline Custom', selector : '[role="deadline"][title="Custom"]' }
                  , { testName : 'Members', selector : '[role="member"]' }
//                  , { testName : 'Теги', selector : '[role="tag"]' }
                  , { testName : 'Input для создания тэга', selector : '[role="tagInput"]' }

                ];
            
                before('(A) открытие контекстного меню', () =>
                    browserA
                    .waitForExist('[role="cardMenu"]', TIMEOUT).then(result =>
                        result.should.equal(true, "Кнопка меню не найдена") )
                    .waitForVisible('[role="cardMenu"]', TIMEOUT).then(result =>
                        result.should.equal(true, "Кнопка меню не видна") )
                    .click('[role="cardMenu"]').click('[role="cardMenu"]')
                    .waitForVisible('[role="menuDropdown"],[role="dropdown"]', TIMEOUT).then(result =>
                        result.should.equal(true, "Дропдаун контекстного меню не открылся") )
                )
                
                after('(A) escape()', () => browserA.escape2() )
                
                params.forEach( (arr) => {
                    it(`(A) ${arr.testName}`, () =>
                        browserA
                        .isExisting(arr.selector).then(result =>
                            result.should.equal(true, `${arr.testName} not found`) )

                    )
                })
            
            })
        
        })

    })
    
    describe('Удаление/восстановление из открытой карточки', () => {
        let taskName = global.taskName + 'd'
          , cardTitleInTree = `//*[@role='task']//*[@role='title'][contains(text(),'${taskName}')]`

        describe('Удаление', () => {
            
            before('(A) Создание карточки', () =>
                browserA.taskCreate(taskName).taskCardOpen(taskName)
            )

/*            it('(A) Открываем карточку', () =>
                browserA
            )*/

            it('(A) Проверяем наличие пункта Delete и кликаем на него', () =>
                browserA
                .waitForVisible("[role='delete']", TIMEOUT).then(result =>
                    result.should.equal(true, 'Пункт delete не найден') )
                .click("[role='delete']")
            )

            it('(A) Delete -> Recover', () =>
                browserA
                .waitForVisible("[role='delete']", TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Delete не пропал') )
                .waitForVisible("[role='recover']", TIMEOUT).then(result =>
                    result.should.equal(true, 'Recover не появился') )
            )

            it('(B) Карточка пропала в дереве', () =>
                browserB
                .waitForVisible(cardTitleInTree, TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Карточка не пропала') )
            )
            
        })
            
        describe('Восстановление', () => {
            
            after('(A) Очистка после восстановления', () =>
                browserA.deleteAll('tasks')
            )
            
            it('(A) Восстанавливаем', () =>
                browserA
                .click("[role='recover']")
                .waitForVisible("[role='recover']", TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Recover не пропал') )
                .waitForVisible("[role='delete']", TIMEOUT).then(result =>
                    result.should.equal(true, 'Delete не появился') )
                .escape()
            )

            it('(AB) Карточка появилась в дереве', () =>
                client
                .waitForVisible(cardTitleInTree, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, 'Карточка не видна в дереве')
                    result.browserB.should.equal(true, 'Карточка не видна в дереве')
                })
            )
            
        })
    })

    describe('Архивация/разархиваиця из открытой карточки', () => {
        let taskName = global.taskName + 'a'
          , cardTitleInTree = `//*[@role='task']//*[@role='title'][contains(text(),'${taskName}')]`

        describe('Архивация', () => {

            before('(A) Создание карточки', () =>
                browserA
                .taskCreate(taskName)
                .taskCardOpen(taskName)
            )

            it('(A) Архивируем', () =>
                browserA
                .isExisting("[role='archive']").then(result =>
                    result.should.equal(true, 'Archive отсутствует') )
                .click("[role='archive']")
                .waitForVisible("[role='archive']", TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Archive не пропал') )
                .waitForVisible("[role='extract']", TIMEOUT).then(result =>
                    result.should.equal(true, 'Extract не появился') )
            )

            it('(B) Проверка во втором окне', () =>
                browserB
                .waitForVisible(cardTitleInTree, TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Карточка не пропала') )
            )

        })

        describe('Разархиваиця', () => {

            after('(A) Очистка после разархивации', () =>
                browserA
                    .deleteAll('tasks')
            )

            it('(A) Разархивируем', () =>
                browserA
                .waitForVisible("[role='extract']", TIMEOUT).then(result =>
                    result.should.equal(true, 'Extract отсутсвует') )
                .click("[role='extract']")
            )

            it('(A) Проверяем пункт в карточке', () =>
                browserA
                .waitForVisible("[role='extract']", TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Extract не пропал') )
                .waitForVisible("[role='archive']", TIMEOUT).then(result =>
                    result.should.equal(true, 'Archive не появился') )
                .escape()
            )

            it('(AB) Проверка во втором окне', () =>
                client
                .waitForVisible(cardTitleInTree, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, 'Карточка не появилась')
                    result.browserB.should.equal(true, 'Карточка не появилась')
                })
            )


        })
    })
})
