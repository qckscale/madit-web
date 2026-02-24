const { EmailClient } = require("@azure/communication-email");

const connectionString = process.env.EMAIL_ENDPOINT;
export const client = new EmailClient(connectionString);
