export interface MenuVariationOption {
  label: string;
  priceDelta: number;
}

export interface MenuVariationGroup {
  name: string;
  required?: boolean;
  options: MenuVariationOption[];
}

export type MenuCategoryType = 
  | 'starters' 
  | 'traditional' 
  | 'main_courses' 
  | 'grilled' 
  | 'platters' 
  | 'vegetarian' 
  | 'desserts' 
  | 'drinks'
  | 'combos'
  | 'proteins'
  | 'starches'
  | 'swahili'
  | 'soups'
  | 'bites';

export interface MenuItem {
  id: string;
  name: string;
  swahiliName?: string;
  category: MenuCategoryType;
  price: number;
  description: string;
  ingredients?: string[];
  variations?: MenuVariationGroup[];
  dietary?: string[];
  image: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  servingTime?: string;
  calories?: number;
  originRegion?: string;
}

export const MENU_CATEGORIES: { id: string; label: string; description: string }[] = [
  { id: 'all', label: 'All 28 Dishes', description: 'Explore our full artisanal Kenyan culinary repertoire' },
  { id: 'starters', label: 'Starters & Soups', description: 'Simmered broths, bone marrow, and savory bites' },
  { id: 'traditional', label: 'Traditional Kenyan', description: 'Ancestral clay pot cauldrons and slow-cooked braises' },
  { id: 'main_courses', label: 'Main Courses', description: 'Fragrant Swahili pilau, stews, and comforting hearty dishes' },
  { id: 'grilled', label: 'Grilled Specialties', description: 'Acacia charcoal embers and sizzling savanna cuts' },
  { id: 'platters', label: 'Signature Platters', description: 'Grand family banquets and multi-dish degustations' },
  { id: 'vegetarian', label: 'Vegetarian Options', description: 'Indigenous leafy greens, tubers, legumes, and roots' },
  { id: 'desserts', label: 'Desserts', description: 'Warm Swahili cardamom pastries and coastal sweet finishes' },
  { id: 'drinks', label: 'Natural Drinks', description: 'Smoked gourd Mursik, ginger Dawa, and fresh fruit nectars' },
];

export const MENU_ITEMS: MenuItem[] = [
  // =========================================================================
  // 1. STARTERS & SOUPS (4 Dishes)
  // =========================================================================
  {
    id: 'starter-bone-soup',
    name: 'Traditional Bone Marrow Broth',
    swahiliName: 'Supu ya Mifupa ya Ng\'ombe',
    category: 'starters',
    price: 250,
    description: 'Slow-simmered savanna beef marrow broth extracted over whistling thorn charcoal for 4 hours. Infused with wild Athi basin roots, cracked ginger, and roasted peppercorns.',
    ingredients: ['Savanna Beef Marrow Bones', 'Wild Athi Herbs', 'Organic Ginger', 'Garlic', 'Cracked Pepper'],
    variations: [
      {
        name: 'Broth Heat Level',
        required: true,
        options: [
          { label: 'Traditional Warm Peppercorn', priceDelta: 0 },
          { label: 'Extra Pili Pili Kick', priceDelta: 0 },
          { label: 'Mild & Soothing', priceDelta: 0 },
        ],
      },
      {
        name: 'Accompaniment',
        required: false,
        options: [
          { label: 'Warm Swahili Chapati (1 pc)', priceDelta: 50 },
          { label: 'Extra Squeeze of Lime & Coriander', priceDelta: 0 },
        ],
      },
    ],
    dietary: ['High Protein', 'Keto Friendly', 'Gluten Free'],
    image: '/src/assets/images/food_bone_soup_marrow_1792637970477.jpg',
    isPopular: true,
    servingTime: '10–12 mins',
    originRegion: 'Machakos / Athi Pastoral Valley',
  },
  {
    id: 'starter-goat-soup',
    name: 'Savanna Mbuzi Pepper Soup',
    swahiliName: 'Supu ya Mbuzi wa Kienyeji',
    category: 'starters',
    price: 300,
    description: 'Invigorating pasture goat cutlet soup simmered with coriander root, cloves, and wild mountain herbs. Renowned for vitality and warmth.',
    ingredients: ['Pasture Goat Cuts', 'Coriander Root', 'Mountain Thyme', 'Garlic & Onion Reduction'],
    variations: [
      {
        name: 'Preparation Style',
        options: [
          { label: 'Clear Broth with Tender Cutlet', priceDelta: 0 },
          { label: 'Double Bone Concentration', priceDelta: 50 },
        ],
      },
    ],
    dietary: ['Gluten Free', 'High Iron', 'Dairy Free'],
    image: '/src/assets/images/food_boiled_beef_1792638239292.jpg',
    isPopular: false,
    servingTime: '10–12 mins',
    originRegion: 'Rift Valley Pastoralists',
  },
  {
    id: 'starter-swahili-samosa',
    name: 'Coastal Crispy Samosas (3 pcs)',
    swahiliName: 'Sambusa za Nyama ya Kusaga',
    category: 'starters',
    price: 250,
    description: 'Hand-rolled paper-thin pastry triangles stuffed with spiced minced prime beef, toasted cumin, fresh cilantro, and green onions. Served with sweet tamarind dip.',
    ingredients: ['Prime Minced Beef', 'Toasted Cumin', 'Green Onions', 'Coriander', 'Crispy Pastry'],
    variations: [
      {
        name: 'Filling Choice',
        required: true,
        options: [
          { label: 'Classic Spiced Beef (3 pcs)', priceDelta: 0 },
          { label: 'Spiced Green Lentil & Veg (3 pcs)', priceDelta: 0 },
        ],
      },
    ],
    dietary: ['Nut Free', 'Halal Verified'],
    image: '/src/assets/images/food_viazi_karai_samosa_1792636521067.jpg',
    isPopular: true,
    servingTime: '8–10 mins',
    originRegion: 'Lamu & Mombasa Archipelago',
  },
  {
    id: 'starter-savanna-bites',
    name: 'Hearth-Seared Mutura Savanna Bites',
    swahiliName: 'Mutura wa Makaa na Kachumbari',
    category: 'starters',
    price: 300,
    description: 'Traditional spiced African sausage delicately seasoned with rosemary, garlic, and wild chili peppers, flame-kissed on glowing acacia charcoal with red onion relish.',
    ingredients: ['Artisan Savanna Sausage', 'Fresh Rosemary', 'Habanero Relish', 'Tomato Kachumbari'],
    dietary: ['High Protein', 'Gluten Free'],
    image: '/src/assets/images/food_mbuzi_choma_burst_1792636519294.jpg',
    isPopular: true,
    isSpicy: true,
    servingTime: '12 mins',
    originRegion: 'Central Highlands & Athi Corridor',
  },

  // =========================================================================
  // 2. TRADITIONAL KENYAN CUISINE (4 Dishes)
  // =========================================================================
  {
    id: 'trad-kienyeji-chicken',
    name: 'Village Kienyeji Chicken in Porous Claypot',
    swahiliName: 'Kuku wa Kienyeji wa Chungu',
    category: 'traditional',
    price: 750,
    description: 'Free-range organic kienyeji chicken simmered for 2.5 hours in a hand-thrown earthenware pot over acacia embers. Rich tomato-onion gravy that deeply penetrates the firm, flavor-packed village meat.',
    ingredients: ['Free-Range Village Chicken', 'Heirloom Tomatoes', 'Sweet Red Onions', 'Clay Pot Reduction'],
    variations: [
      {
        name: 'Choice of Traditional Starch',
        required: true,
        options: [
          { label: 'Stone-Ground Brown Millet Ugali', priceDelta: 0 },
          { label: 'Traditional White Maize Ugali', priceDelta: 0 },
          { label: 'Layered Swahili Chapati (2 pcs)', priceDelta: 50 },
          { label: 'Steamed Nduma (Arrowroots)', priceDelta: 50 },
        ],
      },
      {
        name: 'Indigenous Green Selection',
        required: true,
        options: [
          { label: 'Sautéed Managu (African Nightshade)', priceDelta: 0 },
          { label: 'Silky Mrenda (Jute Mallow)', priceDelta: 0 },
          { label: 'Terere (Amaranth Greens)', priceDelta: 0 },
          { label: 'Sukuma Wiki ya Kienyeji', priceDelta: 0 },
        ],
      },
    ],
    dietary: ['100% Organic', 'Gluten Free Available', 'High Iron'],
    image: '/src/assets/images/food_kienyeji_chicken_pot_1792636979366.jpg',
    isPopular: true,
    servingTime: '18–20 mins',
    originRegion: 'Western & Central Kenya Farms',
  },
  {
    id: 'trad-beef-stew-pot',
    name: 'Slow-Simmered Clay Pot Beef Cauldron',
    swahiliName: 'Mchuzi wa Nyama kwenye Chungu',
    category: 'traditional',
    price: 650,
    description: 'Tender braised beef chunks cooked with marrow broth, garlic, and fresh coriander inside an unglazed terracotta pot. Served with organic managu greens and piping hot ugali.',
    ingredients: ['Tender Grass-Fed Beef', 'Marrow Glaze', 'Claypot Steam Reduction', 'Managu Greens'],
    variations: [
      {
        name: 'Choice of Ugali Starch',
        required: true,
        options: [
          { label: 'Brown Sorghum & Millet Ugali', priceDelta: 0 },
          { label: 'Traditional White Maize Ugali', priceDelta: 0 },
          { label: 'Swahili Chapati Layers (2 pcs)', priceDelta: 50 },
        ],
      },
    ],
    dietary: ['Gluten Free Available', 'Halal Verified'],
    image: '/src/assets/images/food_claypot_stew_steam_1792636521301.jpg',
    isPopular: true,
    servingTime: '15 mins',
    originRegion: 'Ancestral Hearth Tradition',
  },
  {
    id: 'trad-tilapia-mrenda',
    name: 'Lake Victoria Whole Tilapia with Mrenda',
    swahiliName: 'Ngege wa Kukaanga na Mrenda',
    category: 'traditional',
    price: 750,
    description: 'Fresh freshwater whole tilapia crisp-fried in cold-pressed oil, served alongside a glistening bowl of traditional savory mrenda greens and dark millet ugali.',
    ingredients: ['Whole Lake Victoria Tilapia', 'Steamed Mrenda Greens', 'Brown Millet Ugali', 'Fresh Lemon'],
    variations: [
      {
        name: 'Fish Preparation',
        required: true,
        options: [
          { label: 'Deep Golden Crispy Fried (Ngege)', priceDelta: 0 },
          { label: 'Wet Fry Simmered with Tomatoes & Onions', priceDelta: 50 },
        ],
      },
    ],
    dietary: ['Omega-3 Rich', 'Gluten Free Available'],
    image: '/src/assets/images/food_lake_tilapia_splash_1792636520467.jpg',
    isPopular: true,
    servingTime: '20 mins',
    originRegion: 'Lake Victoria Shoreline',
  },
  {
    id: 'trad-matoke-stew',
    name: 'Highlands Matoke & Beef Stew',
    swahiliName: 'Matoke ya Ndizi na Nyama',
    category: 'traditional',
    price: 550,
    description: 'Green highland plantains gently simmered until fork-tender in a velvety stew of braised beef, sweet carrots, onions, and fresh coconut cream.',
    ingredients: ['Kisii Green Cooking Bananas (Matoke)', 'Braised Beef Cutlets', 'Coconut Milk', 'Sweet Carrots'],
    dietary: ['Nut Free', 'Rich in Potassium'],
    image: '/src/assets/images/food_claypot_stew_steam_1792636521301.jpg',
    isPopular: false,
    servingTime: '15 mins',
    originRegion: 'Kisii Highlands & Mount Kenya',
  },

  // =========================================================================
  // 3. MAIN COURSES (4 Dishes)
  // =========================================================================
  {
    id: 'main-swahili-pilau',
    name: 'Fragrant Swahili Beef Pilau',
    swahiliName: 'Pilau ya Nyama ya Ng\'ombe',
    category: 'main_courses',
    price: 450,
    description: 'Aromatic long-grain basmati rice browned with roasted whole cumin, green cardamom pods, cinnamon bark, cloves, and tender beef cuts. Served with spicy tomato kachumbari.',
    ingredients: ['Basmati Rice', 'Savanna Beef Cuts', 'Whole Spices (Cumin, Cardamom, Cinnamon)', 'Kachumbari'],
    variations: [
      {
        name: 'Accompaniment',
        options: [
          { label: 'Standard Kachumbari & Banana', priceDelta: 0 },
          { label: 'Add Extra Beef Stew Gravy', priceDelta: 100 },
        ],
      },
    ],
    dietary: ['Halal Verified', 'Gluten Free'],
    image: '/src/assets/images/food_swahili_pilau_beef_1792637971903.jpg',
    isPopular: true,
    servingTime: '12 mins',
    originRegion: 'Coast / Swahili Heritage',
  },
  {
    id: 'main-githeri-special',
    name: 'Hearth-Braised Special Githeri',
    swahiliName: 'Githeri Maalum cha Siagi na Mboga',
    category: 'main_courses',
    price: 400,
    description: 'Steamed green maize kernels and tender red kidney beans sautéed in butter, sweet onions, bell peppers, and fresh cilantro. Hearty and grounded in Kenyan tradition.',
    ingredients: ['Green Maize Kernels', 'Red Kidney Beans', 'Caramelized Onions', 'Bell Peppers', 'Fresh Coriander'],
    variations: [
      {
        name: 'Style',
        options: [
          { label: 'Fried Vegetarian with Avocado', priceDelta: 0 },
          { label: 'Enriched with Braised Beef Chunks', priceDelta: 150 },
        ],
      },
    ],
    dietary: ['High Fiber', 'Vegetarian Available'],
    image: '/src/assets/images/food_peanut_groundnut_soup_1792637972718.jpg',
    isVegetarian: true,
    servingTime: '12 mins',
    originRegion: 'Central Rift Agricultural Belt',
  },
  {
    id: 'main-coconut-maharage',
    name: 'Coastal Coconut Bean Maharage',
    swahiliName: 'Maharage ya Nazi na Chapati',
    category: 'main_courses',
    price: 450,
    description: 'Velvety red kidney beans slow-simmered in freshly extracted coastal coconut cream, cardamom, and fried garlic. Served with two warm layered chapatis.',
    ingredients: ['Red Kidney Beans', 'Fresh Coconut Milk', 'Cardamom', 'Layered Swahili Chapati'],
    variations: [
      {
        name: 'Starch Selection',
        options: [
          { label: '2 Layered Ghee Chapatis', priceDelta: 0 },
          { label: 'Fragrant Steamed Jasmine Rice', priceDelta: 0 },
        ],
      },
    ],
    dietary: ['Vegetarian', 'Dairy Free Available'],
    image: '/src/assets/images/food_flaky_chapati_1792637970628.jpg',
    isVegetarian: true,
    servingTime: '14 mins',
    originRegion: 'Mombasa / Diani Coastal Kitchens',
  },
  {
    id: 'main-omena-stew',
    name: 'Lake Victoria Sun-Dried Omena Stew',
    swahiliName: 'Omena wa Kukaanga na Maziwa Lala',
    category: 'main_courses',
    price: 450,
    description: 'Delicately fried silver cyprinid lake fish tossed in a rich onion, tomato, and garlic reduction with a touch of milk to soften. Served with millet ugali.',
    ingredients: ['Lake Victoria Omena', 'Sweet Tomatoes', 'Garlic', 'Brown Millet Ugali'],
    dietary: ['Calcium Rich', 'Omega-3', 'Gluten Free'],
    image: '/src/assets/images/dish_lakeside_tilapia_1792635389886.jpg',
    isPopular: false,
    servingTime: '15 mins',
    originRegion: 'Homa Bay / Kisumu Basin',
  },

  // =========================================================================
  // 4. GRILLED SPECIALTIES (4 Dishes)
  // =========================================================================
  {
    id: 'grilled-mbuzi-choma-1kg',
    name: 'Highlands Savanna Mbuzi Choma (1 kg Full Platter)',
    swahiliName: 'Mbuzi Choma Kilo Moja Kamili',
    category: 'grilled',
    price: 1850,
    description: 'A full kilogram of prime savanna goat cutlets and ribs, seared over glowing whistling thorn charcoal embers with sea salt crystals. Tender interior, crisp charred bark, served with ugali and fresh kachumbari.',
    ingredients: ['1 kg Prime Savanna Goat Meat', 'Natural Sea Salt Crystals', 'Acacia Charcoal Heat', 'Kachumbari'],
    variations: [
      {
        name: 'Doneness & Ribs Cut',
        required: true,
        options: [
          { label: 'Juicy Medium-Well with Ribs & Loin', priceDelta: 0 },
          { label: 'Well-Done Crispy Bark', priceDelta: 0 },
        ],
      },
      {
        name: 'Complimentary Starch',
        required: true,
        options: [
          { label: 'Brown Sorghum & Millet Ugali', priceDelta: 0 },
          { label: 'Traditional White Maize Ugali', priceDelta: 0 },
          { label: 'Layered Swahili Chapati (3 pcs)', priceDelta: 50 },
        ],
      },
    ],
    dietary: ['High Protein', 'Gluten Free', 'Zero Added Sugars'],
    image: '/src/assets/images/dish_mbuzi_choma_ugali_1792635389333.jpg',
    isPopular: true,
    servingTime: '22–25 mins',
    originRegion: 'Athi River Ranching Heartland',
  },
  {
    id: 'grilled-mbuzi-choma-half',
    name: 'Highlands Mbuzi Choma (Half Portion / Cutlets)',
    swahiliName: 'Mbuzi Choma Nusu Kilo',
    category: 'grilled',
    price: 850,
    description: 'Half kilogram of succulent Athi savanna goat ribs and cutlets seared to perfection over glowing embers. Paired with brown millet ugali, wild managu, and fresh tomato kachumbari.',
    ingredients: ['Half kg Savanna Goat Ribs', 'Brown Millet Ugali', 'Managu Greens', 'Kachumbari'],
    variations: [
      {
        name: 'Accompaniment Choice',
        options: [
          { label: 'Brown Millet Ugali · Managu', priceDelta: 0 },
          { label: 'Swahili Chapati · Managu', priceDelta: 50 },
        ],
      },
    ],
    dietary: ['High Protein', 'Gluten Free Available'],
    image: '/src/assets/images/food_mbuzi_choma_burst_1792636519294.jpg',
    isPopular: true,
    servingTime: '18 mins',
    originRegion: 'Athi River Plains',
  },
  {
    id: 'grilled-kuku-choma',
    name: 'Flame-Kissed Charcoal Kuku Choma',
    swahiliName: 'Kuku wa Kuchoma na Pili Pili',
    category: 'grilled',
    price: 750,
    description: 'Half chicken marinated in crushed garlic, ginger, and wild lime juice, then slowly roasted over acacia woodfire till smoky and golden. Served with roast potatoes and kachumbari.',
    ingredients: ['Half Marinated Chicken', 'Wild Lime & Garlic Rub', 'Roast Potatoes', 'Kachumbari Dip'],
    dietary: ['High Protein', 'Gluten Free'],
    image: '/src/assets/images/food_kienyeji_chicken_pot_1792636979366.jpg',
    isPopular: true,
    servingTime: '20 mins',
    originRegion: 'Athi Hearth Charcoal Grill',
  },
  {
    id: 'grilled-beef-ribs',
    name: 'Smoked Acacia Beef Short Ribs',
    swahiliName: 'Mbavu za Ng\'ombe za Kuchoma',
    category: 'grilled',
    price: 900,
    description: 'Thick beef short ribs glazed with tamarind and honey marinade, slow-smoked over seasoned acacia wood for 3 hours. Meat that falls right off the bone.',
    ingredients: ['Prime Beef Short Ribs', 'Tamarind-Honey Glaze', 'Acacia Smoke Bark', 'Brown Ugali'],
    dietary: ['Gluten Free', 'Halal Verified'],
    image: '/src/assets/images/food_mbuzi_choma_burst_1792636519294.jpg',
    isPopular: false,
    servingTime: '20 mins',
    originRegion: 'Savanna Smoker House',
  },

  // =========================================================================
  // 5. SIGNATURE PLATTERS (4 Dishes)
  // =========================================================================
  {
    id: 'platter-arcadia-safari',
    name: 'Arcadia Grand Safari Feast Platter (Serves 4)',
    swahiliName: 'Sinia Kubwa ya Safari ya Arcadia',
    category: 'platters',
    price: 3200,
    description: 'The definitive Roots & Pots experience: 1kg tender mbuzi choma, half roast kuku choma, two bowls of bone marrow soup, brown sorghum ugali, white ugali, sautéed managu, swahili chapati, and traditional kachumbari.',
    ingredients: ['1kg Savanna Mbuzi Choma', 'Half Roast Kuku', 'Bone Marrow Soup (x2)', 'Ugali Duo', 'Managu & Chapatis'],
    dietary: ['Feast for 4 Persons', 'High Protein'],
    image: '/src/assets/images/hero_african_claypot_feast_1792635387927.jpg',
    isPopular: true,
    servingTime: '25 mins',
    originRegion: 'Chef Signature Feast',
  },
  {
    id: 'platter-hearth-claypot',
    name: 'Hearth Trio Degustation Platter',
    swahiliName: 'Sinia ya Vyungu Vitatu vya Jadi',
    category: 'platters',
    price: 1850,
    description: 'A tasting trio presented in mini terracotta cauldrons: slow-simmered beef marrow stew, free-range kienyeji chicken, and coconut maharage. Accompanied by ugali and warm chapatis.',
    ingredients: ['Trio Clay Pots', 'Beef Marrow Stew', 'Kienyeji Chicken', 'Coconut Beans', 'Ugali & Chapati'],
    dietary: ['Gluten Free Available'],
    image: '/src/assets/images/food_claypot_stew_steam_1792636521301.jpg',
    isPopular: true,
    servingTime: '20 mins',
    originRegion: 'Arcadia Master Hearth',
  },
  {
    id: 'platter-lake-rangelands',
    name: 'Lake & Rangelands Duo Platter',
    swahiliName: 'Sinia ya Ziwa na Nyanda za Juu',
    category: 'platters',
    price: 1550,
    description: 'Crispy whole Lake Victoria tilapia paired with half portion savanna mbuzi choma, served with brown millet ugali, mrenda, managu, and fresh lime kachumbari.',
    ingredients: ['Whole Lake Tilapia', 'Mbuzi Choma Cuts', 'Brown Millet Ugali', 'Mrenda & Managu'],
    dietary: ['High Protein', 'Rich Omega-3'],
    image: '/src/assets/images/food_lake_tilapia_splash_1792636520467.jpg',
    isPopular: true,
    servingTime: '22 mins',
    originRegion: 'Luo Lake & Maasai Savanna Union',
  },
  {
    id: 'platter-kraal-family',
    name: 'Executive Kraal Family Banquet (Serves 6–8)',
    swahiliName: 'Karamu Kuu ya Familia ya Kraal',
    category: 'platters',
    price: 5400,
    description: 'Reserved for private kraal suites and celebratory tables: 2kg Mbuzi Choma, full Kienyeji Chicken stew, four claypot soups, assorted ugali and starches, and 1L traditional Mursik gourd.',
    ingredients: ['2kg Mbuzi Choma', 'Whole Kienyeji Chicken', '4 Soups', '1L Smoked Mursik', 'Assorted Starches'],
    dietary: ['Grand Banquet for 6-8'],
    image: '/src/assets/images/ambiance_bistro_interior_1792635389767.jpg',
    isPopular: false,
    servingTime: '30 mins',
    originRegion: 'Executive Kraal Tradition',
  },

  // =========================================================================
  // 6. VEGETARIAN OPTIONS (3 Dishes)
  // =========================================================================
  {
    id: 'veg-managu-ugali',
    name: 'Organic Sautéed Managu & Brown Ugali',
    swahiliName: 'Mboga za Managu na Ugali wa Wimbi',
    category: 'vegetarian',
    price: 350,
    description: 'Freshly harvested African nightshade (managu) leaves steam-sautéed in cold-pressed oil, onions, and mild sea salt. Served with mineral-rich brown sorghum and millet ugali.',
    ingredients: ['Indigenous Managu Leaves', 'Sweet Red Onions', 'Brown Sorghum & Millet Meal'],
    dietary: ['100% Vegan', 'Gluten Free', 'High Antioxidants'],
    image: '/src/assets/images/food_managu_greens_1792636979211.jpg',
    isVegetarian: true,
    servingTime: '12 mins',
    originRegion: 'Central Highlands Organic Smallholders',
  },
  {
    id: 'veg-nduma-ngwaci',
    name: 'Steamed Nduma & Ngwaci Roots Platter',
    swahiliName: 'Mizizi ya Nduma na Ngwaci',
    category: 'vegetarian',
    price: 350,
    description: 'Tender volcanic arrowroots (nduma) and purple-skin sweet potatoes (ngwaci) steamed with rock salt. Perfect morning or evening comforting carbohydrate source.',
    ingredients: ['Tender Arrowroots (Nduma)', 'Sweet Potatoes (Ngwaci)', 'Rock Salt'],
    dietary: ['100% Vegan', 'Gluten Free', 'Low Glycemic Index'],
    image: '/src/assets/images/food_nduma_arrowroots_1792638212055.jpg',
    isVegetarian: true,
    servingTime: '10 mins',
    originRegion: 'Mount Kenya Volcanic Slopes',
  },
  {
    id: 'veg-terere-mrenda-duo',
    name: 'Indigenous Greens Platter (Terere & Mrenda)',
    swahiliName: 'Mboga za Jadi Mchanganyiko',
    category: 'vegetarian',
    price: 300,
    description: 'A nutrient-dense pairing of sautéed wild amaranth (terere) and slippery, vitamin-rich jute mallow (mrenda), prepared with light garlic and shallots.',
    ingredients: ['Wild Amaranth (Terere)', 'Jute Mallow (Mrenda)', 'Shallots', 'Cold Pressed Oil'],
    dietary: ['100% Vegan', 'High Iron', 'Gluten Free'],
    image: '/src/assets/images/food_managu_greens_1792636979211.jpg',
    isVegetarian: true,
    servingTime: '12 mins',
    originRegion: 'Western Smallholder Cooperatives',
  },

  // =========================================================================
  // 7. DESSERTS (2 Dishes)
  // =========================================================================
  {
    id: 'dessert-mahamri-cardamom',
    name: 'Warm Coastal Mahamri with Coconut Dip',
    swahiliName: 'Mahamri ya Nazi na Hiliki',
    category: 'desserts',
    price: 200,
    description: 'Golden triangular yeast pastries infused with crushed green cardamom and sweet coconut milk, freshly fried and dusted with raw sugar. Served with warm spiced coconut sauce.',
    ingredients: ['Flour', 'Coconut Milk', 'Green Cardamom', 'Yeast', 'Spiced Coconut Dip'],
    dietary: ['Vegetarian', 'Nut Free'],
    image: '/src/assets/images/food_mahamri_chai_pour_1792636522226.jpg',
    isPopular: true,
    servingTime: '8 mins',
    originRegion: 'Old Town Mombasa Bakeries',
  },
  {
    id: 'dessert-honeycomb-fruit',
    name: 'Savanna Wild Honeycomb & Tropical Fruit',
    swahiliName: 'Asali Mbichi ya Nyuki na Matunda',
    category: 'desserts',
    price: 300,
    description: 'Raw Athi acacia honeycomb chunk served over chilled slices of sweet coastal mango, ripe pawpaw, and tangy passion fruit with fresh mint.',
    ingredients: ['Raw Acacia Honeycomb', 'Coastal Mango', 'Ripe Pawpaw', 'Fresh Passionfruit'],
    dietary: ['Vegetarian', 'Gluten Free', 'Raw Whole Food'],
    image: '/src/assets/images/food_kachumbari_salad_1792636978736.jpg',
    isPopular: false,
    servingTime: '8 mins',
    originRegion: 'Athi Savanna Apiaries',
  },

  // =========================================================================
  // 8. NATURAL DRINKS & ELIXIRS (3 Dishes)
  // =========================================================================
  {
    id: 'drink-mursik-gourd',
    name: 'Traditional Kalenjin Mursik (1L Smoked Gourd)',
    swahiliName: 'Mursik wa Kibuyu cha Jadi 1L',
    category: 'drinks',
    price: 450,
    description: 'Authentic fermented whole cow milk aged inside a soot-treated smoked sotet gourd seasoned with charcoal from the Senetwet tree. Thick, probiotic-rich, with unmistakable smoky depth.',
    ingredients: ['Full Cream Milk', 'Senetwet Wood Charcoal Smoke Essence', 'Natural Culture'],
    dietary: ['Probiotic Rich', 'Gluten Free', 'Vegetarian'],
    image: '/src/assets/images/food_mursik_gourd_1792636981986.jpg',
    isPopular: true,
    servingTime: '5 mins',
    originRegion: 'Rift Valley Gourd Masters',
  },
  {
    id: 'drink-dawa-ginger',
    name: 'Hot Lemon & Ginger Dawa Elixir',
    swahiliName: 'Dawa ya Tangawizi, Ndimu na Asali',
    category: 'drinks',
    price: 200,
    description: 'Fresh crushed ginger root, whole wild lime wedges, and raw unheated Athi acacia honey brewed in simmering spring water. Invigorates and cleanses the palate.',
    ingredients: ['Crushed Ginger Root', 'Fresh Limes', 'Raw Acacia Honey', 'Spring Water'],
    dietary: ['Immunity Booster', '100% Natural', 'Gluten Free'],
    image: '/src/assets/images/food_dawa_drink_1792638224031.jpg',
    isPopular: true,
    servingTime: '5 mins',
    originRegion: 'Nairobi & Coast Wellness Culture',
  },
  {
    id: 'drink-tamarind-ukwaju',
    name: 'Chilled Tamarind Juice (Ukwaju) 1L',
    swahiliName: 'Juisi ya Ukwaju wa Asili 1L',
    category: 'drinks',
    price: 400,
    description: 'Tangy-sweet coastal tamarind pod extract infused with crushed cloves and raw cane sugar, chilled over ice. Wonderfully refreshing alongside rich roasted meats.',
    ingredients: ['Ripe Coastal Tamarind Pods', 'Whole Cloves', 'Raw Cane Sugar', 'Spring Water'],
    dietary: ['100% Vegan', 'Gluten Free', 'Natural Electrolytes'],
    image: '/src/assets/images/food_tamarind_ukwaju_drink_1792637971583.jpg',
    isPopular: true,
    servingTime: '5 mins',
    originRegion: 'Kilifi & Malindi Groves',
  },
];
