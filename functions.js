var stickyNote = (function() {

	var toDoNotesArray = function () {
		var notes = localStorage.getItem("notes");
		if(!notes) {
			notes = [];
			localStorage.setItem("notes",JSON.stringify(notes));
			} else {
				notes = JSON.parse(notes);
			}	
			return notes;
		};
		
	var toDoArray = function () {
		var to_do = localStorage.getItem("to_do");
		if(!to_do) {
			to_do = [];
			localStorage.setItem("to_do",JSON.stringify(to_do));
			} else {
				to_do = JSON.parse(to_do);
			}	
			return to_do;
		};
		
	var doneArray = function () {
		var done = localStorage.getItem("done");
		if(!done) {
			done = [];
			localStorage.setItem("done",JSON.stringify(done));
			} else {
				done = JSON.parse(done);
			}	
			return done;
		};

	var notes = toDoNotesArray();
	var to_do = toDoArray();
	var done = doneArray();
	
	var renderHTML = function(categ) {
		_.each(categ, function(i){
			var templateString = "<div class='task' id='" + i + "'>\
				<div class='pin'></div>\
				<div class='status'>\
					<input type='checkbox' class='checkStatus'>\
					<label></label>\
				</div>\
				<div class='text'></div>\
			</div>";
			var template = _.template(templateString);
			$("#tasks").append(template);
		}); 
	};

	var displayStickies = function(categ) {
		renderHTML(categ);
		for(var i = 0; i < categ.length; i++) {
			var key = categ[i];
			if($.inArray(key, to_do) !== -1) {
				$("#" + key +" .status label").text("To do");
			} else {
				$("#" + key +" .status label").text("Done");
				$("#" + key +" .status .checkStatus").attr("checked",true);
				}
			$("#" + key + " .text").text(localStorage[key]);
		}
	};

	var filterNotes = function(categ) {
		$("#tasks").html("");
		switch(categ) {
			case "to_do":
				displayStickies(to_do);
				break;
			case "done":
				displayStickies(done);
				break;
			default: 
				displayStickies(notes);
		}
	};

	var saveSticky = function() {
		var length = notes.length;
		var key = "note_" + length;

		localStorage.setItem(key, "");
		notes.push(key);
		to_do.push(key);
		localStorage.setItem("notes", JSON.stringify(notes));
		localStorage.setItem("to_do", JSON.stringify(to_do));
	};

	var editSticky = function(note) {
		var key = $(note).parent().attr("id");
		var value = $(note).text();
		localStorage[key] = value;
	};
	
	var toggleStatus = function() {
		$("#tasks").on("click"," div:nth-child(2) .checkStatus",function() {
			var key = $(this).parent().parent().attr("id");

			if($(this).is(':checked')) {
				$(this).siblings().text("Done");
				done.push(key);
				to_do.splice($.inArray(key, to_do),1);
				localStorage.setItem("done",JSON.stringify(done));
				localStorage.setItem("to_do", JSON.stringify(to_do));
			} else {
				$(this).siblings().text("To do");
				to_do.push(key);
				localStorage.setItem("to_do",JSON.stringify(to_do));
				done.splice($.inArray(key, done),1);
				localStorage.setItem("done", JSON.stringify(done));
			}
			filterNotes($(".selected").attr("id"));
			statistics();
		});
	};

	var checkStatus = function(key) {
		if($.inArray(key, to_do) !== -1) {
			to_do.splice($.inArray(key, to_do),1);
			localStorage.setItem("to_do", JSON.stringify(to_do));
		} else {
			done.splice($.inArray(key, done),1);
			localStorage.setItem("done", JSON.stringify(done));
		}
	};

	var deleteNote = function(key) {
		for(var i = 0; i < notes.length; i++) {
			if(notes[i] === key) {
				notes.splice(i,1);
			}
		}
		localStorage.setItem("notes", JSON.stringify(notes));
		localStorage.removeItem(key);
		
		checkStatus(key);
		removeNoteFromDOM(key);
		statistics();
	};

	var removeNoteFromDOM = function(id) {
		var note = document.getElementById(id);
		var cont = document.getElementById("tasks");
		cont.removeChild(note);
	};

	var statistics = function() {
		$("#notes p span").text("(" + notes.length + ")");
		$("#to_do p span").text("(" + to_do.length + ")");
		$("#done p span").text("(" + done.length + ")");
	};

	return {
		toDoNotesArray : toDoNotesArray,
		saveSticky : saveSticky,
		editSticky : editSticky,
		toggleStatus : toggleStatus,
		deleteNote : deleteNote,
		filterNotes : filterNotes,
		statistics : statistics
	};
})();

var general = (function() {
	var selectCateg = function() {
		$(".category").click(function() {
			$(".category").removeClass("selected");
			$(this).addClass("selected");
			
			var id = $(this).attr("id");
			// $(".tasks").html("");
			stickyNote.filterNotes(id);
		});
	};

	var addSticky = function() {
		$("#add_button").click(function() {
			var templateString = "<div class='task' id='note_<%= note %>'>\
				<div class='pin'></div>\
				<div class='status'>\
					<input type='checkbox' class='checkStatus'>\
					<label>To do</label>\
				</div>\
				<div class='text'></div>\
			</div>";
			var template = _.template(templateString, {note:[stickyNote.toDoNotesArray().length]});
			$("#tasks").append(template);
			stickyNote.saveSticky();
			stickyNote.statistics();
		});
	}; 

	return {
		selectCateg : selectCateg,
		addSticky : addSticky
	}
})();