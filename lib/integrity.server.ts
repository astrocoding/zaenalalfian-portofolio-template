import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  REQUIRED_CREATOR_NAME,
  REQUIRED_ATTRIBUTION_TEXT,
  SIGNATURE_PAYLOAD,
  PUBLIC_KEY_PEM,
} from "./integrity";

export function stripComments(source: string): string {
  let clean = source.replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, "");
  clean = clean.replace(/\/\/.*/g, "");
  return clean;
}

export function findProjectRoot(): string {
  let cwd = process.cwd();
  for (let i = 0; i < 10; i++) {
    if (
      fs.existsSync(path.join(cwd, "package.json")) &&
      fs.existsSync(path.join(cwd, "copyright"))
    ) {
      return cwd;
    }
    const parent = path.dirname(cwd);
    if (parent === cwd) break;
    cwd = parent;
  }
  if (process.env.PWD && fs.existsSync(path.join(process.env.PWD, "copyright"))) {
    return process.env.PWD;
  }
  return process.cwd();
}

export function verifyServerAttributionIntegrity(): boolean {
  try {
    const rootDir = findProjectRoot();
    const copyrightKeyPath = path.join(rootDir, "copyright");
    const footerPath = path.join(rootDir, "components/layout/Footer.tsx");
    const mainLayoutPath = path.join(rootDir, "components/layout/MainLayout.tsx");

    // 1. Verify root copyright file exists
    if (!fs.existsSync(copyrightKeyPath)) {
      throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
    }

    const signatureHex = fs.readFileSync(copyrightKeyPath, "utf-8").trim();

    // 2. Cryptographic ECDSA Signature Verification
    const verifier = crypto.createVerify("SHA256");
    verifier.update(SIGNATURE_PAYLOAD);
    verifier.end();
    const isSignatureValid = verifier.verify(PUBLIC_KEY_PEM, signatureHex, "hex");

    if (!isSignatureValid) {
      throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
    }

    // 3. Verify Footer.tsx active uncommented code if source tree exists
    if (fs.existsSync(footerPath)) {
      const rawFooter = fs.readFileSync(footerPath, "utf-8");
      const activeFooter = stripComments(rawFooter);

      if (
        !activeFooter.includes(REQUIRED_CREATOR_NAME) ||
        !activeFooter.includes(REQUIRED_ATTRIBUTION_TEXT)
      ) {
        throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
      }
    }

    // 4. Verify MainLayout.tsx active uncommented code if source tree exists
    if (fs.existsSync(mainLayoutPath)) {
      const rawLayout = fs.readFileSync(mainLayoutPath, "utf-8");
      const activeLayout = stripComments(rawLayout);

      if (!activeLayout.includes("Footer") || !activeLayout.includes("<Footer")) {
        throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
      }
    }

    // 5. Verify AdminFooter.tsx active uncommented code if source tree exists
    const adminFooterPath = path.join(rootDir, "components/admin/AdminFooter.tsx");
    if (fs.existsSync(adminFooterPath)) {
      const rawAdminFooter = fs.readFileSync(adminFooterPath, "utf-8");
      const activeAdminFooter = stripComments(rawAdminFooter);

      if (
        !activeAdminFooter.includes("checkAttributionIntegrity") ||
        !activeAdminFooter.includes("ADMIN_FOOTER_ENCRYPTED_PAYLOAD")
      ) {
        throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
      }
    }

    // 6. Verify app/admin/layout.tsx contains AdminFooter
    const adminLayoutPath = path.join(rootDir, "app/admin/layout.tsx");
    if (fs.existsSync(adminLayoutPath)) {
      const rawAdminLayout = fs.readFileSync(adminLayoutPath, "utf-8");
      const activeAdminLayout = stripComments(rawAdminLayout);

      if (
        !activeAdminLayout.includes("AdminFooter") ||
        !activeAdminLayout.includes("<AdminFooter")
      ) {
        throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
      }
    }

    return true;
  } catch {
    throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
  }
}
