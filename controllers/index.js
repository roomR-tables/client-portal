/*site controller */
content = $("#content");

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
  //Load view
  switch($_GET['view']){
    case "setup":
      console.log(window.location.href)

      break;
      content.html($.getJSON(window.location.href + "/views/setup.html"));
    default:
      content.html("home");
  }
}

loadView();
