const brain = require('brain.js')
const express = require('express');
const app = express();
app.use(express.json());

var net = new brain.NeuralNetwork();
net.fromJSON(require('./data/model_win'));

app.post('/network', (req, res) => {
    const data2 = req.body;
    console.log('>>', data2);
    let data = net.run(convert_data(data2));
    let data1 = {'score1': data[0], 'score2': data[1], 'first': 1 / data[2], 'draw': 1 / data[3], 'second': 1 / data[4]}
    console.log('<<', data1);
    res.send(JSON.stringify(data1))
  });

var time_d = 100000000000
var inp_data = [1, 3, 1, 1, 1 , 30000000]

function convert_data(inp_data){
    inp_data = [inp_data.score1 / 100, inp_data.score2 / 100, 1 / inp_data.first, 1 / inp_data.draw, 1 / inp_data.second, inp_data.time / time_d];
    return inp_data;
}
// var output = net.run(inp_data);
// output = [output[0] * 100, output[1] * 100, 1 / output[2], 1 / output[3], 1 / output[4]]
// console.log(output);



app.listen(3002, () => {
    console.log('Сервер запущен на порту 3002');
  });