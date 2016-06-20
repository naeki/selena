function Page () {
    
}

Page.prototype.open = function (path) {
	return client.init().url(path)
}

module.exports = new Page()