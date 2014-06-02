function showNotes() {
	var toDoNotes = getToDoNotesArray();
	for (var i = 0; i < toDoNotes.length; i++) {
		var key = toDoNotes[i];
		var value = JSON.parse(localStorage[key]);
		displayAllNotes(key,value);
		}
}

function getToDoNotesArray() {
	var toDoNotes = localStorage.getItem("toDoNotes");
	if(!toDoNotes) {
		toDoNotes = [];
		localStorage.setItem("toDoNotes",JSON.stringify(toDoNotes));
		} else {
			toDoNotes = JSON.parse(toDoNotes);
		}	
		return toDoNotes;
}
	
function displayAllNotes(key,notesObj) {
	var tasks = document.getElementById("tasks");
	var div = document.createElement("div");
	div.setAttribute("class","task");
	var pin = document.createElement("div");
	pin.setAttribute("class","pin");
	var status = document.createElement("div");
	var checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.setAttribute("class","checkStatus");
	var label = document.createElement("label");
	if(notesObj.status == "to-do") {
		label.innerHTML = "To do";
		status.appendChild(label);
		status.appendChild(checkbox);
	} else {
		checkbox.setAttribute("checked",true);
		label.innerHTML = "Done";
		status.appendChild(label);
		status.appendChild(checkbox);
	}
	status.setAttribute("class","status");
	div.innerHTML = notesObj.value;
	div.appendChild(pin);
	div.appendChild(status);
	div.setAttribute("id",key);
	tasks.appendChild(div);
}

function addNewNote() {
	var value = document.getElementById("note").value;
	
	var toDoNotes = getToDoNotesArray();
	var length = toDoNotes.length;
	var key = "note_" + length;

	var notesObj = {
		"value" : value,
		"status" : "to-do"
	}
	if(value !== "") {
		localStorage.setItem(key, JSON.stringify(notesObj));
		toDoNotes.push(key);
		localStorage.setItem("toDoNotes", JSON.stringify(toDoNotes));
		displayAllNotes(key,notesObj);
		value.value = "";
		}
}

function selectedCateg() {
	$(".category").click(function() {
		$(".category").removeClass("selected");
		$(this).addClass("selected");
	});
}

function deleteNote(key) {
	var toDoNotes = getToDoNotesArray();
	
	$("div").on("click","div.pin", function() {
		var key = $(this).parent().attr("id");
		var answer = confirm("Are you sure you want tot delete this note?");
		if(answer) {
			if(toDoNotes) {
				for(var i = 0; i < toDoNotes.length; i++) {
					if(toDoNotes[i] === key) {
						toDoNotes.splice(i,1);
					}
				}
				localStorage.setItem("toDoNotes", JSON.stringify(toDoNotes));
			}
			localStorage.removeItem(key);
			removeNoteFromDOM(key);
		}
	});
}

function removeNoteFromDOM(key) {
	var note = document.getElementById(key);
	var cont = document.getElementById("tasks");
	cont.removeChild(note);
}

function getNoteObject(key) {
	var obj = localStorage.getItem(key);

	for (var i = 0; i < localStorage.length; i++) {
		if(localStorage.key(i) == key) {
			obj = JSON.parse(localStorage[key]);
		}
	}
	
	return obj;
}

function toggleStatus() {
	$("div").on("click",".checkStatus",function() {
		var key = $(this).parent().parent().attr("id");
		var obj = getNoteObject(key);
		var status = obj.status;

		if($(this).is(':checked')) {
			$(this).siblings().text("Done");
			status = "done";
			obj = {
				"value" : obj.value,
				"status" : status
				}
			localStorage.setItem(key, JSON.stringify(obj));
		} else {
			$(this).siblings().text("To do");
			status = "to-do";
			obj = {
				"value" : obj.value,
				"status" : status
				}
			localStorage.setItem(key, JSON.stringify(obj));
		}
	});
}

function filterNotes() {
	$(".category").click(function() {
		var categ = $(this).attr("id");
		if(categ == "all") {
				$("#tasks").html('');
				showNotes();
			} else {
				$("#tasks").html('');
				for (var i = 0; i < localStorage.length; i++) {
						var key = localStorage.key(i);
						var obj = JSON.parse(localStorage[key]);
						var status = obj.status;
						if(status == categ) {
							displayAllNotes(key,obj);
							}
						}
					
					}
	});
}

function getNote() {
	$("div").on("dblclick",".task",function() {
		$("#edit_btn").show();
		var text = $(this).text();
		$("#note").val(text);

		var key = $(this).attr("id");
		$("#edit_btn").attr("name",key);
	});
}

function editNote() {
	$("#edit_btn").click(function() {
		var key = $(this).attr("name");
		var obj = getNoteObject(key);
		var value = $("#note").val();
		obj = {
			"value" : value,
			"status" : obj.status
		}
		localStorage.setItem(key, JSON.stringify(obj));
		$("#edit_btn").hide();
		location.reload();
	});
}