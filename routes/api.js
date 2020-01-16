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

// var dataOut = "";

var delayTime = 3000;

function isParsable(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

var dataOut = "";

// Generalized command function
async function sshCommandPipe(command) {
  let bigData = "";
  //console.log("FUNCTION HAS BEEN CALLED!");
  //await
  ssh
    .on("ready", async () => {
      console.log(command, " ready.\n");
    })
    .exec("bitcoin-cli " + command, {
      // 'out' is a pipeline already
      out: async function(stdout) {
        bigData += await stdout;
      },
      err: async function(stderr) {
        console.log(stderr);
      }
    })
    .on("end", async () => {
      try {
        //if (isParsable(bigData)) {
        dataOut = await JSON.parse(bigData);
        //console.log("TRUE: ", dataOut);
        // } else {
        //   //console.log("BIGDATA: ", bigData);
        //   dataOut = await JSON.parse(await JSON.stringify(bigData));
        //   //console.log("FALSE: ", dataOut);
        // }
      } catch (err) {
        console.log(err);
      }
    });
}

// Generalized command function
async function sshCommand(command) {
  //await
  ssh
    .on("ready", async () => {
      console.log(command, " ready.\n");
    })
    .exec("bitcoin-cli " + command, {
      out: async function(stdout) {
        try {
          console.log("\texec started...");
          if (isParsable(stdout)) {
            dataOut = await JSON.parse(stdout);
            console.log("TRUE: ", dataOut);
          } else {
            //console.log("BIGDATA: ", bigData);
            dataOut = await JSON.parse(await JSON.stringify(stdout));
            console.log("FALSE: ", dataOut);
          }
        } catch (err) {
          console.log(err);
        }
      },
      err: async function(stderr) {
        console.log(stderr);
      }
    });
}

async function sshStart(delayT) {
  if (delayT > 30000) delayT = 30000;

  ssh.start({
    success: async () => {
      console.log("\nCommands successfully started.\n");
      return;
    },
    fail: async err => {
      console.log(err);
      console.log("\nRestarting in...");
      await delay(delayT);
      await sshStart(delayT * 2);
    }
  });
}

// API requests
router.get("/getblockchaininfo", async (req, res) => {
  await ssh.reset(err => {
    if (err) throw err;
  });
  if (ssh.count() < 2) {
    await sshCommand("getblockchaininfo");
    sshStart(1000);
    await delay(1.5 * delayTime);
    res.json({
      success: true,
      body: await dataOut
    });
    await ssh.reset(err => {
      if (err) throw err;
    });
  } else {
    res.json({
      success: false
    });
  }
  await ssh.reset(err => {
    if (err) throw err;
  });
});

router.get("/getbestblockhash", async (req, res) => {
  await ssh.reset(err => {
    if (err) throw err;
  });
  if (ssh.count() < 2) {
    await sshCommand("getbestblockhash");
    sshStart(1000);
    await delay(delayTime);
    res.json({
      success: true,
      body: await dataOut
    });
    await ssh.reset(err => {
      if (err) throw err;
    });
  } else {
    res.json({
      success: false
    });
  }
  await ssh.reset(err => {
    if (err) throw err;
  });
});

router.get("/getblockcount", async (req, res) => {
  await ssh.reset(err => {
    if (err) throw err;
  });
  if (ssh.count() < 2) {
    await sshCommand("getblockcount");
    sshStart(1000);
    await delay(delayTime);
    res.json({
      success: true,
      body: await dataOut
    });
    await ssh.reset(err => {
      if (err) throw err;
    });
  } else {
    res.json({
      success: false
    });
  }
  await ssh.reset(err => {
    if (err) throw err;
  });
});

router.get("/getdifficulty", async (req, res) => {
  await ssh.reset(err => {
    if (err) throw err;
  });
  if (ssh.count() < 2) {
    await sshCommand("getdifficulty");
    sshStart(1000);
    await delay(delayTime);
    res.json({
      success: true,
      body: await dataOut
    });
    await ssh.reset(err => {
      if (err) throw err;
    });
  } else {
    res.json({
      success: false
    });
  }
  await ssh.reset(err => {
    if (err) throw err;
  });
});

router.get("/getblock/:hash", async (req, res) => {
  await ssh.reset(err => {
    if (err) throw err;
  });
  if (ssh.count() < 2) {
    await sshCommandPipe("getblock" + " " + req.params.hash);
    sshStart(1000);
    await delay(1.7 * delayTime);
    await console.log("\nBLOCK INFO:\n", dataOut);
    res.json({
      success: true,
      body: await dataOut
    });
    await ssh.reset(err => {
      if (err) throw err;
    });
  } else {
    res.json({
      success: false
    });
  }
  await ssh.reset(err => {
    if (err) throw err;
  });
});

router.get("/getrawtransaction/:txid", async (req, res) => {
  await ssh.reset(err => {
    if (err) throw err;
  });
  if (ssh.count() < 2) {
    await sshCommand("getrawtransaction" + " " + req.params.txid);
    sshStart(1000);
    await delay(delayTime);
    res.json({
      success: true,
      body: await dataOut
    });
    await ssh.reset(err => {
      if (err) throw err;
    });
  } else {
    res.json({
      success: false
    });
  }
  await ssh.reset(err => {
    if (err) throw err;
  });
});

router.get("/decoderawtransaction/:rawtxid", async (req, res) => {
  await ssh.reset(err => {
    if (err) throw err;
  });
  if (ssh.count() < 2) {
    await sshCommand("decoderawtransaction" + " " + req.params.rawtxid);
    sshStart(1000);
    await delay(delayTime);
    await console.log("\nBLOCK INFO:\n", dataOut);
    res.json({
      success: true,
      body: await dataOut
    });
    await ssh.reset(err => {
      if (err) throw err;
    });
  } else {
    res.json({
      success: false
    });
  }
  await ssh.reset(err => {
    if (err) throw err;
  });
});

router.get("/test", (req, res) => res.json({ msg: "backend works" }));

module.exports = router;
