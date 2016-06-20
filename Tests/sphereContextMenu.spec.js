'user strict';

client = require("../functions");

describe('Сфера (контекстное меню)', function () {
    this.timeout(99999999)
      
    before(``, () => client.loginCorrect(LOGIN1, PASS) )

    beforeEach(() => {
        return client
//          .sphereCreate(sphereName)
//          .sphereListOpen()
//          .sphereDDOpen(sphereName)
    })

    afterEach( 'sync()', () => client.sync().pause(PAUSE) )

    after( 'logout()', () => client.logout() )

    describe('Проверка наличие пунктов контекстного меню', () => {
        let params = [
          , { testName : 'Follow', selector : '[title="Follow"]' }
          , { testName : 'Add to starred', selector : '[title="Add to starred"]' }
          , { testName : 'Unmute', selector : '[title="Unmute"]' }
          , { testName : 'Show in quick create list', selector : '[title="Show in quick create list"]' }
          , { testName : 'Settings', selector : '[title*="Settings"]' }
            
        ];
    
        before('(A) Создание сферы и открытие меню', () =>
            browserA.sphereCreate(sphereName).sphereListOpen().sphereDDOpen(sphereName)
        )
        
        after('(A) Удаление сферы и закрытие сайдбара (AB)', () =>
            browserA.deleteAll('spheres')
        )
        
        params.forEach(function (arr) {
            it(`(A) ${arr.testName}`, () => {
                return browserA
                .isExisting(arr.selector).then(result =>
                   result.should.equal(true, `Пункт ${arr.testName} не найден`) )
                    
            })
        })
    })

    describe('Follow/Unfollow сферы', () => {
        
        before('(A) Создание сферы и открытие сайдбара (AB)', done => {
            browserA.sphereCreate(sphereName)
            return client.sync().sphereListOpen().sphereDDOpen(sphereName).call(done)
        })
        
        after('(A) Удаление всех сфер', () => browserA.deleteAll('spheres') )
        
        it('(A) Follow', () =>
            browserA
            .waitForVisible('[title="Follow"]', TIMEOUT).then(result =>
                result.should.equal(true, 'Пункт Follow не найден')
            )
            .click('[title="Follow"]')
        )
        
        it('(AB) Изменение пункта Follow -> Unfollow', () =>
            client
            .waitForVisible('[title="Follow"]', TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, 'Пункт Follow не сменился')
                result.browserB.should.equal(true, 'Пункт Follow не сменился')
            })
            .waitForVisible('[title*="Unfollow"]', TIMEOUT).then(result => {
                result.browserA.should.equal(true, 'Пункт Follow не сменился на Unfollow')
                result.browserB.should.equal(true, 'Пункт Follow не сменился на Unfollow')
            })
        )
                
        it('(B) Unfollow', () =>
            browserB
            .waitForVisible('[title="Unfollow"]', TIMEOUT).then(result =>
                result.should.equal(true, 'Пункт Unfollow не найден')
            )
            .click('[title="Unfollow"]')
        )

        it('(AB) Изменение пункта Unfollow -> Follow', () =>
            client
            .waitForVisible('[title="Unfollow"]', TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, 'Пункт Unfollow не сменился')
                result.browserB.should.equal(true, 'Пункт Unfollow не сменился')
            })
            .waitForVisible('[title*="Follow"]', TIMEOUT).then(result => {
                result.browserA.should.equal(true, 'Пункт Unfollow не сменился на Follow')
                result.browserB.should.equal(true, 'Пункт Unfollow не сменился на Follow')
            })
        )
        
    })

    describe('Add/Remove starred сферы', () => {
    
        before('(A) Создание сферы и открытие сайдбара (AB)', done => {
            browserA.sphereCreate(sphereName)
            return client.sync().sphereListOpen().sphereDDOpen(sphereName).call(done)
        })
        
        after('(A) Удаление сферы', () => browserA.deleteAll('spheres') )
        
        it('(A) Add to starred', () =>
            browserA
            .isVisible('[title="Add to starred"]').then(result =>
                result.should.equal(true, 'Пункт Add to starred не наден') )
            .click('[title="Add to starred"]')
            .waitForVisible('[title="Add to starred"]', TIMEOUT, true).then(result =>
                result.should.equal(true, 'Контекстное меню не закрылось') )
        )
        
        it('(AB) Sphere group Recent -> Starred', () =>
            client
            .waitForExist(`//*[@role='spheresRecent']//*[@role='sphereName'][contains(text(),'${sphereName}')]`, TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, 'Сфера не пропала из группы Recent')
                result.browserB.should.equal(true, 'Сфера не пропала из группы Recent')
            })
            .waitForExist(`//*[@role='spheresStarred']//*[@role='sphereName'][contains(text(),'${sphereName}')]`, TIMEOUT).then(result => {
                result.browserA.should.equal(true, 'Сфера не появилась в группе Starred')
                result.browserB.should.equal(true, 'Сфера не появилась в группе Starred')
            })
        )
                
        it('(AB) Context menu Add => Remove', () =>
            client
            .sphereDDOpen(sphereName)
            .waitForVisible('[title="Remove star"]', TIMEOUT).then(result => {
                result.browserA.should.equal(true, 'Пункт Add to starred не сменился на Remove star')
                result.browserB.should.equal(true, 'Пункт Add to starred не сменился на Remove star')
            })
        )

        it('(A) Remove from starred"', () =>
            browserA
            .isVisible('[title="Remove star"]').then(result =>
                result.should.equal(true, 'Пункт Remove from starred не найден') )
            .click('[title="Remove star"]')
            .waitForVisible('[title="Remove star"]', TIMEOUT, true).then(result =>
                result.should.equal(true, 'Контекстное меню не закрылось') )
        )

        it('(AB) Sphere group Starred -> Recent', () =>
            client
            .waitForExist(`//*[@role='spheresStarred']//*[@role='sphereName'][contains(text(),'${sphereName}')]`, TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, 'Сфера не пропала из группы Starred')
                result.browserB.should.equal(true, 'Сфера не пропала из группы Starred')
            })
            .waitForExist(`//*[@role='spheresRecent']//*[@role='sphereName'][contains(text(),'${sphereName}')]`, TIMEOUT).then(result => {
                result.browserA.should.equal(true, 'Сфера не появилась в группе Recent')
                result.browserB.should.equal(true, 'Сфера не появилась в группе Recent')
            })
        )
                
        it('(AB) Context menu Remove => Add', () =>
            client
            .sphereDDOpen(sphereName)
            .waitForVisible('[title="Add to starred"]', TIMEOUT).then(result => {
                result.browserA.should.equal(true, 'Пункт Remove star не сменился на Add to starred')
                result.browserB.should.equal(true, 'Пункт Remove star не сменился на Add to starred')
            })
        )
    
    })
    

        
    describe('Add/Remove sphere in QCL', () => {
    
        before('Создание сферы (A) и открытие сайдбара (AB)', done => {
            browserA.sphereCreate(sphereName)
            return client.sync().sphereListOpen().sphereDDOpen(sphereName).call(done)
        })
        
        after('(A) Удаление сферы', () => browserA.deleteAll('spheres') )
        
        it('(A) Add to QCL',() =>
            browserA
            .waitForVisible('[title="Show in quick create list"]', TIMEOUT).then(result =>
                result.should.equal(true, 'Пункт Show in quick create list не найден') )
            .click('[title="Show in quick create list"]')
        )
        
        it('(AB) Изменение пункта Show in QCL -> Remove from QCL', () =>
            client
            .waitForVisible('[title="Show in quick create list"]', TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, 'Пункт Show in QCL не сменился')
                result.browserB.should.equal(true, 'Пункт Show in QCL не сменился')
            })
            .waitForVisible('[title*="Remove from quick create list"]', TIMEOUT).then(result => {
                result.browserA.should.equal(true, 'Пункт Show in QCL не сменился на Remove from QCL')
                result.browserB.should.equal(true, 'Пункт Show in QCL не сменился на Remove from QCL')
            })
        )
        
        it('(AB) Проверка добавления в QCL', () =>
            client
            .moveToObject("[role='mainButton']")
            .waitForExist(`//*[@class='quick-sphere' and contains(text(),'S')]`, TIMEOUT).then(result => {
                result.browserA.should.equal(true, "Сфера не появилась в QCL")
                result.browserB.should.equal(true, "Сфера не появилась в QCL")
            })
        )
        
        it('(A) Remove from QCL', () =>
            browserA
            .waitForVisible('[title="Remove from quick create list"]', TIMEOUT).then(result =>
                result.should.equal(true, 'Пункт Remove from quick create list не найден'))
            .click('[title="Remove from quick create list"]')
        )
        
        it('(AB) Изменение пункта Remove from QCL -> Show in QCL', () =>
            client
            .waitForVisible('[title*="Remove from quick create list"]', TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, 'Пункт Remove from QCL не сменился на Show in QCL')
                result.browserB.should.equal(true, 'Пункт Remove from QCL не сменился на Show in QCL')
            })
            .waitForVisible('[title="Show in quick create list"]', TIMEOUT).then(result => {
                result.browserA.should.equal(true, 'Пункт Remove from QCL не сменился')
                result.browserB.should.equal(true, 'Пункт Remove from QCL не сменился')
            })
        )
        
        it('(AB) Проверка удаления из QCL', () =>
            client
            .moveToObject("[role='mainButton']")
            .waitForExist(`//*[@class='quick-sphere' and contains(text(),'S')]`, TIMEOUT, true).then(result => {
                result.browserA.should.equal(true, "Сфера не пропала из QCL")
                result.browserB.should.equal(true, "Сфера не пропала из QCL")
            })
        )
    
    })
        
})

