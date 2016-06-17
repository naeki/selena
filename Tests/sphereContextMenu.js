client = require("../functions");

describe('Сфера (контекстное меню)', function() {
      
    before(function() {
        return client.loginCorrect(LOGIN1, PASS)
    })

    beforeEach(function() {
        return client
//          .sphereCreate(sphereName)
//          .sphereListOpen()
//          .sphereDDOpen(sphereName)
    })

    afterEach('sync()',function() {
        return client.sync().pause(PAUSE)
    })
    
    describe('Проверка наличие пунктов контекстного меню', function () {
        var params = [
          , { testName : 'Follow', selector : '[title="Follow"]' }
          , { testName : 'Add to starred', selector : '[title="Add to starred"]' }
          , { testName : 'Unmute', selector : '[title="Unmute"]' }
          , { testName : 'Show in quick create list', selector : '[title="Show in quick create list"]' }
          , { testName : 'Settings', selector : '[title*="Settings"]' }
            
        ];
    
        before('(A) Создание сферы и открытие меню', function () {
            return browserA.sphereCreate(sphereName).sphereListOpen().sphereDDOpen(sphereName)
        })
        
        after('(A) Удаление сферы и закрытие сайдбара (AB)', function () {
            return browserA.deleteAll('spheres')
        })
        
        params.forEach(function (arr) {
            it(arr.testName, function() {
                return browserA
                .isExisting(arr.selector)
                    .then(function (result) { result.should.equal(true, 'Пункт ' + arr.testName + ' не найден') })
                    
            })
        })
    })

    describe('Follow/Unfollow сферы', function () {
        
        before('(A) Создание сферы и открытие сайдбара (AB)', function (done) {
            browserA.sphereCreate(sphereName)
            return client.sync().sphereListOpen().sphereDDOpen(sphereName).call(done)
        })
        
        after('(A)Удаление всех сфер', function () {
            return browserA.deleteAll('spheres')
        })
        
        it('(A)Follow', function () {
            return browserA
            .waitForVisible('[title="Follow"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Follow не найден')
                    return this.click('[title="Follow"]')
                })
        })
        
        it('(AB) Изменение пункта Follow -> Unfollow', function () {
            return client
            .waitForVisible('[title="Follow"]', TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Пункт Follow не сменился.') })
            .waitForVisible('[title*="Unfollow"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Follow не сменился на Unfollow') })
        })
                
        it('(B) Unfollow', function () {
            return browserB
            .waitForVisible('[title="Unfollow"]', TIMEOUT)
                .then(function (result) {
                    result.should.equal(true, 'Пункт Unfollow не найден')
                    return this.click('[title="Unfollow"]')
                })
        })

        it('(AB) Изменение пункта Unfollow -> Follow', function () {
            return client
            .waitForVisible('[title="Unfollow"]', TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Пункт Unfollow не сменился.') })
            .waitForVisible('[title*="Follow"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Unfollow не сменился на Follow') })
        })
        
    })

    describe('Add/Remove starred сферы', function () {
    
        before('(A) Создание сферы и открытие сайдбара (AB)', function (done) {
            browserA.sphereCreate(sphereName)
            return client.sync().sphereListOpen().sphereDDOpen(sphereName).call(done)
        })
        
        after('(A) Удаление сферы', function () {
            return browserA.deleteAll('spheres')
        })
        
        it('(A) Add to starred', function () {
            return browserA
            .isVisible('[title="Add to starred"]')
                .then(function () {
                    return this
                        .click('[title="Add to starred"]')
                        .waitForVisible('[title="Add to starred"]', TIMEOUT, true)
                            .then(function (result) {
                                result.should.equal(true, 'Контекстное меню не закрылось.')
                            })
                })
        })
        
        it('(AB) Sphere group Recent -> Starred', function () {
            return client
            .waitForExist("//*[@role='spheresRecent']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Сфера не пропала из группы Recent.') })
            .waitForExist("//*[@role='spheresStarred']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Сфера не появилась в группе Starred.') })
        })
                
        it('(AB) Проверка пункта контекстного меню', function () {
            return client
            .sphereDDOpen(sphereName)
            .waitForVisible('[title="Remove star"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Add to starred не сменился на Remove star') })
        })
                
        it('(A) Remove from starred"', function () {
            return browserA
            .isVisible('[title="Remove star"]')
                .then(function (result) {
                    return this.click('[title="Remove star"]')
                        .waitForVisible('[title="Remove star"]', TIMEOUT, true)
                            .then(function (result) {
                                result.should.equal(true, 'Контекстное меню не закрылось.')
                            })
                })
        })

        it('(AB) Sphere group Starred -> Recent', function () {
            return client
            .waitForExist("//*[@role='spheresStarred']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Сфера не пропала из группы Starred.') })
            .waitForExist("//*[@role='spheresRecent']//*[@role='sphereName'][contains(text(),'" + sphereName + "')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Сфера не появилась в группе Recent.') })
        })
                
        it('(AB) Проверка пункта контекстного меню', function () {
            return client
            .sphereDDOpen(sphereName)
            .waitForVisible('[title="Add to starred"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Remove star не сменился на Add to starred') })
        })
    
    })
    

        
    describe('Add/Remove sphere in QCL', function () {
    
        before('Создание сферы (A) и открытие сайдбара (AB)', function (done) {
            browserA.sphereCreate(sphereName)
            return client.sync().sphereListOpen().sphereDDOpen(sphereName).call(done)
        })
        
        after('(A) Удаление сферы', function () {
            return browserA.deleteAll('spheres')
        })
        
        it('(A) Add to QCL',function() {
            return browserA
            .waitForVisible('[title="Show in quick create list"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Show in quick create list не найден')
                    return this.click('[title="Show in quick create list"]')
                })
        })
        
        it('(AB) Изменение пункта Show in QCL -> Remove from QCL', function () {
            return client
            .waitForVisible('[title="Show in quick create list"]', TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Пункт Show in QCL не сменился') })
            .waitForVisible('[title*="Remove from quick create list"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Show in QCL не сменился на Remove from QCL') })
        })
        
        it('(AB) Проверка добавления в QCL', function () {
            return client
            .moveToObject("[role='mainButton']")
            .waitForExist("//*[@class='quick-sphere' and contains(text(),'S')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, "Сфера не появилась в QCL") })
        })
        
        it('(A) Remove from QCL', function () {
            return browserA
            .waitForVisible('[title="Remove from quick create list"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Remove from quick create list не найден')
                    return this.click('[title="Remove from quick create list"]')
                })
        })
        
        it('(AB) Изменение пункта Remove from QCL -> Show in QCL', function () {
            return client
            .waitForVisible('[title*="Remove from quick create list"]', TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Пункт Remove from QCL не сменился на Show in QCL') })
            .waitForVisible('[title="Show in quick create list"]', TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Пункт Remove from QCL не сменился') })
        })
        
        it('(AB) Проверка удаления из QCL', function () {
            return client
            .moveToObject("[role='mainButton']")
            .waitForExist("//*[@class='quick-sphere' and contains(text(),'S')]", TIMEOUT, true)
                .then(function (result) { result.should.equal(true, "Сфера не пропала из QCL") })
        })
    
    })
        
})

