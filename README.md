# marketcap-filter

A simple nodeJS script to filter coinmarketcap microcap coins using the [coinmarketcap api](https://coinmarketcap.com/api/).

This script is based on the methodology described in this medium article by [nik](https://medium.com/@daytradernik) :

[Picking Out Microcaps 101](https://medium.com/@daytradernik/picking-out-microcaps-101-2215a5782691)

---

**Note**: Please respect coinmarketcap's API limit request of no more than 10 per minute.

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
- `--supplyratio` : The maximum ratio (%) of total supply vs available supply *(e.g. `--supplyratio=200` would mean that you will filter coins where the total supply is greater than twice the available supply)*

### Optional: 
- `--sort` : Sort by one of the following *(If no --sort option is given, the default is 'rank')* : 
  - `marketcap` : The total marketcap in USD
  - `price`: The price in USD
  - `rank`: The coinmarketcap ranking
  - `supplyratio`: The ratio of total vs available coins
  
  
### Sample usage: 
- `node query.js --maxmc=250000 --volmcratio=2 --maxprice=1 --supplyratio=200 --sort=price`

