import app from './app';
import { emailService } from './services/emailService/emailService';

const PORT = process.env.PORT || 3000;

emailService.connectToMailJet();

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
