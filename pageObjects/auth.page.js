var page = require('./page')

var authPage = Object.create(page, {
    /**
     * define elements
     */
    username: 		{ get: function () { return client.element('[name="login"]'); } },
    password: 		{ get: function () { return client.element('[name="password"'); } },
    loginButton:    { get: function () { return client.element('.login-button'); } },

    incorrect:  	{ get: function () { return client.element('//*[contains(text(),"Не верный")]'); } },
    wrongType:  	{ get: function () { return client.element('//*[contains(text(),"wrong type")]'); } },

    /**
     * define or overwrite page methods
     */
    open: { value: function () {
        page.open.call(this, 'tm.hub-head.com');
    } },

    submit: { value: function () {
        this.loginButton.click();
    } }
});

module.exports = authPage