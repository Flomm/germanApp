import app from './app';
import { db } from './data/connection';
import { emailService } from './services/emailService/emailService';

const PORT = process.env.PORT || 3000;

db.checkConnection();
emailService.createTransporter();

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
