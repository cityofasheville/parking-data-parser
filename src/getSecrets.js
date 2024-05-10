
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

async function getSecrets(secret_name) {

  const client = new SecretsManagerClient({
    region: "us-east-1",
  });

  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name
      })
    );
  } catch (error) {
    throw error;
  }

  const secrets = JSON.parse(response.SecretString);
  return secrets
}

export default getSecrets;