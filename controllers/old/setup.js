/*
  All javascript utilises the Hungarian Notation depicting the type of the variable as part of it's name.
  bBusy = Boolean, cLetter = char, aNumbers = array, etc. Globals are denoted by a this.G_. example: this.G_bBusy = Global Boolean.
*/

import { prevPage } from "./index"

export var setup = function () {
  this.G_eRoomHolder = $("#room");
  this.G_eRoomGrid = $("#roomGrid");
  this.G_eRoomGridTopBar = $("#roomGridTopBar");
  this.G_eRoomGridSideBar = $("#roomGridSideBar");
  this.G_eRoomWidthInput = $("#roomWidthInput");
  this.G_eRoomLengthInput = $("#roomLengthInput");

  this.G_sRoomName = "";
  this.G_iRoomIndex = null;
  this.G_fRoomWidth = 10; //meters
  this.G_fRoomLength = 5; //meters
  this.G_fTableWidth = 2; //meters
  this.G_fTableLength = 1; //meters
  this.G_fOldTablePosX = 0;
  this.G_fOldTablePosY = 0;
  this.G_fNewTablePosX = 0;
  this.G_fNewTablePosY = 0;

  this.G_eTables = null;
  this.G_eOutlines = null;

  this.createRoom(this.G_fRoomWidth, this.G_fRoomLength, this.G_eTables, this.G_eOutlines)

  this.drawTables(this.G_fTableWidth, this.G_fTableLength)

  let draggable = $(".draggable");
  draggable.draggable({
    containment: "parent",
    grid: [10, 10]
  });

  $('#e1_element').fontIconPicker();
}

setup.prototype = (function () {
  var createRoom = function (eTable, eOutline) {
    let fWidth = Number(this.G_fRoomWidth) > Number(this.G_fRoomLength) ? 100 : Number(this.G_fRoomWidth) / Number(this.G_fRoomLength) * 100;
    let fLength = Number(this.G_fRoomWidth) > Number(this.G_fRoomLength) ? Number(this.G_fRoomLength) / Number(this.G_fRoomWidth) * 100 : 100;

    //Animate  elements to fit aspect ratio.
    this.G_eRoomHolder.animate({
      "width": fWidth + "%",
      "height": fLength + "%"
    });

    this.G_eRoomGrid.animate({
      "width": "100%",
      "height": "100%"
    });

    this.G_eRoomGridTopBar.animate({
      "width": "100%"
    });

    this.G_eRoomGridSideBar.animate({
      "height": "100%"
    });
  }

  var drawTables = function (fTableWidth, fTableLength) {
    let sInnerHTML = "";

    //Resize table dimensions based on this aspect ratio
    let fWidth = this.G_fRoomWidth > this.G_fRoomLength ? fTableWidth / this.G_fRoomWidth * 100 : fTableWidth / this.G_fRoomLength * 100;
    let fLength = this.G_fRoomWidth > this.G_fRoomLength ? fTableLength / this.G_fRoomWidth * 100 : fTableLegth / this.G_fRoomLength * 100;

    sInnerHTML += "<div id='table1' class='table bg-lime' style='width:" + fWidth + "%;height:" + fLength + "%;top:0;left:0;'>01</div>";
    sInnerHTML += "<div id='outline1' class='table-outline draggable' style='width:" + fWidth + "%;height:" + fLength + "%;top:0;left:0;'></div>";

    this.G_eRoomGrid.html(sInnerHTML);

    this.G_eTables = $(".table*");
    this.G_eOutlines = $(".outline*");
  }

  var updateRoomDimensions = function () {
    this.G_fRoomWidth = this.G_eRoomWidthInput.val().length > 0 ? this.G_eRoomWidthInput.val() : this.G_fRoomWidth;
    this.G_fRoomLength = this.G_eRoomLengthInput.val().length > 0 ? this.G_eRoomLengthInput.val() : this.G_fRoomLength;
    this.createRoom(this.G_eTables, this.G_eOutlines)
  }

  var setNewTablePos = function () {
    //Open socket
    //Alter position based on feedback
    let outline = $("#outline1");
    let table = $("#table1");
    this.G_fOldTablePosX = table.css("left");
    this.G_fOldTablePosY = table.css("top");
    this.G_fNewTablePosX = outline.css("left");
    this.G_fNewTablePosY = outline.css("top");

    $("#table1").animate({
      top: outline.css("top"),
      left: outline.css("left")
    }, "slow");
  }

  var storeRoom = function () {
    let sRooms = localStorage.getItem("aRooms");
    let jRooms = JSON.parse(sRooms); //Returns array of objects
    //Store, Overwrite or cancel
    if (this.G_sRoomName === "") {
      alert("Invalid room name");
      return;
    }

    if (jRooms[this.G_sRoomName] !== undefined) {
      if (!confirm("A preset with this name already exists. Do you want to overwrite it?")) {
        return;
      }
    }

    jRooms[this.G_sRoomName] = {};
    jRooms[this.G_sRoomName].fRoomWidth = this.G_fRoomWidth;
    jRooms[this.G_sRoomName].fRoomLength = this.G_fRoomLength;
    jRooms[this.G_sRoomName].fTableWidth = this.G_fTableWidth;
    jRooms[this.G_sRoomName].fTableLength = this.G_fTableLength;
    jRooms[this.G_sRoomName].fOldTablePosX = this.G_fOldTablePosX;
    jRooms[this.G_sRoomName].fOldTablePosY = this.G_fOldTablePosY;
    jRooms[this.G_sRoomName].fNewTablePosX = this.G_fNewTablePosX;
    jRooms[this.G_sRoomName].fNewTablePosY = this.G_fNewTablePosY;

    localStorage.setItem("aRooms", JSON.stringify(jRooms));
    loadPresets();
    prevPage();
  }

  var setName = function () {
    this.G_sRoomName = String($("#roomNameInput").val());
  }

  return {
    createRoom: createRoom,
    drawTables: drawTables,
    updateRoomDimensions: updateRoomDimensions,
    setNewTablePos: setNewTablePos,
    storeRoom: storeRoom,
    setName: setName
  }
})();