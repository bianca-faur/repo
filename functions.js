function storeCateg(newCateg) {
	var categories = [];
	localStorage.setItem("categories", categories.push(newCateg));
}

function addCateg() {
	var addBtn = document.getElementById("add-categ");
	var newCateg = prompt("New category");
	if(newCateg !== null && newCateg !== "") {
		var categories = document.getElementById("categories");
		var div = document.createElement("div");
		var para = document.createElement("p");
		var node = document.createTextNode(newCateg);
		para.appendChild(node);
		div.appendChild(para);
		div.className = "category";
		div.id = newCateg.toLowerCase();
		categories.appendChild(div);
	}
}

function selectCateg() {
	$("#categories").on("click", "div.category", function() {
		$(".category").removeClass("selected");
		$(this).addClass("selected");
	});
}	

function deleteCateg() {
	$("#del-categ").click(function() {
		var conf = confirm("Are you sure you want to delete this category?");
		if(conf) {
			$(".selected").remove();
		}
	});
}

function editCateg() {
	$("#edit-categ").click(function() {
	var categ = prompt("Edit category", $(".selected p").text());
	if (categ !== "") {
		$(".selected p").text(categ);
	}
});
}