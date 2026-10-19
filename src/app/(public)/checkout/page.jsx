'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, useOrders } from "../_context/CrystalAuraProviders";

const ArrowLeftIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5-7 7 7 7"/></svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const GIFT_WRAP_FEE = 99;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

const PROMO_CODES = {
 AURA10: { type: "percent", value: 10, label: "10% off" },
 WELCOME100: { type: "flat", value: 100, label: "₹100 off" },
 CRYSTAL20: { type: "percent", value: 20, label: "20% off" },
};

const steps = [
 { id: "shipping", label: "Shipping" },
 { id: "payment", label: "Payment" },
 { id: "review", label: "Review" },
];

const CheckoutPage = () => {
 const router = useRouter();
 const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCart();
 const { addOrder } = useOrders();

 const [step, setStep] = useState(0);
 const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
 const [formErrors, setFormErrors] = useState({});
 const [giftWrap, setGiftWrap] = useState(false);
 const [giftMessage, setGiftMessage] = useState("");
 const [promoInput, setPromoInput] = useState("");
 const [appliedPromo, setAppliedPromo] = useState(null);
 const [promoError, setPromoError] = useState("");
 const [paymentMethod, setPaymentMethod] = useState("cod");
 const [placing, setPlacing] = useState(false);

 const discount = appliedPromo
 ? appliedPromo.type === "percent"
 ? Math.round((totalPrice * appliedPromo.value) / 100)
 : Math.min(appliedPromo.value, totalPrice)
 : 0;

 const giftFee = giftWrap ? GIFT_WRAP_FEE : 0;
 const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
 const grandTotal = Math.max(0, totalPrice - discount) + shipping + giftFee;

 const validateShipping = () => {
 const errors = {};
 if (!form.name.trim()) errors.name = "Required";
 if (!form.email.trim()) errors.email = "Required";
 else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Invalid email";
 if (!form.phone.trim()) errors.phone = "Required";
 else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ""))) errors.phone = "Invalid phone (10 digits)";
 if (!form.address.trim()) errors.address = "Required";
 if (!form.city.trim()) errors.city = "Required";
 if (!form.state.trim()) errors.state = "Required";
 if (!form.pincode.trim()) errors.pincode = "Required";
 else if (!/^\d{6}$/.test(form.pincode.trim())) errors.pincode = "Invalid pincode (6 digits)";
 setFormErrors(errors);
 return Object.keys(errors).length === 0;
 };

 const handleShippingSubmit = (e) => {
 e.preventDefault();
 if (validateShipping()) setStep(1);
 };

 const applyPromo = () => {
 const code = promoInput.trim().toUpperCase();
 setPromoError("");
 if (!code) { setPromoError("Enter a promo code"); return; }
 const promo = PROMO_CODES[code];
 if (!promo) { setPromoError("Invalid promo code"); setAppliedPromo(null); return; }
 setAppliedPromo({ code, ...promo });
 };

 const removePromo = () => { setAppliedPromo(null); setPromoInput(""); setPromoError(""); };

 const handlePlaceOrder = async () => {
 if (items.length === 0) return;
 setPlacing(true);

 const orderId = `CA${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

 const orderData = {
 id: orderId,
 date: new Date().toISOString(),
 status: "confirmed",
 items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
 subtotal: totalPrice,
 discount,
 shipping,
 giftWrap: giftFee,
 paymentMethod,
 promoCode: appliedPromo?.code || null,
 total: grandTotal,
 shippingAddress: { ...form },
 giftMessage: giftWrap ? giftMessage : null,
 };

 if (paymentMethod === "cod") {
 addOrder(orderData);
 clearCart();
 setPlacing(false);
 router.push(`/order-success?id=${orderId}`);
 } else {
 try {
 const response = await fetch("/api/checkout", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ ...orderData }),
 });
 const result = await response.json();

 if (!response.ok) throw new Error(result.error || "Payment failed");

 const options = {
 key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
 amount: grandTotal * 100,
 currency: "INR",
 name: "Crystal Aura",
 description: `Order ${orderId}`,
 order_id: result.razorpayOrderId,
 prefill: { name: form.name, email: form.email, contact: form.phone },
 handler: () => {
 orderData.paymentId = result.razorpayOrderId;
 addOrder(orderData);
 clearCart();
 setPlacing(false);
 router.push(`/order-success?id=${orderId}`);
 },
 modal: {
 ondismiss: () => { setPlacing(false); },
 },
 };

 const rzp = new window.Razorpay(options);
 rzp.open();
 } catch (err) {
 setPlacing(false);
 alert("Payment could not be initiated. Please try again.");
 }
 }
 };

 if (items.length === 0) {
 return (
 <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-6">
 <div className="text-center max-w-md">
 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-muted-foreground"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
 </div>
 <h1 className="font-serif text-2xl text-foreground mb-2">Your cart is empty</h1>
 <p className="text-sm text-muted-foreground/70 font-light mb-6">Discover our sacred collection of healing crystals</p>
 <Link href="/shop" className="inline-block text-[10px] font-sans font-black text-primary bg-primary/10 border border-primary/20 px-8 py-3.5 rounded-xl hover:bg-primary/20 active:scale-95 transition-all">
 Browse Shop
 </Link>
 </div>
 </div>
 );
 }

 const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-all font-sans";
 const inputErrorClass = "w-full bg-white/5 border border-destructive/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-destructive/70 transition-all font-sans";

 return (
 <div className="min-h-screen pt-28 pb-20 px-6">
 <div className="max-w-7xl mx-auto">
 <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] font-sans font-bold text-muted-foreground hover:text-foreground transition-all mb-6 group">
 <ArrowLeftIcon className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
 Back to Cart
 </Link>

 <div className="flex items-center gap-1 mb-8">
 {steps.map((s, i) => (
 <React.Fragment key={s.id}>
 <div className={`flex items-center gap-1.5 ${i <= step ? "text-primary" : "text-muted-foreground/40"}`}>
 <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-sans font-black ${
 i < step
 ? "bg-primary/20 border border-primary/40"
 : i === step
 ? "bg-primary/10 border border-primary/30"
 : "bg-white/5 border border-white/10"
 }`}>
 {i < step ? <CheckIcon className="w-3.5 h-3.5" /> : i + 1}
 </div>
 <span className={`text-[9px] font-sans font-black hidden sm:inline ${i === step ? "text-foreground" : ""}`}>
 {s.label}
 </span>
 </div>
 {i < steps.length - 1 && (
 <div className={`flex-1 h-px mx-2 ${i < step ? "bg-primary/30" : "bg-white/10"}`} />
 )}
 </React.Fragment>
 ))}
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
 <div className="lg:col-span-2">
 {step === 0 && (
 <motion.form
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 onSubmit={handleShippingSubmit}
 className="rounded-3xl border border-white/5 bg-[#0b0b0e]/50 backdrop-blur-md p-8"
 style={{ boxShadow: '0 15px 35px -10px rgba(0,0,0,0.3)' }}
 >
 <h2 className="font-serif text-xl text-foreground mb-6">Shipping Address</h2>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">Full Name</label>
 <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={formErrors.name ? inputErrorClass : inputClass} placeholder="Your full name" />
 {formErrors.name && <p className="text-[9px] text-destructive mt-1 font-sans font-bold">{formErrors.name}</p>}
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">Email</label>
 <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={formErrors.email ? inputErrorClass : inputClass} placeholder="your@email.com" />
 {formErrors.email && <p className="text-[9px] text-destructive mt-1 font-sans font-bold">{formErrors.email}</p>}
 </div>
 </div>

 <div className="mt-5">
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">Phone</label>
 <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={formErrors.phone ? inputErrorClass : inputClass} placeholder="10-digit mobile number" maxLength={10} />
 {formErrors.phone && <p className="text-[9px] text-destructive mt-1 font-sans font-bold">{formErrors.phone}</p>}
 </div>

 <div className="mt-5">
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">Address</label>
 <textarea rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={(formErrors.address ? inputErrorClass : inputClass) +"resize-none"} placeholder="Street, area, landmark" />
 {formErrors.address && <p className="text-[9px] text-destructive mt-1 font-sans font-bold">{formErrors.address}</p>}
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">City</label>
 <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={formErrors.city ? inputErrorClass : inputClass} placeholder="City" />
 {formErrors.city && <p className="text-[9px] text-destructive mt-1 font-sans font-bold">{formErrors.city}</p>}
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">State</label>
 <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={formErrors.state ? inputErrorClass : inputClass} placeholder="State" />
 {formErrors.state && <p className="text-[9px] text-destructive mt-1 font-sans font-bold">{formErrors.state}</p>}
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">Pincode</label>
 <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={formErrors.pincode ? inputErrorClass : inputClass} placeholder="6-digit pincode" maxLength={6} />
 {formErrors.pincode && <p className="text-[9px] text-destructive mt-1 font-sans font-bold">{formErrors.pincode}</p>}
 </div>
 </div>

 <div className="mt-6 border border-white/5 rounded-2xl p-5 bg-white/[0.02]">
 <label className="flex items-start gap-3 cursor-pointer">
 <input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="mt-0.5 w-4 h-4 accent-primary" />
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-primary"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
 <span className="text-sm font-sans font-bold text-foreground">Add gift wrapping</span>
 <span className="text-[10px] text-muted-foreground font-sans">+₹{GIFT_WRAP_FEE}</span>
 </div>
 <p className="text-[10px] text-muted-foreground/60 mt-1 font-light">Hand-wrapped in silk pouch with a personalized note card.</p>
 </div>
 </label>
 <AnimatePresence>
 {giftWrap && (
 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 overflow-hidden">
 <textarea rows={3} maxLength={200} value={giftMessage} onChange={(e) => setGiftMessage(e.target.value)} placeholder="Wishing you healing energy and abundance ✦" className={inputClass +"resize-none"} />
 <p className="text-[9px] text-muted-foreground/60 mt-1 text-right font-sans">{giftMessage.length}/200</p>
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 <button type="submit" className="w-full mt-8 py-3.5 rounded-xl text-[10px] font-sans font-black bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 border border-primary/20">
 Continue to Payment
 </button>
 </motion.form>
 )}

 {step === 1 && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="rounded-3xl border border-white/5 bg-[#0b0b0e]/50 backdrop-blur-md p-8"
 style={{ boxShadow: '0 15px 35px -10px rgba(0,0,0,0.3)' }}
 >
 <h2 className="font-serif text-xl text-foreground mb-6">Payment Method</h2>

 <div className="space-y-4">
 <button
 type="button"
 onClick={() => setPaymentMethod("cod")}
 className={`w-full text-left p-5 rounded-2xl border transition-all ${
 paymentMethod === "cod"
 ? "border-primary/40 bg-primary/5"
 : "border-white/5 bg-white/[0.02] hover:border-white/10"
 }`}
 >
 <div className="flex items-center gap-4">
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
 paymentMethod === "cod" ? "border-primary" : "border-white/20"
 }`}>
 {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
 </div>
 <div>
 <p className="text-sm font-sans font-bold text-foreground">Cash on Delivery</p>
 <p className="text-[10px] text-muted-foreground/60 mt-0.5">Pay when your order arrives</p>
 </div>
 </div>
 </button>

 <button
 type="button"
 onClick={() => {
 if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
 setPaymentMethod("cod");
 return;
 }
 setPaymentMethod("razorpay");
 }}
 className={`w-full text-left p-5 rounded-2xl border transition-all ${
 paymentMethod === "razorpay"
 ? "border-primary/40 bg-primary/5"
 : "border-white/5 bg-white/[0.02] hover:border-white/10"
 }`}
 >
 <div className="flex items-center gap-4">
 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
 paymentMethod === "razorpay" ? "border-primary" : "border-white/20"
 }`}>
 {paymentMethod === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
 </div>
 <div>
 <p className="text-sm font-sans font-bold text-foreground">Pay Online (Razorpay)</p>
 <p className="text-[10px] text-muted-foreground/60 mt-0.5">Credit / Debit card, UPI, Net Banking, Wallet</p>
 </div>
 </div>
 </button>
 </div>

 <div className="flex gap-4 mt-8">
 <button
 type="button"
 onClick={() => setStep(0)}
 className="flex-1 py-3.5 rounded-xl text-[10px] font-sans font-black border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 active:scale-[0.98] transition-all"
 >
 Back
 </button>
 <button
 type="button"
 onClick={() => setStep(2)}
 className="flex-1 py-3.5 rounded-xl text-[10px] font-sans font-black bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 border border-primary/20"
 >
 Review Order
 </button>
 </div>
 </motion.div>
 )}

 {step === 2 && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="rounded-3xl border border-white/5 bg-[#0b0b0e]/50 backdrop-blur-md p-8"
 style={{ boxShadow: '0 15px 35px -10px rgba(0,0,0,0.3)' }}
 >
 <h2 className="font-serif text-xl text-foreground mb-6">Review Your Order</h2>

 <div className="space-y-4">
 <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.02]">
 <h3 className="text-[9px] font-sans font-black text-muted-foreground mb-3">Shipping To</h3>
 <p className="text-sm text-foreground font-sans font-bold">{form.name}</p>
 <p className="text-xs text-muted-foreground/70 mt-0.5">{form.address}</p>
 <p className="text-xs text-muted-foreground/70">{form.city}, {form.state} — {form.pincode}</p>
 <p className="text-xs text-muted-foreground/70 mt-1">{form.phone}</p>
 <p className="text-xs text-muted-foreground/70">{form.email}</p>
 </div>

 <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.02]">
 <h3 className="text-[9px] font-sans font-black text-muted-foreground mb-3">Items ({items.length})</h3>
 <div className="space-y-3">
 {items.map((item) => (
 <div key={item.product.id} className="flex items-center gap-3">
 <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
 <div className="flex-1 min-w-0">
 <p className="text-xs text-foreground font-sans font-bold truncate">{item.product.name}</p>
 <p className="text-[10px] text-muted-foreground/60">Qty: {item.quantity}</p>
 </div>
 <p className="text-xs text-primary font-sans font-bold">₹{item.product.priceNum || item.product.price}</p>
 </div>
 ))}
 </div>
 </div>

 <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.02]">
 <h3 className="text-[9px] font-sans font-black text-muted-foreground mb-3">Payment</h3>
 <p className="text-xs text-foreground font-sans font-bold">
 {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
 </p>
 </div>

 {giftWrap && giftMessage && (
 <div className="border border-white/5 rounded-2xl p-5 bg-white/[0.02]">
 <h3 className="text-[9px] font-sans font-black text-muted-foreground mb-2">Gift Message</h3>
 <p className="text-xs text-muted-foreground/80 italic">&ldquo;{giftMessage}&rdquo;</p>
 </div>
 )}
 </div>

 <div className="flex gap-4 mt-8">
 <button
 type="button"
 onClick={() => setStep(1)}
 disabled={placing}
 className="flex-1 py-3.5 rounded-xl text-[10px] font-sans font-black border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 active:scale-[0.98] transition-all disabled:opacity-50"
 >
 Back
 </button>
 <button
 type="button"
 onClick={handlePlaceOrder}
 disabled={placing}
 className="flex-1 py-3.5 rounded-xl text-[10px] font-sans font-black bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 border border-primary/20 disabled:opacity-50"
 >
 {placing ? "Placing Order..." : `Place Order — ₹${grandTotal}`}
 </button>
 </div>
 </motion.div>
 )}
 </div>

 {/* Order Summary Sidebar */}
 <div>
 <div className="rounded-3xl border border-white/5 bg-[#0b0b0e]/50 backdrop-blur-md p-6 sticky top-28" style={{ boxShadow: '0 15px 35px -10px rgba(0,0,0,0.3)' }}>
 <h2 className="font-serif text-lg text-foreground mb-5">Order Summary</h2>

 <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
 {items.map((item) => (
 <div key={item.product.id} className="flex gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
 <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
 <div className="flex-1 min-w-0">
 <p className="text-[10px] font-sans font-bold text-foreground truncate">{item.product.name}</p>
 <p className="text-[10px] text-primary font-sans font-bold mt-0.5">₹{item.product.priceNum || item.product.price}</p>
 {step === 0 && (
 <div className="flex items-center gap-1 mt-1">
 <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-5 h-5 flex items-center justify-center rounded bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground text-[9px]">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><path d="M5 12h14"/></svg>
 </button>
 <span className="text-[9px] w-4 text-center font-sans font-bold">{item.quantity}</span>
 <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-5 h-5 flex items-center justify-center rounded bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground text-[9px]">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
 </button>
 <button onClick={() => removeItem(item.product.id)} className="ml-1 text-muted-foreground hover:text-destructive">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
 </button>
 </div>
 )}
 </div>
 </div>
 ))}
 </div>

 {/* Promo in sidebar */}
 <div className="mb-4">
 {appliedPromo ? (
 <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
 <div className="flex items-center gap-2">
 <CheckIcon className="w-3.5 h-3.5 text-green-400" />
 <span className="text-[10px] font-sans font-bold text-foreground">{appliedPromo.code}</span>
 <span className="text-[9px] text-muted-foreground">({appliedPromo.label})</span>
 </div>
 <button type="button" onClick={removePromo} className="text-[9px] text-muted-foreground hover:text-destructive font-sans font-bold">Remove</button>
 </div>
 ) : step < 2 && (
 <div>
 <div className="flex gap-2">
 <input type="text" value={promoInput} onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }} placeholder="Promo code" maxLength={20} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-[10px] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 font-sans font-bold"/>
 <button type="button" onClick={applyPromo} className="px-4 py-2.5 rounded-xl text-[9px] font-sans font-black bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all">Apply</button>
 </div>
 {promoError && <p className="text-[9px] text-destructive mt-1 font-sans font-bold">{promoError}</p>}
 </div>
 )}
 </div>

 <div className="border-t border-white/5 pt-4 space-y-2">
 <div className="flex justify-between text-xs text-muted-foreground">
 <span>Subtotal</span>
 <span className="text-foreground font-sans font-bold">₹{totalPrice}</span>
 </div>
 {discount > 0 && (
 <div className="flex justify-between text-xs text-muted-foreground">
 <span>Discount</span>
 <span className="text-green-400 font-sans font-bold">−₹{discount}</span>
 </div>
 )}
 {giftWrap && (
 <div className="flex justify-between text-xs text-muted-foreground">
 <span>Gift wrap</span>
 <span className="text-foreground font-sans font-bold">₹{GIFT_WRAP_FEE}</span>
 </div>
 )}
 <div className="flex justify-between text-xs text-muted-foreground">
 <span>Shipping</span>
 <span className={shipping === 0 ? "text-green-400 font-sans font-bold" : "text-foreground font-sans font-bold"}>
 {shipping === 0 ? "FREE" : `₹${shipping}`}
 </span>
 </div>
 {totalPrice < FREE_SHIPPING_THRESHOLD && totalPrice > 0 && (
 <p className="text-[9px] text-muted-foreground/60 text-center font-sans font-bold ">
 Add ₹{FREE_SHIPPING_THRESHOLD - totalPrice} more for free shipping
 </p>
 )}
 </div>

 <div className="border-t border-white/5 pt-4 mt-4">
 <div className="flex justify-between items-center">
 <span className="text-sm font-serif text-foreground">Total</span>
 <span className="text-lg font-serif text-primary font-bold">₹{grandTotal}</span>
 </div>
 </div>

 {step === 0 && (
 <div className="border-t border-white/5 pt-4 mt-4">
 <div className="flex items-center gap-2 text-[9px] text-muted-foreground/60 font-sans font-bold ">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-green-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
 Secure checkout
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default CheckoutPage;
