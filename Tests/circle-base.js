client = require('../functions')

describe('Круг (базовые кейсы)', function() {
		this.timeout(99999999);
    
    before(function() {
        return client
        .sessionStart()
        .loginCorrect(LOGIN1, PASS)
		})
    
    afterEach('sync()', function () {
        return client.sync().pause(PAUSE)
    })
     
    after('end()', function() {
        return client.end()
    })
    
/*    beforeEach(function() {
        return client.circleListOpen()
    })*/

    describe('Создание круга', function() {
        this.slow(300);
        
        it('(A) Наличие кнопки открытия списка кругов', function() {
            return browserA
            .isExisting('[role="circlesButton"]')
                .then(function(result) { result.should.equal(true, 'Кнопка не найдена') })
        })
        
        it('(A) Срабатывание кнопки списка кругов (открытие списка)', function() {
            return browserA
            .click('[role="circlesButton"]')
            .waitForVisible('[role="test"]', TIMEOUT)
                .then(function(result) { result.should.equal(true, 'Список кругов не открылся') })
        })
                
        it('(A) Наличие кнопки создания нового круга', function() {
            return browserA
            .isExisting('[role="circleCreateButton"]')
                .then(function(result) { result.should.equal(true, 'Кнопка создания нового круга в списке кругов отсутствует') })
        })
                
        it('(A) Срабатывание кнопки создания нового круга (открытие формы)', function() {
            return browserA
            .click('[role="circleCreateButton"]')
            .waitForVisible('[role="sphereCard"]', TIMEOUT)
                .then(function(result) { result.should.equal(true, 'Форма создания круга не открылась') })
            .escape()
        })
           
        describe('Проверка формы создания круга', function() {
            
            before('(A) Открытие формы создания круга', function() {
                return client
                .circleListOpen()
                .then(function () {
                    return browserA
                    .click('[role="circleCreateButton"]')
                    .waitForVisible('[role="sphereCard"]', TIMEOUT)
                        .then(function (result) { result.should.equal(true, 'Форма создания круга не открылась') })
                })
                
            })
            
            after('(A) escape()', function() {
                return browserA.escape().escape()
            })
            
            it('(A) Наличие инпута для ввода названия нового круга', function() {
                return browserA
                .isExisting('[role="newCircleName"]')
                    .then(function(result) { result.should.equal(true, 'Инпут для ввода имени нового круга не найден') })
            })
            
            it('(A) Наличие кнопки для сохранения нового круга', function() {
                return browserA
                .isExisting('[role="newCircleSave"]')
                    .then(function(result) { result.should.equal(true, 'Кнопка создания круга не найдена') })
            })
            
            it('(A) Ввод текста в инпут', function() {
                return browserA
                .setValue('[role="newCircleName"]', circleName)
                .getValue('[role="newCircleName"]')
                    .then(function(value) {
                        value.should.be.equal(circleName)
                    })
            })
                    
            it('(A) Завершение создания круга (открылась карточка)', function() {
                return browserA
                .click('[role="newCircleSave"]')
                .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Новый круг не появился в списке кругов (не создан)') })
            })
            
            it('(AB) Проверка создания круга в списке кругов', function () {
                return client
                .waitForExist("//*[@role='circleName' and contains(text(),'" + circleName + "')]", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Круг не появился в списке кругов') })
            })
            
        })

    })
    
    describe('Удаление круга', function() {
        
        before('(AB) Открытие списка кругов', function () {
            return client
            .circleListOpen()
        })
        
        after('(AB) escape()', function () {
            return client.escape()
        })
        
        it('(A) Удаление', function() {
            return browserA
            .circleSettingsOpen(circleName)
            .click("[role='circleDelete']")
            .keys(["Space"])
        })
        
        it('(AB) Проверка удаления', function () {
            return client
            .waitForExist("//*[@role='circleName' and contains(text(),'" + circleName + "')]", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Круг не удалился (найден)') })
        })
    })
    
    describe('Переименование круга (отмена)', function () {
    
        before('(AB) Открытие списка кругов + (A) создание круга и открытие настроек', function () {
            return client
                .circleListOpen()
                .then(function () {
                    return browserA.circleCreateNew(circleName)
                })
                .circleSettingsOpen(circleNameBefore)
        })
        
        after('(A) удаление всех кругов + (AB) escape()', function () {
            return client
                .escape()
                .then(function () {
                    return browserA.deleteAll('circles')
                })
                .escape()
        })
        
        it('(A) Активируем редактирование (кликаем на название круга)', function() {
            return browserA
            .click("//*[@role='circleName'][contains(text(),'" + circleNameBefore + "')]")
            .waitForExist("[role='circleName'].in-edit", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Редактирование названия круга не началось') })
        })
        
        it('(A) Очищаем название', function () {
            return browserA
            .clearElement("[role='circleName'].in-edit")
            .getText("[role='circleName'].in-edit")
                .then(function (text) { text.should.equal('', 'Инпут не очистился') })
        })

/*        it('(A) Вводим новое название', function () {
            return browserA
            .keys(circleNameAfter)
            .getText("[role='circleName'].in-edit")
                .then(function (text) { text.should.equal(circleNameAfter, 'Новое название не введено') })
        })*/
        
        it('(A) Отменяем (завершаем) редактирование через Escape', function () {
            return browserA
            .escape()
            .waitForExist("[role='circleName'].in-edit", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Редактирование не завершилось') })
        })

        it('(AB) проверка в карточке круга', function () {
            return client
            .getText("//*[@role='sphereCard']//*[@role='circleName']")
                .then(function (result) { result.should.equal(circleNameBefore, 'Старое название не вернулось') })
            .escape()
        })
        
        it('(AB) Проверка в списке кругов', function () {
            return client
            .circleListOpen()
            .getText("//*[@role='test']//*[@role='circleName'][contains(text(),'" + circleNameBefore + "')]")
                .then(function (result) { result.should.equal(circleNameBefore, 'Старое название не вернулось') })
        })
    
    })
        
    describe.skip('Переименование круга (пустое поле)', function () {
    
        before('(AB) Открытие списка кругов + (A) создание круга и открытие настроек', function () {
            return client
                .circleListOpen()
                .then(function () {
                    return browserA.circleCreateNew(circleName)
                })
                .circleSettingsOpen(circleNameBefore)
        })
        
        after('(A) удаление всех кругов + (AB) escape()', function () {
            return client
                .escape()
                .then(function () {
                    return browserA.deleteAll('circles')
                })
                .escape()
        })
        
        it('(A) Активируем редактирование (кликаем на название круга)', function() {
            return browserA
            .click("//*[@role='circleName'][contains(text(),'" + circleNameBefore + "')]")
            .waitForExist("[role='circleName'].in-edit", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Редактирование названия круга не началось') })
        })
        
        it('(A) Очищаем название', function () {
            return browserA
            .clearElement("[role='circleName'].in-edit")
            .getText("[role='circleName'].in-edit")
                .then(function (text) { text.should.equal('', 'Инпут не очистился') })
        })
        
        it('(A) Завершаем редактирование (сохраняем пустое название)', function () {
            return browserA
            .keys(["Enter"])
            .waitForExist("[role='circleName'].in-edit", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Редактирование не завершилось') })
        })

        it('(AB) проверка в карточке круга', function () {
            return client
            .getText("//*[@role='sphereCard']//*[@role='circleName']")
                .then(function (result) { result.should.equal(circleNameBefore, 'Старое название не вернулось') })
            .escape()
        })
        
        it('(AB) Проверка в списке кругов', function () {
            return client
            .circleListOpen()
            .getText("//*[@role='test']//*[@role='circleName'][contains(text(),'" + circleNameBefore + "')]")
                .then(function (result) { result.should.equal(circleNameBefore, 'Старое название не вернулось') })
        })
    
    })
    
    describe('Переименование круга (успешное)', function() {
        
        before('(AB) Открытие списка кругов + (A) создание круга и открытие настроек', function () {
            return client
                .circleListOpen()
                .then(function () {
                    return browserA.circleCreateNew(circleName)
                })
                .then(function () {
                    return browserB.circleSettingsOpen(circleNameBefore)
                })
                
        })
        
        after('(A) удаление всех кругов + (AB) escape()', function () {
            return client
                .escape().escape()
                .then(function () {
                    return browserA.deleteAll('circles')
                })
                .escape()
        })
        
        it('(A) Активируем редактирование (кликаем на название круга)', function() {
            return browserA
            .click("//*[@role='circleName'][contains(text(),'" + circleNameBefore + "')]")
            .waitForExist("[role='circleName'].in-edit", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Редактирование названия круга не началось') })
        })
        
        it('(A) Очищаем название', function () {
            return browserA
            .clearElement("[role='circleName'].in-edit")
            .getText("[role='circleName'].in-edit")
                .then(function (text) { text.should.equal('', 'Инпут не очистился') })
        })
        
        it('(A) Вводим новое и сохраняем', function() {
            return browserA
            .keys(circleNameAfter)
            .getText("[role='circleName'].in-edit")
                .then(function (text) { text.should.equal(circleNameAfter, 'Новое название не введено') })
            .keys(["Enter"])
        })
        
        it('(AB) Проверка в карточке круга', function () {
            return client
            .waitForExist("//*[@role='sphereCard']//*[@role='circleName'][contains(text(),'" + circleNameAfter + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Круг не переименовался в карточке') })
        })
        
        it('(AB) Проверка в списке кругов', function () {
            return client
            .circleListOpen()
            .waitForExist("//*[@role='test']//*[@role='circleName'][contains(text(),'" + circleNameAfter + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Круг не переименовался в списке кругов') })
        })

    })
    
})