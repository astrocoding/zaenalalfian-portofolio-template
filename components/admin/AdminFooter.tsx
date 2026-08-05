import * as React from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import {
  checkAttributionIntegrity,
  REQUIRED_CREATOR_NAME,
  REQUIRED_ATTRIBUTION_TEXT,
} from "@/lib/integrity";

/**
 * Encrypted Base64 payloads for tamper-proof AdminFooter attribution.
 * Protects copyright integrity and prevents unauthorized modification of creator metadata.
 */
const ADMIN_FOOTER_ENCRYPTED_PAYLOAD = {
  // Base64 for "Zaenal Alfian"
  creator: "WmFlbmFsIEFsZmlhbg==",
  // Base64 for "Crafted with Passion by Zaenal Alfian"
  attribution: "Q3JhZnRlZCB3aXRoIFBhc3Npb24gYnkgWmFlbmFsIEFsZmlhbg==",
  // Base64 for "無の境地"
  kanji: "54SE44Gu44KL44Gg",
};

/**
 * Safely decodes Base64 encoded attribution strings at runtime.
 */
function decodeAttributionPayload(encoded: string): string {
  try {
    if (typeof window !== "undefined") {
      return atob(encoded);
    }
    return Buffer.from(encoded, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

export const AdminFooter: React.FC = () => {
  // 1. Assert client/server attribution integrity via cryptographic verification
  checkAttributionIntegrity();

  const currentYear = new Date().getFullYear();

  // 2. Runtime decryption of copyright & attribution payloads
  const decodedCreator =
    decodeAttributionPayload(ADMIN_FOOTER_ENCRYPTED_PAYLOAD.creator) ||
    REQUIRED_CREATOR_NAME;
  const decodedAttribution =
    decodeAttributionPayload(ADMIN_FOOTER_ENCRYPTED_PAYLOAD.attribution) ||
    REQUIRED_ATTRIBUTION_TEXT;
  const decodedKanji =
    decodeAttributionPayload(ADMIN_FOOTER_ENCRYPTED_PAYLOAD.kanji) || "無の境地";

  // 3. Runtime assertion guard — throw error immediately if creator signature is tampered with
  if (
    decodedCreator !== REQUIRED_CREATOR_NAME ||
    decodedAttribution !== REQUIRED_ATTRIBUTION_TEXT
  ) {
    throw new Error('You can\'t changed the creator name "Zaenal Alfian"');
  }

  return (
    <footer className="w-full bg-surface border-t border-border-warm py-4 px-4 sm:px-6 lg:px-8 mt-auto z-10 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-ink-muted gap-2.5">
        {/* Left Side: Copyright notice + Kanji badge */}
        <div className="flex items-center space-x-2">
          <span>
            © {currentYear}{" - "}
            <Link
              href="/"
              className="font-bold text-secondary hover:text-primary transition-colors"
            >
              {decodedCreator}
            </Link>
            . All rights reserved.
          </span>
          <span className="text-border-warm">•</span>
          <span className="font-serif text-primary font-medium">{decodedKanji}</span>
        </div>

        {/* Right Side: Crafted with passion attribution */}
        <div className="flex items-center space-x-1 font-mono text-[11px]">
          <Flame className="w-3.5 h-3.5 text-primary fill-primary inline mr-1" />
          <span>{decodedAttribution}</span>
        </div>
      </div>
    </footer>
  );
};
