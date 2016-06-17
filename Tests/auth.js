fn = require('../functions')

describe('Страница авторизации', function() {
    this.timeout(99999999);
    
    before(function() {
        return client.sessionStart()
		})
    
    afterEach(function() {
        return client.sync().pause(PAUSE)
    })
    
    after(function() {
        return client.end()
    })
 
    it('Тайтл должен быть hub-head Sign in', function() {
        return client.getTitle()
        .then(function(title) { title.should.be.equal('hub-head Sign in') })
    })
    
    it('Размер экрана должен быть 1200 на 900', function() {
        return client
        .windowHandleSize().then(function(size) {
            size.value.width.should.be.equal(900);
            size.value.height.should.be.equal(1200);
        })
    })
    
    it('(A) Наличие поля для ввода логина', function() {
        return browserA
        .getAttribute('[name="login"]', 'type')
            .then(function(attr) { attr.should.be.equal('email') })
    })
        
    it('(B) Наличие поля для ввода пароля', function() {
        return browserB
        .getAttribute('[name="password"]', 'type')
            .then(function(attr) { attr.should.be.equal('password') })
    })
     
    it('(A) Наличие кнопки логина', function() {
        return browserA
        .getAttribute('.login-button', 'type')
            .then(function(attr) { attr.should.be.equal('submit') })
    })
  
    it('Наличие кнопки «Forgot?»', function() {
        return browserA
        .isVisible("//A[contains(text(),'Forgot')]")
            .then(function(result) { result.should.equal(true, 'Кнопка Forgot не найдена') })
    })
    
    describe('Проверка процедуры восстановления пароля', function() {
        
        after('Возврат на страницу логина', function () {
            return client
            .url(URL)
        })
        
        it('(A) Открытие формы восстановления пароля', function() {
            return browserA
            .click("//A[contains(text(),'Forgot')]")
            .waitForVisible("//h1[contains(text(),'Forgot?')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Форма восстановления пароля не открылась.') })
        })
        
        it('(A) url is http://tm.hub-head.com/register/remind-pass', function () {
            return browserA
            .url()
                .then(function (url) { console.log(url.value); url.value.should.equal('http://tm.hub-head.com/register/remind-pass', 'URL не соответствует') })
        })
        
        it('(A) Поле email', function () {
            return browserA
            .isExisting('[name="email"]')
                .then(function (result) { result.should.equal(true, 'Поле email не найдено') })
        })
        
        it('(A) Кнопка подтверждения', function() {
            return browserA
            .isExisting('[type="submit"]')
                .then(function (result) { result.should.equal(true, 'Кнопка подтверждения не найдена') })
        })
                
        it('(A) Ввод несуществующего email', function() {
            return browserA
            .setValue("[name='email']", 'unregistred@levelup.ru')
            .waitForValue("[name='email']", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Мыло не введено.') })
            .click('[type="submit"]')
            .waitForVisible("//*[contains(text(),'Такого пользователя нет в системе')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Уведомление, что юзер не найден не вывелось.') })
        })
                        
        it('(A) Ввод нормального email', function() {
            return browserA
            .setValue("[name='email']", LOGIN1)
            .waitForValue("[name='email']", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Мыло не введено.') })
            .click('[type="submit"]')
            .waitForVisible("//*[contains(text(),'Вам на e-mail отправлено письмо со ссылкой восстановления пароля')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, 'Уведомление, что юзер мыло выслано не вывелось.') })
        })
        
    })

    describe('Попытка авторизации с некорректными данными', function() {
        this.slow(500);
        var params = [
          , { login : '', pass : PASS }
          , { login : PASS, pass : '' }
          , { login : '', pass : '' }
          , { login : PASS, pass : PASS }
          , { login : 'login@ login.ru', pass : PASS }
//          , { login : 'login@login', pass : PASS } // временно неправильно отрабатывает
            
        ];
        
        beforeEach(function() {
            return client
            .refresh()
            .waitForExist("[name='login']", TIMEOUT)
                .then(function (result) { result.should.equal(true, '') })
        })
        
        params.forEach(function (arr) {
            it('Логин: ' + arr.login + ', пароль: ' + arr.pass, function() {
                return client
                .login(arr.login, arr.pass)
                .waitForExist("//*[contains(text(),'wrong type')]", TIMEOUT)
                    .then(function (result) { result.should.equal(true, '') })
            })
        })
    })
    
    describe('Попытка авторизации с корректными, но неверными логином и/или паролем', function() {
        this.slow(550);
        
        beforeEach(function() {
            return client
            .refresh()
            .waitForExist("[name='login']")
        })
        
        it('Неправильный логин', function() {
            return browserA
            .login(WRONGLOGINPASS, PASS)
            .waitForExist("//*[contains(text(),'Не верный')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, '') })
        })
        
        it('Неправильный пароль', function() {
            return browserB
            .login(LOGIN1, WRONGLOGINPASS)
            .waitForExist("//*[contains(text(),'Не верный')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, '') })
        })
        
        it('Неправильный пароль + неправильный логин', function() {
            return browserA
            .login(WRONGLOGINPASS, WRONGLOGINPASS)
            .waitForExist("//*[contains(text(),'Не верный')]", TIMEOUT)
                .then(function (result) { result.should.equal(true, '') })
        })
        
    })
    
    describe('Авторизации с корректными данными и логаут', function() {
        this.slow(2000);
        it('(B) Корректный логин/пароль', function() {
            return browserB
            .login(LOGIN1, PASS)
            .waitForVisible("[role='mainButton']", TIMEOUT)
                .then(function (result) { result.should.equal(true, '(+) не появился.') })
            .waitForExist('.loader', TIMEOUT, true)
                .then(function (result) { result.should.equal(true, 'Loading screen не пропал.') })
        })
        
        it('(B) Логаут', function() {
            return browserB
            .circleListOpen()
            .click(".logout-button")
            .waitForExist(".login-button", TIMEOUT)
            .then(function (result) { result.should.equal(true, 'Логаут не выполнен. Страница авторизации не открылась.') })
        })
    })

})