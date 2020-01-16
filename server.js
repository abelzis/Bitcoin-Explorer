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
  callbackGetBlockchainInfo = async (error, response, body) => {
    if (error) {
      return console.log(error);
    }

    try {
      body = await JSON.parse(body).body;
    } catch (e) {
      console.log(e);
    }

    await res.render("index", {
      blocks: body.blocks,
      headers: body.headers,
      bestHash: body.bestblockhash,
      difficulty: body.difficulty,
      totalSize: Math.floor(body.size_on_disk / 1000000000)
    });
  };

  await request(optionsGetBlockchainInfo, callbackGetBlockchainInfo);
});

// Submit transaction request
app.get("/submittx", async function(req, res) {
  var urlGetRawTx =
    "http://localhost:4444/api/getrawtransaction/" + req.query.txfield;
  var rawTransaction;
  var optionsGetRawTx = {
    headers: { "content-type": "application/json" },
    url: urlGetRawTx
  };
  callbackGetRawTx = async (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    rawTransaction = await JSON.parse(body).body;
    //console.log("RAW TRANSACTION = ", rawTransaction);
  };

  await request(optionsGetRawTx, callbackGetRawTx);

  await delay(4000);
  var urlDecodeTx =
    "http://localhost:4444/api/decoderawtransaction/" + rawTransaction;

  var optionsDecodeTx = {
    headers: { "content-type": "application/json" },
    url: urlDecodeTx
  };
  callbackDecodeTx = async (error, response, body) => {
    if (error) {
      return console.log(error);
    }
    //res.sendFile(path.join(__dirname + "/submittx.html"));
    // body = JSON.stringify(body);
    try {
      console.log("BODY: ", body);
      body = await JSON.parse(body).body;
      //body = JSON.parse(body);
      console.log("LATE    \n", body, "\n LATE");
    } catch (e) {
      console.log(e);
    }

    totalVout = 0;
    for (var i = 0; i < body.vout.length; i++) {
      totalVout += body.vout[i].value;
    }

    // render transaction template
    await res.render("transaction", {
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

// Submit block request
app.get("/submitblock", async function(req, res) {
  var urlGetBlock =
    "http://localhost:4444/api/getblock/" + req.query.blockfield;
  var optionsGetBlock = {
    headers: { "content-type": "application/json" },
    url: urlGetBlock
  };
  callbackGetBlock = async (error, response, body) => {
    if (error) {
      return console.log(error);
    }

    // var err;
    // while (!err) {
    //   try {
    //     var body = await JSON.parse(body).body;
    //     console.log("BODY:\n", body);
    //     break;
    //   } catch (e) {
    //     console.log(e);
    //     error = e;
    //   }
    //   await delay(300);
    // }

    try {
      body = await JSON.parse(body).body;
      console.log("BODY:\n", body);
    } catch (e) {
      console.log(e);
      // await delay(2000);
      // return await request(optionsGetBlock, callbackGetBlock);
    }

    // render block template
    await res.render("block", {
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
      nextBlockHash: body.nextblockhash,
      txList: body.tx
    });
  };

  await request(optionsGetBlock, callbackGetBlock);
});

app.use("/", router);
server = app.listen(port, () => console.log(`Server running on port ${port}`));
