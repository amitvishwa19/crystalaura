'use client';

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { products } from "../_data/products";
import { useImagePack } from "../_context/CrystalAuraProviders";

const SparklesIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.938A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.938l6.135 1.581a.5.5 0 0 1 0 .962L15.5 14.063A2 2 0 0 0 14.063 15.5L12.481 21.64a.5.5 0 0 1-.962 0z"/><path d="M20 3h.01"/><path d="M4 20h.01"/><path d="M18.5 18h.01"/><path d="M5.5 6h.01"/></svg>
);

const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const CheckCircle2Icon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);

const braceletProducts = products.filter(p => p.tags && p.tags.includes("bracelet"));

const chakraOptions = [
 { value: "root", label: "Root — Grounding & Protection", color: "red" },
 { value: "sacral", label: "Sacral — Creativity & Emotion", color: "orange" },
 { value: "solar", label: "Solar Plexus — Confidence & Power", color: "yellow" },
 { value: "heart", label: "Heart — Love & Compassion", color: "green" },
 { value: "throat", label: "Throat — Communication & Truth", color: "blue" },
 { value: "thirdEye", label: "Third Eye — Intuition & Insight", color: "indigo" },
 { value: "crown", label: "Crown — Spirituality & Connection", color: "purple" },
];

const intentionOptions = [
 { value: "abundance", label: "Abundance & Prosperity", icon: "💰" },
 { value: "love", label: "Love & Emotional Healing", icon: "💖" },
 { value: "protection", label: "Protection & Grounding", icon: "🛡️" },
 { value: "calm", label: "Calm & Stress Relief", icon: "🧘" },
 { value: "energy", label: "Energy & Vitality", icon: "⚡" },
 { value: "spiritual", label: "Spiritual Growth", icon: "✨" },
];

const SiteCrystalBraceletCalculator = () => {
 const { getProductImage } = useImagePack();
 const [step, setStep] = useState(0);
 const [answers, setAnswers] = useState({});
 const [completed, setCompleted] = useState(false);

 const handleSelect = (questionId, value) => {
 const updated = { ...answers, [questionId]: value };
 setAnswers(updated);
 if (step < 1) {
 setStep(step + 1);
 } else {
 setCompleted(true);
 }
 };

 const handleRestart = () => {
 setAnswers({});
 setStep(0);
 setCompleted(false);
 };

 const getRecommendations = () => {
 const chakra = answers.chakra;
 const intention = answers.intention;

 const scored = braceletProducts.map((p) => {
 let score = 0;
 const tags = (p.tags || []).join(" ").toLowerCase();
 const name = p.name.toLowerCase();
 const desc = p.description.toLowerCase();

 if (chakra === "root" && (name.includes("black tourmaline") || name.includes("obsidian") || name.includes("hematite"))) score += 3;
 if (chakra === "sacral" && (name.includes("carnelian") || name.includes("sunstone") || name.includes("citrine"))) score += 3;
 if (chakra === "solar" && (name.includes("citrine") || name.includes("pyrite") || name.includes("tiger eye"))) score += 3;
 if (chakra === "heart" && (name.includes("rose quartz") || name.includes("green aventurine") || name.includes("jade"))) score += 3;
 if (chakra === "throat" && (name.includes("lapis") || name.includes("sodalite") || name.includes("aquamarine"))) score += 3;
 if (chakra === "thirdEye" && (name.includes("amethyst") || name.includes("labradorite") || name.includes("sodalite"))) score += 3;
 if (chakra === "crown" && (name.includes("amethyst") || name.includes("clear quartz") || name.includes("selenite"))) score += 3;

 if (intention === "abundance" && (name.includes("citrine") || name.includes("pyrite") || name.includes("jade"))) score += 2;
 if (intention === "love" && (name.includes("rose quartz") || name.includes("rhodochrosite"))) score += 2;
 if (intention === "protection" && (name.includes("tourmaline") || name.includes("obsidian") || name.includes("black onyx"))) score += 2;
 if (intention === "calm" && (name.includes("amethyst") || name.includes("rose quartz") || name.includes("moonstone"))) score += 2;
 if (intention === "energy" && (name.includes("carnelian") || name.includes("citrine") || name.includes("sunstone"))) score += 2;
 if (intention === "spiritual" && (name.includes("amethyst") || name.includes("labradorite") || name.includes("clear quartz"))) score += 2;

 if (tags.includes("bracelet") || tags.includes("healing")) score += 1;
 if (p.rating >= 4.7) score += 1;

 return { product: p, score };
 });

 scored.sort((a, b) => b.score - a.score);
 return scored.slice(0, 4).map((s) => s.product);
 };

 const recommendations = useMemo(() => getRecommendations(), [answers]);
 const progressPercent = ((step) / 3) * 100;
 const currentQuestion = step === 0 ? { title: "Which chakra needs balancing?", subtitle: "Select the energy center that feels blocked", options: chakraOptions, type: "list", questionId: "chakra" }
 : step === 1 ? { title: "What is your primary intention?", subtitle: "Choose the energy you want to attract", options: intentionOptions, type: "grid", questionId: "intention" }
 : null;

 return (
 <section id="bracelet-calculator" className="py-28 px-6 relative bg-gradient-to-b from-[#0d091a] to-background scroll-mt-20">
 <div className="max-w-5xl mx-auto">
 <div className="text-center mb-16">
 <div className="w-12 h-12 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-4">
 <SparklesIcon className="w-5 h-5 text-[11px]rimary animate-pulse" />
 </div>
 <p className="text-[11px]rimary text-[10px] font-sans font-black mb-3">
 ✦ Bracelet Finder ✦
 </p>
 <h2 className="font-serif text-4xl md:text-5xl text-foreground">
 Find Your <span className="text-gold-gradient italic font-normal">Perfect</span> Bracelet
 </h2>
 <p className="text-muted-foreground/80 mt-4 text-sm max-w-md mx-auto font-light leading-relaxed">
 Answer 2 quick questions and we will reveal the crystal bracelets that match your energy and intention.
 </p>
 </div>

 <div className="max-w-3xl mx-auto">
 {!completed ? (
 <div>
 <div className="mb-6 flex items-center justify-between text-[10px] font-sans font-bold text-muted-foreground/50">
 <span>Step {step + 1} of 3</span>
 <button
 onClick={handleRestart}
 className="flex items-center gap-1.5 hover:text-foreground transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5"
 >
 Restart
 </button>
 </div>

 <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-10">
 <div
 className="h-full bg-gold-gradient transition-all duration-500 ease-out"
 style={{ width: `${progressPercent}%` }}
 />
 </div>

 <AnimatePresence mode="wait">
 <motion.div
 key={step}
 initial={{ opacity: 0, y: 15 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -15 }}
 transition={{ duration: 0.3 }}
 className="glass-card rounded-3xl p-6 md:p-12 border-white/5 relative bg-[#0e0c15]/10 backdrop-blur-md hover:border-primary/10 transition-colors duration-500"
 style={{ boxShadow: '0 15px 35px -10px rgba(0,0,0,0.3)' }}
 >
 <h3 className="font-serif text-2xl md:text-3xl text-center text-foreground mb-2">
 {currentQuestion.title}
 </h3>
 <p className="text-[11px]s text-muted-foreground/60 text-center font-light mb-10">
 {currentQuestion.subtitle}
 </p>

 {currentQuestion.type === "grid" ? (
 <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
 {currentQuestion.options.map((opt) => (
 <button
 key={opt.value}
 onClick={() => handleSelect(currentQuestion.questionId, opt.value)}
 className="text-center p-5 rounded-2xl border transition-all border-white/5 bg-[#120f1e]/40 hover:border-primary/45 hover:bg-primary/5 hover:shadow-2xl hover:shadow-primary/5 active:scale-95 flex flex-col items-center gap-2 group"
 >
 <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{opt.icon}</span>
 <span className="text-[11px]s text-muted-foreground group-hover:text-foreground font-sans font-bold ">{opt.label}</span>
 </button>
 ))}
 </div>
 ) : (
 <div className="flex flex-col gap-3.5 max-w-lg mx-auto">
 {currentQuestion.options.map((opt) => (
 <button
 key={opt.value}
 onClick={() => handleSelect(currentQuestion.questionId, opt.value)}
 className="text-left py-4 px-6 rounded-2xl border transition-all border-white/5 bg-[#120f1e]/40 hover:border-primary/45 hover:bg-primary/5 text-muted-foreground hover:text-foreground text-[11px]s font-sans font-bold active:scale-98 flex justify-between items-center group"
 >
 <span>{opt.label}</span>
 <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px]rimary">✦</span>
 </button>
 ))}
 </div>
 )}
 </motion.div>
 </AnimatePresence>
 </div>
 ) : (
 <motion.div
 initial={{ opacity: 0, scale: 0.96 }}
 animate={{ opacity: 1, scale: 1 }}
 className="glass-card rounded-3xl p-8 md:p-14 border-white/10 bg-[#0e0b17]/50 backdrop-blur-md shadow-2xl hover:border-primary/20 transition-all duration-750"
 style={{ boxShadow: '0 25px 60px -20px rgba(220,160,40,0.15)' }}
 >
 <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
 <CheckCircle2Icon className="w-8 h-8 text-[11px]rimary animate-bounce" />
 </div>
 <p className="text-[11px]rimary text-[10px] font-sans font-black mb-3">
 Alignment Complete
 </p>
 <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
 Your <span className="text-gold-gradient italic">Bracelet</span> Matches
 </h3>
 <p className="text-muted-foreground/80 text-sm mb-8 font-light text-center">
 Based on your chakra and intention, these bracelets resonate most with your energy.
 </p>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
 {recommendations.map((p) => {
 const resolvedImage = getProductImage(p.id, p.image);
 const priceVal = p.priceNum || p.price;
 return (
 <motion.div
 key={p.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-[#120f1e]/40 hover:border-primary/20 transition-all duration-300"
 >
 <img
 src={resolvedImage}
 alt={p.name}
 className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
 />
 <div className="flex flex-col justify-between min-w-0">
 <h4 className="font-serif text-sm text-foreground truncate">{p.name}</h4>
 <p className="text-[10px] text-muted-foreground/60 mt-1 line-clamp-2">{p.description}</p>
 <div className="flex items-center justify-between mt-2">
 <span className="text-[11px]rimary font-sans font-bold text-sm">₹{priceVal}</span>
 <Link href={`/shop/${p.id}`}>
 <button className="text-[10px] font-sans font-black text-[11px]rimary hover:underline">
 View →
 </button>
 </Link>
 </div>
 </div>
 </motion.div>
 );
 })}
 </div>

 <div className="flex flex-col sm:flex-row justify-center gap-4">
 <button
 onClick={handleRestart}
 className="border border-white/10 text-foreground text-[10px] font-black font-sans px-8 py-4.5 rounded-full hover:bg-white/5 hover:border-white/20 transition-all active:scale-95"
 >
 Retake Quiz
 </button>
 <Link href="/shop?category=bracelets">
 <button className="bg-gold-gradient text-white text-[10px] font-black font-sans px-8 py-4.5 rounded-full hover:opacity-90 shadow-lg shadow-primary/20 transition-all border border-primary/15 active:scale-95">
 Browse All Bracelets
 </button>
 </Link>
 </div>
 </motion.div>
 )}
 </div>
 </div>
 </section>
 );
};

export default SiteCrystalBraceletCalculator;