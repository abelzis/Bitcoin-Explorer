# Bitcoin-Explorer
Bitcoin explorer rip-off

# How to install?
Clone the repo, run `npm install` to install dependencies. Hit `npm run dev` and volia. 

# What is this?
A blockchain explorer, similar to [Blockchain Explorer](https://www.blockchain.com/explorer), where you can search for blocks, transactions, get info about the blockchain. It uses SSH connection to connect to a non-local node.

# How to access API?
`/api/~command~`

### API commands:
`getblockchaininfo`

`getbestblockhash`

`getblockcount`

`getdifficulty`

`getblock/:hash`

`getrawtransaction/:txid`

`decoderawtransaction/:rawtxid`
