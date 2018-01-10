#! /usr/bin/env node

var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var _ = require('lodash');
var Table = require('easy-table');

var parseArgs = require('minimist');
var argv = parseArgs(process.argv.slice(2));

var sort = 'rank';

if (argv.maxmc == null) {
  console.error('Please provide a cutoff market cap in USD: e.g. --maxmc=250000');
  return;
}
if (argv.volmcratio == null) {
  console.error('Please provide a minimum 24hr volume to marketcap ratio percentage: e.g --volmcratio=2');
  return;
}
if (argv.maxprice == null) {
  console.error('Please provide a maximum price in USD: e.g --maxprice=1');
  return;
}
if (argv.maxsupply == null) {
  console.error('Please provide a maximum coin supply: e.g --maxsupply=50000000');
  return;
}
if (argv.sort == null) {
  console.error('No --sort flag passed. Available options are: "marketcap", "price", "rank", "supplyratio". The default is "rank" which orders by coinmarketcap ranking');
} else {
  sort = String(argv.sort);
}

var max_mc = Number(argv.maxmc)
//set min mc_to_vol_ratio percentage
var vol_to_mc_ratio = Number(argv.volmcratio);
//set max price
var max_price_usd = Number(argv.maxprice);
//set supply ratio
var max_supply = Number(argv.maxsupply);



var makeRequest = function () {
  var request = new XMLHttpRequest();
  var results = [];
  request.open('GET', 'https://api.coinmarketcap.com/v1/ticker/?limit=2000');
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
    var coin_vol_to_mc_ratio = Number(_24h_vol/mc).toFixed(2) * 100;
    coin.vol_to_mc_ratio = coin_vol_to_mc_ratio;
    if (coin_vol_to_mc_ratio > vol_to_mc_ratio) {
      return true;
    }
  });

  //filter out remaining coins if total supply much greater than available supply
  coins = _.filter(coins, function (coin) {
    var available_supply = Number(coin.available_supply);
    var total_supply = Number(coin.total_supply);
    if (max_supply <= available_supply) {
      return true;
    }
  });
  if (coins.length > 0) {
    makeTable(coins);
  } else {
    console.error('No results found..');
  }

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
  else if (sort == 'maxsupply') {
    coins = _.sortBy(coins, [function (o) {
      return Number(o.max_supply);
    }
    ]);
  } else {
    console.error('Invalid --sort flag passed. Available options are: "marketcap", "price", "rank", "maxsupply". The default is "rank" which orders by coinmarketcap ranking, if no --sort option is given');
  }

  var t = new Table;

  _.each(coins, function (coin) {
    t.cell('Name', coin.id);
    t.cell('Coinmarketcap Rank', coin.rank);
    t.cell('Price', "$" + coin.price_usd);
    t.cell('Market Cap', "$" + coin.market_cap_usd);
    t.cell('24hr vol/mc ratio', coin.vol_to_mc_ratio + "%");
    t.cell('Max Supply', coin.max_supply);
    t.newRow();
  });
  console.log('');
  console.log(t.toString());
  console.log('');

}
