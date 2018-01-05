var COINZ = COINZ || {};
COINZ.BASE = "https://api.coinmarketcap.com/v1/ticker/$COIN$/?ref=widget&convert=USD";
COINZ.RESPONSES = [];

COINZ.get = function(coin) {
  
  // altfolio support 
  split_coin = coinz[c].split('=');

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(split_coin, e) {

    if (e.target.readyState == 4 && e.target.status == 200) {

      e.target.response[0].altfolio_value = split_coin[1];

      COINZ.RESPONSES.push(e.target.response);
      COINZ.update();

    }
  }.bind(this, split_coin);
  xhttp.responseType = 'json';
  xhttp.open("GET", COINZ.BASE.replace('$COIN$', split_coin[0]), true);
  xhttp.send();

};

COINZ.update = function() {

  var output = '';

  // sort by name
  COINZ.RESPONSES.sort(function(a, b) {
    var nameA = a[0]['name'].toUpperCase();
    var nameB = b[0]['name'].toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  for (c in COINZ.RESPONSES) {

    var coin_id = COINZ.RESPONSES[c][0]['id'];
    var coin_name = COINZ.RESPONSES[c][0]['name'];
    var coin_symbol = COINZ.RESPONSES[c][0]['symbol'];
    var coin_usd = COINZ.RESPONSES[c][0]['price_usd'];
    var coin_change_24h = COINZ.RESPONSES[c][0]['percent_change_24h'];
    var altfolio_value = COINZ.RESPONSES[c][0]['altfolio_value'];

    // from http://www.jacklmoore.com/notes/rounding-in-javascript/
    coin_usd = Number(Math.round(coin_usd+'e2')+'e-2').toFixed(2);

    if (coin_change_24h < 0) {
      coin_change_24h = '<font color="red">(' + coin_change_24h + '%)</font>';
    } else {
      coin_change_24h = '<font color="green">(' + coin_change_24h + '%)</font>';
    }

    output += '<img src="https://files.coinmarketcap.com/static/img/coins/16x16/'+coin_id.toLowerCase()+'.png" align="baseline"></img>'
    output += ' <font color="royalblue">' + coin_name + ' (' + coin_symbol + '):</font> ' + coin_usd + ' USD ' + coin_change_24h;

    if (typeof(altfolio_value) != 'undefined' && !isNaN(altfolio_value)) {

      altfolio_value = parseFloat(altfolio_value)*coin_usd;
      altfolio_value =  Number(Math.round(altfolio_value+'e2')+'e-2').toFixed(2);

      output += ' <font color="gray">*' + altfolio_value + ' USD</font>';

    }

    output += '<br>';

  }

  output += '<br><font size=1>powered by coinmarketcap.com</font>'
  document.body.innerHTML = output;

};