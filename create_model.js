const tf = require('@tensorflow/tfjs');
// require('@tensorflow/tfjs-node');
const fs = require('fs');

// достаем данные
var inp_data = JSON.parse(fs.readFileSync('inp_data.json', 'utf8'));
var out_data = JSON.parse(fs.readFileSync('out_data.json', 'utf8'));
var inp_data1 = [];
var out_data1 = [];
var minValue = 0;
var maxValue = 100;
var time_d = 100000000000

for (let j=0; j < out_data.length; j++){
    for (let i=0; i < inp_data.length; i++){
        if (inp_data[i].id == out_data[j].id){
            let local_arr = inp_data[i];
            inp_data1.push([
                local_arr.score1 / maxValue,
                local_arr.score2 / maxValue,
                1 / local_arr.first,
                1 / local_arr.draw,
                1 / local_arr.second,
                (local_arr.now - local_arr.start_time) / time_d
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


/* for (let i=0; i < out_data.length; i++){
    let local_arr = out_data[i];
    out_data[i] = [
        local_arr.score1,
        local_arr.score2,
        local_arr.draw,
        local_arr.first,
        local_arr.second,
    ]
} */
// 73571

var data = [];
for (let i=0; i<out_data1.length; i++){
    data.push(
        
        {input: inp_data1[i], output: out_data1[i]}
    )
    // console.log(format(inp_data1[i]), ' -> ', format(out_data1[i]))
}

var brain = require('brain.js');
var net = new brain.NeuralNetwork({inputRange: {min: 0, max: 10}, outputRange: {min: 0, max: 10}});


net.train(data, {
    //errorThresh: 0.005,  // error threshold to reach
    iterations: 2000,   // maximum training iterations
    log: true,           // console.log() progress periodically
    logPeriod: 1,       // number of iterations between logging
    // learningRate: 0.3    // learning rate
});

let wstream = fs.createWriteStream('./data/model_win1.json');
wstream.write(JSON.stringify(net.toJSON(),null,2));
wstream.end();

console.log('MNIST dataset with Brain.js train done.')

/* var output = net.run([10, 12, 1.18, 5.5, 18, 600000]);  // [0.987]
console.log(output); */

/* // Создаем и обучаем модель
const model = tf.sequential();
model.add(tf.layers.dense({inputShape: [6], units: 10, activation: 'relu'}));
model.add(tf.layers.dense({units: 5, activation: 'relu'}));
//model.add(tf.layers.dense({units: 5, activation: 'relu'}));

model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

const xTrain = tf.tensor2d(inp_data1);
const yTrain = tf.tensor2d(out_data1);

const modelPath = 'model.json'

model.fit(xTrain, yTrain, {
    epochs: 10,
    callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Эпоха ${epoch}: Инфо - ${logs.loss}`);
        }
      }
}).then(() => {
//.then(() => {model.save(`file://${modelPath}`)});


 const model1 = tf.loadLayersModel(`file://${modelPath}`);

const xTest = tf.tensor2d([
        [2, 1, 1.18, 5.5, 18, 600000],
        [2, 1, 1.18, 5.5, 18, 800000],
        [2, 1, 1.18, 5.5, 18, 1000000]
    ]);
const yTest = model.predict(xTest);
yTest.print()
}) */