/*
  All javascript utilises the Hungarian Notation depicting the type of the variable as part of it's name.
  bBusy = Boolean, cLetter = char, aNumbers = array, etc. Globals are denoted by a G_. example: G_bBusy = Global Boolean.
*/



const G_eRoomHolder = $("#room");
const G_eRoomGrid = $("#roomGrid");
const G_eRoomGridTopBar = $("#roomGridTopBar");
const G_eRoomGridSideBar = $("#roomGridSideBar");
const G_eRoomWidthInput = $("#roomWidthInput");
const G_eRoomLengthInput = $("#roomLengthInput");

G_sRoomName = "";
G_iRoomIndex = null;
G_fRoomWidth = 10; //meters
G_fRoomLength = 5; //meters
G_fTableWidth = 2; //meters
G_fTableLength = 1; //meters
G_fOldTablePosX = 0;
G_fOldTablePosY = 0;
G_fNewTablePosX = 0;
G_fNewTablePosY = 0;

G_eTables = null;
G_eOutlines = null;

//Create a room based on the percentage of it's aspect ratio. 1:1 == 100%, 100%.
function createRoom(eTable, eOutline){
  fWidth =  Number(G_fRoomWidth) > Number(G_fRoomLength) ? 100 : Number(G_fRoomWidth) / Number(G_fRoomLength) * 100;
  fLength = Number(G_fRoomWidth) > Number(G_fRoomLength) ? Number(G_fRoomLength) / Number(G_fRoomWidth) * 100 : 100;

  //Animate  elements to fit aspect ratio.
  G_eRoomHolder.animate({
    "width" : fWidth + "%",
    "height" : fLength +"%"
  });

  G_eRoomGrid.animate({
    "width" : "100%",
    "height" : "100%"
  });

  G_eRoomGridTopBar.animate({
    "width" : "100%"
  });

  G_eRoomGridSideBar.animate({
    "height" : "100%"
  });

  // if(G_eTables != null){
  //   G_eTables.animate({
  //     "width" : G_fRoomWidth > G_fRoomLength ? G_fTableWidth / G_fRoomWidth * 100 : G_fTableWidth / G_fRoomLength * 100,
  //     "height": G_fRoomWidth > G_fRoomLength ? G_fTableLength / G_fRoomWidth * 100 : G_fTableLength / G_fRoomLength * 100
  //   });
  // }
  //
  // if(G_eOutlines != null){
  //   G_eTables.animate({
  //     "width" : G_fRoomWidth > G_fRoomLength ? G_fTableWidth / G_fRoomWidth * 100 : G_fTableWidth / G_fRoomLength * 100,
  //     "height": G_fRoomWidth > G_fRoomLength ? G_fTableLength / G_fRoomWidth * 100 : G_fTableLength / G_fRoomLength * 100
  //   });
  // }


}

//Update the width of the room by reloading it with new values.
function updateRoomDimensions(){
  G_fRoomWidth = G_eRoomWidthInput.val().length > 0 ? G_eRoomWidthInput.val() : G_fRoomWidth;
  G_fRoomLength = G_eRoomLengthInput.val().length > 0 ? G_eRoomLengthInput.val() : G_fRoomLength;
  createRoom(G_eTables, G_eOutlines);
}

// draw all tables in json array
function drawTables(fTableWidth, fTableLength ){
  sInnerHTML = "";

  //Resize table dimensions based on this aspect ratio
  fWidth = G_fRoomWidth > G_fRoomLength ? fTableWidth / G_fRoomWidth * 100 : fTableWidth / G_fRoomLength * 100;
  fLength = G_fRoomWidth > G_fRoomLength ? fTableLength / G_fRoomWidth * 100 : fTableLegth / G_fRoomLength * 100;

  sInnerHTML += "<div id='table1' class='table bg-lime' style='width:"+fWidth+"%;height:"+fLength+"%;top:0;left:0;'>01</div>";
  sInnerHTML += "<div id='outline1' class='table-outline draggable' style='width:"+fWidth+"%;height:"+fLength+"%;top:0;left:0;'></div>";

  G_eRoomGrid.html(sInnerHTML);

  G_eTables = $(".table*");
  G_eOutlines = $(".outline*");
}

function setNewTablePos(){
  //Open socket
  //Alter position based on feedback
  outline = $("#outline1");
  table = $("#table1");
  G_fOldTablePosX = table.css("left");
  G_fOldTablePosY = table.css("top");
  G_fNewTablePosX = outline.css("left");
  G_fNewTablePosY = outline.css("top");

  $("#table1").animate({
    top: outline.css("top"),
    left: outline.css("left")
  }, "slow");
}

function storeRoom(){
  sRooms = localStorage.getItem("aRooms");
  jRooms = JSON.parse(sRooms);

  $.map(jRooms, (value, key) => {
    jRooms[key].fRoomWidth = G_fRoomWidth;
    jRooms[key].fRoomLength = G_fRoomWidth;
  });

  //Gathero
  aData = {};
  aData["fRoomWidth"] = G_fRoomWidth;
  aData["fRoomLength"] = G_fRoomLength;
  aData["fTableWidth"] = G_fTableWidth;
  aData["fTableLegth"] = G_fTableLength;
  aData["fOldTablePosX"] = G_fOldTablePosX;
  aData["fOldTablePosY"] = G_fOldTablePosY;
  aData["fNewTablePosX"] = G_fNewTablePosX;
  aData["fNewTablePosY"] = G_fNewTablePosY;

  iIndex = (G_iRoomIndex == null) ? sRooms.length : G_iRoomIndex;
  dRooms = {};
  if(G_sRoomName === ""){
    alert("Invalid room name");
    return;
  }
  dRooms[G_sRoomName] = aData;


  localStorage.setItem("aRooms", JSON.stringify(dRooms));
}

function setName(){
  G_sRoomName = String($("#roomNameInput").val());
}



createRoom(G_fRoomWidth, G_fRoomLength, G_eTables, G_eOutlines);

drawTables(G_fTableWidth, G_fTableLength);

draggable = $(".draggable");
draggable.draggable({
  containment: "parent",
  grid: [ 10, 10 ]
});
