import { useState, useEffect, useRef } from "react";

// ─── PALETTE & CATEGORY CONFIG ────────────────────────────────────
const CAT = {
  rest:     { color: "#8B8B8B", bg: "#F5F5F5", label: "Rest" },
  inject:   { color: "#00897B", bg: "#E0F2F1", label: "Injection" },
  redlight: { color: "#E53935", bg: "#FFEBEE", label: "Red Light" },
  skincare: { color: "#C2185B", bg: "#FCE4EC", label: "Skincare" },
  supps:    { color: "#827717", bg: "#F9FBE7", label: "Supplements" },
  shop:     { color: "#283593", bg: "#E8EAF6", label: "Shopping" },
  thaw:     { color: "#00695C", bg: "#E0F2F1", label: "Thaw" },
  meal:     { color: "#E65100", bg: "#FFF3E0", label: "Meal" },
  prep:     { color: "#37474F", bg: "#ECEFF1", label: "Meal Prep" },
  sleep:    { color: "#283593", bg: "#E8EAF6", label: "Sleep" },
  workout:  { color: "#6B21A8", bg: "#F3E8FF", label: "Yoga" },
  strength: { color: "#1565C0", bg: "#E3F2FD", label: "Strength" },
  outdoor:  { color: "#2E7D32", bg: "#E8F5E9", label: "Outdoor" },
  yin:      { color: "#6B21A8", bg: "#F3E8FF", label: "Yin Yoga" },
};

// ─── FULL WEEK DATA ───────────────────────────────────────────────
const WEEK = {
  Sunday: {
    subtitle: "Active Rest · Shop · Prep · Microneedling",
    tag: "rest",
    items: [
      { time: "6:30 AM", label: "Wake + water", detail: "20–32 oz with electrolytes before anything else", cat: "rest" },
      { time: "6:35 AM", label: "Iron Blood tincture", detail: "Empty stomach · 2+ hrs before Cal/Mag/Zinc drops · Mix in water with vitamin C", cat: "supps", note: "Calcium blocks iron absorption — spacing Iron at 6:35 AM and Cal/Mag/Zinc with morning supplements keeps them safely separated." },

      { time: "6:45 AM", label: "Zepbound injection", detail: "SubQ abdomen or thigh — weekly dose · Rotate sites · Take same day each week", cat: "inject", note: "Tirzepatide peaks in appetite suppression 24–72 hrs post-injection — Sunday timing means strongest effect Mon–Wed when meal prep is fresh" },
      { time: "6:45 AM", label: "Red light mask", detail: "10–15 min — AM ideal on rest days (circadian reset)", cat: "redlight" },
      { time: "7:00 AM", label: "AM skincare", detail: "Water cleanse → HA → niacinamide 5% → peptide complex → Curenex rejuvenatic → SPF50", cat: "skincare" },
      { time: "7:15 AM", label: "Gentle movement", detail: "Easy walk 15–20 min, or restorative yoga — no intensity", cat: "rest" },
      { time: "7:35 AM", label: "Gua sha — SKIP today", detail: "Do not do gua sha on microneedling day — wait 48 hrs post-needling", cat: "skincare" },
      { time: "8:00 AM", label: "Morning supplements", detail: "Testosterone · Progesterone · B12 sublingual · Vitamin D liquid · Cal/Mag/Zinc+D3 drops · Red Maca · Tribulus · Collagen · Protein · Creatine · Omega-3s · CoQ10 · Urolithin A", cat: "supps", note: "Take all fat-soluble supplements (D, CoQ10, omega-3s, urolithin A) with food containing fat" },
      { time: "8:00 AM", label: "NAD+ (Sun — 1 of 3x/wk)", detail: "Take with morning food — earlier timing avoids sleep interference", cat: "supps" },
      { time: "9:30 AM", label: "Shop 1: Grocery run", detail: "Proteins + hardy produce + dairy. Buy firm avocados — ripen on counter.", cat: "shop", instacart: "shop1" },
      { time: "11:00 AM", label: "Freezer portioning", detail: "Ground turkey → 2 bags · Wild salmon → vacuum seal · Chicken thighs → freeze 1 lb, fridge 1 lb · Açaí + berries → freezer", cat: "thaw" },
      { time: "11:30 AM", label: "Fridge org + thaw setup", detail: "Move salmon bag 1 to fridge shelf (for Mon/Tue) · Label everything with day", cat: "thaw" },
      { time: "12:00 PM", label: "Meal 1 — Protein forward", detail: "Salmon bowl or egg scramble · Greek yogurt + berries · Avocado · Cucumber · Arugula · Olive oil · Bone broth to sip", cat: "meal" },
      { time: "1:00 PM", label: "Batch cook proteins", detail: "Bake chicken thighs (turmeric/cumin, 400°F 35 min) · Roast sweet potatoes x2 (425°F 45 min)", cat: "prep" },
      { time: "1:45 PM", label: "Batch cook grains + veg", detail: "Cook red lentils (20 min) · Roast carrots + fennel (400°F 25 min) · Hard boil 6 eggs for week", cat: "prep" },
      { time: "2:15 PM", label: "Sauce + assembly", detail: "Mix tahini sauce · Portion containers: protein + veg + grain for Mon/Tue/Wed lunches", cat: "prep" },
      { time: "2:45 PM", label: "Stock check", detail: "Confirm pantry stocked · Fill water bottles · Set out Wed grocery list", cat: "prep" },
      { time: "3:30 PM", label: "Meal 2 — Balanced", detail: "Batch chicken + roasted veg + lentils + tahini + arugula", cat: "meal" },
      { time: "4:00 PM", label: "Glutathione injection", detail: "SubQ — can stack with Sermorelin or split AM/PM", cat: "inject" },
      { time: "5:00 PM", label: "Microneedling prep", detail: "Wash hands · Cleanse with Curenex cleanser · Pat dry — no actives", cat: "skincare" },
      { time: "5:10 PM", label: "Numbing (optional)", detail: "Apply topical numbing cream if using · Wait 20–30 min · Wipe off completely before needling", cat: "skincare" },
      { time: "5:40 PM", label: "At-home microneedling + PDRN/HA", detail: "20–30 min session", cat: "skincare", note: "Apply PDRN serum by zone · Needle each zone (forehead, cheeks, chin, neck) — light pressure, overlapping passes · Apply HA booster mid-session or immediately after · Depth: 0.25–0.5mm · Avoid eye area, active blemishes, lips" },
      { time: "6:10 PM", label: "Post-needling recovery skincare", detail: "PDRN/HA serum pressed in gently · Curenex rejuvenating cream — generous layer · NO tretinoin · NO niacinamide · NO vitamin C · NO exfoliants", cat: "skincare", note: "Skin will be red/flushed for 1–4 hrs — normal. Sleep on clean pillowcase." },
      { time: "6:30 PM", label: "Meal 3 — Light + protein", detail: "Grass-fed flank steak (3 min/side) + roasted fennel + cauliflower rice + olive oil · OR: tuna + cucumber + white miso", cat: "meal" },
      { time: "7:30 PM", label: "PM skincare (post-needling)", detail: "Gentle rinse · HA · Curenex rejuvenating cream · NO tretinoin tonight", cat: "skincare", note: "Resume full PM routine (tretinoin etc.) Monday night — 48 hrs post-needling minimum" },
      { time: "8:00 PM", label: "Eating window closes", detail: "Last food by 8 PM — Sermorelin needs 2-hr empty stomach before bed", cat: "meal" },
      { time: "8:30 PM", label: "Thaw check", detail: "Move turkey bag 2 to fridge for Tuesday · Confirm salmon thawing for Mon/Tue", cat: "thaw" },
      { time: "9:30 PM", label: "Before-bed supplements", detail: "Magnesium glycinate · Melatonin (if needed)", cat: "sleep" },
      { time: "10:00 PM", label: "Sermorelin injection", detail: "SubQ abdomen — 2+ hrs after last food (window closes 8 PM) · Before-bed timing amplifies nocturnal GH pulse", cat: "inject" },
      { time: "10:30 PM", label: "Sleep", detail: "7–9 hrs — Sermorelin, NAD+, urolithin A do repair work now", cat: "sleep" },
    ]
  },
  Monday: {
    subtitle: "Power Yoga",
    tag: "workout",
    items: [
      { time: "6:30 AM", label: "Wake + water", detail: "20–32 oz water", cat: "rest" },
      { time: "6:35 AM", label: "Iron Blood tincture", detail: "Empty stomach · 2+ hrs before Cal/Mag/Zinc drops · Mix in water with vitamin C", cat: "supps", note: "Calcium blocks iron absorption — spacing Iron at 6:35 AM and Cal/Mag/Zinc with morning supplements keeps them safely separated." },

      { time: "6:40 AM", label: "Red light mask", detail: "10–15 min BEFORE yoga — AM circadian benefit highest on yoga days", cat: "redlight" },
      { time: "6:55 AM", label: "AM skincare", detail: "Water cleanse → HA → niacinamide 5% → peptide complex → Curenex rejuvenatic → SPF50", cat: "skincare" },
      { time: "7:10 AM – 7:55 AM", label: "Power yoga", detail: "45 min", cat: "workout", note: "Cat-cow + thread the needle (2 min) · Sun salutation A x3 (5 min) · Power flow: Warrior I > II > A (8 min) · Final pose holds x4 (4 min) · Crow pose / arm balance (6 min) · Boat pose + navasana pulses (4 min) · Plank > chaturanga > updog > down dog x6 (5 min) · Pigeon each side (4 min each) · Supine twist + savasana (5 min)" },
      { time: "8:00 AM", label: "Morning supplements", detail: "Testosterone · Progesterone · B12 sublingual · Vitamin D liquid · Cal/Mag/Zinc+D3 drops · Red Maca · Tribulus · Collagen · Protein · Creatine · Omega-3s · CoQ10 · Urolithin A", cat: "supps" },
      { time: "8:15 AM", label: "Glutathione injection", detail: "SubQ post-workout", cat: "inject" },
      { time: "12:00 PM", label: "Meal 1 — Protein forward", detail: "Wild smoked salmon + arugula + cucumber + avocado · Olive oil + capers + lemon · Bone broth", cat: "meal" },
      { time: "3:30 PM", label: "Meal 2 — Balanced", detail: "Batch chicken + roasted veg + lentils + tahini + greens (from Sunday prep)", cat: "meal" },
      { time: "6:30 PM", label: "Meal 3 — Light + protein", detail: "Salmon fillet pan-seared + large salad + cottage cheese + olive oil", cat: "meal" },
      { time: "7:30 PM", label: "PM skincare", detail: "Curenex cleanser → HA → Curenex rejuvenating cream → Rx tretinoin", cat: "skincare" },
      { time: "8:00 PM", label: "Eating window closes", detail: "Last food by 8 PM", cat: "meal" },
      { time: "8:30 PM", label: "Thaw check", detail: "Confirm turkey bag 2 thawing · Move chicken thighs forward in fridge", cat: "thaw" },
      { time: "9:30 PM", label: "Before-bed supplements", detail: "Magnesium glycinate · Melatonin if needed", cat: "sleep" },
      { time: "10:00 PM", label: "Sermorelin injection", detail: "SubQ abdomen — 2+ hrs after last food · Amplifies nocturnal GH pulse", cat: "inject" },
      { time: "10:30 PM", label: "Sleep", detail: "7–9 hrs", cat: "sleep" },
    ]
  },
  Tuesday: {
    subtitle: "Bodyweight Strength",
    tag: "strength",
    items: [
      { time: "6:30 AM", label: "Wake + water", detail: "20–32 oz water", cat: "rest" },
      { time: "6:35 AM", label: "Iron Blood tincture", detail: "Empty stomach · 2+ hrs before Cal/Mag/Zinc drops · Mix in water with vitamin C", cat: "supps", note: "Calcium blocks iron absorption — spacing Iron at 6:35 AM and Cal/Mag/Zinc with morning supplements keeps them safely separated." },

      { time: "6:45 AM", label: "AM skincare", detail: "Water cleanse → HA → niacinamide 5% → peptide complex → Curenex rejuvenatic → SPF50", cat: "skincare", note: "Skip red light pre-workout — doing post-session for muscle recovery" },
      { time: "7:00 AM – 7:55 AM", label: "Bodyweight strength", detail: "45–50 min", cat: "strength", note: "Activation: Glute bridges x20 · Dead bugs x10 each side | Circuit x3 rounds: Push-up variations (wide/narrow/diamond) 3x12 · Single-leg Romanian deadlift 3x10 each (slow eccentric) · Pike push-ups 3x10 · Reverse lunges + knee drive 3x12 each · Bear crawl + plank shoulder taps 3x30s | Core: Hollow body hold 3x20s · Side plank + hip dip 3x15 · V-ups 3x12" },
      { time: "7:55 AM", label: "Post-workout protein — within 30 min", detail: "Protein shake (30–40g) or Greek yogurt + collagen — DO NOT wait for noon window", cat: "supps", note: "On Zepbound, GLP-1 suppresses appetite signals — manual protein timing is essential for muscle retention" },
      { time: "8:10 AM", label: "Red light mask", detail: "10–15 min post-session — stronger for muscle recovery on strength days", cat: "redlight" },
      { time: "8:25 AM", label: "Morning supplements", detail: "Testosterone · Progesterone · B12 sublingual · Vitamin D liquid · Cal/Mag/Zinc+D3 drops · Red Maca · Tribulus · Omega-3s · CoQ10 · Urolithin A · Creatine", cat: "supps" },
      { time: "8:35 AM", label: "Glutathione injection", detail: "SubQ", cat: "inject" },
      { time: "8:35 AM", label: "NAD+ (Tue — 2 of 3x/wk)", detail: "Take with food", cat: "supps" },
      { time: "12:00 PM", label: "Meal 1 — Protein forward", detail: "Greek yogurt bowl + berries + granola · OR: 3 eggs + chicken + spinach · Avocado · Bone broth", cat: "meal" },
      { time: "3:30 PM", label: "Meal 2 — Balanced", detail: "Batch chicken or turkey + sweet potato + greens + tahini + olive oil", cat: "meal" },
      { time: "6:30 PM", label: "Meal 3 — Light + protein", detail: "Wild albacore tuna + large salad + cucumber + fennel + capers + olive oil + lemon", cat: "meal" },
      { time: "7:30 PM", label: "PM skincare", detail: "Curenex cleanser → HA → Curenex rejuvenating cream → Rx tretinoin", cat: "skincare" },
      { time: "8:00 PM", label: "Eating window closes", detail: "", cat: "meal" },
      { time: "8:30 PM", label: "Thaw check", detail: "Move chicken thighs to fridge for Thursday soup", cat: "thaw" },
      { time: "9:30 PM", label: "Before-bed supplements", detail: "Magnesium glycinate · Melatonin if needed", cat: "sleep" },
      { time: "10:30 PM", label: "Sleep", detail: "100+ oz water today — creatine + strength demand", cat: "sleep" },
    ]
  },
  Wednesday: {
    subtitle: "Outdoor Walk + Flow · Shop 2",
    tag: "outdoor",
    items: [
      { time: "6:30 AM", label: "Wake + water", detail: "20–32 oz water", cat: "rest" },
      { time: "6:35 AM", label: "Iron Blood tincture", detail: "Empty stomach · 2+ hrs before Cal/Mag/Zinc drops · Mix in water with vitamin C", cat: "supps", note: "Calcium blocks iron absorption — spacing Iron at 6:35 AM and Cal/Mag/Zinc with morning supplements keeps them safely separated." },

      { time: "6:40 AM", label: "Red light mask", detail: "10–15 min before outdoor session — AM ideal on flow days", cat: "redlight" },
      { time: "6:55 AM", label: "AM skincare", detail: "Water cleanse → HA → niacinamide 5% → peptide complex → Curenex rejuvenatic → SPF50 (essential — outdoor)", cat: "skincare" },
      { time: "7:10 AM – 8:10 AM", label: "Outdoor walk + flow", detail: "45–60 min", cat: "outdoor", note: "Walk: varied terrain/inclines 20–30 min · HR 100–130 bpm zone 2 · barefoot on grass · Zone 2 amplifies Sermorelin GH release — hit the target, do not exceed it | Flow: Standing outdoor flow (8 min) · Balance sequence: tree > warrior III > half moon (8 min) · Low lunge flow + hip flexor work (6 min) · Down dog walk-outs + hamstring stretch (5 min) · Box breathing 4-7-8 (5 min)" },
      { time: "8:20 AM", label: "Morning supplements", detail: "Testosterone · Progesterone · B12 sublingual · Vitamin D liquid · Cal/Mag/Zinc+D3 drops · Red Maca · Tribulus · Collagen · Protein · Creatine · Omega-3s · CoQ10 · Urolithin A", cat: "supps" },
      { time: "8:20 AM", label: "NAD+ (Wed — 3 of 3x/wk)", detail: "Take with morning food — earlier timing avoids sleep interference", cat: "supps" },
      { time: "8:30 AM", label: "Glutathione injection", detail: "SubQ", cat: "inject" },
      { time: "9:30 AM", label: "Shop 2: Soft produce run", detail: "After walk, before noon", cat: "shop", instacart: "shop2", note: "Fridge is 30–40% emptier by Wed — soft produce slots right in" },
      { time: "12:00 PM", label: "Meal 1 — Balanced", detail: "3 eggs + broccolini + cherry tomatoes · OR: tuna + butter lettuce + avocado + red pepper · Fresh herbs · Apple or berries", cat: "meal" },
      { time: "3:30 PM", label: "Meal 2 — Balanced", detail: "Batch chicken/turkey + new greens + sweet potato + tahini", cat: "meal" },
      { time: "6:30 PM", label: "Meal 3 — Light + protein", detail: "Grass-fed flank steak + zucchini + mushrooms + arugula + olive oil", cat: "meal" },
      { time: "7:30 PM", label: "PM skincare", detail: "Curenex cleanser → HA → Curenex rejuvenating cream → Rx tretinoin", cat: "skincare" },
      { time: "8:00 PM", label: "Eating window closes", detail: "", cat: "meal" },
      { time: "8:30 PM", label: "Thaw check", detail: "Move chicken thighs bag from freezer to fridge for Thursday", cat: "thaw" },
      { time: "9:30 PM", label: "Before-bed supplements", detail: "Magnesium glycinate · Melatonin if needed", cat: "sleep" },
      { time: "10:00 PM", label: "Sermorelin injection", detail: "SubQ abdomen — 2+ hrs after last food · Amplifies nocturnal GH pulse", cat: "inject" },
      { time: "10:30 PM", label: "Sleep", detail: "", cat: "sleep" },
    ]
  },
  Thursday: {
    subtitle: "Yin Yoga — protect this day",
    tag: "yin",
    items: [
      { time: "6:30 AM", label: "Wake + water", detail: "20–32 oz water", cat: "rest" },
      { time: "6:35 AM", label: "Iron Blood tincture", detail: "Empty stomach · 2+ hrs before Cal/Mag/Zinc drops · Mix in water with vitamin C", cat: "supps", note: "Calcium blocks iron absorption — spacing Iron at 6:35 AM and Cal/Mag/Zinc with morning supplements keeps them safely separated." },

      { time: "6:35 AM", label: "Sermorelin injection", detail: "SubQ abdomen", cat: "inject" },
      { time: "6:45 AM", label: "Red light mask", detail: "10–15 min — AM ideal on yin days (circadian + anti-inflammatory)", cat: "redlight" },
      { time: "7:00 AM", label: "AM skincare", detail: "Water cleanse → HA → niacinamide 5% → peptide complex → Curenex rejuvenatic → SPF50", cat: "skincare" },
      { time: "7:10 AM", label: "Gua sha", detail: "On moisturized skin before SPF — yin days are ideal (low cortisol, good circulation)", cat: "skincare" },
      { time: "7:20 AM – 8:05 AM", label: "Yin yoga", detail: "45 min", cat: "yin", note: "Baddha konasana (4 min) · Dragon pose each side (4 min each) · Sleeping swan / yin pigeon each side (4 min each) · Shoelace pose each side (3 min each) · Sphinx / seal backbend (4 min) · Twisted roots supine spiral each side (3 min each) · Melting heart / anahatasana (3 min) · Savasana + body scan (5 min) | Hold poses longer not shorter. Especially protective 48–72 hrs post filler or microneedling." },
      { time: "8:10 AM", label: "Morning supplements", detail: "Testosterone · Progesterone · B12 sublingual · Vitamin D liquid · Cal/Mag/Zinc+D3 drops · Red Maca · Tribulus · Collagen · Protein · Creatine · Omega-3s · CoQ10 · Urolithin A", cat: "supps" },
      { time: "8:10 AM", label: "NAD+ (Sat — optional, check prescriber)", detail: "Take with morning food — earlier timing avoids sleep interference", cat: "supps" },
      { time: "8:20 AM", label: "Glutathione injection", detail: "SubQ", cat: "inject" },
      { time: "12:00 PM", label: "Meal 1 — Light + protein", detail: "Salmon or chicken + arugula/spinach + cherry tomatoes + red pepper + olive oil + lemon · Sheep's milk or cottage cheese · White miso dressing", cat: "meal" },
      { time: "3:30 PM", label: "Meal 2 — Balanced", detail: "Lentils + roasted veg + kale + avocado + tahini + fresh herbs", cat: "meal" },
      { time: "6:30 PM", label: "Meal 3 — Light + protein", detail: "Chicken bone broth soup (thighs + celery + carrot + miso) + sourdough slice", cat: "meal" },
      { time: "7:30 PM", label: "PM skincare", detail: "Curenex cleanser → HA → Curenex rejuvenating cream → Rx tretinoin", cat: "skincare", note: "If quarterly botox/filler this week: skip tretinoin night-of and 48 hrs post-procedure" },
      { time: "8:00 PM", label: "Eating window closes", detail: "", cat: "meal" },
      { time: "8:30 PM", label: "Thaw check", detail: "Confirm Friday protein ready — salmon or turkey to fridge", cat: "thaw" },
      { time: "9:30 PM", label: "Before-bed supplements", detail: "Magnesium glycinate · Melatonin if needed", cat: "sleep" },
      { time: "10:00 PM", label: "Sermorelin injection", detail: "SubQ abdomen — 2+ hrs after last food · Amplifies nocturnal GH pulse", cat: "inject" },
      { time: "10:30 PM", label: "Sleep", detail: "", cat: "sleep" },
    ]
  },
  Friday: {
    subtitle: "Bodyweight Strength — glutes + posterior chain",
    tag: "strength",
    items: [
      { time: "6:30 AM", label: "Wake + water", detail: "20–32 oz water", cat: "rest" },
      { time: "6:35 AM", label: "Iron Blood tincture", detail: "Empty stomach · 2+ hrs before Cal/Mag/Zinc drops · Mix in water with vitamin C", cat: "supps", note: "Calcium blocks iron absorption — spacing Iron at 6:35 AM and Cal/Mag/Zinc with morning supplements keeps them safely separated." },

      { time: "6:45 AM", label: "AM skincare", detail: "Water cleanse → HA → niacinamide 5% → peptide complex → Curenex rejuvenatic → SPF50", cat: "skincare", note: "Skip red light pre-workout — post-session for muscle recovery" },
      { time: "7:00 AM – 7:55 AM", label: "Bodyweight strength", detail: "45–55 min", cat: "strength", note: "Activation: World's greatest stretch (3 min) · Hip circles + ankle mobility (2 min) | Circuit x3 rounds: Bulgarian split squats off box 3x10 each · Tricep dips off seat 3x12 · Step-up with knee drive 3x10 each · Decline push-ups (feet elevated) 3x10 · Counter-edge pulse 3x15 · Romanian deadlift or single-leg DL 3x8 each (slow, controlled) | Core: Plank to downdog flow 3x8 · Russian twists 3x20 · Leg raises 3x12" },
      { time: "8:00 AM", label: "Post-workout protein — within 30 min", detail: "Protein shake (30–40g) or Greek yogurt + collagen — do NOT wait for noon window", cat: "supps", note: "Same rule as Tuesday — GLP-1 blunts hunger signals so manual timing matters" },
      { time: "8:10 AM", label: "Red light mask", detail: "10–15 min post-session — muscle recovery on strength days", cat: "redlight" },
      { time: "8:25 AM", label: "Morning supplements", detail: "Testosterone · Progesterone · B12 sublingual · Vitamin D liquid · Cal/Mag/Zinc+D3 drops · Red Maca · Tribulus · Omega-3s · CoQ10 · Urolithin A · Creatine", cat: "supps" },
      { time: "8:35 AM", label: "Glutathione injection", detail: "SubQ", cat: "inject" },
      { time: "12:00 PM", label: "Meal 1 — Protein forward", detail: "Chicken or salmon + spinach + mushrooms + avocado + cherry tomatoes + olive oil · Bone broth", cat: "meal" },
      { time: "3:30 PM", label: "Meal 2 — Balanced", detail: "Ground turkey + zucchini + kale + chickpeas + coconut aminos + cauliflower rice", cat: "meal" },
      { time: "6:30 PM", label: "Meal 3 — Light + protein", detail: "Wild salmon fillet + large salad + snap peas + cucumber + olive oil + everything bagel", cat: "meal" },
      { time: "7:30 PM", label: "PM skincare", detail: "Curenex cleanser → HA → Curenex rejuvenating cream → Rx tretinoin", cat: "skincare" },
      { time: "8:00 PM", label: "Eating window closes", detail: "", cat: "meal" },
      { time: "9:30 PM", label: "Before-bed supplements", detail: "Magnesium glycinate · Melatonin if needed", cat: "sleep" },
      { time: "10:00 PM", label: "Sermorelin injection", detail: "SubQ abdomen — 2+ hrs after last food · Amplifies nocturnal GH pulse", cat: "inject" },
      { time: "10:30 PM", label: "Sleep", detail: "100+ oz water today — creatine demand", cat: "sleep" },
    ]
  },
  Saturday: {
    subtitle: "Outdoor + Yoga — longest session",
    tag: "outdoor",
    items: [
      { time: "6:30 AM", label: "Wake + water", detail: "20–32 oz water", cat: "rest" },
      { time: "6:35 AM", label: "Iron Blood tincture", detail: "Empty stomach · 2+ hrs before Cal/Mag/Zinc drops · Mix in water with vitamin C", cat: "supps", note: "Calcium blocks iron absorption — spacing Iron at 6:35 AM and Cal/Mag/Zinc with morning supplements keeps them safely separated." },

      { time: "6:45 AM", label: "Red light mask (optional)", detail: "10 min — AM fine on outdoor/yoga days", cat: "redlight" },
      { time: "6:55 AM", label: "AM skincare", detail: "Water cleanse → HA → niacinamide 5% → peptide complex → Curenex rejuvenatic → SPF50 — essential outdoor", cat: "skincare" },
      { time: "7:10 AM – 8:05 AM", label: "Outdoor yoga + movement", detail: "60+ min", cat: "outdoor", note: "Yoga first (cooler muscles = better flexibility): Sun salutation 5x3 + flow (8 min) · Bodyweight circuit at park if available: bench dips, step-ups, push-ups on grass (8 min) · Floor sequence: bridge, wheel, twists (8 min) | Then movement: Longer walk, hike, or light jog 20–30 min — explore a new park or trail each week" },
      { time: "8:10 AM", label: "Morning supplements", detail: "Testosterone · Progesterone · B12 sublingual · Vitamin D liquid · Cal/Mag/Zinc+D3 drops · Red Maca · Tribulus · Collagen · Protein · Creatine · Omega-3s · CoQ10 · Urolithin A", cat: "supps" },
      { time: "8:10 AM", label: "NAD+ (Sat — optional, check prescriber)", detail: "Take with morning food — earlier timing avoids sleep interference", cat: "supps" },
      { time: "8:20 AM", label: "Glutathione injection", detail: "SubQ", cat: "inject" },
      { time: "12:00 PM", label: "Meal 1 — Protein forward", detail: "Ground turkey (cumin/turmeric) + red lentils + kale + red pepper + cherry tomatoes + avocado + tahini + fresh herbs", cat: "meal" },
      { time: "3:30 PM", label: "Meal 2 — Balanced", detail: "Chickpea bowl + roasted veg + mango + fresh greens + olive oil", cat: "meal" },
      { time: "6:30 PM", label: "Meal 3 — Light + protein", detail: "Grass-fed flank steak OR eggs + large salad + fermented food + omega-3 fats", cat: "meal" },
      { time: "7:00 PM", label: "PM skincare", detail: "Curenex cleanser → HA → Curenex rejuvenating cream → Rx tretinoin", cat: "skincare" },
      { time: "8:00 PM", label: "Eating window closes", detail: "", cat: "meal" },
      { time: "9:30 PM", label: "Before-bed supplements", detail: "Magnesium glycinate · Melatonin if needed", cat: "sleep" },
      { time: "10:00 PM", label: "Sermorelin injection", detail: "SubQ abdomen — 2+ hrs after last food · Amplifies nocturnal GH pulse", cat: "inject" },
      { time: "10:30 PM", label: "Sleep", detail: "Protect — Sunday is shop + prep day", cat: "sleep" },
    ]
  },
};

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

// ─── SHOPPING LISTS ───────────────────────────────────────────────
const SHOP1 = {
  proteins: ["Wild smoked salmon","Organic chicken thighs (2 lb)","Chicken legs (4) — use Sun, freeze rest","Grass-fed flank steak (4 oz)","Wild albacore tuna (2 cans)","Pasture-raised eggs (18)"],
  dairy: ["Full-fat Greek yogurt (organic)","Organic cottage cheese","Sheep's milk","Feta","Ghee","Unsweetened almond milk"],
  produce: ["Sweet potato (2)","Carrots (bag)","Celery","Fennel","Cucumber (2)","Avocados (3) — buy firm","Lemons (4)","Apples (3)","Bananas (3)","Coconut milk can","Organic chicken bone broth (32 oz)"],
  freezer: ["Ground turkey (1.5 lb) — portion into 2 bags","Wild salmon (2 fillets) — vacuum seal","Chicken thighs — freeze 1 lb, fridge 1 lb","Frozen cauliflower rice (bag)","Unsweetened açaí packs","Mixed berries (frozen bag)"],
};

const SHOP2 = [
  "Arugula (large bag)","Spinach (large bag)","Zucchini (4)","Cherry tomatoes","Broccoli / broccolini","Snap peas","Mushrooms","Kale (bunch)","Red peppers (2)","Butter lettuce","Avocados (2–3, ripe)","Fresh blueberries / berries","Mango + kiwi","Fresh herbs: parsley, basil, thyme, fresh ginger (knob)"
];

const PANTRY = [
  "Red lentils","Chickpeas (can)","Crushed tomatoes (can)","Coconut aminos","White miso paste","Almond butter (raw)","Hemp seeds","Chia seeds","Pumpkin seeds","Tahini","Organic sourdough","Honey","Granola (small bag)","Extra virgin olive oil","Sesame oil","Coconut oil","Turmeric","Cumin","Everything bagel seasoning","Mustard","Capers"
];

const REORDER = [
  { name: "Red Maca (Maxx Herb)", type: "supps", provider: "Your supplier", days: 30, url: "#" },
  { name: "Iron Blood tincture", type: "supps", provider: "Pine & Pangolin", days: 30, url: "#" },
  { name: "Tribulus (Khroma)", type: "supps", provider: "Your supplier", days: 30, url: "#" },
  { name: "B-12 sublingual 5000mcg", type: "supps", provider: "Nature's Bounty", days: 30, url: "#" },
  { name: "Cal/Mag/Zinc + D3 drops", type: "supps", provider: "Your supplier", days: 30, url: "#" },
  { name: "Sermorelin", type: "peptide", provider: "Peptide provider", days: 30, url: "#" },
  { name: "Glutathione", type: "peptide", provider: "Peptide provider", days: 30, url: "#" },
  { name: "Zepbound (tirzepatide)", type: "rx", provider: "Pharmacy / prescriber", days: 28, url: "#" },
  { name: "PDRN serum", type: "skincare", provider: "getglowingskin.com", days: 60, url: "https://getglowingskin.com" },
  { name: "HA booster", type: "skincare", provider: "getglowingskin.com", days: 60, url: "https://getglowingskin.com" },
  { name: "Curenex rejuvenatic cream", type: "skincare", provider: "getglowingskin.com", days: 90, url: "https://getglowingskin.com" },
  { name: "Curenex cleanser", type: "skincare", provider: "getglowingskin.com", days: 90, url: "https://getglowingskin.com" },
  { name: "Niacinamide 5%", type: "skincare", provider: "getglowingskin.com", days: 90, url: "https://getglowingskin.com" },
  { name: "Peptide complex", type: "skincare", provider: "getglowingskin.com", days: 90, url: "https://getglowingskin.com" },
  { name: "Rx tretinoin", type: "rx", provider: "Prescriber / pharmacy", days: 60, url: "#" },
  { name: "NAD+", type: "supps", provider: "Your supplier", days: 30, url: "#" },
  { name: "Urolithin A", type: "supps", provider: "Your supplier", days: 30, url: "#" },
  { name: "CoQ10", type: "supps", provider: "Your supplier", days: 30, url: "#" },
  { name: "Magnesium glycinate", type: "supps", provider: "Your supplier", days: 30, url: "#" },
];

// ─── ICONS ────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
    cart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    external: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    bag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    pill: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7"/><circle cx="17" cy="17" r="5"/><path d="M14.5 17h5M17 14.5v5"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  };
  return icons[name] || null;
};

// ─── INSTACART BUTTON ─────────────────────────────────────────────
function InstacartButton({ listType, items }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const queries = items.map(item => ({ query: item.replace(/\(.*?\)/g, '').trim().split('—')[0].trim(), quantity: 1 }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          mcp_servers: [{ type: "url", url: "https://fig-mcp.instacart.com/mcp", name: "instacart" }],
          messages: [{
            role: "user",
            content: `Add these grocery items to my Instacart cart: ${items.slice(0, 8).join(', ')}. Use the cart tool with quick_add_search_queries.`
          }]
        })
      });
      if (response.ok) setAdded(true);
    } catch (e) {
      // fallback: open instacart
      window.open("https://www.instacart.com", "_blank");
    }
    setLoading(false);
  };

  return (
    <button onClick={handleAdd} disabled={loading || added} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: added ? "#22C55E" : "#43B02A",
      color: "#fff", border: "none", borderRadius: 8,
      padding: "6px 12px", fontSize: 12, fontWeight: 600,
      cursor: loading || added ? "default" : "pointer",
      fontFamily: "'DM Mono', monospace", letterSpacing: "0.02em",
      transition: "all 0.2s", opacity: loading ? 0.7 : 1,
    }}>
      <Icon name="cart" size={13} />
      {added ? "Added to Instacart!" : loading ? "Adding…" : `Add ${listType} to Instacart`}
    </button>
  );
}

// ─── REORDER CARD ─────────────────────────────────────────────────
function ReorderCard({ item, daysLeft }) {
  const urgent = daysLeft <= 7;
  const soon = daysLeft <= 14;
  const typeColors = {
    peptide: { bg: "#E0F2F1", color: "#00695C", label: "Peptide" },
    rx: { bg: "#FCE4EC", color: "#C2185B", label: "Rx" },
    skincare: { bg: "#F3E8FF", color: "#6B21A8", label: "Skincare" },
    supps: { bg: "#F9FBE7", color: "#827717", label: "Supplement" },
  };
  const tc = typeColors[item.type] || typeColors.supps;

  return (
    <div style={{
      background: urgent ? "#FFF5F5" : "#FAFAFA",
      border: `1px solid ${urgent ? "#FECACA" : "#E5E5E5"}`,
      borderRadius: 10, padding: "12px 14px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#111", fontFamily: "'DM Sans', sans-serif" }}>{item.name}</span>
          <span style={{ background: tc.bg, color: tc.color, fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 20, fontFamily: "'DM Mono', monospace" }}>{tc.label}</span>
        </div>
        <div style={{ fontSize: 11, color: "#888", fontFamily: "'DM Mono', monospace" }}>{item.provider}</div>
      </div>
      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <span style={{
          fontSize: 12, fontWeight: 700, color: urgent ? "#DC2626" : soon ? "#D97706" : "#16A34A",
          fontFamily: "'DM Mono', monospace"
        }}>
          {daysLeft}d left
        </span>
        <a href={item.url !== "#" ? item.url : undefined} target="_blank" rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: item.url !== "#" ? "#6B21A8" : "#E5E5E5",
            color: item.url !== "#" ? "#fff" : "#999",
            fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
            textDecoration: "none", fontFamily: "'DM Mono', monospace",
            pointerEvents: item.url === "#" ? "none" : "auto",
          }}>
          <Icon name="external" size={11} />
          {item.url !== "#" ? "Reorder" : "Set URL"}
        </a>
      </div>
    </div>
  );
}

// ─── AGENDA ITEM ──────────────────────────────────────────────────
function AgendaItem({ item, checked, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const cat = CAT[item.cat] || CAT.rest;
  const hasNote = !!item.note;
  const hasDetail = !!item.detail;
  const hasInstacart = !!item.instacart;

  const shopItems = item.instacart === "shop1"
    ? [...SHOP1.proteins, ...SHOP1.dairy, ...SHOP1.produce]
    : item.instacart === "shop2" ? SHOP2 : [];

  return (
    <div style={{
      display: "flex", gap: 0,
      opacity: checked ? 0.45 : 1,
      transition: "opacity 0.2s",
    }}>
      {/* Time */}
      <div style={{
        width: 100, minWidth: 100, paddingTop: 14, paddingRight: 12,
        fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#999",
        textAlign: "right", lineHeight: 1.3,
        flexShrink: 0,
      }}>
        {item.time}
      </div>

      {/* Dot */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", marginTop: 16,
          background: checked ? "#D1D5DB" : cat.color,
          flexShrink: 0, transition: "background 0.2s",
        }} />
        <div style={{ flex: 1, width: 1, background: "#E5E7EB", marginTop: 4 }} />
      </div>

      {/* Card */}
      <div style={{ flex: 1, paddingBottom: 8, paddingLeft: 12 }}>
        <div style={{
          background: checked ? "#F9FAFB" : cat.bg,
          border: `1px solid ${checked ? "#E5E7EB" : cat.color}22`,
          borderLeft: `3px solid ${checked ? "#D1D5DB" : cat.color}`,
          borderRadius: "0 10px 10px 0",
          padding: "10px 12px",
          cursor: (hasNote || hasDetail || hasInstacart) ? "pointer" : "default",
          transition: "all 0.15s",
        }} onClick={() => (hasNote || hasDetail || hasInstacart) && setExpanded(e => !e)}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            {/* Checkbox */}
            <button onClick={e => { e.stopPropagation(); onToggle(); }} style={{
              width: 18, height: 18, minWidth: 18, borderRadius: 5, marginTop: 1,
              border: `2px solid ${checked ? "#D1D5DB" : cat.color}`,
              background: checked ? "#D1D5DB" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff", flexShrink: 0,
            }}>
              {checked && <Icon name="check" size={11} />}
            </button>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: checked ? "#9CA3AF" : "#111",
                  fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3,
                  textDecoration: checked ? "line-through" : "none",
                }}>
                  {item.label}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: cat.color,
                  background: `${cat.color}15`, padding: "1px 7px", borderRadius: 20,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {cat.label}
                </span>
                {hasNote && <Icon name="info" size={12} />}
              </div>
              {hasDetail && (
                <div style={{ fontSize: 11.5, color: "#6B7280", marginTop: 2, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                  {item.detail}
                </div>
              )}
            </div>

            {(hasNote || hasInstacart) && (
              <div style={{ color: "#9CA3AF", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", marginTop: 2 }}>
                <Icon name="chevron" size={14} />
              </div>
            )}
          </div>

          {expanded && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${cat.color}22` }}>
              {hasNote && (
                <div style={{
                  fontSize: 12, color: "#374151", lineHeight: 1.6,
                  background: "#fff", borderRadius: 6, padding: "8px 10px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {item.note}
                </div>
              )}
              {hasInstacart && (
                <div style={{ marginTop: hasNote ? 10 : 0 }}>
                  <InstacartButton listType={item.instacart === "shop1" ? "Shop 1" : "Shop 2"} items={shopItems} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function WellnessPlanner() {
  const today = DAYS[new Date().getDay()];
  const [activeDay, setActiveDay] = useState(today);
  const [activeTab, setActiveTab] = useState("agenda");
  const [checked, setChecked] = useState({});
  const [checkedShop1, setCheckedShop1] = useState({});
  const [checkedShop2, setCheckedShop2] = useState({});
  const [checkedPantry, setCheckedPantry] = useState({});
  const [reorderDays, setReorderDays] = useState(() =>
    Object.fromEntries(REORDER.map(r => [r.name, r.days]))
  );
  const [editingDays, setEditingDays] = useState(null);

  const toggleItem = (day, idx) => {
    setChecked(prev => ({ ...prev, [`${day}-${idx}`]: !prev[`${day}-${idx}`] }));
  };

  const dayData = WEEK[activeDay];
  const dayTag = dayData.tag;
  const tagColor = CAT[dayTag]?.color || "#6B21A8";

  const tabs = [
    { id: "agenda", label: "Agenda" },
    { id: "shopping", label: "Shopping" },
    { id: "reorder", label: "Reorder" },
  ];

  const completedCount = WEEK[activeDay].items.filter((_, i) => checked[`${activeDay}-${i}`]).length;
  const totalCount = WEEK[activeDay].items.length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8F7F4",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#111",
        padding: "20px 24px 0",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#666", letterSpacing: "0.12em", marginBottom: 4 }}>WELLNESS OS</div>
            <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Daily Planner</h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555" }}>{completedCount}/{totalCount} done</div>
            <div style={{
              width: 80, height: 4, background: "#333", borderRadius: 2, marginTop: 4, overflow: "hidden"
            }}>
              <div style={{ height: "100%", background: tagColor, borderRadius: 2, width: `${(completedCount/totalCount)*100}%`, transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        {/* Day Picker */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 0 }}>
          {DAYS.map(day => {
            const dc = WEEK[day].tag;
            const active = day === activeDay;
            return (
              <button key={day} onClick={() => setActiveDay(day)} style={{
                padding: "8px 12px",
                background: active ? CAT[dc]?.color : "transparent",
                color: active ? "#fff" : "#666",
                border: "none", borderRadius: "8px 8px 0 0",
                fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: active ? 700 : 400,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
                borderBottom: active ? `3px solid ${CAT[dc]?.color}` : "3px solid transparent",
              }}>
                {day.slice(0, 3).toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 0, background: "#1A1A1A", marginTop: 8 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex: 1, padding: "10px 0",
              background: activeTab === t.id ? "#F8F7F4" : "transparent",
              color: activeTab === t.id ? "#111" : "#666",
              border: "none", fontFamily: "'DM Mono', monospace",
              fontSize: 11, fontWeight: activeTab === t.id ? 700 : 400,
              cursor: "pointer", letterSpacing: "0.05em",
              borderRadius: activeTab === t.id ? "8px 8px 0 0" : 0,
              transition: "all 0.15s",
            }}>
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 0 60px" }}>

        {/* AGENDA TAB */}
        {activeTab === "agenda" && (
          <div style={{ padding: "20px 16px" }}>
            {/* Day header */}
            <div style={{
              background: tagColor,
              borderRadius: 12, padding: "14px 18px", marginBottom: 20,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 2 }}>{activeDay.toUpperCase()}</div>
                <div style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>{dayData.subtitle}</div>
              </div>
              <div style={{
                background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "6px 12px",
                fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.9)",
              }}>
                {totalCount} items
              </div>
            </div>

            {dayData.items.map((item, i) => (
              <AgendaItem
                key={i}
                item={item}
                checked={!!checked[`${activeDay}-${i}`]}
                onToggle={() => toggleItem(activeDay, i)}
              />
            ))}
          </div>
        )}

        {/* SHOPPING TAB */}
        {activeTab === "shopping" && (
          <div style={{ padding: "20px 16px" }}>
            {/* Shop 1 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#1A237E", borderRadius: "10px 10px 0 0", padding: "12px 16px",
              }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>SUNDAY — SHOP 1</div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Proteins · Hardy Produce · Dairy</div>
                </div>
                <InstacartButton listType="Shop 1" items={[...SHOP1.proteins, ...SHOP1.dairy, ...SHOP1.produce]} />
              </div>
              {[
                { label: "Proteins", items: SHOP1.proteins, key: "p" },
                { label: "Dairy", items: SHOP1.dairy, key: "d" },
                { label: "Hardy Produce (lasts 7 days)", items: SHOP1.produce, key: "h" },
                { label: "Freezer", items: SHOP1.freezer, key: "f" },
              ].map(section => (
                <div key={section.key}>
                  <div style={{ background: "#E8EAF6", padding: "6px 16px", fontSize: 11, fontWeight: 700, color: "#283593", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>
                    {section.label.toUpperCase()}
                  </div>
                  {section.items.map((item, i) => {
                    const k = `s1-${section.key}-${i}`;
                    return (
                      <div key={i} onClick={() => setCheckedShop1(p => ({ ...p, [k]: !p[k] }))} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 16px", background: checkedShop1[k] ? "#F9FAFB" : "#fff",
                        borderBottom: "1px solid #F3F4F6", cursor: "pointer",
                        opacity: checkedShop1[k] ? 0.5 : 1,
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                          border: `2px solid ${checkedShop1[k] ? "#D1D5DB" : "#283593"}`,
                          background: checkedShop1[k] ? "#D1D5DB" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                        }}>
                          {checkedShop1[k] && <Icon name="check" size={11} />}
                        </div>
                        <span style={{ fontSize: 13, color: "#111", textDecoration: checkedShop1[k] ? "line-through" : "none", fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Shop 2 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#2E7D32", borderRadius: "10px 10px 0 0", padding: "12px 16px",
              }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>WEDNESDAY — SHOP 2</div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Soft Produce Only · After Walk</div>
                </div>
                <InstacartButton listType="Shop 2" items={SHOP2} />
              </div>
              {SHOP2.map((item, i) => {
                const k = `s2-${i}`;
                return (
                  <div key={i} onClick={() => setCheckedShop2(p => ({ ...p, [k]: !p[k] }))} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", background: checkedShop2[k] ? "#F9FAFB" : "#fff",
                    borderBottom: "1px solid #F3F4F6", cursor: "pointer",
                    opacity: checkedShop2[k] ? 0.5 : 1,
                  }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                      border: `2px solid ${checkedShop2[k] ? "#D1D5DB" : "#2E7D32"}`,
                      background: checkedShop2[k] ? "#D1D5DB" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                    }}>
                      {checkedShop2[k] && <Icon name="check" size={11} />}
                    </div>
                    <span style={{ fontSize: 13, color: "#111", textDecoration: checkedShop2[k] ? "line-through" : "none", fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Pantry */}
            <div>
              <div style={{ background: "#37474F", borderRadius: "10px 10px 0 0", padding: "12px 16px" }}>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "'DM Mono', monospace" }}>ANYTIME — PANTRY</div>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>No Refrigeration Needed</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", background: "#fff", borderRadius: "0 0 10px 10px", padding: 8, gap: 6 }}>
                {PANTRY.map((item, i) => {
                  const k = `p-${i}`;
                  return (
                    <div key={i} onClick={() => setCheckedPantry(p => ({ ...p, [k]: !p[k] }))} style={{
                      padding: "5px 12px", background: checkedPantry[k] ? "#F3F4F6" : "#F8F7F4",
                      border: `1px solid ${checkedPantry[k] ? "#E5E7EB" : "#D1D5DB"}`,
                      borderRadius: 20, fontSize: 12, cursor: "pointer",
                      color: checkedPantry[k] ? "#9CA3AF" : "#374151",
                      textDecoration: checkedPantry[k] ? "line-through" : "none",
                      fontFamily: "'DM Sans', sans-serif",
                      transition: "all 0.15s",
                    }}>
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* REORDER TAB */}
        {activeTab === "reorder" && (
          <div style={{ padding: "20px 16px" }}>
            <div style={{
              background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10,
              padding: "12px 16px", marginBottom: 20,
              fontSize: 12, color: "#6B7280", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif"
            }}>
              <strong style={{ color: "#111" }}>Supply tracker</strong> — set how many days of supply remain for each item. Links go directly to your providers. Add your peptide provider URL by editing the app.
            </div>

            {["peptide","rx","skincare","supps"].map(type => {
              const typeItems = REORDER.filter(r => r.type === type);
              const labels = { peptide: "Peptides", rx: "Prescriptions", skincare: "Skincare", supps: "Supplements" };
              const typeColors2 = { peptide: "#00695C", rx: "#C2185B", skincare: "#6B21A8", supps: "#827717" };
              return (
                <div key={type} style={{ marginBottom: 20 }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
                    color: typeColors2[type], letterSpacing: "0.08em", marginBottom: 8,
                    paddingLeft: 4, borderLeft: `3px solid ${typeColors2[type]}`, paddingLeft: 10,
                  }}>
                    {labels[type].toUpperCase()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {typeItems.map(item => (
                      <div key={item.name} style={{ position: "relative" }}>
                        <ReorderCard item={item} daysLeft={reorderDays[item.name]} />
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, paddingLeft: 4 }}>
                          <span style={{ fontSize: 10, color: "#9CA3AF", fontFamily: "'DM Mono', monospace" }}>Days remaining:</span>
                          <input
                            type="number" min={0} max={365}
                            value={reorderDays[item.name]}
                            onChange={e => setReorderDays(p => ({ ...p, [item.name]: Math.max(0, parseInt(e.target.value) || 0) }))}
                            style={{
                              width: 52, padding: "2px 6px", borderRadius: 5,
                              border: "1px solid #E5E7EB", fontSize: 12,
                              fontFamily: "'DM Mono', monospace", color: "#374151",
                              background: "#fff",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
