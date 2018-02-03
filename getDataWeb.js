'use strict';

var request = require('request');
var cheerio = require('cheerio');

var parseArticle = function(article, $) {

  var itemLinkDOM = article.find('.item-link');
  var title = itemLinkDOM.attr('title');
  var href = itemLinkDOM.attr('href');
  var id;
  if (typeof href != 'undefined') {
    id = href.replace(/\//g, '').replace(/inmueble/, '');
  }

  if (id == null) {
    return null;
  }

  var price = article.find('.item-price').text();
  price = parseInt(price.replace(/\./g, '').replace(/€/, ''));

  var size;
  var rooms;
  var other;
  article.find('.item-detail').each(function() {
    const itemDetail = $(this).text();
    if (itemDetail.indexOf('hab.') != -1) {
      rooms = parseInt(itemDetail.replace(/hab./, ''));
    }
    else if (itemDetail.indexOf('m²') != -1) {
      size = parseInt(itemDetail.replace(/m²/, ''));
    }
    else {
      other = itemDetail;
    }
  });

  var description = article.find('.item-description').text();

  const item_id = {};
  item_id["id"] = id;
  item_id["date"] =  new Date();

  const item = {};
  item["_id"] = item_id;
  item["title"] = title;
  item["price"] = price;
  item["size"] = size;
  item["rooms"] = rooms;
  item["other"] = other;
  item["description"] = description;

  return item;
};

var getWebData = function(baseURL, filter, counter, resultList,  callback ) {

  var filterURL = baseURL + filter.link;
  var url;
  if (counter == 1 ) {
    url = filterURL
  }
  else {
    url = filterURL + 'pagina-' + counter + '.htm';
  }

  request(url, function(error, response, html){
      if(!error){
          console.log ('Processing ', url);
          var $ = cheerio.load(html);

          if ( $('.g-recaptcha').length > 0) {
            console.log ('Error: too many requests');
          }

          if ($('article').length == 0) {
            console.log ('No articles found. Calling callback.');
            callback(resultList, filter.collection);
          }
          else {
            $('article').each(function() {
              const article = $(this);
              const item = parseArticle(article, $);
              if (item != null) {
                resultList.push(item);
              }
            });

            if ($('.next').length == 0) {
              console.log ('No next link found. Calling callback.');
              callback(resultList, filter.collection);
            }
            else {
              counter++;
              getWebData(baseURL, filter, counter, resultList, callback);
            }
          }
      }
  });

};

module.exports = getWebData;
