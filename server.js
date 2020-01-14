const express = require("express");
const bodyParser = require("body-parser");
const rpcMethods = require("./routes/api");
var request = require("request");
var delay = require("delay");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // to load .css

app.use("/api", rpcMethods);

const port = process.env.PORT || 4444;

const router = express.Router();

const headers = {
  "content-type": "text/plain;"
};

// html
router.get("/", async (req, res) => {
  //await res.sendFile(path.join(__dirname + "/index.html"));

  // REQUEST BLOCKCHAIN INFO
  var urlGetBlockchainInfo = "http://localhost:4444/api/getblockchaininfo/";
  var optionsGetBlockchainInfo = {
    headers: headers, //{ "content-type": "application/json" },
    url: urlGetBlockchainInfo
  };
  callbackGetBlockchainInfo = (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    body = JSON.parse(body).body;
    console.log("BLOCKCHAIN INFO");
    console.log(body);

    res.render("index", {
      blocks: body.blocks,
      headers: body.headers,
      bestHash: body.bestblockhash,
      difficulty: body.difficulty,
      totalSize: Math.floor(body.size_on_disk / 1000000000)
    });
  };

  request(optionsGetBlockchainInfo, callbackGetBlockchainInfo);
});

app.get("/submittx", async function(req, res) {
  var urlGetRawTx =
    "http://localhost:4444/api/getrawtransaction/" + req.query.txfield;
  var rawTransaction;
  var optionsGetRawTx = {
    headers: headers, //{ "content-type": "application/json" },
    url: urlGetRawTx
  };
  callbackGetRawTx = (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    rawTransaction = JSON.parse(body).body;
  };

  request(optionsGetRawTx, callbackGetRawTx);

  await delay(4000);
  var urlDecodeTx =
    "http://localhost:4444/api/decoderawtransaction/" + rawTransaction;

  var optionsDecodeTx = {
    //headers: { "content-type": "application/json" },
    url: urlDecodeTx
  };
  callbackDecodeTx = (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    //res.sendFile(path.join(__dirname + "/submittx.html"));
    // body = JSON.stringify(body);
    body = JSON.parse(body).body;
    console.log("-------------------------");
    console.log(body.vout);
    console.log("-------------------------");

    totalVout = 0;
    for (var i = 0; i < body.vout.length; i++) {
      totalVout += body.vout[i].value;
    }

    res.render("transaction", {
      txid: body.txid,
      hash: body.hash,
      version: body.version,
      size: body.size,
      vsize: body.vsize,
      weight: body.weight,
      vout: totalVout
    });
    //res.send(JSON.parse(body));
  };

  await request(optionsDecodeTx, callbackDecodeTx);
});

app.get("/submitblock", async function(req, res) {
  var urlGetBlock =
    "http://localhost:4444/api/getblock/" + req.query.blockfield;
  var optionsGetBlock = {
    headers: headers, //{ "content-type": "application/json" },
    url: urlGetBlock
  };
  callbackGetBlock = (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    var body = JSON.parse(body).body;
    console.log("------------------------------");
    console.log(body);
    console.log("------------------------------");

    res.render("block", {
      hash: body.hash,
      confirmations: body.confirmations,
      size: body.size,
      weight: body.weight,
      version: body.version,
      merkleroot: body.merkleroot,
      time: body.time,
      nonce: body.nonce,
      difficulty: body.difficulty,
      previousBlockHash: body.previousblockhash,
      nextBlockHash: body.nextblockhash
    });
  };

  request(optionsGetBlock, callbackGetBlock);
});

app.use("/", router);
server = app.listen(port, () => console.log(`Server running on port ${port}`));
