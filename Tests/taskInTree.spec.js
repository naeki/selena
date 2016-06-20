'user strict';

client = require(`../functions`);

describe(`Карточка в дереве`, function () {
    this.timeout(99999999)

    before( () => client.loginCorrect(LOGIN1, PASS) )

//    beforeEach(() => {
//        return client
//        .taskCreate(taskName)
//        .taskDDOpen(taskName)
//    })
//
    afterEach( `sync()`, () => client.sync().pause(PAUSE) )

    after( 'logout()', () => client.logout() )
    
    describe(`Открытие контекстного меню карточки`, () => {
    
        before(`(A) Создание карточки`, () =>
            browserA.taskCreate(taskName)
        )
        
        after(`(B) Удаление карточки`, () => browserB.deleteAll(`tasks`) )
        
        it(`(A) Наводим на карточу и ждем появление кнопки •••`, () =>
            browserA
            .moveToObject(`//*[@role='task']//*[@role='title'][contains(text(),'${taskName}')]`)
            .waitForVisible(`//*[@role='task']//*[@role='title'][contains(text(),'${taskName}')]/../../../*[@role='menuButton']`, TIMEOUT).then(result => {
                result.should.equal(true, `Кнопка ••• открытия контекстного меню не появилась`) })
        )
        
        it(`(A) Клик на ••• и открытие контекстного меню`, () =>
            browserA
            .click(`//*[@role='task']//*[@role='title'][contains(text(),'${taskName}')]/../../../*[@role='menuButton']`)
            .waitForVisible(`[role='menuDropdown']`, TIMEOUT).then(result => {
                result.should.equal(true, `Контекстное меню не открылоась`) })
            .escape()
        )
    
    })
    
    describe('Проверка наличия пунктов контекстного меню', () => {
        let params = [
          , { testName : 'Focus', selector : '[title="Focus"]' }
          , { testName : 'Unfollow', selector : '[title="Unfollow"]' }
          , { testName : 'Archive', selector : '[title="Archive"]' }
          , { testName : 'Delete', selector : '[title="Delete"]' }
          , { testName : 'Colors', selector : '[role="colors"]' }
          , { testName : 'Deadline Tomorrow', selector : '[role="deadline"][title="Tomorrow"]' }
          , { testName : 'Deadline Today', selector : '[role="deadline"][title="Today"]' }
          , { testName : 'Deadline Custom', selector : '[role="deadline"][title="Custom"]' }
          , { testName : 'Members', selector : '[role="member"]' }
          , { testName : 'Теги', selector : '[role="tag"]' }
          , { testName : 'Input для создания тэга', selector : '[role="tagInput"]' }
            
        ];
    
        before('Создание карточки и открытие меню', () =>
            browserA.taskCreate(taskName).taskDDOpen(taskName)
        )
        
        after('(B) Удаление карточки', () => browserB.deleteAll(`tasks`) )
        
        params.forEach( (arr) => {
            // let testName = arr.testName;
            // console.log(testName)
            it(`(A) ${arr.testName}`, () =>
                browserA
                .isExisting(arr.selector).then(result => {
                    result.should.equal(true, `${arr.testName} not found`) })
                    
            )
        })
                        
    })
    
    describe('Действия в контекстном меню', () => {
    
        describe('Focus/Unfocus', () => {

            before('(A) Создание карточки', () =>
                browserA
                    .taskCreate(taskName)
                    .taskDDOpen(taskName)
                    .then( () => browserB.taskDDOpen(taskName) )
            )

            after('(B) Удаление карточки', () => browserB.deleteAll(`tasks`) )

            it('(A) Focus карточки', () =>
                browserA
                .click(`[title='Focus']`)
                .waitForVisible(`[title='Focus']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Focus не пропал`) )
                .isVisible(`[title='Unfocus']`).then(result =>
                    result.should.equal(true, `Unfocus не появился`) )
            )

            it('(B) Проверка Focus', () =>
                browserB
                .waitForVisible(`[title='Focus']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Focus не пропал`) )
                .isVisible(`[title='Unfocus']`).then(result =>
                    result.should.equal(true, `Unfocus не появился`))
            )

            it('(B) Unfocus карточки', () =>
                browserB
                .click(`[title='Unfocus']`)
            )

            it('(AB) Проверка Unfocus', function () {
                client
                .waitForVisible(`[title='Unfocus']`, TIMEOUT, true).then(result => {
                    result.browserA.should.equal(true, `Focus не появился`)
                    result.browserB.should.equal(true, `Focus не появился`)
                })
                .isVisible(`[title='Focus']`).then(result => {
                    result.browserA.should.equal(true, `Unfocus не пропал`)
                    result.browserB.should.equal(true, `Unfocus не пропал`)
                })
            })

        })
        
        describe('Unfollow/Follow карточки', () => {
            
            before('(A) Создание карточки', () =>
                browserA
                    .taskCreate(taskName)
                    .taskDDOpen(taskName)
                    .then( () => browserB.taskDDOpen(taskName) )
            )

            after('(B) Удаление карточки', () => browserB.deleteAll(`tasks`) )

            it('(A) Unfollow карточки', () =>
                browserA
                .click(`[title='Unfollow']`)
                .waitForVisible(`[title='Unfollow']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Unfollow не пропал`) )
                .isVisible(`[title='Follow']`).then(result =>
                    result.should.equal(true, `Follow не появился`) )
            )

            it('(B) Проверка Unfollow', () =>
                browserB
                .waitForVisible(`[title='Unfollow']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Unfollow не пропал`) )
                .isVisible(`[title='Follow']`).then(result =>
                    result.should.equal(true, `Follow не появился`) )
            )

            it('(B) Follow карточки', () =>
                browserB
                .click(`[title='Follow']`)
            )

            it('(AB) Проверка Follow', () =>
                client
                .waitForVisible(`[title='Follow']`, TIMEOUT, true).then(result => {
                    result.browserA.should.equal(true, `Follow не пропал`)
                    result.browserB.should.equal(true, `Follow не пропал`)
                })
                .isVisible(`[title='Unfollow']`).then(result => {
                    result.browserA.should.equal(true, `Unfollow не появился`)
                    result.browserB.should.equal(true, `Unfollow не появился`)
                })
            )
          
        })
        
        describe('Смена цвета карточки', () => {
      
            before('(A) Создание карточки', () =>
                browserA.taskCreate(taskName).taskDDOpen(taskName)
            )

            after('(B) Удаление карточки', () => browserB.deleteAll(`tasks`) )
            
            it('(A) Смена цвета', () =>
                browserA
                .click(`em[data-value='2']`)
                .escape()
            )
            
            it('(AB) Проверка цвета карточки', () =>
                client
                .waitForExist(`//*[@role='task' and contains(@style,'255, 202, 202')]//*[contains(text(),'${taskName}')]`, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, `Цвет не соответствует`)
                    result.browserB.should.equal(true, `Цвет не соответствует`)
                })
            )
        
        })
        
        describe('Дедлайн Tomorrow', () => {
        
            before('(A) Создание карточки', () =>
                browserA.taskCreate(taskName).taskDDOpen(taskName)
            )

            after('(B) Удаление карточки', () => browserB.deleteAll(`tasks`) )
            
            it('(A) Выставление', () =>
                browserA
                .click(`[role='menuDropdown'] [role='deadline'][title='Tomorrow']`)
                .waitForVisible(`[role='menuDropdown'] [role='deadline']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Дедлайн не пропали из контекстного меню`) )
                .escape()

            )
            
            it('(B) Поиск аттрибута дедлайна хоть на одной карточке', () =>
                browserB
                .waitForExist(`[role='task'] [role='deadline']`, TIMEOUT).then(result =>
                    result.should.equal(true, `Дедлайн не найден ни на одной карточке`) )
            )
        
        })
        
        describe('Дедлайн Today', () => {
        
            before('(A) Создание карточки', () =>
                browserA.taskCreate(taskName).taskDDOpen(taskName)
            )

            // after('(A) Удаление карточки', () => browserA.deleteAll(`tasks`) )
            
            it('(A) Выставление', () =>
                browserA
                .click(`[role='menuDropdown'] [role='deadline'][title='Today']`)
                .waitForVisible(`[role='menuDropdown'] [role='deadline']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Дедлайны не пропали из контекстного меню`) )
                .escape()

            )
            
            it('(B) Поиск аттрибута дедлайна хоть на одной карточке', () =>
                browserB
                .waitForExist(`[role='task'] [role='deadline']`, TIMEOUT).then(result =>
                    result.should.equal(true, `Дедлайн не найден ни на одной карточке`) )
            )
        
        })  
        
        describe('Удаление дедлайна созданного в предыдущем сьюте', () => {
        
/*            before('Создание карточки', () => {
                return browserA
                .taskCreate(taskName)
                .taskDDOpen(taskName)
                .click(`[role='menuDropdown'] [role='deadline'][title='Today']`)
                .waitForVisible(`[role='menuDropdown'] [role='deadline'][title='Today']`, TIMEOUT, true).then(result => {
                    result.should.equal(true, 'Дедлайн не добавлен') })
            })*/

            after('(B) Удаление карточки', () => browserB.deleteAll(`tasks`) )
            
            it('(A) Открытие календаря', () =>
                browserA
                .click(`[role='task'] [role='deadline']`)
                .waitForExist(`[role='calendar'] [role='timeDrop']`, TIMEOUT).then(result =>
                    result.should.equal(true, `Каленрадрь не открылся`) )
            )
            
            it('(A) Клик на удаление и автоматическое закрытие календаря', () =>
                browserA
                .click(`[role='calendar'] [role='timeDrop']`)
                .waitForExist(`[role='calendar']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Календарь не закрылся`) )
                .escape()
            )

            it('(AB) Проверка наличия дедлайна', () =>
                client
                .waitForExist(`[role='task'] [role='deadline']`, TIMEOUT, true).then(result => {
                    result.browserA.should.equal(true, `Дедлайн не пропал`)
                    result.browserB.should.equal(true, `Дедлайн не пропал`)
                })
            )
            
        })
        
        describe('Добавление и удаление мембера', () => {
            let memberName = MEMBER1NAME;
        
            before('(A) Создание карточки', () =>
                browserA
                    .taskCreate(taskName)
                    .taskDDOpen(taskName)
                    .then( () => browserB.taskDDOpen(taskName) )
            )

            after('(A) Удаление карточки', () => browserA.deleteAll(`tasks`) )
            
            it('(A) Добавление', () =>
                browserA
                .waitForVisible(`[role='menuDropdown'] [role='member'][title='${memberName}']`, TIMEOUT).then(result =>
                    result.should.equal(true, `${memberName} не найден в контекстном меню`) )
                .click(`[role='menuDropdown'] [role='member'][title='${memberName}']`)
            )
            
            it('(AB) Мембер изчез из контекстного меню', () =>
                client
                .waitForVisible(`[role='menuDropdown'] [role='member'][title='${memberName}']`, TIMEOUT, true).then(result => {
                    result.browserA.should.equal(true, `${memberName} не пропал из контекстного меню`)
                    result.browserB.should.equal(true, `${memberName} не пропал из контекстного меню`)
                })
            )
            
            it('(AB) Проверка добавления в дереве', () =>
                client
                .waitForVisible(`[role='task'] [role='member']`, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, `Мембер не найден ни на одной карточке`)
                    result.browserB.should.equal(true, `Мембер не найден ни на одной карточке`)
                })
            )
            
            it('(A) Удаление с карточки', () =>
                browserA
                .click(`[role='task'] [role='member']`)
                .waitForVisible(`[role='task'] [role='member']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Мембер найден на одной из карточек`) )
            )
            
            
            it('(B) Мембер появился в контекстном меню', () =>
                browserB
                .waitForVisible(`[role='menuDropdown'] [role='member'][title='${memberName}']`, TIMEOUT).then(result =>
                    result.should.equal(true, `${memberName} не появился в контекстном меню`) )
            )
            
                    
            it('(AB) Проверка удаления в дереве', () => 
                client
                .waitForVisible(`[role='task'] [role='member']`, TIMEOUT, true).then(result => {
                    result.browserA.should.equal(true, `Мембер найден на одной из карточек`)
                    result.browserB.should.equal(true, `Мембер найден на одной из карточек`)
                })
            )
        })
        
        describe('Создание нового тега (+ автодобавление к карточке)', () => {
        
            before('(A) Создание карточки', () =>
                browserA.taskCreate(taskName).taskDDOpen(taskName)
            )

            // after('(B) Удаление карточки', () => browserB.deleteAll(`tasks`) )
            
            it('(A) Инпут в зоне видимости', () =>
                browserA
                .selectorExecute(`[role='tagInput']`, els => els[0].scrollIntoView() )
                .waitForVisible(`[role='tagInput']`, TIMEOUT).then(result =>
                    result.should.equal(true, `Инпут не в зоне видимости`) )
                
            )
                
            it('(A) Инпут пустой', () =>
                browserA
                .waitForValue(`[role='tagInput']`, TIMEOUT, true).then( value =>
                    value.should.equal(true, `Инпут не пустой`) )
            )
                
            it('(A) Ввод названия тега', () =>
                browserA
                .click(`[role='tagInput']`)
                .keys(tagName)
                .waitForValue(`[role='tagInput']`, TIMEOUT).then(result =>
                    result.should.equal(true, `Название не введено`) )
                .getValue(`[role='tagInput']`).then( value =>
                    value.should.equal(tagName, `Введеный текст не соответствует`) )
            )
                
            it('(A) Создание тега, очистка инпута', () =>
                browserA
                .keys(["Enter"])
                .waitForValue(`[role='tagInput']`, TIMEOUT, true).then( value =>
                    value.should.equal(true, `Инпут не очистился`) )
                .getValue(`[role='tagInput']`).then( value =>
                    value.should.equal(``, `Инпут должен был очистится`) )
            )
                
            it('(AB) Проверка добавления', () =>
                client
                .waitForVisible(`[role='tag'][title='${tagName}']`, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, `Мембер ${tagName} не найден ни на одной из карточек`)
                    result.browserB.should.equal(true, `Мембер ${tagName} не найден ни на одной из карточек`)
                })
                .escape()
            )
        })
        
        describe('Удаление тега (созданного предыдущим сьютом', () => {
        
/*            before('Создание карточки и тега', () =>
                browserA
                .taskCreate(taskName)
                .taskDDOpen(taskName)
                .waitForVisible(`[role='menuDropdown'] [role='member'] [title='${memberName}']`, TIMEOUT).then(result =>
                    result.should.equal(true, `${memberName} не найден в контекстном меню`) )
                .click(`[role='menuDropdown'] [role='member'] [title='${memberName}']`)
            )*/

            after('(B) Удаление карточки', () => browserB.deleteAll(`tasks`) )
            
            it('(A) Удаление', () =>
                browserA
                .isExisting(`[role='task'] [role='tag'][title='${tagName}']`).then(result =>
                    result.should.equal(true, `Тег ${tagName} не найден на карточках`) )
                .click(`[role='task'] [role='tag'][title='${tagName}']`)
                .waitForVisible(`[role='task'] [role='tag'][title='${tagName}']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, `Тег ${tagName} остался на карточках`) )
                .escape()
            )
            
        })
        

        describe.skip('Остальные тесты (доделать)', () => {

            it('Добавление тега, созданного в предыдущем тесте, и его удаление', () =>
                client
                .selectorExecute(`[role='tagInput']`, els => els[0].scrollIntoView() )
                .waitForVisible(`[role='menuDropdown'] [role='tag'] [title='${tagName}']`, TIMEOUT).then(result =>
                    result.should.equal(true, ``) )
                .click(`[role='menuDropdown'] [role='tag'] [title='${tagName}']`)
                
                .switchTabAndCallback(tabMap.second)
                .waitForExist(`[role='task'] [role='tag']`, TIMEOUT).then(result =>
                    result.should.equal(true, ``))
                .escape()

                .click(`[role='task'] [role='tag']`)
                .waitForVisible(`[role='task'] [role='tag']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, ``) )
                .escape()
            )
        })
    })
})
