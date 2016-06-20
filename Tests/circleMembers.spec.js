'user strict';

client = require("../functions");

describe('Круг (юзеры)', function () {
     this.timeout(99999999)
   
/*    before(function () {
        return client.sessionStart()
    })*/

    afterEach( 'sync()', () => client.sync().pause(PAUSE) )

    // after( 'logout()', () => client.logout() )
    
    describe.skip('Проверка всяких менюшек', () => {
    
        before('', () =>
            client
            
        )
        
        after('', () =>
            client
            
        )
        
        it('', () =>
            client
            
        )
        
        it('', () =>
            client
            
        )
    
    })

    describe('Отправка приглашений (проверка)', () => {
    
        describe('Незарегистрированный юзер', () => {
            
            let memberLogin = MEMBERRANDOM
              , memberName = memberLogin.replace(/[@\+\.]+/g, ``)
            
            before('Логин обоих в LOGIN1 + Создание круга (A)', () =>
                client
                    .loginCorrect(LOGIN1, PASS)
                    .circleListOpen()
                    .then( () => browserA.circleCreateNew(circleName) )
                    .circleSettingsOpen(circleName)
            )

            after('Удаление всех кругов (B) и логаут в обоих', () =>
                client
                    .then( () => browserB.deleteAll('circles') )
                    .logout()
            )

            it('Открытие попапа поиска юзера', () =>
                browserA
                .waitForVisible(`[role='addUser']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Кнопка добавления нового юзера не найдена') )
                .click(`[role='addUser']`)
                .click(`[role='addUser']`)
                .waitForVisible(`[role='findUser']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Поле поиска юзеров для добавления в круг не появилось') )
            )

            it('Ввод email', () =>
                browserA
                .waitForVisible(`[role='findUser']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Поле поиска юзеров для добавления в круг не найдено') )
                .setValue(`[role='findUser']`, memberLogin)
                .getValue(`[role='findUser']`, memberLogin).then(value =>
                   value.should.equal(memberLogin, `${memberLogin} не введен в поле добавления юзеров в круг`) )
            )

            it('Ждем ответ, что юзер не зареган', () =>
                browserA
                .waitForVisible(`[role='userInvite']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Кнопка инвайта юзера не найдена') )
            )

            it('Кликаем кнопку для инвайта в hubhead. Ждем поле для ввода имени.', () =>
                browserA
                .click(`[role='userInvite']`)
                .waitForVisible(`[role='userInviteName']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Поле для ввода имени нового юезера не найдено') )
            )

            it('Вписываем имя приглашаемого юзера и нажимаем Enter', () =>
                browserA
                .setValue(`[role='userInviteName']`, memberLogin)
                .getValue(`[role='userInviteName']`, memberLogin).then(value =>
                   value.should.equal(memberLogin, `${memberLogin} не введено в имя добавляемого юзера`) )
                .keys(["Enter"])
            )

            it('Проверка появления инвайта в списке (A+B)', () =>
                client
                .waitForVisible(`//*[@role='name'][contains(text(),'${memberName}')]`, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, 'Инвайт не появился в списке юзеров круга')
                    result.browserB.should.equal(true, 'Инвайт не появился в списке юзеров круга')
                    })
                .escape()
            )

        })

        describe('Зарегистрированный юзер', () => {
            
            let memberLogin = LOGIN2
              , memberName = MEMBER2NAME

            before('(AB) Логин в LOGIN1 + (A) Создание круга', () =>
                client
                    .loginCorrect(LOGIN1, PASS)
                    .circleListOpen()
                    .then(() => browserA.circleCreateNew(circleName) )
                    .circleSettingsOpen(circleName)
            )

            after('(B) Удаление всех кругов и (AB) логаут', done => {
                browserB.deleteAll('circles')
                return client.sync().logout().call(done)
            })
            
            it('(A) Открытие попапа поиска юзера', () =>
                browserA
                .waitForVisible(`[role='addUser']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Кнопка добавления нового юзера не найдена') )
                .click(`[role='addUser']`)
                .click(`[role='addUser']`)
                .waitForVisible(`[role='findUser']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Поле поиска юзеров для добавления в круг не появилось') )
            )

            it('(A) Ввод email', () =>
                browserA
                .waitForVisible(`[role='findUser']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Поле поиска юзеров для добавления в круг не найдено') )
                .setValue(`[role='findUser']`, memberLogin)
                .getValue(`[role='findUser']`, memberLogin).then(value =>
                   value.should.equal(memberLogin, `${memberLogin} не введен в поле добавления юзеров в круг`) )
            )
            
            it('(A) Ждем появления юзера в списке и кликаем на него.', () =>
                browserA
                .waitForVisible(`//*[@role='userEmail'][contains(text(),'${memberLogin}')]`, TIMEOUT)
                // выделить функцию приглашения нового/существующего юзера в круг
                .click(`//*[@role='userEmail'][contains(text(),'${memberLogin}')]`)
            )

            it('(AB) Проверка появления инвайта в списке ', () =>
                client
                .waitForVisible(`//*[@role='name'][contains(text(),'${memberName}')]`, TIMEOUT).then(result => {
                    result.browserA.should.equal(true, 'Инвайт не появился в списке юзеров круга')
                    result.browserB.should.equal(true, 'Инвайт не появился в списке юзеров круга')
                })
                .escape()
            )
        
        })
        
    })
    
    describe('Ответы на приглашение', () => {
        
        let memberLogin = LOGIN2
          , memberName = MEMBER2NAME
    
        before('', () =>
            client
            
        )
        
        after('', () =>
            client
            
        )

        describe('Отказ от приглашения в круг', () => {
            
            before('LOGIN1 (A), LOGIN2 (B) + Создание круга (A)', done =>
                client
                    .then( () => {
                        browserA.loginCorrect(LOGIN1, PASS);
                        browserB.loginCorrect(LOGIN2, PASS);
                        return client.sync()
                    })
                    .circleListOpen()
                    .then( () => browserA.circleCreateNew(circleName) )
                    .call(done)
            )

            after('Удаление всех кругов (A) и логаут в обоих', done =>
                client
                    .then( () => browserA.deleteAll('circles') )
                    .logout().call(done)
            )
            
            it('(A) Инвайт 2 юзера', () =>
                browserA
                .circleMemberInvite(circleName, memberLogin)
            )
            
            it('(B) Проверяем наличие инвайта в списке кругов', () =>
                browserB
                .waitForVisible(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='decline']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Инвайт с кнопкой отмены не найдены') )
            )
            
            it('(B) Отказываемся вторым юзером от инвайта. Проверяем пропадание кнопки', () =>
                browserB
                .click(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='decline']`)
                .waitForVisible(`//*[@role='circleName'][contains(text(),'${circleName}')]`, TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Кнопка отмены инвайта не пропала') )
            )
                                    
            it('(B) Проверка пропадания круга из списка кругов', () =>
                browserB
                .waitForExist(`//*[@role='circleName'][contains(text(),'${circleName}')]`, TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Круг в списке отсутствует') )
                .escape()
            )
            
            it('(A) Проверка пропадания инвайта из списка юзеров круга', () =>
                browserA
                .waitForVisible(`//*[@role='name'][contains(text(),'${memberName}')]`, TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Инвайт юзера не пропал из списка юзеров круга') )
                .escape()
            )
        
        })
        
        describe('Принятие приглашения в круг', () => {
        
            before('LOGIN1 (A), LOGIN2 (B) + Создание круга (A)', done =>
                client
                    .then( () => {
                        browserA.loginCorrect(LOGIN1, PASS);
                        browserB.loginCorrect(LOGIN2, PASS);
                        return client.sync()
                    })
                    .circleListOpen()
                        .then( () => browserA.circleCreateNew(circleName) )
//                    .sync()
                    .call(done)
            )

            after('(A) Удаление всех кругов и (AB) логаут', done =>
                client
                .then( () => browserA.deleteAll('circles') )
                .logout().call(done)
            )
            
            it('(A) Инвайт 2 юзера', () =>
                browserA
                .circleListOpen()
                .circleSettingsOpen(circleName)
                .circleMemberInvite(circleName, memberLogin)
            )
            
            it('(B) Проверяем наличие инвайта в списке кругов', () =>
                browserB
                .waitForExist(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='accept']`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Инвайт с кнопкой подтверждения не найдены') )
            )
            
            it('(B) Принятие приглашения в круг', () =>
                browserB
                .click(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='accept']`)
                .waitForExist(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='accept']`, TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Кнопка подтверждения пропала') )
            )
                        
            it('(B) Проверка наличия круга в списке кругов', () =>
                browserB
                .waitForExist(`//*[@role='circleName'][contains(text(),'${circleName}')]`, TIMEOUT).then(result =>
                    result.should.equal(true, 'Круг в списке отсутствует') )
                .escape()
            )
            
            it('(A) Проверка смены состояния инвайта в списке юзеров круга', () =>
                browserA
                .waitForVisible(`//*[@role='name'][contains(text(),'${memberName}')]`, TIMEOUT, true).then(result =>
                    result.should.equal(true, 'Юзер не пропал из списка юзеров круга') )
                .escape()
            )
        
        })
    
    })
    
    describe.skip('Остальные кейсы', () => {
    
        before('', () =>
            client
            
        )
        
        after('', () =>
            client
            
        )
        
        it.skip('Удаление инвайта', () =>
            browserA
            
        )
        
        describe('', () => {
        
            let memberLogin = LOGIN2
              , memberName = MEMBER2NAME

            before('Логин обоих в LOGIN1 + Создание круга (A)', done => {
                loginCorrect(LOGIN1, PASS).circleCreateNew(circleName)
                browserB.loginCorrect(LOGIN2, PASS)
                return client.sync().call(done)
            })

            after('Удаление всех кругов (B) и логаут в обоих', done => {
                browserA.deleteAll('circles')
                return client.sync().logout().call(done)
            })
            
            
            it('', () =>
                browserA
                
            )
            
            it('', () =>
                browserA
                
            )
        
        })
        
        it('Удаление мембера круга', () =>
            client
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .circleMemberInvite(circleName, memberLogin)
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .waitForExist(`//*[@role='email'][contains(text(),'${memberLogin}')]`, TIMEOUT)
            .moveToObject(`//*[@role='email'][contains(text(),'${memberLogin}')]`)
            .waitForExist(`//*[@role='email'][contains(text(),'${memberLogin}')]/../*[@role='role']`, TIMEOUT)
            .click(`//*[@role='email'][contains(text(),'${memberLogin}')]/../*[@role='delete']`)
            .waitForExist(`[label='Cancel']`, TIMEOUT)
            .keys(["Enter"])
            .waitForExist(`//*[@role='email'][contains(text(),'${memberLogin}')]`, TIMEOUT, true)
            .escape()
        )

        it('Выход из круга', () =>
            client
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .circleMemberInvite(circleName, memberLogin)
            .switchUser(memberLogin, PASS)

            .circleListOpen("Открываем список кругов для принятия приглашения.")
            .click(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='accept']`)
            .waitForExist(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='accept']`, TIMEOUT, true)

            .circleSettingsOpen(circleName)
            .waitForExist(`[role='circleLeave']`, TIMEOUT)
            .click(`[role='circleLeave']`)
            .waitForExist(`[label='Cancel']`, TIMEOUT)
            .keys(["Space"])
            .circleListOpen("Открываем список кругов для проверки, что круг пропал.")
            .waitForVisible(`//*[@role='circleName'][contains(text(),'${circleName}')]`, TIMEOUT, true)
            .escape()

            .switchUser(LOGIN1, PASS)
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .waitForExist(`//*[@role='email'][contains(text(),'${memberLogin}')]`, TIMEOUT, true)
        //  .escape()

        )

        // ставить только последним тестом, чтобы после него была разавторизация, так как овнерство круга передано юзеру c LOGIN2.
        it('Передача овнерства круга', () => 
            client
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .circleMemberInvite(circleName, memberLogin)
            .switchUser(memberLogin, PASS)

            .circleListOpen("Открываем список кругов для подтверждения приглашения.")
            .waitForExist(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='accept']`, TIMEOUT)
            .click(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='accept']`)
            .waitForExist(`//*[@role='circleName'][contains(text(),'${circleName}')]/..//*[@role='accept']`, TIMEOUT, true)
            .escape()

            .switchUser(LOGIN1, PASS)
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .waitForExist(`//*[@role='email'][contains(text(),'${memberLogin}')]`, TIMEOUT)
            .click(`//*[@role='email'][contains(text(),'${memberLogin}')]/..//*[@role='role']`)
            .waitForExist(`//*[@role='dropdown']//*[@title='Owner']`, TIMEOUT)
            .click(`//*[@role='dropdown']//*[@title='Owner']`)
            .waitForExist(".dialog-buttons", TIMEOUT)
            .keys(["Space"])
            .waitForExist(`//*[@role='email'][contains(text(),'${memberLogin}')]/..//*[@role='role'][contains(text(),'O')]`, TIMEOUT)
            .escape()
            .switchUser(memberLogin, PASS)
        )
    
    })



})