var Protocol = function() {
	
	
	
	Protocol.prototype.add = function(user) {
		var msg = {};
		var action = "add";
		var data = {};
		data.user = user;
		
		msg.action = action;
		msg.data = data;
					
		return JSON.stringify(msg);
		
	} 
	
	
	Protocol.prototype.remove = function(user) {
		var msg = {};
		var action = "remove";
		var data = {};
		data.user = user;
		
		msg.action = action;
		msg.data = data;
					
		return JSON.stringify(msg);
		
	} 
	
	
	
	Protocol.prototype.move = function(user, localization) {
		var msg = {};
		var action = "move";
		var data = {};
		data.user = user;
		data.localization = localization;
		
		msg.action = action;
		msg.data = data;
					
		return JSON.stringify(msg);
		
	} 
	
	
	
	Protocol.prototype.spray = function(user, venue) {
		var msg = {};
		var action = "spray";
		var data = {};
		data.user = user;
		data.venue = venue;
		
		msg.action = action;
		msg.data = data;
					
		return JSON.stringify(msg);
		
	} 
	
	


}