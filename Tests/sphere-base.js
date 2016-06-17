client = require("../functions");

describe('Сфера (базовые кейсы)', function () {
		this.timeout(99999999);
    
    before(function () {
        return client
        .sessionStart()
        .loginCorrect(LOGIN1, PASS)
		})
    
    afterEach(function () {
        return client.sync()
        .pause(PAUSE)
    })
        
    beforeEach(function () {
//        return client
//        .sphereCreate(sphereName)
//        .sphereListOpen()
//        .sphereSettingsOpen(sphereName)
    })
    
    after(function () {
        return client.end()
    })
    
    it('Наличие +', function () {
        return browserA
        .isExisting('[role="mainButton"]')
            .then(function (result) { result.should.equal(true, 'Кнопка (+) не найдена') })
    })
    
    it('Открытие QCL (наведение на +)', function () {
        return browserA
        .moveToObject("[role='mainButton']")
        .waitForVisible("[role='qclForm']", TIMEOUT)
            .then(function (result) { result.should.equal(true, 'QCL при наведении не открылся') })
    })
    
    it('Наличие кнопки создания сферы', function () {
        return browserA
        .QCLOpen()
        .isExisting('[role="createSphere"]')
            .then(function (result) { result.should.equal(true, 'В QCL кнопка создания сферы не найдена') })
    })
    
    it('Открытие формы создания сферы', function () {
        return browserA
        .QCLOpen()
        .click('[role="createSphere"]')
        .waitForVisible("[role='sphereCard']", TIMEOUT)
            .then(function (result) { result.should.equal(true, 'По клику на кнопку создания сферы попап создания сферы не открылся') })
    })

    describe('Тесты формы создания сферы', function () {
        
        beforeEach(function () {
            return browserA
            .QCLOpen()
            .click('[role="createSphere"]')
            .waitForVisible("[role='sphereCard']", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Попап создания сферы не открылся') })
        })
        
        afterEach('escape ()', function () {
            return client.escape()
        })
        
        after('Удаляем все сферы (B)', function () {
            return browserB.deleteAll('spheres')
        })
        
        it('Наличие инпута для ввода названия новой сферы', function () {
            return browserA
            .isExisting('.new-sphere-name')
                .then(function (result) { result.should.equal(true, '') })
        })
            
        it('Наличие кнопки для сохранения новой сферы', function () {
            return browserA
            .isExisting('.new-sphere-save')
                .then(function (result) { result.should.equal(true, '') })
        })

        it('Ввод текста в инпут и его последующая очистка', function () { // TODO: разделить на отдельные тесты
            return browserA
            .setValue('.new-sphere-name', 'Test')
            .getValue('.new-sphere-name')
                .then(function (value) { value.should.equal('Test') })
            .clearElement('.new-sphere-name')
            .getValue('.new-sphere-name')
                .then(function (value) { value.should.equal('') })
        })
        
        it('Наличие дд добавления сферы в круг', function () {
            return browserA
            .isExisting('[role="sphereCircle"]')
                .then(function (result) { result.should.equal(true, 'Кнопка для открытия ДД со списком кругов не найдена') })
        })
        
        it.skip('Открытие дд добавления сферы в круг', function () {
            return browserA
            .click('[role="sphereCircle"]')
            .waitForExist('[role="dropdown"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'ДД со списком кругов не открылся') })
        })

        it.skip('Смена круга у создаваемой сферы', function () {
            return browserA
            .click('[role="sphereCircle"]')
            .waitForExist('[role="dropdown"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, '') })
        })
        
        it('Создание сферы без круга (A)', function () { // TODO: разделить на отдельные тесты
            return browserA
//            .QCLOpen()
//            .click("[role='createSphere']")
//            .waitForExist('.new-sphere-name', TIMEOUT)
//                .then(function (result) { result.should.equal(true, 'Инпут для ввода имени создаваемой сферы не найден') })
            .setValue(".new-sphere-name", sphereName)
            .getValue(".new-sphere-name")
                .then(function (value) { value.should.equal(sphereName, 'Имя новой сферы не введено в инпут') })
            .keys(["Enter"])
            .waitForExist("//div[contains(text(),'" + sphereName + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Новая сфера создана. Открылась карточка сферы') })
            .escape()
        })
        
        it('Проверка создания сферы (B)', function () {
            return browserB
            .sphereListOpen("Открываем список сфер для проверки, что созданная сфера появилась в нем.")
                .waitForExist("//span[contains(text(),'" + sphereName + "')]")
            .escape()
        })
        
        it.skip('Создание сферы в круге', function () {
            return client
            
        })

    })
    
    describe('Переименование сферы', function () {
    
        before('Открытие сайдбара в обоих и создание сферы (A)', function () {
            return client
            .sphereListOpen()
            .then(function () {
                return browserA
                .sphereCreate(sphereName)
                .waitForVisible("[role='sphereCard'] [role='sphereName']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, "Карточка сферы не открылась") })
            })
        })
        
        after('Удаляем все сферы (B)', function () {
            return client
            .then(function () {
                return browserB.deleteAll('spheres')
            })
            .escape()
        })
        
        it('(A) Активируем редактирование названия', function () {
            return browserA
            .click("[role='sphereCard'] [role='sphereName']")
            .waitForExist("//*[@contenteditable='true'][contains(text(),'" + sphereNameBefore + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Редактирование название не активировалось') })
        })
        
        it('(A) Очистка названия сферы', function () {
            return browserA
            .clearElement("[role='sphereCard'] [role='sphereName']")
            .getText("[role='sphereCard'] [role='sphereName']")
                .then(function (text) { text.should.equal('', 'Инпут не очистился') })
        })
        
        it('(A) Ввод нового названия и удаление пробела', function () {
            return browserA
            .keys(sphereNameAfter)
            .keys(["Delete"]) // для удаления пробела 

            .getText("[role='sphereCard'] [role='sphereName']")
                .then(function (text) { text.should.equal(sphereNameAfter, 'Новое название сферы не введено или пробел не удален') })
        })
        
        it('(A) Завершаем переименование', function () {
            return browserA
            .keys(["Enter"])
            .pause(100)
            .keys(["Enter"])
            .waitForExist("//*[@contenteditable='true'][contains(text(),'" + sphereNameAfter + "')]", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Редактирование сферы не завершилось. Инпут активен') })
        })
        
        it('(A) Проверка переименования в карточке', function () {
            return browserA
            .waitForExist("//*[@role='sphereCard']//*[@role='sphereName'][contains(text(),'" + sphereNameAfter + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Название сферы не поменялось в карточке') })
            .escape()

        })
        
        it('(B) Проверка переименования в списке сфер', function () {
            return browserB
            .waitForExist("//*[@role='sphereName'][contains(text(),'" + sphereNameAfter + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Название сферы не поменялось в списке сфер') })
        })
    
    })
    
    describe('Смена цвета сферы', function () {
    
        before('Открытие настроек сферы в (A) и списка сферы в (B).', function () {
            return client
            .sphereListOpen()
            .then(function () {
                return browserA.sphereCreate(sphereName)
            })
            
        })
        
//        after('(B) Удаляем все сферы (B)', function (done) {
//            browserB.escape().deleteAll('spheres')
//            return client.sync().escape().call(done)
//        })
        
        it('(A) Ищем иконку сферы в карточке и кликаем', function () {
            return browserA
            .waitForVisible(".sphere-settings-popup__icon", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Иконка сферы не найдена') })
            .click(".sphere-settings-popup__icon")
        })
        
        it('(A) Ожидаем color picker и кликаем цвет', function () {
            return browserA
            .waitForVisible(".color-picker-grid", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Color picker не появился') })
            .click(".color-picker-grid-item[data-color='#00e9b6']")
        })
                
        it('(A) Проверяем новый цвет у иконки в карточке сферы', function () {
            return browserA
            .waitForVisible(".sphere-settings-popup__icon[style*='rgb(0, 233, 182)']", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Цвет иконки не поменялся') })
            .escape()
        })
        
        it('(B) Проверка цвета сферы в списке сфер (B)', function () {
            return browserB
            .waitForVisible(".sphere-icon[style*='rgb(0, 233, 182)']", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Цвет не соответствует') })
        })
    
    })
 
    describe('Удаление сферы (созданной в предыдущем тесте)', function () {
        
        before('(AB) Открытие всего', function () {
            return client
            .sphereListOpen()
            .then(function () {
                return browserA.sphereDDOpen(sphereName).sphereSettingsOpen(sphereName).sphereListOpen()
            })
        })

        it('Удаление сферы', function () {
            return browserA
            .waitForExist("[role='sphereDelete']", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Кнопка удаления не найдена') })
            .click("[role='sphereDelete']")
            .waitForExist(".dialog-buttons", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Диалог не появилася') })
            .keys(["Space"])
            .waitForExist(".dialog-buttons", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Диалог не закрылся') })
        })
            
        it('(AB) Проверка удаления', function () {
            return client
            .waitForVisible("//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Сфера не удалилась') })
        })


    })
})