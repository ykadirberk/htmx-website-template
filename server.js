var express = require('express');
var https = require('https');
const http = require('http');
var app = express();
const httpApp = express();
var fs = require('fs');

const options = {
    key: fs.readFileSync('./ssl/cert.key'),
    cert: fs.readFileSync('./ssl/cert.crt')
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    //res.header("Cache-Control", "no-cache");
    res.header("X-Content-Type-Options", "nosniff");
    delete res.header["x-powered-by"];
    delete res.header["expires"];
    delete res.header["x-frame-options"];
    // Content-Type, Access-Control-Allow-Headers,
    // Authorization, X-Requested-With, Origin, X-Requested-With, Content-Type, 
    //Accept, Accept, Accept-Language, Content-Language, Content-Type, hx-current-url, hx-request
    next();
});

const httpsServer = https.createServer(options, app);

var files = [];

async function loadFile(filename) {
    for (let index = 0; index < files.length; index++) {
        const element = array[index];
        if (element.key == filename) {
            return element.value;
        }
    }
    const template = fs.readFileSync('templates/page.html', 'utf8').toString();
} 

//
// PAGE CALLS
//

app.get('/', async(request, response) => {
    console.log("Siteye giriş yapıldı:", request.ip);
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', 'text/html; charset=utf-8');
    response.sendFile('/pages/index.html', {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        }
        response.end();
    });
});

app.get('/*.html', async(request, response) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', 'text/html; charset=utf-8');
    const filename = request.url;
    response.sendFile('/pages/' + filename, {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        }
        response.end();
    });
});

app.get('/*.css', async(request, response) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', 'text/css; charset=utf-8');
    const filename = request.url;
    response.sendFile('/styles/' + filename, {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        }
        response.end();
    });
});

app.get('/*.js', async(request, response) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', 'text/javascript; charset=utf-8');
    const filename = request.url;
    response.sendFile('/scripts/' + filename, {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        }
        response.end();
    });
});

app.get('/component/:name', async(request, response) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', 'text/html; charset=utf-8');
    const filename = request.params.name;
    response.sendFile('/components/' + filename + '.html', {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        }
        response.end();
    });
});

//
// Image
//

app.get('/images/:name', async(request, response, next) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', 'image/png');
    const filename = request.params.name;
    response.sendFile('/images/' + filename, {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(filename, 'sent!');
        }
        response.end();
    });
});

//
// Icons
//

app.get('/icons/:name', async(request, response, next) => {
    response.set('X-Content-Type-Options', 'nosniff');

    const filename = request.params.name;
    if (filename.includes('png')) {
        response.set('Content-Type', 'image/png');
    } else {
        response.set('Content-Type', 'image/x-icon');
    }
    response.sendFile('/favicon/' + filename, {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        }
        response.end();
    });
});

//
// webmanifest
//

app.get('/manifest.webmanifest', async(request, response, next) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', 'application/manifest+json');
    const filename = request.params.name;
    response.sendFile('/site.webmanifest', {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        }
        response.end();
    });
});

//
// sitemap
//

app.get('/sitemap.txt', async(request, response, next) => {
    response.set('X-Content-Type-Options', 'nosniff');
    response.set('Content-Type', 'text/plain');
    const filename = request.params.name;
    response.sendFile('/sitemap.txt', {dotfiles: 'allow', root: __dirname}, (err) => {
        if (err) {
            console.log(err);
        }
        response.end();
    });
});


//
// HTTPS LISTENER
//

httpsServer.listen(443, () => {
    console.log("Express TTP server listening on port 443, HTTPS.");
});

//
// HTTP LISTENER
//

httpApp.get("*", async(req, res, next) => {
    res.redirect("https://" + req.headers.host + req.path);
});

http.createServer(httpApp).listen(80, async() => {
    console.log("Express TTP redirection server listening on port 80, HTTP.");
});