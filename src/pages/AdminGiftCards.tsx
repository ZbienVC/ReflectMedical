import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Tag,
  Search,
  Plus,
  X,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye,
} from "lucide-react";
import {
  getAllGiftCards,
  getAllPromoCodes,
  createPromoCode,
  togglePromoCode,
  deletePromoCode,
  GiftCard,
  PromoCode,
} from "../services/giftCardService";
import { useAuth } from "../AuthContext";
import { Timestamp } from "firebase/firestore";
import { useToast } from "../components/ui/Toast";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  redeemed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  expired: "bg-gray-100 dark:bg-gray-700 text-gray-500",
  pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
};

const AdminGiftCards: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<"cards" | "promos">("cards");

  // Gift Cards state
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [cardsLoading, setCardsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);

  // Promo codes state
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [promosLoading, setPromosLoading] = useState(true);
  const [showCreatePromo, setShowCreatePromo] = useState(false);
  const [promoForm, setPromoForm] = useState({
    code: "",
    description: "",
    discountType: "percent" as "percent" | "fixed",
    discountValue: "",
    minPurchase: "",
    maxUses: "",
    startsAt: "",
    expiresAt: "",
    active: true,
  });
  const [promoCreating, setPromoCreating] = useState(false);

  useEffect(() => {
    getAllGiftCards().then(setCards).finally(() => setCardsLoading(false));
    getAllPromoCodes().then(setPromos).finally(() => setPromosLoading(false));
  }, []);

  const filteredCards = cards.filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || c.code.toLowerCase().includes(q) || c.purchaserEmail.toLowerCase().includes(q) || (c.recipientEmail?.toLowerCase().includes(q) ?? false);
    return matchStatus && matchSearch;
  });

  const setPromoField = (k: string, v: unknown) => setPromoForm((f) => ({ ...f, [k]: v }));

  const previewDiscount = () => {
    const v = parseFloat(promoForm.discountValue) || 0;
    if (!v) return "";
    if (promoForm.discountType === "percent") return `With code ${promoForm.code || "CODE"}: Buy a $100 gift card → pay $${(100 - v).toFixed(0)}`;
    return `With code ${promoForm.code || "CODE"}: Buy a $100 gift card → pay $${(100 - v).toFixed(0)}`;
  };

  const handleCreatePromo = async () => {
    if (!promoForm.code || !promoForm.discountValue || !promoForm.startsAt || !promoForm.expiresAt) {
      showToast("error", "Validation Error", "Please fill in all required fields.");
      return;
    }
    setPromoCreating(true);
    try {
      const promo = await createPromoCode({
        code: promoForm.code.toUpperCase(),
        description: promoForm.description,
        discountType: promoForm.discountType,
        discountValue: parseFloat(promoForm.discountValue),
        minPurchase: promoForm.minPurchase ? parseFloat(promoForm.minPurchase) : undefined,
        maxUses: promoForm.maxUses ? parseInt(promoForm.maxUses) : undefined,
        startsAt: Timestamp.fromDate(new Date(promoForm.startsAt)),
        expiresAt: Timestamp.fromDate(new Date(promoForm.expiresAt)),
        active: promoForm.active,
        createdBy: user?.uid || "",
      });
      setPromos((p) => [promo, ...p]);
      setShowCreatePromo(false);
      setPromoForm({ code: "", description: "", discountType: "percent", discountValue: "", minPurchase: "", maxUses: "", startsAt: "", expiresAt: "", active: true });
      showToast("success", `Promo code ${promo.code} created!`);
    } catch {
      showToast("error", "Error", "Failed to create promo code.");
    } finally {
      setPromoCreating(false);
    }
  };

  const handleTogglePromo = async (id: string, active: boolean) => {
    await togglePromoCode(id, !active);
    setPromos((p) => p.map((x) => (x.id === id ? { ...x, active: !active } : x)));
  };

  const handleDeletePromo = async (id: string, code: string) => {
    if (!confirm(`Delete promo code ${code}?`)) return;
    await deletePromoCode(id);
    setPromos((p) => p.filter((x) => x.id !== id));
    showToast("success", "Promo code deleted.");
  };

  return (
    <motion.div className="space-y-6 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gift Cards</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage gift cards and promo codes.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {(["cards", "promos"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {t === "cards" ? <Gift className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
            {t === "cards" ? "Gift Cards" : "Promo Codes"}
          </button>
        ))}
      </div>

      {tab === "cards" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search code or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 w-64" />
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-4 pr-8 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="redeemed">Redeemed</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {cardsLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : filteredCards.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No gift cards found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      {["Code", "Value", "Balance", "Status", "Purchaser", "Recipient", "Purchased", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredCards.map((card) => (
                      <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => setSelectedCard(card)}>
                        <td className="px-4 py-3 font-mono font-semibold text-violet-600 dark:text-violet-400">{card.code}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">${card.originalValue}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">${card.balance}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[card.status] || ""}`}>{card.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[140px] truncate">{card.purchaserEmail}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[120px] truncate">{card.recipientEmail || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {card.purchasedAt?.toDate ? card.purchasedAt.toDate().toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3"><Eye className="w-4 h-4 text-gray-400" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "promos" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowCreatePromo(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors">
              <Plus className="w-4 h-4" /> Create Promo Code
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {promosLoading ? (
              <div className="p-8 text-center text-gray-500">Loading...</div>
            ) : promos.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">No promo codes yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      {["Code", "Description", "Discount", "Uses", "Starts", "Expires", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {promos.map((promo) => (
                      <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-violet-600 dark:text-violet-400">{promo.code}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-[160px] truncate">{promo.description}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                          {promo.discountType === "percent" ? `${promo.discountValue}% off` : `$${promo.discountValue} off`}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                          {promo.usesCount}{promo.maxUses ? `/${promo.maxUses}` : ""}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {promo.startsAt?.toDate ? promo.startsAt.toDate().toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {promo.expiresAt?.toDate ? promo.expiresAt.toDate().toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${promo.active ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>
                            {promo.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleTogglePromo(promo.id, promo.active)} title={promo.active ? "Deactivate" : "Activate"}
                              className="text-gray-400 hover:text-violet-600 transition-colors">
                              {promo.active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                            </button>
                            <button onClick={() => handleDeletePromo(promo.id, promo.code)}
                              className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gift Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCard(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white">Gift Card Details</h3>
              <button onClick={() => setSelectedCard(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="font-mono text-xl font-bold text-violet-600 dark:text-violet-400">{selectedCard.code}</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Value", `$${selectedCard.originalValue}`],
                ["Balance", `$${selectedCard.balance}`],
                ["Purchase Price", `$${selectedCard.purchasePrice}`],
                ["Status", selectedCard.status],
                ["Purchaser", selectedCard.purchaserName],
                ["Email", selectedCard.purchaserEmail],
                ["Recipient", selectedCard.recipientName || "—"],
                ["Recipient Email", selectedCard.recipientEmail || "—"],
                ["Delivery", selectedCard.deliveryMethod.toUpperCase()],
                ["Promo Used", selectedCard.promoCodeUsed || "—"],
                ["Purchased", selectedCard.purchasedAt?.toDate ? selectedCard.purchasedAt.toDate().toLocaleDateString() : "—"],
                ["Redeemed", selectedCard.redeemedAt?.toDate ? selectedCard.redeemedAt.toDate().toLocaleDateString() : "—"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
            {selectedCard.message && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Message</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{selectedCard.message}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Promo Modal */}
      {showCreatePromo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreatePromo(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white">Create Promo Code</h3>
              <button onClick={() => setShowCreatePromo(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            {[
              { label: "Code Name *", key: "code", type: "text", placeholder: "MOTHERSDAY25" },
              { label: "Description", key: "description", type: "text", placeholder: "Mother's Day Special" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{label}</label>
                <input type={type} placeholder={placeholder} value={(promoForm as Record<string, string>)[key]}
                  onChange={(e) => setPromoField(key, e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Discount Type</label>
                <select value={promoForm.discountType} onChange={(e) => setPromoField("discountType", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                  <option value="percent">% Off</option>
                  <option value="fixed">Fixed $</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Discount Value *</label>
                <input type="number" min="0" placeholder="10" value={promoForm.discountValue} onChange={(e) => setPromoField("discountValue", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
            </div>

            {previewDiscount() && (
              <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-xl px-4 py-3">
                <p className="text-xs text-violet-700 dark:text-violet-300">{previewDiscount()}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Min Purchase ($)</label>
                <input type="number" min="0" placeholder="50" value={promoForm.minPurchase} onChange={(e) => setPromoField("minPurchase", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Max Uses (blank = ∞)</label>
                <input type="number" min="0" placeholder="500" value={promoForm.maxUses} onChange={(e) => setPromoField("maxUses", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Active From *</label>
                <input type="date" value={promoForm.startsAt} onChange={(e) => setPromoField("startsAt", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Expires *</label>
                <input type="date" value={promoForm.expiresAt} onChange={(e) => setPromoField("expiresAt", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setPromoField("active", !promoForm.active)}
                className={`relative inline-flex w-10 h-6 rounded-full transition-colors ${promoForm.active ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-600"}`}>
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${promoForm.active ? "translate-x-4" : ""}`} />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">Active immediately</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowCreatePromo(false)}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-xl py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreatePromo} disabled={promoCreating}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
                {promoCreating ? "Creating..." : "Create Promo Code"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminGiftCards;
