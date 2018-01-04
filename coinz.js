var COINZ = COINZ || {};
COINZ.BASE = "https://api.coinmarketcap.com/v1/ticker/$COIN$/?ref=widget&convert=USD";
COINZ.RESPONSES = [];

COINZ.get = function(coin) {
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      COINZ.RESPONSES.push(this.response);
      COINZ.update();

    }
  };
  xhttp.responseType = 'json';
  xhttp.open("GET", COINZ.BASE.replace('$COIN$', coin), true);
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

    // from http://www.jacklmoore.com/notes/rounding-in-javascript/
    coin_usd = Number(Math.round(coin_usd+'e2')+'e-2').toFixed(2);

    if (coin_change_24h < 0) {
      coin_change_24h = '<font color="red">(' + coin_change_24h + '%)</font>';
    } else {
      coin_change_24h = '<font color="green">(' + coin_change_24h + '%)</font>';
    }

    output += '<img src="https://files.coinmarketcap.com/static/img/coins/16x16/'+coin_id.toLowerCase()+'.png" align="baseline"></img>'
    output += ' <font color="royalblue">' + coin_name + ' (' + coin_symbol + '):</font> ' + coin_usd + ' USD ' + coin_change_24h + '<br>';

  }

  output += '<br><font size=1>powered by coinmarketcap.com</font>'
  document.body.innerHTML = output;

};