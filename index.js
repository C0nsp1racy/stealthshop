const fs = require('fs'), { google } = require('googleapis'),drive = google.drive({ version: 'v3' });
var SAarray = require("./SAs.json"), SAIndex = 0, res, access_token, files, https = require('https');
const contentDisposition = require('content-disposition');
module.exports = {
    async search(titleID, response, request) {
        let serviceAccount = new google.auth.JWT(SAarray[SAIndex].client_email, null, SAarray[SAIndex].private_key, ['https://www.googleapis.com/auth/drive'])
        serviceAccount.authorize(async (err, tokens) => {
            if (err) return SAIndex++
        });
        drive.files.list({
            "auth": serviceAccount,
            "corpora": "allDrives",
            "pageSize": 400,
            "supportsAllDrives": true,
            "includeItemsFromAllDrives": true,
            "q": `name contains "${titleID}"`
        }).then(async resp => {
            files = resp.data.files
            let options = {
                "supportsAllDrives": true,
                "supportsTeamDrives": true
            }
            if(files.length == 0) return response.sendStatus(404)
            for (let i = 0; i < files.length; i++) {
                try {
                    serviceAccount = new google.auth.JWT(SAarray[i].client_email, null, SAarray[i].private_key, ['https://www.googleapis.com/auth/drive'])
                    serviceAccount.authorize(async (err, tokens) => {
                        access_token = tokens.access_token
                    })
                    options.auth = serviceAccount
                    options.fileId = files[i].id
                    res = await drive.files.copy(options)
                    i = files.length
                } catch (e) {
                    console.log(e);
                }
            }
            response.header('Content-Disposition', contentDisposition(res.data.name));
            options = {
                host: "www.googleapis.com",
                path: `/drive/v3/files/${res.data.id}?alt=media`,
                headers: { 'Authorization': `Bearer ${access_token}` }
            }
            https.get(options, (remote_resp) => {
              remote_resp.pipe(response)
            }).on('error', (e) => {
             console.error(e);
            });
        }).catch(e => {
            console.log(e)
        })
    }
}

fastify.get('/mirror', (req, reply) => {
 reply.sendFile('/mirror.tfl');
})
