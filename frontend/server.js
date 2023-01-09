const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/german-learning-app'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/german-learning-app/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is listening on port: ${port}`);
});
