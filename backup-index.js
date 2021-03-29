const express = require('express')
const app = express()
app.listen(3000)
const { search } = require("./api/index.js")

app.all("/download", async (req, res) => {
    if(req.query.titleID){
      await search(req.query.titleID, res, req)
    } else {
      res.sendStatus(403)
    }
})

app.get('/mirror', (req, res) => {
	res.download(__dirname + '/mirror.tfl');
});

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

const { exec } = require('child_process');
let i = 0;

function start() {
	exec(`bash index.sh`, (error, stdout, stderr) => {
		if (stderr) console.log(stderr);
		console.log(stdout);
		setTimeout(start, 60 * 60 * 1000 * 2);
	});
}

start();

app.get('/startindex', async (req, res) => {
  await require("axios").get("repl 1 URL address/recieveCommands", { 
      headers: { "commandToBeExecuted": "echo Hello from repl 2", "auth": "43274%@#(FFAS_!!" }
   })
});
