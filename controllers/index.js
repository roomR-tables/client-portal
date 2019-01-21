/*site controller */
var content1 = $("#content1");
var content2 = $("#content2");

//Instantiate storage
localStorage.setItem("aRooms", "{}");

//Get GET variables
var $_GET = {};
if (window.location.toString().indexOf('?') !== -1) {
  var query = document.location
    .toString()
    // get the query string
    .replace(/^.*?\?/, '')
    // and remove any existing hash string (thanks, @vrijdenker)
    .replace(/#.*$/, '')
    .split('&');

  for (var i = 0, l = query.length; i < l; i++) {
    var aux = decodeURIComponent(query[i]).split('=');
    $_GET[aux[0]] = aux[1];
  }
}

//Loads the right view
function loadView() {
  var url = ""

  //Load view
  switch ($_GET['view']) {
    case "404":
      url = "/views/404.html";
      break;
    default:
      url = "/views/dashboard.html";
      break;
  }

  //Load page
  console.log("Loading " + url);
  $.ajax({
    url: url,
    success: (data) => {
      content1.html(data);
    }
  })

  $.ajax({
    url: "/views/setup.html",
    success: (data) => {
      content2.html(data);
    }
  })
}

 function nextPage(){
   $("#scroller").animate({marginLeft:"-100%"}, "slow", "swing");
 }
 function prevPage(){
   $("#scroller").animate({marginLeft:"0"}, "slow", "swing");
 }
loadView();

module.exports = {
  nextPage: () => nextPage(),
  updateRoomWidth: () => updateRoomWidth(),
  updateRoomHeight: () => updateRoomHeight()
};