const tf = require('@tensorflow/tfjs');

// Создаем нейронную сеть с одним скрытым слоем
const model = tf.sequential();
model.add(tf.layers.dense({inputShape: [1], units: 10, activation: 'relu'}));
model.add(tf.layers.dense({units: 1}));

// Компилируем модель с функцией потерь Mean Squared Error (MSE) и оптимизатором Stochastic Gradient Descent (SGD)
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

// Создаем обучающий набор данных
const xTrain = tf.tensor2d([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]]);
const yTrain = tf.tensor2d([[1], [3], [5], [7], [9], [11], [13], [15], [17], [19]]);

// Обучаем модель на обучающем наборе данных
model.fit(xTrain, yTrain, {epochs: 100}).then(() => {
  // Тестируем модель на новых данных
  const xTest = tf.tensor2d([[10], [11], [12], [13], [14], [15]]);
  const yTest = model.predict(xTest);

  yTest.print();
});