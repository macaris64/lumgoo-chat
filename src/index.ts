import dotenv from 'dotenv';
import express from 'express';
import chatRouter from "./routes/chat.routes";
import {errorHandler} from "./middlewares/error.middleware";

import sequelize from "./utils/sequelize";
import {initUserModel} from "./models/user.model";
import {initCharacterModel} from "./models/character.model";
import {initMessageModel} from "./models/message.model";
import {initThreadModel} from "./models/thread.model";
import {setupAssociations} from "./models/associations";

initUserModel(sequelize);
initCharacterModel(sequelize);
initThreadModel(sequelize);
initMessageModel(sequelize);

setupAssociations();

dotenv.config();
const app = express();
const port = 3008;

app.use(express.json());
app.use('/api', chatRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.query('CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, test_column VARCHAR(100));');
  })
  .then(() => console.log('Test table created'))
  .catch(err => console.error('Unable to connect to the database:', err));


sequelize.sync({ force: true }).then(() => {
  console.log('Database & tables created!');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})
