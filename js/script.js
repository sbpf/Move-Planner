
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview- fetch street images of the location entered in the form
	var street = $('#street').val();
	var city = $('#city').val();
	var address = street + ', ' + city;
 	var streetViewURL = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address + ' ';

 	$body.append('<img class="bgimg" src ="' + streetViewURL + '">');

  //Code to fetch the local news using the NY times api
var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
url += '?' + $.param({
  'api-key': "0474825e99f649bba0c792f75354f963",
  'q': address
});

$.getJSON( url, function (data){
  articles_list = data.response.docs;
  articles_list.forEach(displayNews);
}).error(displayError);

function displayNews(item,index){
  var list_item_html = ('<li class = "news_item"> <a href =' + item.web_url + '>' + item.headline.main + '</a> <p>'+ item.snippet + '</p></li>');
  $("#nytimes-articles").append(list_item_html);
};

function displayError(){
  var error_msg = ('<h1>'+ 'The New York Times article could not be loaded' + '</h1>');
  $("#nytimes-articles").append(error_msg);
}

var timeoutForWiki = setTimeout(function(){
$wikiElem.text("failed to load wikipedia links");
}, 5000);

var wikiUrl =  'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';
$.ajax( {
    url: wikiUrl,
    dataType: "jsonp",
    success: function(response){
      var articleList = response[1];
      for (var i =0; i<articleList.length; i++) {
        articleStr = articleList[i];
        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
        $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
      };

      clearTimeout(timeoutForWiki);
    }
} );

  return false;
};

$('#form-container').submit(loadData);
