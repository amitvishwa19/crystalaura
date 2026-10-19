'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useOrders } from "../_context/CrystalAuraProviders";

const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const OrderSuccessPage = () => {
 const [orderId, setOrderId] = useState(null);
 const [ready, setReady] = useState(false);
 const { orders } = useOrders();
 const order = orders.find((o) => o.id === orderId);

 useEffect(() => {
 setOrderId(new URLSearchParams(window.location.search).get("id"));
 setReady(true);
 }, []);

 if (!ready) {
 return <div className="min-h-screen" />;
 }

 if (!orderId) {
 return (
 <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-6">
 <div className="text-center max-w-md">
 <h1 className="font-serif text-2xl text-foreground mb-2">No order found</h1>
 <p className="text-sm text-muted-foreground/70 font-light mb-6">This page needs a valid order ID.</p>
 <Link href="/shop" className="inline-block text-sm font-sans font-black text-primary bg-primary/10 border border-primary/20 px-8 py-3.5 rounded-xl hover:bg-primary/20 active:scale-95 transition-all">
 Continue Shopping
 </Link>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen pt-28 pb-20 px-6">
 <div className="max-w-2xl mx-auto">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.5 }}
 className="rounded-3xl border border-white/5 bg-[#0b0b0e]/50 backdrop-blur-md p-10 text-center"
 style={{ boxShadow: '0 25px 60px -20px rgba(139,92,246,0.15)' }}
 >
 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ delay: 0.2, type: "spring", damping: 15 }}
 >
 <CheckCircleIcon className="w-10 h-10 text-green-400" />
 </motion.div>
 </div>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 >
 <p className="text-sm font-sans font-black text-primary mb-3">
 Order Confirmed
 </p>
 <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
 Thank You, <span className="text-gold-gradient italic">{order?.shippingAddress?.name?.split(" ")[0] || "Guest"}</span>
 </h1>
 <p className="text-sm text-muted-foreground/70 font-light max-w-md mx-auto mb-8">
 Your order has been placed successfully. You will receive a confirmation email shortly.
 </p>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] mb-8 text-left"
 >
 <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
 <div>
 <p className="text-sm font-sans font-black text-muted-foreground">Order ID</p>
 <p className="text-sm font-sans font-bold text-foreground mt-0.5">{orderId}</p>
 </div>
 <div className="text-right">
 <p className="text-sm font-sans font-black text-muted-foreground">Status</p>
 <span className="inline-block mt-0.5 text-sm font-sans font-black px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
 Confirmed
 </span>
 </div>
 </div>

 <div className="space-y-3">
 {order?.items?.map((item) => (
 <div key={item.product.id} className="flex items-center gap-3">
 <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
 <div className="flex-1 min-w-0">
 <p className="text-xs text-foreground font-sans font-bold truncate">{item.product.name}</p>
 <p className="text-sm text-muted-foreground/60">Qty: {item.quantity}</p>
 </div>
 <p className="text-xs text-primary font-sans font-bold">₹{item.product.priceNum || item.product.price}</p>
 </div>
 ))}
 </div>

 <div className="border-t border-white/5 pt-4 mt-4 space-y-1.5 text-xs text-muted-foreground">
 <div className="flex justify-between">
 <span>Subtotal</span>
 <span className="text-foreground font-sans font-bold">₹{order?.subtotal}</span>
 </div>
 {order?.discount > 0 && (
 <div className="flex justify-between">
 <span>Discount</span>
 <span className="text-green-400 font-sans font-bold">−₹{order.discount}</span>
 </div>
 )}
 {order?.giftWrap > 0 && (
 <div className="flex justify-between">
 <span>Gift wrap</span>
 <span className="text-foreground font-sans font-bold">₹{order.giftWrap}</span>
 </div>
 )}
 <div className="flex justify-between">
 <span>Shipping</span>
 <span className={order?.shipping === 0 ? "text-green-400 font-sans font-bold" : "text-foreground font-sans font-bold"}>
 {order?.shipping === 0 ? "FREE" : `₹${order?.shipping}`}
 </span>
 </div>
 <div className="flex justify-between text-sm font-serif pt-2 border-t border-white/5">
 <span className="text-foreground">Total</span>
 <span className="text-primary font-bold">₹{order?.total}</span>
 </div>
 </div>

 <div className="mt-4 pt-4 border-t border-white/5">
 <p className="text-sm font-sans font-black text-muted-foreground mb-2">Shipping To</p>
 <p className="text-xs text-foreground font-sans font-bold">{order?.shippingAddress?.name}</p>
 <p className="text-sm text-muted-foreground/70">{order?.shippingAddress?.address}</p>
 <p className="text-sm text-muted-foreground/70">{order?.shippingAddress?.city}, {order?.shippingAddress?.state} — {order?.shippingAddress?.pincode}</p>
 </div>

 <div className="mt-4 pt-4 border-t border-white/5">
 <p className="text-sm font-sans font-black text-muted-foreground mb-2">Payment</p>
 <p className="text-xs text-foreground font-sans font-bold">
 {order?.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
 </p>
 </div>
 </motion.div>

 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5 }}
 className="flex flex-col sm:flex-row justify-center gap-4"
 >
 <Link href="/orders" className="text-sm font-sans font-black px-8 py-3.5 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 active:scale-95 transition-all">
 View All Orders
 </Link>
 <Link href="/shop" className="text-sm font-sans font-black px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 border border-primary/20">
 Continue Shopping
 </Link>
 </motion.div>
 </motion.div>
 </div>
 </div>
 );
};

export default OrderSuccessPage;
