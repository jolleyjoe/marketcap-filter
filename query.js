#! /usr/bin/env node

XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
_ = require('lodash');
Table = require('easy-table');

var parseArgs = require('minimist');
var argv = parseArgs(process.argv.slice(2));

var sort = 'rank';

if (argv.maxmc == null) {
  console.error('Please provide a cutoff market cap in USD: e.g. --maxmc=250000000');
  return;
}
if (argv.mcvolratio == null) {
  console.error('Please provide a market cap to volume ratio percentage: e.g --mcvolratio=2');
  return;
}
if (argv.maxprice == null) {
  console.error('Please provide a maximum price in USD: e.g --maxprice=1');
  return;
}
if (argv.maxsupplyratio == null) {
  console.error('Please provide a maximum supply ratio percentage (i.e. the ratio of total to available supply): e.g --supplyratio=200');
  return;
}
if (argv.sort == null) {
  console.error('No --sort flag passed. Available options are: "marketcap", "price", "rank", "supplyratio". The default is "rank" which orders by coinmarketcap ranking');
} else {
  sort = String(argv.sort);
}

var max_mc = Number(argv.maxmc)
//set min mc_to_vol_ratio percentage
var mc_to_vol_ratio = Number(argv.mcvolratio);
//set max price
var max_price_usd = Number(argv.maxprice);
//set supply ratio
var supply_ratio = Number(argv.maxsupplyratio);



var makeRequest = function () {
  var request = new XMLHttpRequest();
  var results = [];
  request.open('GET', 'https://api.coinmarketcap.com/v1/ticker/');
  request.send();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      results = JSON.parse(request.responseText);
      handleResults(results);
    }
  }
}
makeRequest();


//handle the coinmarketcap response
var handleResults = function (data) {
  var coins;


  //filter out higher market cap coins
  coins = _.filter(data, function (coin) {
    if (Number(coin.market_cap_usd) < max_mc && Number(coin.price_usd) < max_price_usd) {
      return true;
    }
  });

  //filter out remaining coins based on mc_to_vol_ratio
  coins = _.filter(coins, function (coin) {
    var _24h_vol = Number(coin['24h_volume_usd']);
    var mc = Number(coin.market_cap_usd);
    var _mc_to_vol_ratio_perc = Number(mc / _24h_vol).toFixed(6) * 100;
    if (_mc_to_vol_ratio_perc > 2) {
      return true;
    }
  });

  //filter out remaining coins if total supply much greater than available supply
  coins = _.filter(coins, function (coin) {
    var available_supply = Number(coin.available_supply);
    var total_supply = Number(coin.total_supply);
    var ratio_perc = Number(total_supply / available_supply).toFixed(1)*100;
    coin.supply_ratio = ratio_perc;
    if (ratio_perc <= supply_ratio) {
      return true;
    }
  });
  makeTable(coins);
}

var makeTable = function (coins) {

  // console.error('No --sort flag passed. Available options are: "marketcap", "price", "rank", "supplyratio". The default is "rank" which orders by coinmarketcap ranking');
  if (sort == 'marketcap') {
    coins = _.sortBy(coins, [function (o) {
      return Number(o.market_cap_usd);
    }
    ]);
  }
  else if (sort == 'price') {
    coins = _.sortBy(coins, [function (o) {
      return Number(o.price_usd);
    }
    ]);
  }
  else if (sort == 'rank') {
    coins = _.sortBy(coins, [function (o) {
      return Number(o.rank);
    }
    ]);
  }
  else if (sort == 'supplyratio') {
    coins = _.sortBy(coins, [function (o) {
      return Number(o.supply_ratio);
    }
    ]);
  } else {
    console.error('Invalid --sort flag passed. Available options are: "marketcap", "price", "rank", "supplyratio". The default is "rank" which orders by coinmarketcap ranking, if no --sort option is given');
  }

  var t = new Table;

  _.each(coins, function (coin) {
    t.cell('name', coin.id);
    t.cell('coinmarketcap rank', coin.rank);
    t.cell('market cap', coin.market_cap_usd);
    t.cell('price', "$" + coin.price_usd);
    t.cell('supply ratio (%)', coin.supply_ratio);
    t.newRow();
  });
  console.log('');
  console.log(t.toString());
  console.log('');

}