'use strict';
var chalk = require('chalk');
var table = require('text-table');
var extend = require('util-extend');
var fs = require('fs');
var path = require('path');

module.exports = {
    reporter: function(result, config, options) {
        var total = result.length;
        var ret = '';
        var headers = [];
        var prevfile;

        options = options || {};

        var colors = {
            'meta': 'gray',
            'reason': 'blue',
            'verbose': 'gray',
            'error': 'red',
            'noproblem': 'green'
        };

        if (fs.existsSync(path.resolve('.stylishcolors'))) {
            var rc = fs.readFileSync('.stylishcolors', {
                encoding: 'utf8'
            });
            colors = JSON.parse(rc);
        } else {
            colors = null;
        }

        ret += table(result.map(function(el, i) {
            var err = el.error;
            var line = [
                '',
                colors ? chalk[colors.meta]('line ' + err.line) : 'line ' + err.line,
                colors ? chalk[colors.meta]('col ' + err.character) : 'col ' + err.character,
                colors ? chalk[colors.reason](err.reason) : err.reason
            ];

            if (el.file !== prevfile) {
                headers[i] = el.file;
            }

            if (options.verbose) {
                line.push(
                	colors ? chalk[colors.verbose]('(' + err.code + ')') : '(' + err.code + ')');
            }

            prevfile = el.file;

            return line;
        })).split('\n').map(function(el, i) {
            return headers[i] ? '\n' + (colors ? chalk.underline(headers[i]) : headers[i]) + '\n' + el : el;
        }).join('\n') + '\n\n';

        if (total > 0) {
            ret += colors ? chalk[colors.error].bold('✖ ' + total + ' problem' + (total === 1 ? '' : 's')) : '✖ ' + total + ' problem' + (total === 1 ? '' : 's');
        } else {
            ret += colors ? chalk[colors.noproblem].bold('✔ No problems') : '✔ No problems';
            ret = '\n' + ret.trim();
        }

        console.log(ret + '\n');
    }
};
