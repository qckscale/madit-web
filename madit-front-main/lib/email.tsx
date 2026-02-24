const { EmailClient } = require("@azure/communication-email");

let _client: InstanceType<typeof EmailClient> | null = null;

export function getEmailClient() {
  if (!_client) {
    const connectionString = process.env.EMAIL_ENDPOINT;
    _client = new EmailClient(connectionString);
  }
  return _client;
}
