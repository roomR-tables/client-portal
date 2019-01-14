data = {
  "room": {
    "width": 5000,
    "depth": 2500
  },
  "tables": [
    {
      "id": 0,
      "x": 800,
      "y": 600,
      "width": 752,
      "depth": 501
    }/*,
    {
      "id": 1,
      "x": 1300,
      "y": 600,
      "width": 752,
      "depth": 501
    },
    {
      "id": 2,
      "x": 1800,
      "y": 600,
      "width": 752,
      "depth": 501
    }*/
  ]
}

room_width = 10000; //mm
room_length = 5000; //mm

function createRoom(){
  // width =  data.room.width > data.room.depth ? 100 : value.y / data.room.width / data.room.depth * 100;
  // depth = data.room.width > data.room.depth ? data.room.depth / data.room.width * 100 : 100;

  width =  room_width > room_length ? 100 : room_width / room_length * 100;
  depth = room_width > room_length ? room_length / room_width * 100 : 100;



  $("#room").animate({
    "width" : width + "%",
    "height" : depth +"%"
  });

  $("#room-entry").animate({
    "width" : "100%",
    "height" : "100%"
  });

  $("#horizontal-top-bar").animate({
    "width" : "100%"
  });

  $("#vertical-side-bar").animate({
    "height" : "100%"
  });
}

function updateRoomWidth(){
  room_width = $("#plain-text-input").val() * 1000;

  createRoom();
}
function updateRoomHeight(){
  room_length = $("#plain-text-input2").val() * 1000;
  createRoom();
}

// draw all tables in json array
function drawTables( data ){
  innerHTML = "";
  $.each(data.tables, function(key, value){
    // //Get the current position of the
    // top = (data.room.width > data.room.depth) ? value.y / data.room.width * 100 : value.y / data.room.depth * 100;
    // left = (data.room.width > data.room.depth) ? value.x / data.room.width * 100 : value.x / data.room.depth * 100;

    //Resize table dimensions based on this aspect ratio
    width = (data.room.width > data.room.depth) ? value.width / data.room.width * 100 : value.width / data.room.depth * 100;
    height = (data.room.width > data.room.depth) ? value.depth / data.room.width * 100 : value.depth / data.room.depth * 100;

    innerHTML += "<div class='table bg-lime draggable' style='width:"+width+"%;height:"+height+"%;top:"+ value.y / data.room.width * 100 +"%;left="+ value.x / data.room.width * 100+"%;'>ID: "+value.id+"</div>";
  })
  roomEntry = $("#room-entry");
  roomEntry.html(innerHTML);

}

createRoom();

drawTables(data);

draggable = $(".draggable");
draggable.draggable({
  containment: "parent",
  grid: [ 10, 10 ]
});
