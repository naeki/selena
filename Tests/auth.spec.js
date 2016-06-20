'user strict';

client = require('../functions')
authPage = require('../pageObjects/auth.page')

describe('Страница авторизации', function () {
    this.timeout(99999999)
    
    /*before(() => {

        return client.sessionStart()

	   })*/
       
    afterEach( 'sync()', () => client.sync().pause(PAUSE) )

    after( 'logout()', () => client.logout() )
 
    it('Тайтл должен быть hub-head Sign in', () => 

        browserA.getTitle().then( (title) =>
            title.should.be.equal('hub-head Sign in') )

    )

    
    it('Размер экрана должен быть 1200 на 900', () => 

        browserA
        .windowHandleSize().then( (size) => {
            size.value.width.should.be.equal(900);
            size.value.height.should.be.equal(1200);
        })

    )

    
    it('(A) Наличие поля для ввода логина', () => 

        browserA
        .getAttribute('[name="login"]', 'type').then( attr =>
            attr.should.be.equal('email') )

    )

        
    it('(B) Наличие поля для ввода пароля', () =>

        browserB
        .getAttribute('[name="password"]', 'type').then( attr =>
            attr.should.be.equal('password') )

    )

     
    it('(A) Наличие кнопки логина', () => 

        browserA
        .getAttribute('.login-button', 'type').then( attr => 
            attr.should.be.equal('submit') )

    )

  
    it('Наличие кнопки «Forgot?»', () => 

        browserA
        .isVisible("//A[contains(text(),'Forgot')]").then(result => 
            result.should.equal(true, 'Кнопка Forgot не найдена') )

    )

    
    describe('Проверка процедуры восстановления пароля', () => {
        
        after('Возврат на страницу логина', () =>

            client.url(URL)

        )
        

        it('(A) Открытие формы восстановления пароля', () =>

            browserA
            .click("//A[contains(text(),'Forgot')]")
            .waitForVisible("//h1[contains(text(),'Forgot?')]", TIMEOUT).then(result => 
                result.should.equal(true, 'Форма восстановления пароля не открылась') )

        )
        

        it('(A) url is http://tm.hub-head.com/register/remind-pass', () =>
            
            browserA
            .url().then( url => 
                url.value.should.equal('http://tm.hub-head.com/register/remind-pass', 'URL не соответствует') )

        )
        

        it('(A) Поле email', () =>

            browserA
            .isExisting('[name="email"]').then(result => 
                result.should.equal(true, 'Поле email не найдено') )

        )
        

        it('(A) Кнопка подтверждения', () =>

            browserA
            .isExisting('[type="submit"]').then(result => 
                result.should.equal(true, 'Кнопка подтверждения не найдена') )

        )

                
        it('(A) Ввод несуществующего email', () =>

            browserA
            .setValue("[name='email']", 'unregistred@levelup.ru')
            .waitForValue("[name='email']", TIMEOUT).then(result => 
                result.should.equal(true, 'Мыло не введено.') )
            .click('[type="submit"]')
            .waitForVisible("//*[contains(text(),'Такого пользователя нет в системе')]", TIMEOUT).then(result => 
                result.should.equal(true, 'Уведомление, что юзер не найден не вывелось.') )

        )

                        
        it('(A) Ввод нормального email', () =>

            browserA
            .setValue("[name='email']", LOGIN1)
            .waitForValue("[name='email']", TIMEOUT).then(result => {
                result.should.equal(true, 'Мыло не введено.') })
            .click('[type="submit"]')
            .waitForVisible("//*[contains(text(),'Вам на e-mail отправлено письмо со ссылкой восстановления пароля')]", TIMEOUT).then(result => 
                result.should.equal(true, 'Уведомление, что юзер мыло выслано не вывелось.') )

        )
        
    })

    describe('Попытка авторизации с некорректными данными', () => {

        let params = [
          , { login : ''                , pass : PASS }
          , { login : PASS              , pass : '' }
          , { login : ''                , pass : '' }
          , { login : PASS              , pass : PASS }
          , { login : 'login@ login.ru' , pass : PASS }
//          , { login : 'login@login', pass : PASS } // временно неправильно отрабатывает
            
        ];
        
        beforeEach( () =>

            browserA
            .refresh()
            .waitForExist("[name='login']", TIMEOUT).then(result => 
                result.should.equal(true, ``) )

        )
        
        params.forEach( (arr) => {

            // it('Логин: ' + arr.login + ', пароль: ' + arr.pass, () => {
            it(`Логин: ${arr.login} , пароль: ${arr.pass}`, () => {
                return browserA
                .login(arr.login, arr.pass)
                .waitForExist("//*[contains(text(),'wrong type')]", TIMEOUT).then(result => 
                    result.should.equal(true, ``) )
            })

        })
    })
    
    describe('Попытка авторизации с корректными, но неверными логином и/или паролем', () => {

        beforeEach( () =>

            browserA
            .refresh()
            .waitForExist("[name='login']")

        )
        
        it('Неправильный логин', () =>

            browserA
            .login(WRONGLOGINPASS, PASS)
            .waitForExist("//*[contains(text(),'Не верный')]", TIMEOUT).then(result => 
                result.should.equal(true, ``) )

        )
        
        it('Неправильный пароль', () =>

            browserB
            .login(LOGIN1, WRONGLOGINPASS)
            .waitForExist("//*[contains(text(),'Не верный')]", TIMEOUT).then(result => 
                result.should.equal(true, ``) )

        )
        
        it('Неправильный пароль + неправильный логин', () =>

            browserA
            .login(WRONGLOGINPASS, WRONGLOGINPASS)
            .waitForExist("//*[contains(text(),'Не верный')]", TIMEOUT).then(result => 
                result.should.equal(true, ``) )

        )
        
    })
    
    describe('Авторизация с корректными данными и логаут', () => {

        it('(B) Корректный логин/пароль', () =>

            browserB
            .login(LOGIN1, PASS)
            .waitForVisible("[role='mainButton']", TIMEOUT).then(result => 
                result.should.equal(true, '(+) не появился.') )
            .waitForExist('.loader', TIMEOUT, true).then(result => 
                result.should.equal(true, 'Loading screen не пропал.') )

        )
        
        it('(B) Логаут', () =>

            browserB
            .circleListOpen()
            .click(".logout-button")
            .waitForExist(".login-button", TIMEOUT).then(result => 
                result.should.equal(true, 'Логаут не выполнен. Страница авторизации не открылась.') )

        )
    })
})
