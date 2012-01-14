/* 
 * JavaScript DynamicHyperlinker
 * SteelUnderpants.DynamicHyperlinker.js
 * Copyright 2012, Steel Underpants Software (Ryan Morlok)
 * Released under the MIT, BSD, and GPL Licenses.
 * 
 */
(function(window, document, $) {

if( typeof window.SteelUnderpants === "undefined" )
	window.SteelUnderpants = {};

window.SteelUnderpants.DynamicHyperlinker = function(options) {
	
	// "this" object to be returned
	var me = this;
	
	if ( me.constructor !== window.SteelUnderpants.DynamicHyperlinker ) {
		return new window.SteelUnderpants.DynamicHyperlinker();
	}

	var defaultOptions = {
		// Array of string jQuery selectors where the text replacement will happen within the page
		// e.g. ["#foo", ".bar"]
		jQueryBindSelectors: null,
		
		// Function to fetch the dynamic hyperlink definitions. May either immediately return
		// the array of selectors, or call back the passed continuation function when the
		// hyperlink definitions are loaded (the initial function call should then return null)
		// 
		// Hyperlink definitions are of the form:
		// [
		//   {selector:"regex", value:"http://the.hyper.link", new_window:true, css_class:"foo"},
		//   {selector:"regex", value:"http://other.hyper.link", new_window:true, css_class:"bar"}
		// ]
		// 
		// where selector is a string representing a regex; value is the hyperlink to be inserted
		// when the regex is located; new_window is a boolean flag indicating if the link
		// should pop a window; and css_class is a class to be applied to the anchor (or a 
		// space separated list)
		fetchDynamicHyperlinkDefintions: null,
		
		// Function called when all replacements are complete. Useful for tests that wish to
		// validate results.
		onComplete: null
	};
	
	options = $.extend(defaultOptions, options);
	
	function executeReplacement(jQuerySelector, fetchDynamicHyperlinkDefintions) {
		$(jQuerySelector).each(function() {
			
			var hyperlink = "<a href='" + fetchDynamicHyperlinkDefintions.value + "' ";
			if( fetchDynamicHyperlinkDefintions.css_class ) {
				hyperlink += " class='" + fetchDynamicHyperlinkDefintions.css_class + "' ";
			}
			if( fetchDynamicHyperlinkDefintions.new_window ) {
				hyperlink += " target='_blank'";
			}
			hyperlink += ">$1</a>";
			
			this.innerHTML = 
				this.innerHTML.replace(new RegExp("(" + fetchDynamicHyperlinkDefintions.selector + ")", "ig"), hyperlink);
		});
	}
	
	function linearize(arr1, arr2) {
		var result = [];
		var i = 0, j = 0;
		var arr1length = arr1.length;
		var arr2length = arr2.length;
		
		for(i = 0; i < arr1length; i++) {
			for(j = 0; j < arr2length; j++) {
				result.push({left: arr1[i], right:arr2[j]});
			}
		}
		
		return result;
	}
	
	me.execute = function SteelUnderpants$DynamicHyperlinker$execute() {
		function runSubstitutions(hyperlinkDefinitions) {
			$(document).ready(function() {
				var selectorDefCombos = linearize(options.jQueryBindSelectors, hyperlinkDefinitions);
				var selectorDefCombosLength = selectorDefCombos.length;
				var i = 0;
			
				function nextAndDelay() {
					executeReplacement(selectorDefCombos[i].left, selectorDefCombos[i].right);
					i = i + 1;
					if( i < selectorDefCombosLength) {
						window.setTimeout(nextAndDelay, 0);
					} else {
						if( typeof options.onComplete === "function") {
							options.onComplete();
						}
					}
				}
			
				window.setTimeout(nextAndDelay, 0);
			});
		}
		
		var hyperlinkDefinitions = options.fetchDynamicHyperlinkDefintions(function(hyperlinkDefinitions) {
			runSubstitutions(hyperlinkDefinitions);
		});
		
		if( hyperlinkDefinitions ) {
			runSubstitutions(hyperlinkDefinitions);
		}
	};
	
	return me;
};

})(window, document, jQuery);