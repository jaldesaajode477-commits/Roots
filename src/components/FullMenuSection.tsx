import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Utensils, 
  Check, 
  Eye, 
  X, 
  Flame, 
  AlertCircle, 
  Sparkles, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Leaf, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { MENU_CATEGORIES, MenuItem } from '../data/menuData';
import { useRestaurant } from '../context/RestaurantContext';
import confetti from 'canvas-confetti';

interface Props {
  onSelectItemForCart: (item: MenuItem & { selectedVariation?: string; selectedQuantity?: number; specialNotes?: string }) => void;
  onOpenReservation?: () => void;
}

export const FullMenuSection: React.FC<Props> = ({ onSelectItemForCart, onOpenReservation }) => {
  const { menuItems } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDietary, setFilterDietary] = useState<'all' | 'veg' | 'popular'>('all');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  
  // Interactive Product Detail View Modal State
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [detailQuantity, setDetailQuantity] = useState<number>(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, { label: string; priceDelta: number }>>({});
  const [specialKitchenNotes, setSpecialKitchenNotes] = useState<string>('');

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.swahiliName && item.swahiliName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.ingredients && item.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())));
    
    let matchesDiet = true;
    if (filterDietary === 'veg') matchesDiet = !!item.isVegetarian;
    if (filterDietary === 'popular') matchesDiet = !!item.isPopular;

    return matchesCat && matchesQuery && matchesDiet;
  });

  const handleOpenDetailModal = (item: MenuItem) => {
    setDetailItem(item);
    setDetailQuantity(1);
    setSpecialKitchenNotes('');
    
    // Initialize default variations
    const defaults: Record<string, { label: string; priceDelta: number }> = {};
    if (item.variations) {
      item.variations.forEach((v) => {
        if (v.options.length > 0) {
          defaults[v.name] = v.options[0];
        }
      });
    }
    setSelectedVariations(defaults);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    onSelectItemForCart(item);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    confetti({ particleCount: 30, spread: 50, colors: ['#8B5A2B', '#3E2723'] });
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1500);
  };

  const handleAddFromDetailModal = () => {
    if (!detailItem) return;

    // Build variation summary string
    const variationParts = Object.entries(selectedVariations).map(
      ([group, opt]) => `${group}: ${opt.label}`
    );
    const variationString = variationParts.join(' · ');

    // Calculate final unit price
    const deltaTotal = Object.values(selectedVariations).reduce((sum, opt) => sum + opt.priceDelta, 0);
    const finalUnitPrice = detailItem.price + deltaTotal;

    for (let q = 0; q < detailQuantity; q++) {
      onSelectItemForCart({
        ...detailItem,
        price: finalUnitPrice,
        selectedVariation: variationString || detailItem.swahiliName,
        selectedQuantity: detailQuantity,
        specialNotes: specialKitchenNotes,
      });
    }

    confetti({ particleCount: 45, spread: 60, colors: ['#8B5A2B', '#3E2723'] });
    setDetailItem(null);
  };

  // Compute live price inside modal
  const computedDetailPrice = detailItem 
    ? (detailItem.price + Object.values(selectedVariations).reduce((sum, opt) => sum + opt.priceDelta, 0)) * detailQuantity
    : 0;

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#3E2723] py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#8B5A2B] selection:text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Title & Search Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D7CCC8] pb-8">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B5A2B] mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#8B5A2B]" />
              <span>Roots & Pots Digital Menu · Arcadia Mall Athi River</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3E2723] font-serif tracking-tight">
              Traditional Kenyan Culinary Menu (28 Dishes)
            </h1>
            <p className="mt-2 text-sm text-[#5D4037] max-w-2xl leading-relaxed">
              Every dish is prepared using hand-molded clay pots and wild acacia firewood embers. Click any dish to open the product detail view, customize your traditional starches, and add to your bag.
            </p>
          </div>

          {/* Search & Dietary Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#795548] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ugali, tilapia, choma, pilau..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 bg-white border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] placeholder-[#795548]/70 focus:outline-none focus:border-[#8B5A2B] shadow-xs"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#D7CCC8] shadow-xs">
              <button
                onClick={() => setFilterDietary('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  filterDietary === 'all' ? 'bg-[#8B5A2B] text-white' : 'text-[#5D4037] hover:text-[#3E2723]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterDietary('veg')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  filterDietary === 'veg' ? 'bg-[#2E7D32] text-white' : 'text-[#5D4037] hover:text-[#3E2723]'
                }`}
              >
                <Leaf className="w-3 h-3" />
                <span>Vegetarian</span>
              </button>
              <button
                onClick={() => setFilterDietary('popular')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  filterDietary === 'popular' ? 'bg-[#8B5A2B] text-white' : 'text-[#5D4037] hover:text-[#3E2723]'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Popular</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-2xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#8B5A2B] text-[#F5F2EB] shadow-md shadow-[#8B5A2B]/20 scale-102'
                  : 'bg-[#D7CCC8]/50 text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723] border border-[#D7CCC8]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#D7CCC8] p-8 space-y-3">
            <Utensils className="w-12 h-12 text-[#8B5A2B] mx-auto" />
            <h3 className="text-base font-bold text-[#3E2723]">No dishes found matching your query</h3>
            <p className="text-xs text-[#795548]">Try searching for other comforting Kenyan classics like Mbuzi Choma, Tilapia, or Pilau.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isJustAdded = addedItemIds[item.id];
              const isInStock = (item as any).isAvailable !== false;

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenDetailModal(item)}
                  className={`bg-white rounded-3xl overflow-hidden border border-[#D7CCC8] hover:border-[#8B5A2B] transition-all flex flex-col justify-between group shadow-xs hover:shadow-xl cursor-pointer ${
                    !isInStock ? 'opacity-70 grayscale-30' : ''
                  }`}
                >
                  {/* Food Image */}
                  <div className="relative w-full aspect-16/10 overflow-hidden bg-black/5">
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('dish_mbuzi_choma_ugali')) {
                          target.src = '/src/assets/images/dish_mbuzi_choma_ugali_1792635389333.jpg';
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-3 left-3 bg-[#3E2723]/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono font-bold text-[#F5F2EB] shadow-md border border-[#D7CCC8]/30">
                      KES {item.price.toLocaleString()}
                    </div>

                    {/* Stock Status / Popular Badge */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                      {!isInStock ? (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#C62828] text-white shadow-md">
                          86ed / Sold Out
                        </span>
                      ) : item.isPopular ? (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#8B5A2B] text-[#F5F2EB] shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Hearth Star</span>
                        </span>
                      ) : null}

                      {item.isVegetarian && (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-[#2E7D32] text-white shadow-md flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          <span>Veg</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#795548] font-bold">
                          {item.category.replace('_', ' ')}
                        </span>
                        {item.servingTime && (
                          <span className="text-[10px] font-mono text-[#795548] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#8B5A2B]" />
                            <span>{item.servingTime}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#3E2723] font-serif group-hover:text-[#8B5A2B] transition-colors mt-0.5 line-clamp-1">
                        {item.name}
                      </h3>

                      {item.swahiliName && (
                        <p className="text-xs text-[#795548] italic font-serif mt-0.5 line-clamp-1">
                          {item.swahiliName}
                        </p>
                      )}

                      <p className="text-xs text-[#5D4037] mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-[#D7CCC8]/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#8B5A2B] flex items-center gap-1">
                        <span>Inspect & Customize</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>

                      <button
                        onClick={(e) => handleQuickAdd(e, item)}
                        disabled={!isInStock}
                        className={`p-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer ${
                          !isInStock
                            ? 'bg-[#D7CCC8]/50 text-[#795548] cursor-not-allowed'
                            : isJustAdded
                            ? 'bg-[#2E7D32] text-white'
                            : 'bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] active:scale-95'
                        }`}
                        title="Add to order"
                      >
                        {isJustAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* ELEGANT PRODUCT DETAIL VIEW MODAL (Per Requirement 5) */}
      {/* ========================================================================= */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-[#D7CCC8] rounded-3xl overflow-hidden shadow-2xl text-[#3E2723] my-8 animate-in zoom-in-95">
            
            {/* Close Button */}
            <button
              onClick={() => setDetailItem(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header: Large Food Photograph */}
            <div className="relative w-full h-64 sm:h-72 bg-black">
              <img
                src={detailItem.image}
                alt={detailItem.name}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('dish_mbuzi_choma_ugali')) {
                    target.src = '/src/assets/images/dish_mbuzi_choma_ugali_1792635389333.jpg';
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#D7CCC8] font-bold block">
                    {detailItem.category.replace('_', ' ')} · ARCADIA HEARTH
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif leading-tight">
                    {detailItem.name}
                  </h3>
                  {detailItem.swahiliName && (
                    <p className="text-xs text-[#D7CCC8] italic font-serif">
                      {detailItem.swahiliName}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-lg sm:text-xl font-mono font-bold text-[#F5F2EB] block">
                    KES {detailItem.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              
              {/* Description */}
              <div>
                <p className="text-xs sm:text-sm text-[#5D4037] leading-relaxed">
                  {detailItem.description}
                </p>
              </div>

              {/* Provenance & Serving Info */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#795548] bg-[#F5F2EB] p-3 rounded-2xl border border-[#D7CCC8]">
                {detailItem.originRegion && (
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    <span>Origin: {detailItem.originRegion}</span>
                  </div>
                )}
                {detailItem.servingTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#8B5A2B]" />
                    <span>Prep Time: {detailItem.servingTime}</span>
                  </div>
                )}
              </div>

              {/* Ingredients Chips */}
              {detailItem.ingredients && detailItem.ingredients.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#795548] block">
                    Artisanal Hearth Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailItem.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-[#F5F2EB] text-[#3E2723] rounded-lg text-xs font-medium border border-[#D7CCC8]"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dietary Tags */}
              {detailItem.dietary && detailItem.dietary.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#795548] block">
                    Dietary & Verification
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {detailItem.dietary.map((d, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/30 flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{d}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Variations (e.g. Choose Starch, Heat Level) */}
              {detailItem.variations && detailItem.variations.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-[#D7CCC8]/70">
                  {detailItem.variations.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-2">
                      <span className="text-xs font-bold text-[#3E2723] flex items-center justify-between">
                        <span>{group.name}</span>
                        {group.required && <span className="text-[10px] font-mono text-[#8B5A2B]">Required</span>}
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.options.map((opt, oIdx) => {
                          const isSelected = selectedVariations[group.name]?.label === opt.label;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setSelectedVariations((prev) => ({
                                  ...prev,
                                  [group.name]: opt,
                                }));
                              }}
                              className={`p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#8B5A2B]/10 border-[#8B5A2B] text-[#3E2723] font-bold'
                                  : 'bg-white border-[#D7CCC8] text-[#5D4037] hover:bg-[#F5F2EB]'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {opt.priceDelta > 0 && (
                                <span className="font-mono text-[#8B5A2B] font-bold">
                                  +KES {opt.priceDelta}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Kitchen Special Notes */}
              <div className="pt-2 border-t border-[#D7CCC8]/70 space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#795548] block">
                  Special Kitchen Request (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Separate kachumbari, well roasted ribs, extra lime..."
                  value={specialKitchenNotes}
                  onChange={(e) => setSpecialKitchenNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F2EB] border border-[#D7CCC8] rounded-xl text-xs text-[#3E2723] focus:outline-none focus:border-[#8B5A2B]"
                />
              </div>

            </div>

            {/* Modal Footer: Quantity Selector & Add to Bag */}
            <div className="p-4 sm:p-5 bg-[#F5F2EB] border-t border-[#D7CCC8] flex items-center justify-between gap-4">
              
              {/* Quantity Counter */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#D7CCC8]">
                <button
                  onClick={() => setDetailQuantity((q) => Math.max(1, q - 1))}
                  className="text-[#795548] hover:text-[#3E2723] font-bold text-sm px-1 cursor-pointer"
                >
                  −
                </button>
                <span className="font-mono font-bold text-sm text-[#3E2723] px-2">
                  {detailQuantity}
                </span>
                <button
                  onClick={() => setDetailQuantity((q) => q + 1)}
                  className="text-[#795548] hover:text-[#3E2723] font-bold text-sm px-1 cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                onClick={handleAddFromDetailModal}
                className="flex-1 py-3 px-4 bg-[#8B5A2B] hover:bg-[#70461F] text-[#F5F2EB] font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag · KES {computedDetailPrice.toLocaleString()}</span>
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
