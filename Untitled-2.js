class Page{
    
}


class AuthPage extends Page{
    constructor (browser) {
        this.browser = browser;
    }
    get $login (){
        return this.browser.elements('#login');
    }
    
    get $submit (){
        
    }
    
    auth(){
        this.$submit.click()
    }
}





page.AppPage.$header.click

export.module


this.currentPage = new AuthPage;



browser.currentPage instanceof AppPage


browser.currentPage.workspace.items[0].openContext()


class AppPage {
    
    constructor (browser){
        this.browser = browser;
        
    }
    
    get $workspace {
        return this._$workspace || (this._$workspace = new Workspace())
    }

    openSidebar () {
        this.$button.click().then(() => {
            return this.__sidebar = new Sidebar(browser, this.browser.elements('.sidebar'));
        })
    }
}


class Sidebar {
    constructor (browser, $el){
        
    }
}




browser.init().then(() => {
    this.currentPage = new AuthPage(this);
})


yield browser.page.openSidebar();
