(function() {

  function BlogSearchService() {
    var svc = this;
    var indexName = 'blog-posts';
    var client = AzureSearch({
            url: 'https://hollisblog.search.windows.net',
            key:'F0B5341D1C25C191C7CC19682F05DE7B',
            version: '2016-09-01'
        });
	//define a search property for BlogSearchService class
    svc.search = search;


    function search(query, callback) {
        var searchOptions = { search: query, 'select': 'id, title, url, date', 
                                             'highlight': 'title, content', 
                                             'highlightPreTag': '<strong><em>', 'highlightPostTag': '</em></strong>' };
        client.search(indexName, searchOptions, callback);
        }
    }
	
  //display the search results.
  function displaySearchResults(results) {
    var searchResults = document.getElementById('search-results');

    if (results.length) { // Are there any results?
      var appendString = '';

      for (var i = 0; i < results.length; i++) {  // Iterate over the results
        var item = results[i];
        var title = item.title;
		//如果标题命中了，就返回带突出显示片段，否则返回原样的标题
        if (item["@search.highlights"].title && item["@search.highlights"].title.length > 0)
          title = item["@search.highlights"].title["0"];
		
        appendString += '<li><a href="' + item.url + '"><h3>' + title + '</h3></a>';
		
        //appendString += '<p class="post-meta">' + new Date(item.date).Format("yyyy-MM-dd") + '</p>';
		
		//判断有多少命中片段，只显示最前面的三个
		if(item["@search.highlights"].content && item["@search.highlights"].content.length > 0)
		{
			for (var j = 0; j < item["@search.highlights"].content.length; j++)
			{
                if (j > 2) break;
				appendString += '<p>' + item["@search.highlights"].content[j] + '......</p>';
			}
		}
		
		appendString += '</li>';
      }

      searchResults.innerHTML = appendString;
    } else {
      searchResults.innerHTML = '<li>No results found</li>';
    }
  }

  function getQueryVariable(variable) {	  
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
  }

  var searchTerm = getQueryVariable('query');

  if (searchTerm) {
      document.getElementById('search-box').setAttribute("value", searchTerm);

      // Perform a azure search, and then handle the results in the callback function.
	  new BlogSearchService().search(searchTerm, function(err, results){
		  if (err) {alert(err.message);return;}
		  displaySearchResults(results); // We'll write this in the next section
	  });
    
    }
})();
