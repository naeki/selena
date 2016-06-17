class Page{
    
}


class AuthPage extends Page{
    get $login : function(){
        return client.elements('#login');
    }
    
    get $submit : function(){
        
    }
    
    auth : function(){
        this.$submit.click()
    }
}


class AppPage extends Page{
    
    get $header
    
}