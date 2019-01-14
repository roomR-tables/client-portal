/*site controller */
content1 = $("#content1");
content2 = $("#content2");

//Get GET variables
var $_GET = {};
if(window.location.toString().indexOf('?') !== -1) {
    var query = document.location
                   .toString()
                   // get the query string
                   .replace(/^.*?\?/, '')
                   // and remove any existing hash string (thanks, @vrijdenker)
                   .replace(/#.*$/, '')
                   .split('&');

    for(var i=0, l=query.length; i<l; i++) {
       var aux = decodeURIComponent(query[i]).split('=');
       $_GET[aux[0]] = aux[1];
    }
}

//Loads the right view
function loadView(){
  url = "";
  //Load view
  switch($_GET['view']){
    case "404":
      url = window.location.pathname + "/views/404.html";
      break;
    default:
      url = window.location.pathname + "/views/dashboard.html";
      break;
  }

  //Load page
  console.log("Loading " + url);
  $.get(url, function(data, status){
    if(status == "success")
      content1.html(data);
  });

  $.get(window.location.pathname + "/views/setup.html", function(data, status){
    if(status == "success")
      content2.html(data);
  });
 }

 function nextPage(){
   $("#scroller").animate({marginLeft:"-100%"}, "slow", "swing");
 }

loadView();
