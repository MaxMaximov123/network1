const tf = require('@tensorflow/tfjs');
var brain = require('brain.js');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// достаем данные
var inp_data = [];
var out_data = [];
var inp_data1 = [];
var out_data1 = [];
var minValue = 0;
var maxValue = 100;
var time_d = 10000000000000
const db = new sqlite3.Database('../../livesporttools-api-v2-main/example-app/history.db');


function get_data_from_db(){
    console.log("!!! START_GET_DATA");
    db.all(
        `SELECT * FROM data WHERE id IS NOT NULL AND
        is_live IS NOT NULL AND
        start_time <> 0 AND
        score1 IS NOT NULL AND
        score2 IS NOT NULL AND
        draw IS NOT NULL AND
        first IS NOT NULL AND
        second IS NOT NULL AND
        now IS NOT NULL;
        `, [], function(err, rows) {
            if (err) {
                throw err;
            }
            rows.forEach(function(row) {
                inp_data.push(row);
            });
            db.all(
                `SELECT * FROM data
                WHERE now IN (
                    SELECT MAX(now)
                    FROM data
                    GROUP BY id
                ) AND id IS NOT NULL AND
                is_live IS NOT NULL AND
                start_time <> 0 AND
                score1 IS NOT NULL AND
                score2 IS NOT NULL AND
                draw IS NOT NULL AND
                first IS NOT NULL AND
                second IS NOT NULL AND
                now IS NOT NULL;
            `, [], function(err1, rows1) {
                if (err1) {
                    throw err1;
                }
                rows1.forEach(function(row1) {
                    out_data.push(row1);
                });
                create();
                
            });

        });

    db.close();
}


get_data_from_db();

function create() {
    for (let j=0; j < out_data.length; j++){
        for (let i=0; i < inp_data.length; i++){
            if (inp_data[i].id == out_data[j].id){
                let local_arr = inp_data[i];
                inp_data1.push([
                    1 / (local_arr.score1 + 1),
                    1 / (local_arr.score2 + 1),
                    1 / local_arr.first,
                    1 / local_arr.draw,
                    1 / local_arr.second,
                    1 / (local_arr.now - local_arr.start_time)
                ])
                let local_arr1 = out_data[j];
                out_data1.push(
                    [
                        /* local_arr1.score1 / maxValue,
                        local_arr1.score2 / maxValue, */
                        (local_arr1.score1 < local_arr1.score2) ? 0: 1,
                        (local_arr1.score1 > local_arr1.score2) ? 0: 1,
                        1 / local_arr1.first,
                        1 / local_arr1.draw,
                        1 / local_arr1.second
                    ]
                )
            }
        }
    }

    var data = [];
    for (let i=0; i<out_data1.length; i++){
        data.push(
            
            {input: inp_data1[i], output: out_data1[i]}
        )
        // console.log(inp_data1[i], ' -> ', out_data1[i]);
    }
    var net = new brain.NeuralNetwork();


    net.train(data, {
        //errorThresh: 0.005,  // error threshold to reach
        iterations: 10000,   // maximum training iterations
        log: true,           // console.log() progress periodically
        logPeriod: 1,       // number of iterations between logging
        // learningRate: 0.3    // learning rate
    });

    let wstream = fs.createWriteStream('../models/model_win2.json');
    wstream.write(JSON.stringify(net.toJSON(),null,2));
    wstream.end();

    console.log('MNIST dataset with Brain.js train done.')    
}
