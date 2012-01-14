/* 
 * JavaScript EventManager
 * SteelUnderpants.EventManager.js unit tests
 * Copyright 2010, Steel Underpants Software (Ryan Morlok)
 * Released under the MIT, BSD, and GPL Licenses.
 * 
 */
module("Bind/Trigger");

test("Simple Handler", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handlerCallCount = 0;
	
	var handler = function() {
		handlerCallCount++;
	}
	
	em.bind("a", handler);
	
	equal(handlerCallCount, 0, "Handler not called yet");
	
	em.trigger("a");
	
	equal(handlerCallCount, 1, "Handler called 1 time");
	
	em.trigger("a");
	
	equal(handlerCallCount, 2, "Handler called 2 times");
});

test("Multiple Handlers", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handler1CallCount = 0;
	var handler2CallCount = 0;
	
	var handler1 = function() {
		handler1CallCount++;
	}
	var handler2 = function() {
		handler2CallCount++;
	}
	
	em.bind("a", handler1);
	em.bind("a", handler2);
	
	equal(handler1CallCount, 0, "Handler 1 not called yet");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.trigger("a");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 2, "Handler 2 called 2 times");
});

test("Multiple Events", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handlerCallCount = 0;
	
	var handler = function() {
		handlerCallCount++;
	}
	
	em.bind("a", handler);
	em.bind("b", handler);
	
	equal(handlerCallCount, 0, "Handler not called yet");
	
	em.trigger("a");
	
	equal(handlerCallCount, 1, "Handler called 1 time");
	
	em.trigger("b");
	
	equal(handlerCallCount, 2, "Handler called 2 times");
});

test("Multiple Events/Handlers", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handler1CallCount = 0;
	var handler2CallCount = 0;
	
	var handler1 = function() {
		handler1CallCount++;
	}
	var handler2 = function() {
		handler2CallCount++;
	}
	
	em.bind("a", handler1);
	em.bind("b", handler2);
	
	equal(handler1CallCount, 0, "Handler 1 not called yet");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	
	em.trigger("b");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
});

test("Namespaced", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handlerCallCount = 0;
	
	var handler = function() {
		handlerCallCount++;
	}
	
	em.bind("a.foo", handler);
	em.bind("b.foo", handler);
	
	equal(handlerCallCount, 0, "Handler not called yet");
	
	em.trigger("a");
	
	equal(handlerCallCount, 1, "Handler called 1 time");
	
	em.trigger("b");
	
	equal(handlerCallCount, 2, "Handler called 2 times");
});

test("Arguments", function() {
	var em = new SteelUnderpants.EventManager();
	
	var paramA;
	var paramB;
	var thisObj;
	
	var handler = function(a, b) {
		thisObj = this;
		paramA = a;
		paramB = b;
	}
	
	em.bind("a", handler);
	
	same(thisObj, undefined, "paramA undefined");
	same(paramA, undefined, "paramA undefined");
	same(paramB, undefined, "paramB undefined");
	
	var tmpThis = {};
	em.trigger("a", tmpThis, "x", "y");
	
	same(thisObj, tmpThis, "this object set")
	same(paramA, "x", "paramA x");
	same(paramB, "y", "paramB y");
});

test("Trigger Unbound Event", function() {
	var em = new SteelUnderpants.EventManager();
	
	em.trigger("a", {}, "x", "y");
	
	ok(true, "No errors");
});

module("Unbind");

test("Simple Unbind", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handlerCallCount = 0;
	
	var handler = function() {
		handlerCallCount++;
	}
	
	em.bind("a", handler);
	
	equal(handlerCallCount, 0, "Handler not called yet");
	
	em.trigger("a");
	
	equal(handlerCallCount, 1, "Handler called 1 time");
	
	em.unbind("a");
	
	equal(handlerCallCount, 1, "Handler called 1 time");
	
	em.trigger("a");
	
	equal(handlerCallCount, 1, "Handler called 1 time");
});

test("Unbind All with Namespaced", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handler1CallCount = 0;
	var handler2CallCount = 0;
	
	var handler1 = function() {
		handler1CallCount++;
	}
	var handler2 = function() {
		handler2CallCount++;
	}
	
	em.bind("a", handler1);
	em.bind("a.foo", handler2);
	
	equal(handler1CallCount, 0, "Handler 1 not called yet");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.unbind("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
});

test("Unbind Namespaced", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handler1CallCount = 0;
	var handler2CallCount = 0;
	
	var handler1 = function() {
		handler1CallCount++;
	}
	var handler2 = function() {
		handler2CallCount++;
	}
	
	em.bind("a", handler1);
	em.bind("a.foo", handler2);
	
	equal(handler1CallCount, 0, "Handler 1 not called yet");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.unbind("a.foo");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.trigger("a");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
});

test("Unbind All Namespaced", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handler1CallCount = 0;
	var handler2CallCount = 0;
	var handler3CallCount = 0;
	
	var handler1 = function() {
		handler1CallCount++;
	}
	var handler2 = function() {
		handler2CallCount++;
	}
	var handler3 = function() {
		handler3CallCount++;
	}
	
	em.bind("a", handler1);
	em.bind("a.foo", handler2);
	em.bind("b.foo", handler3);
	
	equal(handler1CallCount, 0, "Handler 1 not called yet");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	equal(handler3CallCount, 0, "Handler 3 not called yet");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	equal(handler3CallCount, 0, "Handler 3 not called yet");
	
	em.trigger("b");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	equal(handler3CallCount, 1, "Handler 3 called 1 time");
	
	em.unbind(".foo");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	equal(handler3CallCount, 1, "Handler 3 called 1 time");
	
	em.trigger("a");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	equal(handler3CallCount, 1, "Handler 3 called 1 time");
	
	em.trigger("b");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	equal(handler3CallCount, 1, "Handler 3 called 1 time");
});

test("Unbind Function", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handler1CallCount = 0;
	var handler2CallCount = 0;
	var handler3CallCount = 0;
	
	var handler1 = function() {
		handler1CallCount++;
	}
	var handler2 = function() {
		handler2CallCount++;
	}
	var handler3 = function() {
		handler3CallCount++;
	}
	
	em.bind("a", handler1);
	em.bind("a", handler2);
	
	equal(handler1CallCount, 0, "Handler 1 not called yet");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.unbind(handler1);
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 2, "Handler 2 called 2 times");
});

test("Unbind Function Across Multipe Events", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handler1CallCount = 0;
	var handler2CallCount = 0;
	var handler3CallCount = 0;
	
	var handler1 = function() {
		handler1CallCount++;
	}
	var handler2 = function() {
		handler2CallCount++;
	}
	var handler3 = function() {
		handler3CallCount++;
	}
	
	em.bind("a", handler1);
	em.bind("a", handler2);
	em.bind("b", handler1);
	
	equal(handler1CallCount, 0, "Handler 1 not called yet");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.trigger("b");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.unbind(handler1);
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.trigger("a");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 2, "Handler 2 called 2 times");
	
	em.trigger("b");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 2, "Handler 2 called 2 times");
});

test("Unbind Event + Function", function() {
	var em = new SteelUnderpants.EventManager();
	
	var handler1CallCount = 0;
	var handler2CallCount = 0;
	var handler3CallCount = 0;
	
	var handler1 = function() {
		handler1CallCount++;
	}
	var handler2 = function() {
		handler2CallCount++;
	}
	var handler3 = function() {
		handler3CallCount++;
	}
	
	em.bind("a", handler1);
	em.bind("a", handler2);
	em.bind("b", handler1);
	
	equal(handler1CallCount, 0, "Handler 1 not called yet");
	equal(handler2CallCount, 0, "Handler 2 not called yet");
	
	em.trigger("a");
	
	equal(handler1CallCount, 1, "Handler 1 called 1 time");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.trigger("b");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.unbind("a", handler1);
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 1, "Handler 2 called 1 time");
	
	em.trigger("a");
	
	equal(handler1CallCount, 2, "Handler 1 called 2 times");
	equal(handler2CallCount, 2, "Handler 2 called 2 times");
	
	em.trigger("b");
	
	equal(handler1CallCount, 3, "Handler 1 called 3 times");
	equal(handler2CallCount, 2, "Handler 2 called 1 times");
});