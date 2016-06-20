var webdriverio = require('webdriverio') 
    client = webdriverio.multiremote({
        browserA: { desiredCapabilities: { browserName: 'firefox' } }
    })


authPage = require('./pageObjects/auth.page')
var expect = require('chai').expect

describe('Страница авторизации', function () {
    // console.log('1')
    this.timeout(99999999);
    
    it('(A) Наличие поля для ввода логина', function (done) {
        // return client.init().url('http://tm.hub-head.com').then(function () {return 
        //     authPage.username.setValue('vadim@levelup.ru');
        //     authPage.password.setValue('12341234');
        // }).call(done)
        authPage.open().call(done);
        // authPage.username.setValue('vadim@levelup.ru');
        // authPage.password.setValue('12341234');
        // authPage.submit();

        // authPage.login.click()
        // expect( authPage.username.getText()).to.contain('vadim@levelup.ru');
        // expect( authPage.password.getText().to.contain('vadim@12341234.ru') )

    })
    

})