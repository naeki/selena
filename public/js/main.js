socket = new WebSocket("ws://127.0.0.1:8124/");


function run(){
    socket.send($("#url").val());
}

function renderResults(message){
	var data = JSON.parse(message.data);

	$(".results").empty();

	$(".results").append("<div class='header' result='" + data.setup + "'>Global Setup</div>");

	for(var i in data.modules){
		var module = new Module(i, data.modules[i]);
		module.el.appendTo(".results");
	}

	$(".results").append("<div class='header' result='" + data.clean + "'>Global Clean</div>");

}

socket.onmessage = renderResults;




function Module(name, obj){
	this.data   = obj;
	this.result = this.getResult();

	this.el     = $("<div class='block'></div>");
	this.header = $("<div result='"+ this.result +"' class='header'>"+ name +"</div>").appendTo(this.el);

	if (this.data.result == "skip") return this;

	this.header.addClass("snap");
	this.body = $("<div class='body'></div>").appendTo(this.el);
	if (!this.result && !Module.error) Module.error = openBlock(this.el);


	// Rendering Module Setup
	this.$setup = new ActionsBlock("Setup", this.data.setup);
	this.$setup.el.appendTo(this.body);
	
	// Rendering Module Tests
	for(var i in this.data.tests){
		var test = new Test(this.data.tests[i]);
		test.el.appendTo(this.body);
	}

	// Rendering Module Clean
	this.$clean = new ActionsBlock("Clean", this.data.clean);
	this.$clean.el.appendTo(this.body);

	return this;
}

Module.prototype = {
	getResult : function(){
		if (this.data.result === "skip") return this.data.result;

		var result = true;

		result = result 
				&& ActionsBlock.prototype.getResult(this.data.setup)
				&& ActionsBlock.prototype.getResult(this.data.clean);

		for(var i in this.data.tests){
			result = result && Test.prototype.getResult(this.data.tests[i]);
		} 

		return result ? 1 : 0;
	}
}



function Test(obj){
	this.data = obj;

	this.result = this.getResult(this.data);

	this.el     = $("<div class='block'></div>");
	this.header = $("<div result='"+ this.result +"' class='header'>"+ this.data.message +"</div>").appendTo(this.el);

	if (this.data.result == "skip") return this;
	if (!this.result && !Test.error) Test.error = openBlock(this.el);



	this.body = $("<div class='body'></div>").appendTo(this.el);
	this.header.addClass("snap");

	// Rendering Test Setup
	this.$setup = new ActionsBlock("Setup", this.data.setup);
	this.$setup.el.appendTo(this.body);
	

	// Rendering Test result
	this.$actions = new ActionsBlock("Actions", this.data);
	this.$actions.el.appendTo(this.body);


	// Rendering Module Clean
	this.$clean = new ActionsBlock("Clean", this.data.clean);
	this.$clean.el.appendTo(this.body);


	return this;
}

Test.prototype = {
	getResult : function(data){
		if (data.result === "skip") return data.result;

		var result = true;

		result = result 
				&& ActionsBlock.prototype.getResult(data.setup) 
				&& ActionsBlock.prototype.getResult(data)
				&& ActionsBlock.prototype.getResult(data.clean);

		return result ? 1 : 0;
	}
}





function ActionsBlock(name, data){
	this.data = data;

	var actions = data.actions;
	this.result = this.getResult(this.data);

	this.el     = $("<div class='block'></div>");
	this.header = $("<div result='"+ this.result +"' class='header'>"+ name +"</div>").appendTo(this.el);

	if (actions){
		if (!this.result && !ActionsBlock.error) ActionsBlock.error = openBlock(this.el);

		this.header.addClass("snap");
		this.body = $("<div class='body'></div>").appendTo(this.el);

		for (var i=0;actions[i];i++){
			var actionData = actions[i];
			var $action = $("<div class='action' result='"+ actionData.result +"'>"+ actionData.message +"</div>");
			$action.appendTo(this.body)
		}
	}

	return this;
}

ActionsBlock.prototype = {
	getResult : function(data){
		if (!data.actions) return data.result || "skip";

		var result = true, actions = data.actions;

		for(var i=0; actions[i]; i++){
			result = result && actions[i].result;
		} 

		return result ? 1 : 0;
	}
}




$(document).on("click", ".header", function(e){
	var viewed = $(e.target).parent(".block").hasClass("view");
	(viewed ? closeBlock : openBlock).call(this, $(e.target).parent(".block"));
})
function openBlock(el){
	$(el).addClass("view");
	return true;
}
function closeBlock(el){
	$(el).removeClass("view");
	return true;
}


// blockPrototype = {
// 	getResult : function(){
// 		function comp(obj){
// 			for(var i in obj){
// 				obj[i]
// 			}
// 		}

// 		return comp(this.data);
// 	}
// }



