client = require("../functions");

//var client = browserA;

describe('Карточка в дереве', function() {
		this.timeout(99999999);
    
    before(function() {
        return client.loginCorrect(LOGIN1, PASS)
    })

//    beforeEach(function() {
//        return client
//        .taskCreate(taskName)
//        .taskDDOpen(taskName)
//    })
//
    afterEach('sync()', function() {
        return client.sync().pause(PAUSE)
    })

    after('end()', function() {
        return client.end()
    })
    
    describe('Открытие контекстного меню карточки', function () {
    
        before('(A) Создание карточки', function () {
            return browserA.taskCreate(taskName)
        })
        
        after('(B) Удаление карточки', function () {
            return browserB.deleteAll('tasks')
        })
        
        it('(A) Наводим на карточу и ждем появление кнопки •••', function() {
            return browserA
            .moveToObject("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]")
            .waitForVisible("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Кнопка ••• открытия контекстного меню не появилась') })
        })
        
        it('(A) Клик на ••• и открытие контекстного меню', function () {
            return browserA
            .click("//*[@role='task']//*[@role='title'][contains(text(),'" + taskName + "')]/../../../*[@role='menuButton']")
            .waitForVisible("[role='menuDropdown']", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Контекстное меню не открылоась') })
            .escape()
        })
    
    })
    
    describe('Проверка наличия пунктов контекстного меню', function () {
        var params = [
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
    
        before('Создание карточки и открытие меню', function () {
            return browserA.taskCreate(taskName).taskDDOpen(taskName)
        })
        
        after('Удаление карточки', function () {
            return browserB.deleteAll('tasks')
        })
        
        params.forEach(function (arr) {
            it('(A) ' + arr.testName, function() {
                return browserA
                .isExisting(arr.selector)
                    .then(function (result) { result.should.equal(true, arr.testName + ' not found') })
                    
            })
        })
                        
    })
    
    describe('Действия в контекстном меню', function () {
    
        describe('Focus/Unfocus', function () {

            before('(A) Создание карточки', function () {
                return browserA
                    .taskCreate(taskName)
                    .taskDDOpen(taskName)
                    .then(function () {
                        return browserB.taskDDOpen(taskName)
                    })
            })

            after('(B) Удаление карточки', function () {
                return browserB.deleteAll('tasks')
            })

            it('(A) Focus карточки', function() {
                return browserA
                .click("[title='Focus']")
                .waitForVisible("[title='Focus']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Focus не пропал') })
                .isVisible("[title='Unfocus']")
                    .then(function (result) { result.should.equal(true, 'Unfocus не появился') })
            })

            it('(B) Проверка Focus', function() {
                return browserB
                .waitForVisible("[title='Focus']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Focus не пропал') })
                .isVisible("[title='Unfocus']")
                    .then(function (result) { result.should.equal(true, 'Unfocus не появился') })
            })

            it('(B) Unfocus карточки', function () {
                return browserB
                .click("[title='Unfocus']")
            })

            it('(AB) Проверка Unfocus', function () {
                return client
                .waitForVisible("[title='Unfocus']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Focus не появился') })
                .isVisible("[title='Focus']")
                    .then(function (result) { result.should.equal(true, 'Unfocus не пропал') })
            })

        })
        
        describe('Unfollow/Follow карточки', function () {
            
            before('(A) Создание карточки', function () {
                return browserA
                    .taskCreate(taskName)
                    .taskDDOpen(taskName)
                    .then(function () {
                        return browserB.taskDDOpen(taskName)
                    })
            })

            after('(B) Удаление карточки', function () {
                return browserB.deleteAll('tasks')
            })

            it('(A) Unfollow карточки', function() {
                return browserA
                .click("[title='Unfollow']")
                .waitForVisible("[title='Unfollow']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Unfollow не пропал') })
                .isVisible("[title='Follow']")
                    .then(function (result) { result.should.equal(true, 'Follow не появился') })
            })

            it('(B) Проверка Unfollow', function() {
                return browserB
                .waitForVisible("[title='Unfollow']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Unfollow не пропал') })
                .isVisible("[title='Follow']")
                    .then(function (result) { result.should.equal(true, 'Follow не появился') })
            })

            it('(B) Follow карточки', function() {
                return browserB
                .click("[title='Follow']")
            })

            it('(AB) Проверка Follow', function() {
                return client
                .waitForVisible("[title='Follow']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Follow не пропал') })
                .isVisible("[title='Unfollow']")
                    .then(function (result) { result.should.equal(true, 'Unfollow не появился') })
            })
          
        })
        
        describe('Смена цвета карточки', function () {
        
            before('(A) Создание карточки', function () {
                return browserA.taskCreate(taskName).taskDDOpen(taskName)
            })

            after('(B) Удаление карточки', function () {
                return browserB.deleteAll('tasks')
            })
            
            it('(A) Смена цвета', function() {
                return browserA
                .click("em[data-value='2']")
                .escape()
            })
            
            it('(AB) Проверка цвета карточки', function () {
                return client
                .waitForExist("//*[@role='task' and contains(@style,'255, 202, 202')]//*[contains(text(),'" + taskName + "')]", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Цвет не соответствует') })
            })
        
        })
        
        describe('Дедлайн Tomorrow', function () {
        
            before('(A) Создание карточки', function () {
                return browserA.taskCreate(taskName).taskDDOpen(taskName)
            })

            after('(B) Удаление карточки', function () {
                return browserA.deleteAll('tasks')
            })
            
            it('(A) Выставление', function() {
                return browserA
                .click("[role='menuDropdown'] [role='deadline'][title='Tomorrow']")
                .waitForVisible("[role='menuDropdown'] [role='deadline']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Дедлайн не пропали из контекстного меню') })
                .escape()

            })
            
            it('(B) Поиск аттрибута дедлайна хоть на одной карточке', function () {
                return browserB
                .waitForExist("[role='task'] [role='deadline']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Дедлайн не найден ни на одной карточке') })
            })
        
        })
        
        describe('Дедлайн Today', function () {
        
            before('(A) Создание карточки', function () {
                return browserA.taskCreate(taskName).taskDDOpen(taskName)
            })

/*            after('Удаление карточки', function (done) {
                browserA.deleteAll('tasks')
                return client
                .escape().call(done)
            })*/
            
            it('(A) Выставление', function() {
                return browserA
                .click("[role='menuDropdown'] [role='deadline'][title='Today']")
                .waitForVisible("[role='menuDropdown'] [role='deadline']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Дедлайны не пропали из контекстного меню') })
                .escape()

            })
            
            it('(B) Поиск аттрибута дедлайна хоть на одной карточке', function () {
                return browserB
                .waitForExist("[role='task'] [role='deadline']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Дедлайн не найден ни на одной карточке') })
            })
        
        })  
        
        describe('Удаление дедлайна созданного в предыдущем сьюте', function () {
        
/*            before('Создание карточки', function () {
                return browserA
                .taskCreate(taskName)
                .taskDDOpen(taskName)
                .click("[role='menuDropdown'] [role='deadline'][title='Today']")
                .waitForVisible("[role='menuDropdown'] [role='deadline'][title='Today']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Дедлайн не добавлен') })
            })*/

            after('(B) Удаление карточки', function () {
                return browserB.deleteAll('tasks')
            })
            
            it('(A) Открытие календаря', function () {
                return browserA
                .click("[role='task'] [role='deadline']")
                .waitForExist("[role='calendar'] [role='timeDrop']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Каленрадрь не открылся') })
            })
            
            it('(A) Клик на удаление и автоматическое закрытие календаря', function () {
                return browserA
                .click("[role='calendar'] [role='timeDrop']")
                .waitForExist("[role='calendar']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Календарь не закрылся') })
                .escape()
            })

            it('(AB) Проверка наличия дедлайна', function() {
                return client
                .waitForExist("[role='task'] [role='deadline']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Дедлайн не пропал') })
            })
            
        })
        
        describe('Добавление и удаление мембера', function () {
            var memberName = MEMBER1NAME;
        
            before('(A) Создание карточки', function () {
                return browserA
                    .taskCreate(taskName)
                    .taskDDOpen(taskName)
                    .then(function () {
                        return browserB.taskDDOpen(taskName)
                    })
            })

            after('(A) Удаление карточки', function () {
                return browserA.deleteAll('tasks')
            })
            
            it('(A) Добавление', function() {
                return browserA
                .waitForVisible("[role='menuDropdown'] [role='member'][title='" + memberName + "']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, memberName + 'не найден в контекстном меню') })
                .click("[role='menuDropdown'] [role='member'][title='" + memberName + "']")
            })
            
            it('(AB) Мембер изчез из контекстного меню', function () {
                return client
                .waitForVisible("[role='menuDropdown'] [role='member'][title='" + memberName + "']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, memberName + 'не пропал из контекстного меню') })
            })
            
            it('(AB) Проверка добавления в дереве', function () {
                return client
                .waitForVisible("[role='task'] [role='member']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Мембер не найден ни на одной карточке') })
            })
            
            it('(A) Удаление с карточки', function () {
                return browserA
                .click("[role='task'] [role='member']")
                .waitForVisible("[role='task'] [role='member']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Мембер найден на одной из карточек') })
            })
            
            
            it('(B) Мембер появился в контекстном меню', function () {
                return browserB
                .waitForVisible("[role='menuDropdown'] [role='member'][title='" + memberName + "']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, memberName + 'не появился в контекстном меню') })
            })
            
                    
            it('(AB) Проверка удаления в дереве', function () {
                return client
                .waitForVisible("[role='task'] [role='member']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Мембер найден на одной из карточек') })
            })
        
        })
        
        describe('Создание нового тега (+ автодобавление к карточке)', function () {
        
            before('(A) Создание карточки', function () {
                return browserA.taskCreate(taskName).taskDDOpen(taskName)
            })

/*            after('Удаление карточки', function (done) {
                browserB.deleteAll('tasks')
                return client
                .escape().call(done)
            })*/
            
            it('(A) Инпут в зоне видимости', function() {
                return browserA
                .selectorExecute("[role='tagInput']", function(els) {
                    els[0].scrollIntoView();
                })
                .waitForVisible("[role='tagInput']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Инпут не в зоне видимости') })
                
            })
                
            it('(A) Инпут пустой', function () {
                return browserA
                .waitForValue("[role='tagInput']", TIMEOUT, true)
                    .then(function (value) { value.should.equal(true, 'Инпут не пустой') })
            })
                
            it('(A) Ввод названия тега', function () {
                return browserA
                .click("[role='tagInput']")
                .keys(tagName)
                .waitForValue("[role='tagInput']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Название не введено') })
                .getValue("[role='tagInput']")
                    .then(function (value) { value.should.equal(tagName, 'Введеный текст не соответствует') })
            })
                
            it('(A) Создание тега, очистка инпута', function () {
                return browserA
                .keys(["Enter"])
                .waitForValue("[role='tagInput']", TIMEOUT, true)
                    .then(function (value) { value.should.equal(true, 'Инпут не очистился') })
                .getValue("[role='tagInput']")
                    .then(function (value) { value.should.equal('', 'Инпут должен был очистится') })
            })
                
            it('(AB) Проверка добавления', function () {
                return client
                .waitForVisible("[role='tag'][title='" + tagName + "']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Мембер ' + tagName + ' не найден ни на одной из карточек') })
                .escape()
            })
            
        })
        
        describe('Удаление тега (созданного предыдущим сьютом', function () {
        
/*            before('Создание карточки и тега', function () {
                return browserA
                .taskCreate(taskName)
                .taskDDOpen(taskName)
                .waitForVisible("[role='menuDropdown'] [role='member'] [title='" + memberName + "']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, memberName + 'не найден в контекстном меню') })
                .click("[role='menuDropdown'] [role='member'] [title='" + memberName + "']")
            })*/

            after('(B) Удаление карточки', function () {
                return browserB.deleteAll('tasks')
            })
            
            it('(A) Удаление', function () {
                return browserA
                .isExisting("[role='task'] [role='tag'][title='" + tagName + "']")
                    .then(function (result) { result.should.equal(true, 'Тег ' + tagName + ' не найден на карточках') })
                .click("[role='task'] [role='tag'][title='" + tagName + "']")
                .waitForVisible("[role='task'] [role='tag'][title='" + tagName + "']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Тег ' + tagName + ' остался на карточках') })
                .escape()
            })
            
        })
        

        describe.skip('Остальные тесты (доделать)', function () {

            it('Добавление тега, созданного в предыдущем тесте, и его удаление', function() {
                return client
                .selectorExecute("[role='tagInput']", function(els) {
                    els[0].scrollIntoView();
                })
                .waitForVisible("[role='menuDropdown'] [role='tag'] [title='" + tagName + "']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, '') })
                .click("[role='menuDropdown'] [role='tag'] [title='" + tagName + "']")
                
                .switchTabAndCallback(tabMap.second)
                .waitForExist("[role='task'] [role='tag']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, '') })
                .escape()

                .click("[role='task'] [role='tag']")
                .waitForVisible("[role='task'] [role='tag']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, '') })
                .escape()
            })
        })
    })
})
