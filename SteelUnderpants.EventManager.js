/* 
 * JavaScript EventManager
 * SteelUnderpants.EventManager.js
 * Copyright 2010, Steel Underpants Software (Ryan Morlok)
 * Released under the MIT, BSD, and GPL Licenses.
 * 
 */
(function() {

if( typeof window.SteelUnderpants === "undefined" )
	window.SteelUnderpants = {};

window.SteelUnderpants.EventManager = function() {
	// "This" object to be returned
	var me = this;
	if ( me.constructor !== window.SteelUnderpants.EventManager ) {
		return new window.SteelUnderpants.EventManager();
	}
	
	// Mapping object from event name to array of objects that hold handlers
	var handlers = {};
	
	me.bind = function(event, handler) {
		if (!event) {
			throw "Event must be specified.";
		}
		
		if (!handler) {
			throw "Handler must be specified.";
		}
		
		if ( typeof handler !== "function" ) {
			throw "Handler must me function.";
		}
		
		var namespaceSeparator = event.indexOf(".");
		if (namespaceSeparator >= 0) {
			var eventName = event.substr(0, namespaceSeparator);
			var namespace = event.substr(namespaceSeparator+1);	
		} else {
			var eventName = event;
			var namespace = "";
		}
		
		if (!handlers[eventName]) {
			handlers[eventName] = [];
		}
		
		handlers[eventName].push({
			namespace: namespace,
			handler: handler
		});
		
	};
	
	me.trigger = function(event, thisObject) {
		var handlerArgs = [];
		if (arguments.length > 2) {
			for(var i = 2; i < arguments.length; i++) {
				handlerArgs.push(arguments[i]);
			}
		}
		
		var eventHandlers = handlers[event] || [];
		var handlersLength = eventHandlers.length;
		for (var i = 0; i < handlersLength; i++) {
			eventHandlers[i].handler.apply(thisObject, handlerArgs);
		} 
	};
	
	me.unbind = function(a, b) {
		if (typeof a === "string") {
			var dotIndex = a.indexOf(".");
			if (dotIndex >= 0) {
				var eventName = a.substr(0, dotIndex);
				var namespace = a.substr(dotIndex+1);
			} else {
				var eventName = a;
			}
		} else {
			var handler = a;
		}
		
		if (!handler && typeof b === "function") {
			var handler = b;
		}
		
		function matches(thisEventName, handlerObject) {
			return (!eventName || thisEventName === eventName) &&
				(!namespace || handlerObject.namespace === namespace) &&
				(!handler || handlerObject.handler === handler);
		}
		
		function removeHandlers(eventNames) {
			for(var event in eventNames) {
				if (eventNames.hasOwnProperty(event)) {
					
					var thisEventHandlers = handlers[event];
					var thisEventHanldersLength = thisEventHandlers.length;
					var resultingEventHandlers = [];
					
					for(var i = 0; i < thisEventHanldersLength; i++) {
						if (!matches(event, thisEventHandlers[i])) {
							resultingEventHandlers.push(thisEventHandlers[i]);
						}
					}
					
					if (resultingEventHandlers.length > 0) {
						handlers[event] = resultingEventHandlers;
					} else {
						delete handlers[event];
					}
				}
			}
		}
		
		if( eventName ) {
			var tmp = {};
			tmp[eventName] = true;
			removeHandlers(tmp);
		} else {
			removeHandlers(handlers);
		}
	};
	
	return me;
};

})();