export const REQUIRED_CREATOR_NAME = "Zaenal Alfian";
export const REQUIRED_ATTRIBUTION_TEXT = "Crafted with Passion by Zaenal Alfian";
export const SIGNATURE_PAYLOAD = "Zaenal Alfian|Crafted with Passion by Zaenal Alfian";

// Official ECDSA P-256 Public Key PEM belonging exclusively to Zaenal Alfian
export const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEjnjCNxH9bDOmKdqouBI13M8P9760
J5ExB0X+1eqoZ10Rzgf4NlrMp9zKJ4Zdkx6+L91vRUBNzq3/JIR28pV8Uw==
-----END PUBLIC KEY-----`;

export function checkAttributionIntegrity(): boolean {
  if (
    REQUIRED_CREATOR_NAME !== "Zaenal Alfian" ||
    REQUIRED_ATTRIBUTION_TEXT !== "Crafted with Passion by Zaenal Alfian" ||
    !PUBLIC_KEY_PEM.includes("MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEjnjCNxH9bDOmKdqouBI13M8P9760")
  ) {
    throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
  }
  return true;
}
