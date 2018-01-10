# marketcap-filter

A simple nodeJS script to filter coinmarketcap microcap coins using the [coinmarketcap api](https://coinmarketcap.com/api/).

This script is based on the methodology described in this medium article by [nik](https://medium.com/@daytradernik) :

[Picking Out Microcaps 101](https://medium.com/@daytradernik/picking-out-microcaps-101-2215a5782691)

---

**Note**: Please respect coinmarketcap's API limit request of no more than 10 per minute. This version also uses a direct 'maxsupply' filter instead of a 'supply ratio'.

---

### Installation : 
- Requires nodeJS and npm to be installed.
- clone the repo: `git clone https://github.com/jolleyjoe/marketcap-filter.git`
- `cd marketcap-filter`
- `npm install`


### Running the script :
- From project folder: `node query.js [options]`

### Required options: 
- `--maxmc` : The maximum market cap you wish to query in USD *(`--maxmc=250000` recommended in article)*
- `--volmcratio` : The min ratio (%) of 24 hour volume to marketcap *(`--volmcratio=2` recommended in article)*
- `--maxprice` : The maximum price in USD per coin
- `--maxsupply` : The maximum available coin supply *(e.g. `--maxsupply=50000000` would mean that you will exclude coins with a greater available supply than the maxsupply given)*

### Optional: 
- `--sort` : Sort by one of the following *(If no --sort option is given, the default is 'rank')* : 
  - `marketcap` : The total marketcap in USD
  - `price`: The price in USD
  - `rank`: The coinmarketcap ranking
  - `supply`: The ratio of total vs available coins
  
  
### Sample usage: 
- `node query.js --maxmc=250000 --volmcratio=2 --maxprice=1 --maxsupply=50000000 --sort=supply`

## OTHER

#### Creating standalone programs
*Disclaimer: This is the way I did it and not the only way!*
- You can create a binary by using the [pkg](https://github.com/zeit/pkg) library.
  - `npm install -g pkg`
  - Run `pkg query.js` to create 3 x binaries, one for Linux, MacOS and Windows.
  - Run `pkg --help` for options.
- You can then execute the binary directly without invoking `node query.js`.

There are other ways to create node command line utils. Great post [here](https://javascriptplayground.com/blog/2015/03/node-command-line-tool/)

