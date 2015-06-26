// Copyright (c) 2015 by rapidhere, RANTTU. INC. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// just a simple http server for development
// author: rapidhere@gamil.com

var http = require('http');
var path = require('path');
var fs = require('fs');

var port = 8100;

// create static http server
var server = http.createServer(function(req, res) {
    // static server

    // get file path
    var fpath = req.url;

    // set the root as index.html
    if(fpath === '/') {
        fpath = '/index.html';
    }

    // get full path
    fpath = path.join(__dirname, fpath);

    // get file and set response
    fs.lstat(fpath, function(err, stat) {
        // handle error, return 404
        if(err) {
            console.log('[404] ' + req.url);
            res.writeHead(404);
            return ;
        }

        // must be a regular file
        if(stat.isFile()) {
            // get file type
            var ftype = 'text/plain';
            if(fpath.indexOf('.css') >= 0) {
                ftype = 'text/css';
            } else if(fpath.indexOf('.json') >= 0) {
                ftype = 'application/json';
            } else if(fpath.indexOf('.html') >= 0) {
                ftype = 'text/html';
            } else if(fpath.indexOf('.js') >= 0) {
                ftype = 'text/javascript';
            }

            console.log('[200] ' + req.url);
            // make response
            res.writeHead(200, {
                'Content-Type': ftype
            });

            fs.createReadStream(fpath).pipe(res);
        } else {
            console.log('[404] ' + req.url);
            res.writeHead(404);
            return ;
        }
    });
});

// start server
console.log('server started on localhost, port: ' + port);
server.listen(port);

// catch sig int and quit
process.on('SIGINT', function() {
    console.log('abort');
    process.exit(0);
});
