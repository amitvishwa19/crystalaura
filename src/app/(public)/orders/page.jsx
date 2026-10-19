'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useOrders } from "../_context/CrystalAuraProviders";

const PackageIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><polyline points="12 22 12 12"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="7.5" y1="4.5" x2="16.5" y2="10.5"/></svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
);

const statusConfig = {
 confirmed: { label: "Confirmed", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
 shipped: { label: "Shipped", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
 delivered: { label: "Delivered", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
 cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

const OrdersPage = () => {
 const { orders } = useOrders();
 const [expanded, setExpanded] = useState(null);

 const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

 if (orders.length === 0) {
 return (
 <div className="min-h-screen flex items-center justify-center pt-24 pb-20 px-6">
 <div className="text-center max-w-md">
 <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
 <PackageIcon className="w-7 h-7 text-muted-foreground" />
 </div>
 <h1 className="font-serif text-2xl text-foreground mb-2">No orders yet</h1>
 <p className="text-sm text-muted-foreground/70 font-light mb-6">Your order history will appear here</p>
 <Link href="/shop" className="inline-block text-[10px] font-sans font-black text-[11px]rimary bg-primary/10 border border-primary/20 px-8 py-3.5 rounded-xl hover:bg-primary/20 active:scale-95 transition-all">
 Start Shopping
 </Link>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen pt-28 pb-20 px-6">
 <div className="max-w-3xl mx-auto">
 <div className="text-center mb-12">
 <p className="text-[10px] font-sans font-black text-[11px]rimary mb-3">Your Orders</p>
 <h1 className="font-serif text-3xl md:text-4xl text-foreground">
 Order <span className="text-gold-gradient italic">History</span>
 </h1>
 <p className="text-sm text-muted-foreground/70 font-light mt-3">{orders.length} {orders.length === 1 ? "order" : "orders"} placed</p>
 </div>

 <div className="space-y-4">
 {[...orders].reverse().map((order) => {
 const status = statusConfig[order.status] || statusConfig.confirmed;
 const isExpanded = expanded === order.id;
 const orderDate = new Date(order.date).toLocaleDateString("en-IN", {
 day: "numeric", month: "long", year: "numeric",
 });

 return (
 <motion.div
 key={order.id}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="rounded-2xl border border-white/5 bg-[#0e0b17]/50 backdrop-blur-md overflow-hidden"
 style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}
 >
 <button
 onClick={() => toggleExpand(order.id)}
 className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-all"
 >
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 mb-1">
 <span className={`text-[9px] font-sans font-black px-2 py-0.5 rounded-full ${status.bg} ${status.color} ${status.border} border`}>
 {status.label}
 </span>
 <span className="text-[9px] text-muted-foreground/60 font-sans font-bold">{orderDate}</span>
 </div>
 <p className="text-[10px] font-sans font-bold text-muted-foreground mt-1">
 {order.id}
 </p>
 <div className="flex items-center gap-2 mt-1">
 <span className="text-[11px]s font-sans font-bold text-foreground">{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
 <span className="text-muted-foreground/40">•</span>
 <span className="text-[11px]s font-serif text-[11px]rimary font-bold">₹{order.total}</span>
 </div>
 </div>
 <ChevronDownIcon className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
 </button>

 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ height: 0, opacity: 0 }}
 animate={{ height: "auto", opacity: 1 }}
 exit={{ height: 0, opacity: 0 }}
 transition={{ duration: 0.3 }}
 className="overflow-hidden"
 >
 <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
 <div className="space-y-2">
 {order.items.map((item) => (
 <div key={item.product.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
 <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
 <div className="flex-1 min-w-0">
 <p className="text-[11px]s text-foreground font-sans font-bold truncate">{item.product.name}</p>
 <div className="flex items-center gap-2 mt-0.5">
 <span className="text-[10px] text-muted-foreground/60 font-sans">Qty: {item.quantity}</span>
 <span className="text-[10px] text-[11px]rimary font-sans font-bold">₹{item.product.priceNum || item.product.price}</span>
 </div>
 </div>
 </div>
 ))}
 </div>

 <div className="grid grid-cols-2 gap-3 text-[11px]s text-muted-foreground">
 <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
 <p className="text-[9px] font-sans font-black mb-1">Shipping To</p>
 <p className="text-foreground font-sans font-bold text-[11px]">{order.shippingAddress?.name}</p>
 <p className="text-[10px] mt-0.5">{order.shippingAddress?.address}</p>
 <p className="text-[10px]">{order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}</p>
 </div>
 <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
 <p className="text-[9px] font-sans font-black mb-1">Payment</p>
 <p className="text-foreground font-sans font-bold text-[11px]">
 {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
 </p>
 {order.promoCode && (
 <p className="text-[10px] mt-1">Promo: <span className="text-[11px]rimary font-sans font-bold">{order.promoCode}</span></p>
 )}
 </div>
 </div>

 <div className="border-t border-white/5 pt-3 space-y-1 text-[11px]s text-muted-foreground">
 <div className="flex justify-between"><span>Subtotal</span><span className="text-foreground font-sans font-bold">₹{order.subtotal}</span></div>
 {order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span className="text-green-400 font-sans font-bold">−₹{order.discount}</span></div>}
 {order.giftWrap > 0 && <div className="flex justify-between"><span>Gift wrap</span><span className="text-foreground font-sans font-bold">₹{order.giftWrap}</span></div>}
 <div className="flex justify-between"><span>Shipping</span><span className={order.shipping === 0 ? "text-green-400 font-sans font-bold" : "text-foreground font-sans font-bold"}>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span></div>
 <div className="flex justify-between text-sm font-serif pt-2 border-t border-white/5"><span className="text-foreground">Total</span><span className="text-[11px]rimary font-bold text-base">₹{order.total}</span></div>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.div>
 );
 })}
 </div>
 </div>
 </div>
 );
};

export default OrdersPage;
