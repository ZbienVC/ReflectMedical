import QRCode from "qrcode";
import { GiftCard } from "../services/giftCardService";

export async function generateGiftCardCertificate(giftCard: GiftCard): Promise<string> {
  const qrData = JSON.stringify({
    code: giftCard.code,
    value: giftCard.originalValue,
    from: "Reflect Medical",
  });

  const qrDataUrl = await QRCode.toDataURL(qrData, {
    width: 200,
    margin: 2,
    color: { dark: "#4C1D95", light: "#FFFFFF" },
  });

  const expiryLine = giftCard.expiresAt
    ? `· Expires ${new Date(giftCard.expiresAt.toMillis()).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`
    : "· No expiration";

  const recipientBlock = giftCard.recipientName
    ? `<div class="detail-row"><div class="detail-label">For</div><div class="detail-value">${giftCard.recipientName}</div></div>`
    : "";

  const messageBlock = giftCard.message
    ? `<div class="detail-row"><div class="detail-label">Message</div><div class="detail-value" style="max-width:360px;font-size:13px;opacity:0.8;">"${giftCard.message}"</div></div>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reflect Medical Gift Card</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
    body { margin: 0; background: #f8f5f2; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Inter', sans-serif; }
    .certificate { width: 700px; background: linear-gradient(135deg, #1a0533 0%, #2d1050 50%, #1a0533 100%); border-radius: 24px; padding: 48px; position: relative; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.3); }
    .deco-1 { position: absolute; top: -60px; right: -60px; width: 200px; height: 200px; border-radius: 50%; background: rgba(180,100,255,0.15); }
    .deco-2 { position: absolute; bottom: -40px; left: -40px; width: 150px; height: 150px; border-radius: 50%; background: rgba(180,100,255,0.1); }
    .deco-line { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #B57EDC, #7C3AED, #B57EDC); }
    .logo { font-family: 'Playfair Display', serif; font-size: 22px; color: #E8C8FF; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .tagline { font-size: 11px; color: rgba(255,255,255,0.4); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 40px; }
    .gift-label { font-size: 11px; color: rgba(255,255,255,0.5); letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .value { font-family: 'Playfair Display', serif; font-size: 72px; font-weight: 700; color: #ffffff; line-height: 1; margin-bottom: 4px; }
    .value-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 32px; }
    .divider { height: 1px; background: rgba(255,255,255,0.1); margin: 28px 0; }
    .details { display: flex; justify-content: space-between; align-items: flex-end; }
    .detail-row { margin-bottom: 16px; }
    .detail-label { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
    .detail-value { font-size: 15px; color: #ffffff; font-weight: 500; }
    .code-section { margin-top: 28px; }
    .code-label { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
    .code { font-family: 'Courier New', monospace; font-size: 22px; color: #B57EDC; letter-spacing: 4px; font-weight: 700; }
    .qr-section { text-align: center; }
    .qr-label { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; }
    .qr-wrapper { background: white; border-radius: 12px; padding: 12px; display: inline-block; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.3); }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="deco-line"></div>
    <div class="deco-1"></div>
    <div class="deco-2"></div>
    <div class="logo">Reflect Medical</div>
    <div class="tagline">Medical · Cosmetic · Wellness</div>
    <div class="gift-label">Gift Card Value</div>
    <div class="value">$${giftCard.originalValue}</div>
    <div class="value-sub">Beauty Credits</div>
    <div class="divider"></div>
    <div class="details">
      <div class="left-details">
        ${recipientBlock}
        ${messageBlock}
        <div class="code-section">
          <div class="code-label">Redemption Code</div>
          <div class="code">${giftCard.code}</div>
        </div>
      </div>
      <div class="qr-section">
        <div class="qr-wrapper"><img src="${qrDataUrl}" width="140" height="140" /></div>
        <div class="qr-label">Scan to redeem</div>
      </div>
    </div>
    <div class="footer">Valid at all Reflect Medical locations · reflectmedical.com ${expiryLine}</div>
  </div>
</body>
</html>`;

  return html;
}

export async function downloadCertificate(giftCard: GiftCard): Promise<void> {
  const html = await generateGiftCardCertificate(giftCard);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reflect-gift-card-${giftCard.code}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function openCertificatePreview(giftCard: GiftCard): Promise<void> {
  const html = await generateGiftCardCertificate(giftCard);
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
