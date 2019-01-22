/* Dashboard controller */
function loadPresets(){
  jPresets = JSON.parse(localStorage.getItem("aRooms"));
  console.log("loading presets");
  sHtml = "";
  eCardLoader = $("#cardLoader");
  $.each(jPresets, function(key, value){
    sHtml += "<div class='card'><div class='card-menu'><div class='edit-btn bg-lime text-light text-center' onclick='nextPage()'><span class='fas fa-pen'></span></div></div><div class='card-circle'></div><div class='card-title text-dark'>"+key+"</div></div>";
  })
  eCardLoader.html(sHtml);
}
loadPresets();
