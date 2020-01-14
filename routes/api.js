const express = require("express");
const router = express.Router();
var request = require("request");
var simple_ssh = require("simple-ssh");
const delay = require("delay");

var ssh = new simple_ssh({
  host: "ip",
  port: "port",
  user: "user",
  pass: "pass"
});

var dataOut;
var bigData = "";

async function sshCommand(command) {
  //await
  ssh
    .exec("bitcoin-cli " + command, {
      // 'out' is a pipeline already
      out: async function(stdout) {
        // if (IsJsonString(stdout)) {
        //   //JSON.stringify(stdout);
        //   data = JSON.parse(stdout);
        //   //data = stdout;
        //   dataOut = data;
        //   console.log(data);
        // } else {
        //   dataOut = stdout;
        //   console.log(stdout);
        // }
        bigData += stdout;
      },
      err: async function(stderr) {
        console.log(stderr);
      }
    })
    .on("end", () => {
      try {
        bigData = JSON.parse(bigData);
        console.log(bigData);
        dataOut = bigData;
        bigData = "";
      } catch (err) {
        console.log(err);
      }
    });
}

// var bigBody = "",
//   bigData = "";

// ssh.on("data", chunk => {
//   bigBody += chunk;
//   console.log("CHUNK");
//   console.log(chunk);
// });

// ssh.on("end", () => {
//   try {
//     //bigData = JSON.parse(bigBody);
//     //console.log(data);
//   } catch (err) {
//     console.log(err);
//   }
// });

// async function sshCommand(command) {
//   var data;
//   //await
//   ssh
//     .exec("bitcoin-cli " + command, {
//       out: async function(stdout) {
//         console.log(stdout);
//         // if (IsJsonString(stdout)) {
//         //   //JSON.stringify(stdout);
//         //   data = JSON.parse(stdout);
//         //   //data = stdout;
//         //   dataOut = data;
//         //   console.log(data);
//         // } else {
//         //   dataOut = stdout;
//         //   console.log(stdout);
//         // }
//         //console.log(data);
//         bigBody = "";
//       },
//       err: async function(stderr) {
//         console.log(stderr);
//       }
//     })
//     .on("", chunk => {
//       bigBody += chunk;
//       console.log("BIIIIG BODDDDYYYY");
//       console.log(chunk);
//       console.log("BIIIIG BODDDDYYYY");
//       // console.log("CHUNK");
//       // console.log(chunk);
//     })
//     .on("end", () => {
//       try {
//         //bigData = JSON.parse(JSON.stringify(bigBody));
//         // bigBody = "[" + bigBody + "]";
//         // bigBody = JSON.parse(bigBody);
//       } catch (err) {
//         console.log(err);
//       }
//     });
// }

router.get("/getblockchaininfo", async (req, res) => {
  sshCommand("getblockchaininfo");
  await ssh.start();
  await delay(2000);
  res.json({
    success: true,
    body: await dataOut
  });
  ssh.reset();
});

router.get("/getbestblockhash", async (req, res) => {
  sshCommand("getbestblockhash");
  await ssh.start();
  await delay(2000);
  res.json({
    success: true,
    body: await dataOut
  });
  ssh.reset();
});

router.get("/getblockcount", async (req, res) => {
  sshCommand("getblockcount");
  await ssh.start();
  await delay(2000);
  res.json({
    success: true,
    body: await dataOut
  });
  ssh.reset();
});

router.get("/getdifficulty", async (req, res) => {
  sshCommand("getdifficulty");
  await ssh.start();
  await delay(2000);
  res.json({
    success: true,
    body: await dataOut
  });
  ssh.reset();
});

router.get("/getblock/:hash", async (req, res) => {
  sshCommand("getblock" + " " + req.params.hash);
  await ssh.start();
  await delay(2000);
  res.json({
    success: true,
    body: await dataOut
  });
  ssh.reset();
});

router.get("/getrawtransaction/:txid", async (req, res) => {
  sshCommand("getrawtransaction" + " " + req.params.txid);
  await ssh.start();
  await delay(2000);
  res.json({
    success: true,
    body: await dataOut
  });
  ssh.reset();
});

router.get("/decoderawtransaction/:rawtxid", async (req, res) => {
  sshCommand("decoderawtransaction" + " " + req.params.rawtxid);
  await ssh.start();
  await delay(2000);
  res.json({
    success: true,
    body: await dataOut
  });
  ssh.reset();
});

router.get("/test", (req, res) => res.json({ msg: "backend works" }));

// router.get("/getblockcount", (req, res) => {
//   var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getblockcount","params":[]}`;
//   var options = {
//     //url: `http://${USER}:${PASS}@127.0.0.1:8332/`,
//     url: `http://${USER}:${PASS}@127.0.0.1:8332/`,
//     method: "POST",
//     headers: headers,
//     body: dataString
//   };

//   callback = (error, response, body) => {
//     if (!error && response.statusCode == 200) {
//       const data = JSON.parse(body);
//       res.send(data);
//     }
//   };
//   request(options, callback);
// });

module.exports = router;
