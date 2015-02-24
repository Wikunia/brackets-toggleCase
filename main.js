/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, _, Mustache */
define(function (require, exports, module) {
    "use strict";
    
    var AppInit             = brackets.getModule("utils/AppInit"),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        KeyEvent            = brackets.getModule("utils/KeyEvent");

	// set variable to true if altKey and shiftKey were true on the last keydown event
	var lastBothTrue = false;
	
    var keyEventHandler = function ($event, editor, event) {
       	var arrayKeyCodes = [KeyEvent.DOM_VK_ALT,KeyEvent.DOM_VK_SHIFT];
       	if (event.type == "keydown") {
			lastBothTrue = (event.altKey && event.shiftKey && arrayKeyCodes.indexOf(event.keyCode) >= 0) ? true : false;
	   	}
		
		
		var nrOfselections = editor.getSelections().length;	
		if (nrOfselections == 1 && lastBothTrue && (event.altKey || event.shiftKey) 
			&& event.type == "keyup" && arrayKeyCodes.indexOf(event.keyCode) >= 0) {
			// get the part of the current line in front of the cursor
			var pos 			= editor.getCursorPos();
			var document    	= editor.document;
			var linePartBefore 	= document.getLine(pos.line).substr(0,pos.ch);
			
			var reverse 		= reverse_str(linePartBefore); 
			// characters which can be part of a word
        	var function_chars = '0123456789abcdefghijklmnopqrstuvwxyz_';
			var noword_regex = new RegExp('[^'+function_chars+']','i');
			// check if there is a character which isn't part of a word
			var match 		 = noword_regex.exec(reverse);
			var word_start;
			if (match) {
				word_start = pos.ch - match.index;	
			} else {
				// first word in a line
				word_start = 0;	
			}
			var firstchar = linePartBefore.charAt(word_start);
			if (firstchar.toLowerCase() === firstchar) {
				document.replaceRange(firstchar.toUpperCase(),{line: pos.line, ch: word_start},{line: pos.line, ch: word_start+1});
			} else {
				document.replaceRange(firstchar.toLowerCase(),{line: pos.line, ch: word_start},{line: pos.line, ch: word_start+1});
			}
		}
    };

    /**
        reverse a string  
    */
    function reverse_str(s){
        return s.split("").reverse().join("");
    }
	
    var activeEditorChangeHandler = function ($event, focusedEditor, lostEditor) {
        if (lostEditor) {
            $(lostEditor).off("keyEvent", keyEventHandler);
		}

        if (focusedEditor) {
            $(focusedEditor).on("keyEvent", keyEventHandler);
        }
    };
    
   

    AppInit.appReady(function () {
        
        var currentEditor = EditorManager.getCurrentFullEditor();
       
        $(currentEditor).on('keyEvent', keyEventHandler);
        $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });
});