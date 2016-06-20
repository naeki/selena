'user strict';

client = require(`../functions`)

describe(`Круг (базовые кейсы)`, function () {
    this.timeout(99999999)
    
    before( () => client.loginCorrect(LOGIN1, PASS) )
    
    afterEach( `sync()`, () => client.sync().pause(PAUSE) )

    after( 'logout()', () => client.logout() )
    
/*    beforeEach(() =>
        return client.circleListOpen()
    })*/

    describe(`Создание круга`, () => {
        
        it(`(A) Наличие кнопки открытия списка кругов`, () =>
            browserA
            .isExisting(`[role="circlesButton"]`).then(result =>
                result.should.equal(true, `Кнопка не найдена`) )
        )
        
        it(`(A) Срабатывание кнопки списка кругов (открытие списка)`, () =>
            browserA
            .click(`[role="circlesButton"]`)
            .waitForVisible(`[role="test"]`, TIMEOUT).then(result =>
                result.should.equal(true, `Список кругов не открылся`) )
        )
                
        it(`(A) Наличие кнопки создания нового круга`, () =>
            browserA
            .isExisting(`[role="circleCreateButton"]`).then(result =>
                result.should.equal(true, `Кнопка создания нового круга в списке кругов отсутствует`) )
        )
                
        it(`(A) Срабатывание кнопки создания нового круга (открытие формы)`, () =>
            browserA
            .click(`[role="circleCreateButton"]`)
            .waitForVisible(`[role="sphereCard"]`, TIMEOUT).then(result =>
                result.should.equal(true, `Форма создания круга не открылась`) )
            .escape()
        )
           
        describe(`Проверка формы создания круга`, () => {
            
            before(`(A) Открытие формы создания круга`, () =>
                client
                .circleListOpen()
                .then( () => browserA
                    .click(`[role="circleCreateButton"]`)
                    .waitForVisible(`[role="sphereCard"]`, TIMEOUT).then(result =>
                        result.should.equal(true, `Форма создания круга не открылась`) )
                )
                
            )
            
            after(`(A) escape2()`, () => browserA.escape2() )
            
            it(`(A) Наличие инпута для ввода названия нового круга`, () =>
                browserA
                .isExisting(`[role="newCircleName"]`).then(result =>
                    result.should.equal(true, `Инпут для ввода имени нового круга не найден`) )
            )
            
            it(`(A) Наличие кнопки для сохранения нового круга`, () =>
                browserA
                .isExisting(`[role="newCircleSave"]`).then(result =>
                    result.should.equal(true, `Кнопка создания круга не найдена`) )
            )
            
            it(`(A) Ввод текста в инпут`, () =>
                browserA
                .setValue(`[role="newCircleName"]`, circleName)
                .getValue(`[role="newCircleName"]`).then( value =>
                    value.should.be.equal(circleName) )
            )
                    
            it(`(A) Завершение создания круга (открылась карточка)`, () =>
                browserA
                .click(`[role="newCircleSave"]`)
                .waitForExist(`//*[@role='circleName'][contains(text(),'${circleName}')]`, TIMEOUT).then(result =>
                    result.should.equal(true, `Новый круг не появился в списке кругов (не создан)`) )
            )
            
            it(`(AB) Проверка создания круга в списке кругов`, () =>
                client
                .waitForExist(`//*[@role='circleName' and contains(text(),'${circleName}')]`, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, `Круг не появился в списке кругов`) 
                    result.browserB.should.equal(true, `Круг не появился в списке кругов`) 
                })
            )
            
        })

    })
    
    describe(`Удаление круга`, () => {
        
        before(`(AB) Открытие списка кругов`, () => client.circleListOpen() )
        
        after(`(AB) escape()`, () => client.escape() )
        
        it(`(A) Удаление`, () =>
            browserA
            .circleSettingsOpen(circleName)
            .click(`[role='circleDelete']`)
            .keys(["Space"])
        )
        
        it(`(AB) Проверка удаления`, () =>
            client
            .waitForExist(`//*[@role='circleName' and contains(text(),'${circleName}')]`, TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, `Круг не удалился (найден)`)
                result.browserB.should.equal(true, `Круг не удалился (найден)`)
            })
        )
    })
    
    describe(`Переименование круга (отмена)`, () => {
    
        before(`(AB) Открытие списка кругов + (A) создание круга и открытие настроек`, () =>
            client
                .circleListOpen()
                .then( () => browserA.circleCreateNew(circleName) )
                .circleSettingsOpen(circleNameBefore)
        )
        
        after(`(A) удаление всех кругов + (AB) escape()`, () =>
            client
                .escape()
                .then(() => browserA.deleteAll(`circles`) )
                .escape()
        )
        
        it(`(A) Активируем редактирование (кликаем на название круга)`, () =>
            browserA
            .click(`//*[@role='circleName'][contains(text(),'${circleNameBefore}')]`)
            .waitForExist(`[role='circleName'].in-edit`, TIMEOUT).then(result =>
                result.should.equal(true, `Редактирование названия круга не началось`) )
        )
        
        it(`(A) Очищаем название`, () =>
            browserA
            .clearElement(`[role='circleName'].in-edit`)
            .getText(`[role='circleName'].in-edit`).then(text =>
                text.should.equal(``, `Инпут не очистился`) )
        )

/*        it(`(A) Вводим новое название`, () =>
            browserA
            .keys(circleNameAfter)
            .getText(`[role='circleName'].in-edit`)
                .then(text => text.should.equal(circleNameAfter, `Новое название не введено`) )
        )*/
        
        it(`(A) Отменяем (завершаем) редактирование через Escape`, () =>
            browserA
            .escape()
            .waitForExist(`[role='circleName'].in-edit`, TIMEOUT, true).then(result =>
                result.should.equal(true, `Редактирование не завершилось`) )
        )

        it(`(AB) Проверка в карточке круга`, () =>
            client
            .getText(`//*[@role='sphereCard']//*[@role='circleName']`).then(result => {
                result.browserA.should.equal(circleNameBefore, `Старое название не вернулось`)
                result.browserB.should.equal(circleNameBefore, `Старое название не вернулось`)
            })
            .escape()
        )
        
        it(`(AB) Проверка в списке кругов`, () =>
            client
            .circleListOpen()
            .getText(`//*[@role='test']//*[@role='circleName'][contains(text(),'${circleNameBefore}')]`).then(result => {
                result.browserA.should.equal(circleNameBefore, `Старое название не вернулось`)
                result.browserB.should.equal(circleNameBefore, `Старое название не вернулось`)
            })
        )
    
    })
        
    describe.skip(`Переименование круга (пустое поле)`, () => {
    
        before(`(AB) Открытие списка кругов + (A) создание круга и открытие настроек`, () =>
            client
                .circleListOpen()
                .then( () => browserA.circleCreateNew(circleNameBefore) )
                .circleSettingsOpen(circleNameBefore)
        )
        
        after(`(A) удаление всех кругов + (AB) escape()`, () =>
            client
                .escape()
                .then(() => browserA.deleteAll(`circles`) )
                .escape()
        )
        
        it(`(A) Активируем редактирование (кликаем на название круга)`, () =>
            browserA
            .click(`//*[@role='circleName'][contains(text(),'${circleNameBefore}')]`)
            .waitForExist(`[role='circleName'].in-edit`, TIMEOUT).then(result =>
                result.should.equal(true, `Редактирование названия круга не началось`) )
        )
        
        it(`(A) Очищаем название`, () =>
            browserA
            .clearElement(`[role='circleName'].in-edit`)
            .getText(`[role='circleName'].in-edit`).then(text =>
                text.should.equal(``, `Инпут не очистился`) )
        )
        
        it(`(A) Завершаем редактирование (сохраняем пустое название)`, () =>
            browserA
            .keys(["Enter"])
            .waitForExist(`[role='circleName'].in-edit`, TIMEOUT, true).then(result =>
                result.should.equal(true, `Редактирование не завершилось`) )
        )

        it(`(AB) проверка в карточке круга`, () =>
            client
            .getText(`//*[@role='sphereCard']//*[@role='circleName']`).then(result => {
                result.browserA.should.equal(circleNameBefore, `Старое название не вернулось`)
                result.browserB.should.equal(circleNameBefore, `Старое название не вернулось`)
            })
            .escape()
        )
        
        it(`(AB) Проверка в списке кругов`, () =>
            client
            .circleListOpen()
            .getText(`//*[@role='test']//*[@role='circleName'][contains(text(),'${circleNameBefore}')]`).then(result => {
                result.browserA.should.equal(circleNameBefore, `Старое название не вернулось`)
                result.browserB.should.equal(circleNameBefore, `Старое название не вернулось`)
            })
        )
    
    })
    
    describe(`Переименование круга (успешное)`, () => {
        
        before(`(AB) Открытие списка кругов + (A) создание круга и открытие настроек`, () =>
            client
                .circleListOpen()
                .then( () => browserA.circleCreateNew(circleName) )
                .then( () => browserB.circleSettingsOpen(circleNameBefore) )
                
        )
        
        after(`(A) удаление всех кругов + (AB) escape()`, () =>
            client
                .escape2()
                .then( () => browserA.deleteAll(`circles`) )
                .escape()
        )
        
        it(`(A) Активируем редактирование (кликаем на название круга)`, () =>
            browserA
            .click(`//*[@role='circleName'][contains(text(),'${circleNameBefore}')]`)
            .waitForExist(`[role='circleName'].in-edit`, TIMEOUT).then(result =>
                result.should.equal(true, `Редактирование названия круга не началось`) )
        )
        
        it(`(A) Очищаем название`, () =>
            browserA
            .clearElement(`[role='circleName'].in-edit`)
            .getText(`[role='circleName'].in-edit`).then(text =>
                text.should.equal(``, `Инпут не очистился`) )
        )
        
        it(`(A) Вводим новое и сохраняем`, () =>
            browserA
            .keys(circleNameAfter)
            .getText(`[role='circleName'].in-edit`).then(text =>
                text.should.equal(circleNameAfter, `Новое название не введено`) )
            .keys(["Enter"])
        )
        
        it(`(AB) Проверка в карточке круга`, () =>
            client
            .waitForExist(`//*[@role='sphereCard']//*[@role='circleName'][contains(text(),'${circleNameAfter}')]`, TIMEOUT).then(result => {
                result.browserA.should.equal(true, `Круг не переименовался в карточке`)
                result.browserB.should.equal(true, `Круг не переименовался в карточке`)
            })
        )
        
        it(`(AB) Проверка в списке кругов`, () =>
            client
            .circleListOpen()
            .waitForExist(`//*[@role='test']//*[@role='circleName'][contains(text(),'${circleNameAfter}')]`, TIMEOUT).then(result => {
                result.browserA.should.equal(true, `Круг не переименовался в списке кругов`) 
                result.browserB.should.equal(true, `Круг не переименовался в списке кругов`) 
            })
        )

    })
    
})