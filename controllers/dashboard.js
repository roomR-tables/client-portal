/* Dashboard controller */
jPresets = localStorage.getItem("aRooms");

//console.log("aRoom" + localStorage.getItem("aRooms"));

function loadPresets(jPresets){
  console.log("loading presets...");
  if(jPresets.length > 0){
    eCardLoader = $(".cardLoader");
    sHtml = "";
    $.getJSON( jPresets, function( json ) {
      console.log("json" + json);
    for (var key in json) {
          console.log(key);
    }
    
    sHtml += "<div class='card'><div class='card-menu'><div class='edit-btn bg-lime text-light text-center' onclick='nextPage()'><span class='fas fa-pen'></span></div></div><div class='card-circle'></div><div class='card-title text-dark'>DEFAULT</div></div>";

});
  }
}

loadPresets(jPresets);
