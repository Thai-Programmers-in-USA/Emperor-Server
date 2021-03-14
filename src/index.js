const express = require('express');
const cors = require('cors');
const app = express();

// INFO Register middlewares
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/statuss', (req, res, next) => {
  res.status(200).send('Server is running');
});

const PORT = process.env.PORT || 3000;

const init = function () {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

init();
