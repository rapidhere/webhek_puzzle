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

(function() {
/**
 * The game solver
 * author: rapidhere@gmail.com
 */
'use strict';

// namespace rapid
var rapidGameSolver = {};

// dx and dy
var nd = 4;
var dx = [0, 0, 1, -1];
var dy = [1, -1, 0, 0];

// a util: create a 2-d array, and fill with zero
rapidGameSolver.new2dArray = function(h, w) {
    var ret = new Array(h);
    var i;

    for(i = 0;i < h;i ++)
        ret[i] = rapidGameSolver.new1dArray(w);

    return ret;
};

// create a 1-d array
// and fill with zero
rapidGameSolver.new1dArray = function(l) {
    var ret = new Array(l);
    var i;

    for(i = 0;i < l;i ++)
        ret[i] = 0;
    return ret;
};

// toggle a solve display or not
rapidGameSolver.toggleSolve = function($div) {
    console.log('Here');
    var clicked = parseInt($div.attr('data-clicked'));
    var sol = parseInt($div.attr('data-sol'));
    var flag = sol ^ clicked;

    if(flag) {
        $div.html('✓');
    } else {
        $div.html('');
    }

    $div.attr('data-clicked', clicked ^ 1);
};

// game solve entry
rapidGameSolver.solveGame = function(game) {
    // solve the game with Gaussian Elimination
    // get board and width, height
    var bd = game.gb.board;
    var h = bd.length;
    var w = bd[0].length;

    if(game.solved)
        return ;

    // mark game as sovled
    game.solved = true;

    // currently the solution is only depending on the height
    // and the width of board
    // TODO: add broken-box int the board

    // the solution, equation array
    // a * x = b
    var nx = h * w;
    var a = rapidGameSolver.new2dArray(nx, nx);
    var x = rapidGameSolver.new1dArray(nx);
    var b = rapidGameSolver.new1dArray(nx);

    // construct equantions
    var i, j, k;
    for(i = 0;i < h;i ++)
    for(j = 0;j < w;j ++) {
        var idx = i * w + j;

        b[idx] = bd[i][j] ^ 1;
        for(k = 0;k < nd;k ++) {
            var ci = i + dx[k],
                cj = j + dy[k];

            if(ci >= 0 && ci < h && cj >= 0 && cj < w) {
                a[ci * w + cj][idx] = 1;
            }
        }
        a[idx][idx] = 1;
    }

    // Elimation
    var lastj = 0;
    var tmp;
    for(i = 0;i < nx;i ++) {
        // find the coef not zero of current x
        for(j = lastj;j < nx;j ++)
            if(a[j][i])
                break;

        // if not found, ignore this x
        if(j === nx)
            continue;

        // swap to this line
        lastj = i + 1;
        tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;

        tmp = b[i];
        b[i] = b[j];
        b[j] = tmp;

        for(j = i + 1;j < nx;j ++)
            if(a[j][i]) {
                for(k = i;k < nx;k ++)
                    a[j][k] ^= a[i][k];

                b[j] ^= b[i];
            }
    }

    // solve
    for(i = nx - 1;i >= 0;i --) {
        // arbitary
        if(! a[i][i])
            x[i] = 0;

        // accumulate
        x[i] = b[i];
        for(j = i + 1;j < nx;j ++)
            x[i] ^= (a[i][j] & x[j]);
    }

    // render the solution
    var cx, cy;
    var coord;
    var $div;

    for(i = 0;i < nx;i ++) {
        cy = parseInt(i % w);
        cx = parseInt(i / h);

        coord = '.coord' + cx + 'q' + cy;

        $div = $('<div data-sol="' + x[i] + '" data-clicked="0"></div>');
        $div.css({
            'color': '#a00',
            'width': '100%',
            'height': '100%',
            'font-weight': 'bolder',
            'font-size': '24px',
            'text-shadow': '1px 2px #8f8f8f'
        });

        $(coord).append($div);

        rapidGameSolver.toggleSolve($div);
        /* jshint ignore:start */
        $div.click(function() {
            var $div = $(this);
            rapidGameSolver.toggleSolve($div);
        });
        /* jshint ignore:end */
    }
};

// export to global
window.solveGame = rapidGameSolver.solveGame;

})();
