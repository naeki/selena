'user strict';

client = require(`../functions`);

describe(`Сфера (базовые кейсы)`, function () {
    this.timeout(99999999)
    
    before( () => client.loginCorrect(LOGIN1, PASS) )
    
    beforeEach(``, () => 
        client
    )
    
    afterEach( `sync()`, () => client.sync().pause(PAUSE) )

    after( 'logout()', () => client.logout() )
    
    it(`(A) Наличие +`, () =>
        browserA
        .isExisting(`[role="mainButton"]`).then(result =>
            result.should.equal(true, `Кнопка (+) не найдена`) )
    )
    
    it(`(A) Открытие QCL (наведение на +)`, () =>
        browserA
        .moveToObject(`[role='mainButton']`)
        .waitForVisible(`[role='qclForm']`, TIMEOUT).then(result =>
            result.should.equal(true, `QCL при наведении не открылся`) )
    )
    
    it(`(A) Наличие кнопки создания сферы`, () =>
        browserA
        .QCLOpen()
        .isExisting(`[role="createSphere"]`).then(result =>
            result.should.equal(true, `В QCL кнопка создания сферы не найдена`) )
    )
    
    it(`(A) Открытие формы создания сферы`, () =>
        browserA
        .QCLOpen()
        .click(`[role="createSphere"]`)
        .waitForVisible(`[role='sphereCard']`, TIMEOUT).then(result =>
            result.should.equal(true, `По клику на кнопку создания сферы попап создания сферы не открылся`) )
    )

    describe(`Тесты формы создания сферы`, () => {
        
        beforeEach(``, () =>
            browserA
            .QCLOpen()
            .click(`[role="createSphere"]`)
            .waitForVisible(`[role='sphereCard']`, TIMEOUT).then(result =>
                result.should.equal(true, `Попап создания сферы не открылся`) )
        )
        
        afterEach(`escape ()`, () => client.escape() )
        
        after(`(B) Удаляем все сферы`, () => browserB.deleteAll(`spheres`) )
        
        it(`(A) Наличие инпута для ввода названия новой сферы`, () =>
            browserA
            .isExisting(`.new-sphere-name`).then(result =>
                result.should.equal(true, ``) )
        )
            
        it(`(A) Наличие кнопки для сохранения новой сферы`, () =>
            browserA
            .isExisting(`.new-sphere-save`).then(result =>
                result.should.equal(true, ``) )
        )

        it(`(A) Ввод текста в инпут и его последующая очистка`, () => // TODO: разделить на отдельные тесты
            browserA
            .setValue(`.new-sphere-name`, `Test`)
            .getValue(`.new-sphere-name`).then( value =>
                value.should.equal(`Test`) )
            .clearElement(`.new-sphere-name`)
            .getValue(`.new-sphere-name`).then( value =>
                value.should.equal(``, ``) )
        )
        
        it(`(A) Наличие дд добавления сферы в круг`, () =>
            browserA
            .isExisting(`[role="sphereCircle"]`).then(result =>
                result.should.equal(true, `Кнопка для открытия ДД со списком кругов не найдена`) )
        )
        
        it.skip(`(A) Открытие дд добавления сферы в круг`, () =>
            browserA
            .click(`[role="sphereCircle"]`)
            .waitForExist(`[role="dropdown"]`, TIMEOUT).then(result =>
                result.should.equal(true, `ДД со списком кругов не открылся`) )
        )

        it.skip(`(A) Смена круга у создаваемой сферы`, () =>
            browserA
            .click(`[role="sphereCircle"]`)
            .waitForExist(`[role="dropdown"]`, TIMEOUT).then(result =>
                result.should.equal(true, ``) )
        )
        
        it(`(A) Создание сферы без круга`, () => // TODO: разделить на отдельные тесты
            browserA
//            .QCLOpen()
//            .click(`[role='createSphere']`)
//            .waitForExist(`.new-sphere-name`, TIMEOUT).then(result =>
//                result.should.equal(true, `Инпут для ввода имени создаваемой сферы не найден`) )
            .setValue(`.new-sphere-name`, sphereName)
            .getValue(`.new-sphere-name`).then( value =>
                value.should.equal(sphereName, `Имя новой сферы не введено в инпут`) )
            .keys(["Enter"])
            .waitForExist(`//div[contains(text(),'${sphereName}')]`, TIMEOUT).then(result =>
                result.should.equal(true, `Новая сфера создана. Открылась карточка сферы`) )
            .escape()
        )
        
        it(`(B) Проверка создания сферы`, () =>
            browserB
            .sphereListOpen(`Открываем список сфер для проверки, что созданная сфера появилась в нем.`)
                .waitForExist(`//span[contains(text(),'${sphereName}')]`)
            .escape()
        )
        
        it.skip(`Создание сферы в круге`, () =>
            client
            
        )

    })
    
    describe(`Переименование сферы`, () => {
    
        before(`(A) Открытие сайдбара в обоих и создание сферы`, () =>
            client
            .sphereListOpen()
            .then( () => browserA
                .sphereCreate(sphereName)
                .waitForVisible(`[role='sphereCard'] [role='sphereName']`, TIMEOUT).then(result =>
                    result.should.equal(true, `Карточка сферы не открылась`) )
            )
        )
        
        after(`(B) Удаляем все сферы`, () =>
            client
            .then( () => browserB.deleteAll(`spheres`) )
            .escape()
        )
        
        it(`(A) Активируем редактирование названия`, () =>
            browserA
            .click(`[role='sphereCard'] [role='sphereName']`)
            .waitForExist(`//*[@contenteditable='true'][contains(text(),'${sphereNameBefore}')]`, TIMEOUT).then(result =>
                result.should.equal(true, `Редактирование название не активировалось`) )
        )
        
        it(`(A) Очистка названия сферы`, () =>
            browserA
            .clearElement(`[role='sphereCard'] [role='sphereName']`)
            .getText(`[role='sphereCard'] [role='sphereName']`).then( text =>
                text.should.equal(``, `Инпут не очистился`) )
        )
        
        it(`(A) Ввод нового названия и удаление пробела`, () =>
            browserA
            .keys(sphereNameAfter)
            .keys(["Delete"]) // для удаления пробела 

            .getText(`[role='sphereCard'] [role='sphereName']`).then( text =>
                text.should.equal(sphereNameAfter, `Новое название сферы не ведено или пробел не удален`) )
        )
        
        it(`(A) Завершаем переименование`, () =>
            browserA
            .keys(["Enter"])
            .pause(100)
            .keys(["Enter"])
            .waitForExist(`//*[@contenteditable='true'][contains(text(),'${sphereNameAfter}')]`, TIMEOUT, true).then(result =>
                result.should.equal(true, `Редактирование сферы не завершилось. Инпут активен`) )
        )
        
        it(`(A) Проверка переименования в карточке`, () =>
            browserA
            .waitForExist(`//*[@role='sphereCard']//*[@role='sphereName'][contains(text(),'${sphereNameAfter}')]`, TIMEOUT).then(result =>
                result.should.equal(true, `Название сферы не поменялось в карточке`) )
            .escape()

        )
        
        it(`(B) Проверка переименования в списке сфер`, () =>
            browserB
            .waitForExist(`//*[@role='sphereName'][contains(text(),'${sphereNameAfter}')]`, TIMEOUT).then(result =>
                result.should.equal(true, `Название сферы не поменялось в списке сфер`) )
        )
    
    })
    
    describe(`Смена цвета сферы`, () => {
    
        before(`Открытие настроек сферы в (A) и списка сферы в (B).`, () =>
            client
            .sphereListOpen()
            .then( () => browserA.sphereCreate(sphereName) )
            
        )
        
//        after(`(B) Удаляем все сферы (B)`, done => {
//            browserB.escape().deleteAll(`spheres`)
//            return client.sync().escape().call(done)
//        )
        
        it(`(A) Ищем иконку сферы в карточке и кликаем`, () =>
            browserA
            .waitForVisible(`.sphere-settings-popup__icon`, TIMEOUT).then(result =>
                result.should.equal(true, `Иконка сферы не найдена`) )
            .click(`.sphere-settings-popup__icon`)
        )
        
        it(`(A) Ожидаем color picker и кликаем цвет`, () =>
            browserA
            .waitForVisible(`.color-picker-grid`, TIMEOUT).then(result =>
                result.should.equal(true, `Color picker не появился`) )
            .click(`.color-picker-grid-item[data-color='#00e9b6']`)
        )
                
        it(`(A) Проверяем новый цвет у иконки в карточке сферы`, () =>
            browserA
            .waitForVisible(`.sphere-settings-popup__icon[style*='rgb(0, 233, 182)']`, TIMEOUT).then(result =>
                result.should.equal(true, `Цвет иконки не поменялся`) )
            .escape()
        )
        
        it(`(B) Проверка цвета сферы в списке сфер (B)`, () =>
            browserB
            .waitForVisible(`.sphere-icon[style*='rgb(0, 233, 182)']`, TIMEOUT).then(result =>
                result.should.equal(true, `Цвет не соответствует`) )
        )
    
    })
 
    describe(`Удаление сферы (созданной в предыдущем тесте)`, () => {
        
        before(`(AB) Открытие всего`, () =>
            client
            .sphereListOpen()
            .then( () => browserA.sphereDDOpen(sphereName).sphereSettingsOpen(sphereName).sphereListOpen() )
        )

        it(`(A) Удаление сферы`, () => // TODO: разделить на отдельные тесты
            browserA
            .waitForExist(`[role='sphereDelete']`, TIMEOUT).then(result =>
                result.should.equal(true, `Кнопка удаления не найдена`) )
            .click(`[role='sphereDelete']`)
            .waitForExist(`.dialog-buttons`, TIMEOUT).then(result =>
                result.should.equal(true, `Диалог не появилася`) )
            .keys(["Space"])
            .waitForExist(`.dialog-buttons`, TIMEOUT, true).then(result =>
                result.should.equal(true, `Диалог не закрылся`) )
        )
            
        it(`(AB) Проверка удаления`, () =>
            client
            .waitForVisible(`//*[@role='sphereName'][contains(text(),'${sphereName}')]`, TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, `Сфера не удалилась`)
                result.browserB.should.equal(true, `Сфера не удалилась`)
            })
        )


    })
})