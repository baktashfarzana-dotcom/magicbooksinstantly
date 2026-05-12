import type { StoryPage } from "@/lib/story-engine/schema";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderStoryboardSvg({
  childName,
  title,
  page,
  anchorColor,
}: {
  childName: string;
  title: string;
  page: StoryPage;
  anchorColor: string;
}) {
  const hue = (page.page_number * 29) % 360;
  const subtitle = page.emotional_beat.slice(0, 42);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="832" viewBox="0 0 1280 832" role="img" aria-label="${escapeXml(title)} page ${page.page_number}">
  <defs>
    <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="hsl(${hue}, 86%, 86%)" offset="0"/>
      <stop stop-color="hsl(${(hue + 72) % 360}, 80%, 96%)" offset="1"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#31506f" flood-opacity=".18"/>
    </filter>
  </defs>
  <rect width="1280" height="832" fill="url(#sky)"/>
  <circle cx="1088" cy="132" r="86" fill="#fff2a8" opacity=".92"/>
  <path d="M0 654 C196 572 306 660 484 606 C648 556 762 598 906 562 C1062 522 1150 574 1280 522 L1280 832 L0 832 Z" fill="#5ad6a3" opacity=".88"/>
  <path d="M0 714 C230 648 386 742 586 680 C748 630 902 710 1280 616 L1280 832 L0 832 Z" fill="#2f8fe6" opacity=".18"/>
  <g filter="url(#soft)">
    <ellipse cx="628" cy="688" rx="176" ry="38" fill="#24425f" opacity=".14"/>
    <circle cx="628" cy="338" r="112" fill="#ffd7b5"/>
    <path d="M520 332 C532 204 724 198 740 332 C690 288 575 288 520 332 Z" fill="#493121"/>
    <circle cx="590" cy="342" r="12" fill="#17202f"/>
    <circle cx="666" cy="342" r="12" fill="#17202f"/>
    <path d="M596 390 C622 414 654 414 680 390" fill="none" stroke="#17202f" stroke-width="9" stroke-linecap="round"/>
    <path d="M470 646 C494 496 540 432 628 432 C716 432 762 496 786 646 Z" fill="${escapeXml(anchorColor)}"/>
    <path d="M512 500 C430 542 392 608 374 684" fill="none" stroke="#ffd7b5" stroke-width="38" stroke-linecap="round"/>
    <path d="M744 500 C826 542 864 608 882 684" fill="none" stroke="#ffd7b5" stroke-width="38" stroke-linecap="round"/>
    <rect x="540" y="622" width="176" height="58" rx="29" fill="#ffffff" opacity=".9"/>
    <text x="628" y="660" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800" fill="#17202f">${escapeXml(childName)}</text>
  </g>
  <g>
    <rect x="72" y="68" width="362" height="126" rx="28" fill="#ffffff" opacity=".82"/>
    <text x="104" y="124" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800" fill="#17202f">${escapeXml(title.slice(0, 22))}</text>
    <text x="104" y="164" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#486176">Page ${page.page_number} · ${escapeXml(subtitle)}</text>
  </g>
</svg>`;
}
