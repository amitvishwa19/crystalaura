'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "../_context/CrystalAuraProviders";

const XIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const MinusIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/></svg>
);

const PlusIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

const TrashIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

const CartDrawer = () => {
 const { items, removeItem, updateQuantity, totalPrice, totalItems, isOpen, setIsOpen } = useCart();
 const [promoInput, setPromoInput] = useState("");
 const [appliedPromo, setAppliedPromo] = useState(null);
 const [promoError, setPromoError] = useState("");

 const PROMO_CODES = {
 AURA10: { type: "percent", value: 10, label: "10% off" },
 WELCOME100: { type: "flat", value: 100, label: "₹100 off" },
 CRYSTAL20: { type: "percent", value: 20, label: "20% off" },
 };

 const discount = appliedPromo
 ? appliedPromo.type === "percent"
 ? Math.round((totalPrice * appliedPromo.value) / 100)
 : Math.min(appliedPromo.value, totalPrice)
 : 0;

 const shipping = totalPrice >= 999 ? 0 : 99;
 const grandTotal = Math.max(0, totalPrice - discount) + shipping;

 const applyPromo = () => {
 const code = promoInput.trim().toUpperCase();
 setPromoError("");
 if (!code) { setPromoError("Enter a promo code"); return; }
 const promo = PROMO_CODES[code];
 if (!promo) { setPromoError("Invalid promo code"); setAppliedPromo(null); return; }
 setAppliedPromo({ code, ...promo });
 };

 const removePromo = () => {
 setAppliedPromo(null);
 setPromoInput("");
 setPromoError("");
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsOpen(false)}
 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
 />
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "spring", damping: 25, stiffness: 250 }}
 className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#0e0b17] border-l border-white/10 shadow-2xl flex flex-col"
 >
 <div className="flex items-center justify-between p-6 border-b border-white/5">
 <div>
 <h2 className="font-serif text-[11px]l text-foreground">Cart</h2>
 <p className="text-[10px] text-muted-foreground font-sans font-bold ">
 {totalItems} {totalItems === 1 ? "item" : "items"}
 </p>
 </div>
 <button
 onClick={() => setIsOpen(false)}
 className="p-2.5 rounded-xl bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 border border-white/5 transition-all"
 >
 <XIcon className="w-4 h-4" />
 </button>
 </div>

 {items.length === 0 ? (
 <div className="flex-1 flex items-center justify-center p-8">
 <div className="text-center">
 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-muted-foreground"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
 </div>
 <p className="text-muted-foreground text-sm font-light mb-1">Your cart is empty</p>
 <p className="text-[10px] text-muted-foreground/60 font-sans font-bold mb-6">Discover our sacred collection</p>
 <Link
 href="/shop"
 onClick={() => setIsOpen(false)}
 className="inline-block text-[10px] font-sans font-black text-[11px]rimary hover:underline"
 >
 Browse Shop
 </Link>
 </div>
 </div>
 ) : (
 <>
 <div className="flex-1 overflow-y-auto p-6 space-y-4">
 {items.map((item) => (
 <div key={item.product.id} className="flex gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all duration-300">
 <img
 src={item.product.image}
 alt={item.product.name}
 className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
 />
 <div className="flex-1 min-w-0 flex flex-col justify-between">
 <div>
 <div className="flex items-start justify-between gap-2">
 <h4 className="text-sm font-serif text-foreground truncate">{item.product.name}</h4>
 <button
 onClick={() => removeItem(item.product.id)}
 className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0"
 >
 <TrashIcon className="w-3.5 h-3.5" />
 </button>
 </div>
 <p className="text-[11px]s text-[11px]rimary font-sans font-bold mt-0.5">
 ₹{item.product.priceNum || item.product.price}
 </p>
 </div>
 <div className="flex items-center gap-2 mt-2">
 <button
 onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-[11px]s"
 >
 <MinusIcon className="w-3 h-3" />
 </button>
 <span className="text-[11px]s font-sans font-bold text-foreground w-6 text-center">
 {item.quantity}
 </span>
 <button
 onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
 className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-[11px]s"
 >
 <PlusIcon className="w-3 h-3" />
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="border-t border-white/5 p-6 space-y-3">
 {/* Promo Code */}
 {appliedPromo ? (
 <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
 <div className="flex items-center gap-2 text-sm">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
 <span className="text-[11px]s font-sans font-bold text-foreground">{appliedPromo.code}</span>
 <span className="text-[10px] text-muted-foreground">({appliedPromo.label})</span>
 </div>
 <button type="button" onClick={removePromo} className="text-[10px] text-muted-foreground hover:text-destructive font-sans font-bold">Remove</button>
 </div>
 ) : (
 <div>
 <div className="flex gap-2">
 <input
 type="text"
 value={promoInput}
 onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
 placeholder="Promo code"
 maxLength={20}
 className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[11px]s text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 font-sans font-bold "
 />
 <button
 type="button"
 onClick={applyPromo}
 className="px-5 py-2.5 rounded-xl text-[10px] font-sans font-black bg-primary/10 text-[11px]rimary border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all"
 >
 Apply
 </button>
 </div>
 {promoError && <p className="text-[10px] text-destructive mt-1.5 font-sans font-bold">{promoError}</p>}
 </div>
 )}

 <div className="space-y-1.5 text-[11px]s text-muted-foreground">
 <div className="flex justify-between">
 <span>Subtotal</span>
 <span className="text-foreground font-sans font-bold">₹{totalPrice}</span>
 </div>
 {discount > 0 && (
 <div className="flex justify-between">
 <span>Discount</span>
 <span className="text-green-400 font-sans font-bold">−₹{discount}</span>
 </div>
 )}
 <div className="flex justify-between">
 <span>Shipping</span>
 <span className={shipping === 0 ? "text-green-400 font-sans font-bold" : ""}>
 {shipping === 0 ? "FREE" : `₹${shipping}`}
 </span>
 </div>
 {totalPrice < 999 && totalPrice > 0 && (
 <p className="text-[9px] text-muted-foreground/60 font-sans font-bold ">
 Add ₹{999 - totalPrice} more for free shipping
 </p>
 )}
 </div>

 <div className="border-t border-white/5 pt-3">
 <div className="flex justify-between items-center mb-4">
 <span className="text-sm font-serif text-foreground">Total</span>
 <span className="text-lg font-serif text-[11px]rimary font-bold">₹{grandTotal}</span>
 </div>
 <Link
 href="/checkout"
 onClick={() => setIsOpen(false)}
 className="block w-full text-center py-3.5 rounded-xl text-[10px] font-sans font-black bg-gradient-to-r from-amber-500/90 via-yellow-500/90 to-amber-500/90 text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 border border-primary/20"
 >
 Checkout
 </Link>
 </div>
 </div>
 </>
 )}
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
};

export default CartDrawer;
