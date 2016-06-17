client = require("../functions");

describe('Круг (юзеры)', function() {
		this.timeout(99999999);
    
/*    before(function() {
        return client.sessionStart()
    })*/

    afterEach('sync()', function() {
        return client.sync().pause(PAUSE)
    })

    after('end()', function() {
        return client.end()
    })
    
    describe.skip('Проверка всяких менюшек', function () {
    
        before('', function () {
            return client
            
        })
        
        after('', function () {
            return client
            
        })
        
        it('', function () {
            return client
            
        })
        
        it('', function () {
            return client
            
        })
    
    })

    describe('Отправка приглашений (проверка)', function () {
    
        describe('Незарегистрированный юзер', function () {
            
            var memberLogin = MEMBERRANDOM
              , memberName = memberLogin.replace(/[@\+\.]+/g, '')
            
            before('Логин обоих в LOGIN1 + Создание круга (A)', function (done) {
                return client
                    .loginCorrect(LOGIN1, PASS)
                    .circleListOpen()
                    .then(function () {
                        return browserA
                            .circleCreateNew(circleName)
                    })
                    .circleSettingsOpen(circleName).call(done)
            })

            after('Удаление всех кругов (B) и логаут в обоих', function (done) {
                return client
                    .then(function () {
                        return browserB.deleteAll('circles')
                    })
                    .sync()
                    .logout().call(done)
            })

            it('Открытие попапа поиска юзера', function() {
                return browserA
                .waitForVisible("[role='addUser']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Кнопка добавления нового юзера не найдена') })
                .click("[role='addUser']")
                .click("[role='addUser']")
                .waitForVisible("[role='findUser']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Поле поиска юзеров для добавления в круг не появилось') })
            })

            it('Ввод email', function () {
                return browserA
                .waitForVisible("[role='findUser']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Поле поиска юзеров для добавления в круг не найдено') })
                .setValue("[role='findUser']", memberLogin)
                .getValue("[role='findUser']", memberLogin)
                    .then(function (value) { value.should.equal(memberLogin, memberLogin + ' не введен в поле добавления юзеров в круг') })
            })

            it('Ждем ответ, что юзер не зареган', function () {
                return browserA
                .waitForVisible("[role='userInvite']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Кнопка инвайта юзера не найдена') })
            })

            it('Кликаем кнопку для инвайта в hubhead. Ждем поле для ввода имени.', function () {
                return browserA
                .click("[role='userInvite']")
                .waitForVisible("[role='userInviteName']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Поле для ввода имени нового юезера не найдено') })
            })

            it('Вписываем имя приглашаемого юзера и нажимаем Enter', function () {
                return browserA
                .setValue("[role='userInviteName']", memberLogin)
                .getValue("[role='userInviteName']", memberLogin)
                    .then(function (value) { value.should.equal(memberLogin, memberLogin + ' не введено в имя добавляемого юзера') })
                .keys(["Enter"])

            })

            it('Проверка появления инвайта в списке (A+B)', function () {
                return client
                .waitForVisible("//*[@role='name'][contains(text(),'" + memberName + "')]", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Инвайт не появился в списке юзеров круга') })
                .escape()
            })

        })

        describe('Зарегистрированный юзер', function () {
            
            var memberLogin = LOGIN2
              , memberName = MEMBER2NAME

            before('Логин обоих в LOGIN1 + Создание круга (A)', function () {
                return client
                    .loginCorrect(LOGIN1, PASS)
                    .circleListOpen()
                    .then(function () {
                        return browserA.circleCreateNew(circleName)
                    })
                    .circleSettingsOpen(circleName)
            })

            after('Удаление всех кругов (B) и логаут в обоих', function (done) {
                browserB.deleteAll('circles')
                return client.sync().logout().call(done)
            })
            
            it('Открытие попапа поиска юзера', function() {
                return browserA
                .waitForVisible("[role='addUser']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Кнопка добавления нового юзера не найдена') })
                .click("[role='addUser']")
                .click("[role='addUser']")
                .waitForVisible("[role='findUser']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Поле поиска юзеров для добавления в круг не появилось') })
            })

            it('Ввод email', function () {
                return browserA
                .waitForVisible("[role='findUser']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Поле поиска юзеров для добавления в круг не найдено') })
                .setValue("[role='findUser']", memberLogin)
                .getValue("[role='findUser']", memberLogin)
                    .then(function (value) { value.should.equal(memberLogin, memberLogin + ' не введен в поле добавления юзеров в круг') })
            })
            
            it('Ждем появления юзера в списке и кликаем на него.', function() {
                return browserA
                .waitForVisible("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
                // выделить функцию приглашения нового/существующего юзера в круг
                .click("//*[@role='userEmail'][contains(text(),'" + memberLogin + "')]")
            })

            it('Проверка появления инвайта в списке (A+B)', function () {
                return client
                .waitForVisible("//*[@role='name'][contains(text(),'" + memberName + "')]", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Инвайт не появился в списке юзеров круга') })
                .escape()
            })
        
        })
        
    })
    
    describe('Ответы на приглашение', function () {
        
        var memberLogin = LOGIN2
          , memberName = MEMBER2NAME
    
        before('', function () {
            return client
            
        })
        
        after('', function () {
            return client
            
        })

        describe('Отказ от приглашения в круг', function () {
            
            before('LOGIN1 (A), LOGIN2 (B) + Создание круга (A)', function (done) {
                return client
                    .then(function () {
                        browserA.loginCorrect(LOGIN1, PASS);
                        browserB.loginCorrect(LOGIN2, PASS);
                        return client
                            .sync()
                    })
                    .circleListOpen()
                    .then(function () {
                        return browserA.circleCreateNew(circleName)
                    })
                    .call(done)
            })

            after('Удаление всех кругов (A) и логаут в обоих', function (done) {
                return client
                    .then(function () {
                        return browserA.deleteAll('circles')
                    })
                    .logout().call(done)
            })
            
            it('Инвайт 2 юзера (A)', function () {
                return browserA
                .circleMemberInvite(circleName, memberLogin)
            })
            
            it('Проверяем наличие инвайта (B) в списке кругов', function () {
                return browserB
                .waitForVisible("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='decline']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Инвайт с кнопкой отмены не найдены') })
            })
            
            it('Отказываемся вторым юзером от инвайта (B). Проверяем пропадание кнопки', function() {
                return browserB
                .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='decline']")
                .waitForVisible("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Кнопка отмены инвайта не пропала') })
            })
                                    
            it('Проверка пропадания круга из списка кругов (B)', function() {
                return browserB
                .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Круг в списке отсутствует') })
                .escape()
            })
            
            it('Проверка пропадания инвайта из списка юзеров круга (A)', function () {
                return browserA
                .waitForVisible("//*[@role='name'][contains(text(),'" + memberName + "')]", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Инвайт юзера не пропал из списка юзеров круга') })
                .escape()
            })
        
        })
        
        describe('Принятие приглашения в круг', function () {
        
            before('LOGIN1 (A), LOGIN2 (B) + Создание круга (A)', function (done) {
                return client
                    .then(function () {
                        browserA.loginCorrect(LOGIN1, PASS);
                        browserB.loginCorrect(LOGIN2, PASS);
                        return client.sync()
                    })
                    .circleListOpen()
                        .then(function () {
                            return browserA.circleCreateNew(circleName)
                        })
//                    .sync()
                    .call(done)
            })

            after('Удаление всех кругов (A) и логаут в обоих', function (done) {
                return client
                    .then(function () {
                        return browserA.deleteAll('circles')
                    })
                    .logout().call(done)
            })
            
            it('Инвайт 2 юзера (A)', function () {
                return browserA
                .circleListOpen()
                .circleSettingsOpen(circleName)
                .circleMemberInvite(circleName, memberLogin)
            })
            
            it('Проверяем наличие инвайта (B) в списке кругов', function () {
                return browserB
                .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Инвайт с кнопкой подтверждения не найдены') })
            })
            
            it('Принятие приглашения в круг (B)', function() {
                return browserB
                .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']")
                .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Кнопка подтверждения пропала') })
            })
                        
            it('Проверка наличия круга в списке кругов (B)', function() {
                return browserB
                .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT)
                    .then(function (result) { result.should.equal(true, 'Круг в списке отсутствует') })
                .escape()
            })
            
            it('Проверка смены состояния инвайта в списке юзеров круга (A)', function () {
                return browserA
                .waitForVisible("//*[@role='name'][contains(text(),'" + memberName + "')]", TIMEOUT, true)
                    .then(function (result) { result.should.equal(true, 'Юзер не пропал из списка юзеров круга') })
                .escape()
            })
        
        })
    
    })
    
    describe.skip('Остальные кейсы', function () {
    
        before('', function () {
            return client
            
        })
        
        after('', function () {
            return client
            
        })
        
        it.skip('Удаление инвайта', function () {
            return browserA
            
        })
        
        describe('', function () {
        
            var memberLogin = LOGIN2
              , memberName = MEMBER2NAME

            before('Логин обоих в LOGIN1 + Создание круга (A)', function (done) {
                browserA.loginCorrect(LOGIN1, PASS).circleCreateNew(circleName)
                browserB.loginCorrect(LOGIN2, PASS)
                return client
                    .sync().call(done)
            })

            after('Удаление всех кругов (B) и логаут в обоих', function (done) {
                browserB.deleteAll('circles')
                return client.sync().logout().call(done)
            })
            
            
            it('', function () {
                return browser
                
            })
            
            it('', function () {
                return browser
                
            })
        
        })
        
        it('Удаление мембера круга', function() {
            return client
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .circleMemberInvite(circleName, memberLogin)
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
            .moveToObject("//*[@role='email'][contains(text(),'" + memberLogin + "')]")
            .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]/../*[@role='role']", TIMEOUT)
            .click("//*[@role='email'][contains(text(),'" + memberLogin + "')]/../*[@role='delete']")
            .waitForExist("[label='Cancel']", TIMEOUT)
            .keys(["Enter"])
            .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT, true)
            .escape()
        })

        it('Выход из круга', function() {
            return client
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .circleMemberInvite(circleName, memberLogin)
            .switchUser(memberLogin, PASS)

            .circleListOpen("Открываем список кругов для принятия приглашения.")
            .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']")
            .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT, true)

            .circleSettingsOpen(circleName)
            .waitForExist("[role='circleLeave']", TIMEOUT)
            .click("[role='circleLeave']")
            .waitForExist("[label='Cancel']", TIMEOUT)
            .keys(["Space"])
            .circleListOpen("Открываем список кругов для проверки, что круг пропал.")
            .waitForVisible("//*[@role='circleName'][contains(text(),'" + circleName + "')]", TIMEOUT, true)
            .escape()

            .switchUser(LOGIN1, PASS)
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT, true)
        //  .escape()

        })

        // ставить только последним тестом, чтобы после него была разавторизация, так как овнерство круга передано юзеру c LOGIN2.
        it('Передача овнерства круга', function() { 
            return client
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .circleMemberInvite(circleName, memberLogin)
            .switchUser(memberLogin, PASS)

            .circleListOpen("Открываем список кругов для подтверждения приглашения.")
            .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT)
            .click("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']")
            .waitForExist("//*[@role='circleName'][contains(text(),'" + circleName + "')]/..//*[@role='accept']", TIMEOUT, true)
            .escape()

            .switchUser(LOGIN1, PASS)
            .circleListOpen()
            .circleSettingsOpen(circleName)
            .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]", TIMEOUT)
            .click("//*[@role='email'][contains(text(),'" + memberLogin + "')]/..//*[@role='role']")
            .waitForExist("//*[@role='dropdown']//*[@title='Owner']", TIMEOUT)
            .click("//*[@role='dropdown']//*[@title='Owner']")
            .waitForExist(".dialog-buttons", TIMEOUT)
            .keys(["Space"])
            .waitForExist("//*[@role='email'][contains(text(),'" + memberLogin + "')]/..//*[@role='role'][contains(text(),'O')]", TIMEOUT)
            .escape()
            .switchUser(memberLogin, PASS)
        })
    
    })



})