// lib/pricingData.ts

export const businessConfig = {
  name: "Kako Photography",
  tagline: "A Quiet Kind of Magic",
  abn: process.env.BUSINESS_ABN ?? "",
  includeGST: false,
  gstNote: "No GST has been charged",
  payId: process.env.PAYID ?? "",
  contactEmail: process.env.CONTACT_EMAIL ?? "",
  instagram: "@your_insta_handle",
};

export const packages = [
  {
    id: "standard",
    name: "Standard Session",
    duration: "1.5 Hours",
    price: 200,
    retouches: 3,
    description: "Perfect for high-quality portraits of a single character, with ample time to capture every subtle expression.",
    deposit: 50,
  },
  {
    id: "extended",
    name: "Extended Session",
    duration: "2.5 Hours",
    price: 320,
    retouches: 6,
    description: "Our most popular choice. Ideal for multiple outfits or location changes, allowing for a more relaxed creative flow.",
    deposit: 50,
    popular: true,
  },
  {
    id: "fullstory",
    name: "The Full Story",
    duration: "5 Hours",
    price: 520,
    retouches: 12,
    description: "Epic storytelling for large projects or group shoots. A deep dive into your character's narrative with full coverage.",
    deposit: 100,
  },
];

export const retouchingTiers = [
  {
    id: "standard",
    name: "Standard Retouch",
    price: 30,
    description: "Cinematic color grading and high-end skin texture refinement.",
    isArtist: false,
  },
  {
    id: "lite",
    name: "Artist — Lite",
    price: 60,
    description: "Hand-painted accents: glowing eyes, weapon glimmers, and atmospheric particles.",
    isArtist: true,
  },
  {
    id: "pro",
    name: "Artist — Pro",
    price: 110,
    description: "Advanced brushwork: hand-painted skill effects (e.g., water, fire) and dynamic lighting re-renders.",
    isArtist: true,
  },
  {
    id: "epic",
    name: "Artist — Epic",
    price: 160,
    description: "Surreal reimagining: background painting and extreme atmospheric rendering with full artistic brushwork.",
    isArtist: true,
  },
];

export const groupPolicy = {
  extraPersonFee: 50,
  discountThreshold: 3,
  discountRate: 0.9,
  label: "Group Discount (3+ people, 10% off shoot fee)",
};

export const artistRewards = [
  { minQty: 5, discount: 0.85, label: "Master's Reward — 15% off Artist retouching" },
  { minQty: 3, discount: 0.9,  label: "Artisan's Reward — 10% off Artist retouching" },
];

export const rushService = {
  id: "rush",
  name: "Express Delivery (3–5 Days)",
  price: 80,
};

export interface AddonInput {
  id: string;
  qty: number;
}

export interface BookingTotal {
  total: number;
  deposit: number;
  balance: number;
  shootFee: number;
  standardFee: number;
  artistFee: number;
  artistDiscountLabel: string;
  artistDiscountAmount: number;
  bonusStandardQty: number;
  rushFee: number;
}

export function calculateBookingTotal(
  pkgId: string,
  numPeople: number,
  addons: AddonInput[],
  isRush: boolean
): BookingTotal {
  const pkg = packages.find(p => p.id === pkgId);
  if (!pkg) throw new Error(`Unknown package: ${pkgId}`);

  // 1. Shoot fee
  const baseShootFee = pkg.price + Math.max(0, numPeople - 1) * groupPolicy.extraPersonFee;
  const shootDiscount = numPeople >= groupPolicy.discountThreshold ? groupPolicy.discountRate : 1;
  const shootFee = Math.round(baseShootFee * shootDiscount);

  // 2. Resolve addon details from retouchingTiers
  const resolvedAddons = addons.map(a => {
    const tier = retouchingTiers.find(t => t.id === a.id);
    if (!tier) throw new Error(`Unknown addon: ${a.id}`);
    return { ...tier, qty: a.qty };
  });

  // 3. Standard addon fee (no discount)
  const standardFee = resolvedAddons
    .filter(a => !a.isArtist)
    .reduce((sum, a) => sum + a.price * a.qty, 0);

  // 4. Artist addon fee
  const artistAddons = resolvedAddons.filter(a => a.isArtist);
  const totalArtistQty = artistAddons.reduce((sum, a) => sum + a.qty, 0);
  const rawArtistFee = artistAddons.reduce((sum, a) => sum + a.price * a.qty, 0);

  const bestReward = artistRewards
    .filter(r => totalArtistQty >= r.minQty)
    .sort((a, b) => a.discount - b.discount)[0];

  const artistDiscount = bestReward?.discount ?? 1;
  const artistFee = Math.round(rawArtistFee * artistDiscount);
  const artistDiscountAmount = Math.round(rawArtistFee * (1 - artistDiscount));
  const artistDiscountLabel = bestReward?.label ?? "";

  // 5. Epic bonus
  const epicQty = artistAddons.find(a => a.id === "epic")?.qty ?? 0;
  const bonusStandardQty = epicQty >= 2 ? 1 : 0;
  const bonusCredit = bonusStandardQty * 30;

  // 6. Rush fee
  const rushFee = isRush ? rushService.price : 0;

  // 7. Total
  const total = Math.round(shootFee + standardFee + artistFee + rushFee - bonusCredit);
  const deposit = pkg.deposit;
  const balance = total - deposit;

  return {
    total,
    deposit,
    balance,
    shootFee,
    standardFee,
    artistFee,
    artistDiscountLabel,
    artistDiscountAmount,
    bonusStandardQty,
    rushFee,
  };
}

export function getDepositAmount(pkgId: string): number {
  return packages.find(p => p.id === pkgId)?.deposit ?? 0;
}