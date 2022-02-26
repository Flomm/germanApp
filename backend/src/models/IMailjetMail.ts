export default interface IMailjetMail {
  From: {
    Email: string;
    Name: string;
  };
  To: [
    {
      Email: string;
    },
  ];
  Subject: string;
  HTMLPart: string;
}
