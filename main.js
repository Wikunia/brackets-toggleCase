/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, _, Mustache */
define(function (require, exports, module) {
    "use strict";
    
    var AppInit             = brackets.getModule("utils/AppInit"),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        KeyEvent            = brackets.getModule("utils/KeyEvent");


    var keyEventHandler = function ($event, editor, event) {
        
		if (event.altKey && event.shiftKey) {
			var pos 			= editor.getCursorPos();
			var document    	= editor.document;
			var linePartBefore 	= document.getLine(pos.line).substr(0,pos.ch);
			var reverse 		= reverse_str(linePartBefore); 
			// characters which can be part of a word
        	var function_chars = '0123456789abcdefghijklmnopqrstuvwxyz_';
			var noword_regex = new RegExp('[^'+function_chars+']','i');
			var match 		 = noword_regex.exec(reverse);
			var word_start;
			if (match) {
				word_start = pos.ch - match.index;	
			} else {
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