'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useOrders, useWishlist, useCart } from "../_context/CrystalAuraProviders";

const tabs = [
 { id: "cart", label: "Cart" },
 { id: "orders", label: "Orders" },
 { id: "wishlist", label: "Wishlist" },
 { id: "profile", label: "Profile" },
 { id: "addresses", label: "Addresses" },
];

const UserIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const PackageIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><polyline points="12 22 12 12"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="7.5" y1="4.5" x2="16.5" y2="10.5"/></svg>
);

const HeartIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

const MapPinIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const LogOutIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const StoreIcon = ({ className = "w-4 h-4" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
);

const PROFILE_KEY = "crystal-aura-profile";
const ADDRESSES_KEY = "crystal-aura-addresses";

const AccountPage = () => {
 const { data: session, status } = useSession();
 const { orders } = useOrders();
 const { items: wishlistItems } = useWishlist();
 const { items: cartItems, totalPrice, totalItems, updateQuantity, removeItem } = useCart();

 const [active, setActive] = useState("orders");

 const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
 const [profileSaved, setProfileSaved] = useState(false);
 const [addresses, setAddresses] = useState([]);
 const [showAddressForm, setShowAddressForm] = useState(false);
 const [editingAddress, setEditingAddress] = useState(null);
 const [addressForm, setAddressForm] = useState({ label: "", name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });

 useEffect(() => {
 const stored = localStorage.getItem(PROFILE_KEY);
 if (stored) setProfile(JSON.parse(stored));
 }, []);

 useEffect(() => {
 const stored = localStorage.getItem(ADDRESSES_KEY);
 if (stored) setAddresses(JSON.parse(stored));
 }, []);

 const saveProfile = () => {
 localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
 setProfileSaved(true);
 setTimeout(() => setProfileSaved(false), 2000);
 };

 const saveAddress = () => {
 const addr = { ...addressForm, id: editingAddress?.id || `addr_${Date.now()}` };
 if (editingAddress) {
 setAddresses((prev) => prev.map((a) => (a.id === editingAddress.id ? addr : a)));
 } else {
 if (addr.isDefault) setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })));
 setAddresses((prev) => [...prev, addr]);
 }
 resetAddressForm();
 setShowAddressForm(false);
 setEditingAddress(null);
 };

 useEffect(() => { localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses)); }, [addresses]);

 const deleteAddress = (id) => setAddresses((prev) => prev.filter((a) => a.id !== id));

 const editAddress = (addr) => {
 setAddressForm(addr);
 setEditingAddress(addr);
 setShowAddressForm(true);
 };

 const resetAddressForm = () => setAddressForm({ label: "", name: "", phone: "", address: "", city: "", state: "", pincode: "", isDefault: false });

 const displayName = session?.user?.name || profile.name || "Guest";
 const displayEmail = session?.user?.email || profile.email || "Not set";
 const displayImage = session?.user?.image || null;

 const isLoggedIn = status === "authenticated";

 const profileDisplay = session?.user
 ? { name: session.user.name || profile.name || "", email: session.user.email || profile.email || "", phone: profile.phone || "" }
 : profile;

 const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-all font-sans";

 const tabContent = (id) => {
 const isTabActive = active === id;
 return (
 <button
 key={id}
 onClick={() => setActive(id)}
 className={`relative px-5 py-3 text-[9px] font-sans font-black transition-all duration-300 rounded-xl ${
 isTabActive
 ? "text-foreground bg-white/5 border border-primary/20"
 : "text-muted-foreground/60 hover:text-foreground border border-transparent"
 }`}
 >
 {id}
 </button>
 );
 };

 return (
 <div className="min-h-screen pt-28 pb-20 px-6">
 <div className="max-w-7xl mx-auto">
 <div className="text-center mb-10">
 <p className="text-[10px] font-sans font-black text-primary mb-3">Account</p>
 <h1 className="font-serif text-3xl md:text-4xl text-foreground">
 My <span className="text-gold-gradient italic">Dashboard</span>
 </h1>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
 {/* Sidebar */}
 <div>
 <div className="rounded-2xl border border-white/5 bg-[#0b0b0e]/50 backdrop-blur-md p-6 sticky top-28" style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}>
 <div className="flex flex-col items-center text-center pb-5 border-b border-white/5">
 <div className="w-16 h-16 rounded-full border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-3 overflow-hidden">
 {displayImage ? (
 <img src={displayImage} alt="" className="w-full h-full object-cover" />
 ) : (
 <UserIcon className="w-7 h-7 text-primary" />
 )}
 </div>
 <h3 className="font-serif text-base text-foreground">{displayName}</h3>
 <p className="text-[10px] text-muted-foreground/70 mt-0.5 font-sans">{displayEmail}</p>
 </div>

 <nav className="mt-4 space-y-1">
 {tabs.map((tab) => {
 const isActive = active === tab.id;
 const count = tab.id === "cart" ? cartItems.length : tab.id === "orders" ? orders.length : tab.id === "wishlist" ? wishlistItems.length : null;
 return (
 <button
 key={tab.id}
 onClick={() => setActive(tab.id)}
 className={`w-full text-left flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-sans font-bold transition-all duration-300 ${
 isActive
 ? "text-foreground bg-primary/10 border border-primary/20"
 : "text-muted-foreground/70 hover:text-foreground hover:bg-white/5 border border-transparent"
 }`}
 >
 <span>{tab.label}</span>
 {count !== null && (
 <span className={`text-[9px] px-2 py-0.5 rounded-full ${
 isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
 }`}>
 {count}
 </span>
 )}
 </button>
 );
 })}
 </nav>

 <div className="mt-4 pt-4 border-t border-white/5 space-y-1">
 <Link
 href="/orders"
 className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[9px] font-sans font-bold text-muted-foreground/70 hover:text-foreground hover:bg-white/5 transition-all border border-transparent"
 >
 <PackageIcon className="w-3.5 h-3.5" />
 All Orders
 </Link>
 <Link
 href="/shop"
 className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[9px] font-sans font-bold text-muted-foreground/70 hover:text-foreground hover:bg-white/5 transition-all border border-transparent"
 >
 <StoreIcon className="w-3.5 h-3.5" />
 Browse Shop
 </Link>
 </div>

 <button
 onClick={() => signOut({ callbackUrl: "/" })}
 className="w-full mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[9px] font-sans font-bold text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-all"
 >
 <LogOutIcon className="w-3.5 h-3.5" />
 Sign Out
 </button>
 </div>
 </div>

 {/* Main Content */}
 <motion.div
 key={active}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3 }}
 className="rounded-2xl border border-white/5 bg-[#0b0b0e]/50 backdrop-blur-md p-8 min-h-[500px]"
 style={{ boxShadow: '0 15px 35px -10px rgba(0,0,0,0.3)' }}
 >
 {active === "orders" && (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="font-serif text-xl text-foreground">Order History</h2>
 <p className="text-[10px] text-muted-foreground/70 mt-1 font-sans font-bold ">Track and manage your orders</p>
 </div>
 {orders.length > 0 && (
 <Link href="/orders" className="text-[10px] font-sans font-black text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/20 transition-all">
 View All
 </Link>
 )}
 </div>
 {orders.length === 0 ? (
 <div className="border border-dashed border-white/10 rounded-xl py-16 flex flex-col items-center text-center">
 <PackageIcon className="w-8 h-8 text-muted-foreground/40 mb-4" />
 <h3 className="font-serif text-lg text-foreground">No orders yet</h3>
 <p className="text-xs text-muted-foreground/60 mt-1 font-light mb-6">Start your crystal journey with us</p>
 <Link href="/shop" className="text-[10px] font-sans font-black px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 border border-primary/20">
 Browse Shop
 </Link>
 </div>
 ) : (
 <div className="space-y-3">
 {[...orders].reverse().slice(0, 5).map((order) => (
 <Link
 key={order.id}
 href={`/order-success?id=${order.id}`}
 className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group"
 >
 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
 <PackageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs text-foreground font-sans font-bold truncate">{order.id}</p>
 <p className="text-[10px] text-muted-foreground/60 mt-0.5">{order.items.length} {order.items.length === 1 ? "item" : "items"} — ₹{order.total}</p>
 </div>
 <div className="text-right">
 <span className="inline-block text-[9px] font-sans font-black px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
 {order.status}
 </span>
 <p className="text-[9px] text-muted-foreground/60 mt-1">
 {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
 </p>
 </div>
 </Link>
 ))}
 {orders.length > 5 && (
 <Link href="/orders" className="block text-center text-[10px] font-sans font-black text-primary mt-4 hover:underline">
 View all {orders.length} orders
 </Link>
 )}
 </div>
 )}
 </div>
 )}

 {active === "cart" && (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="font-serif text-xl text-foreground">Shopping Cart</h2>
 <p className="text-[10px] text-muted-foreground/70 mt-1 font-sans font-bold ">{totalItems} {totalItems === 1 ? "item" : "items"} — ₹{totalPrice}</p>
 </div>
 {cartItems.length > 0 && (
 <Link href="/checkout" className="text-[10px] font-sans font-black px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 border border-primary/20">
 Checkout
 </Link>
 )}
 </div>
 {cartItems.length === 0 ? (
 <div className="border border-dashed border-white/10 rounded-xl py-16 flex flex-col items-center text-center">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-muted-foreground/40 mb-4"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
 <h3 className="font-serif text-lg text-foreground">Your cart is empty</h3>
 <p className="text-xs text-muted-foreground/60 mt-1 font-light mb-6">Discover our sacred collection</p>
 <Link href="/shop" className="text-[10px] font-sans font-black px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 border border-primary/20">
 Browse Shop
 </Link>
 </div>
 ) : (
 <div className="space-y-3">
 {cartItems.map((item) => (
 <div key={item.product.id} className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
 <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
 <div className="flex-1 min-w-0 flex flex-col justify-between">
 <div>
 <div className="flex items-start justify-between gap-2">
 <h4 className="text-sm font-serif text-foreground truncate">{item.product.name}</h4>
 <button onClick={() => removeItem(item.product.id)} className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
 </button>
 </div>
 <p className="text-xs text-primary font-sans font-bold mt-0.5">₹{item.product.priceNum || item.product.price}</p>
 </div>
 <div className="flex items-center gap-2">
 <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-xs">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M5 12h14"/></svg>
 </button>
 <span className="text-xs font-sans font-bold text-foreground w-6 text-center">{item.quantity}</span>
 <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-xs">
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {active === "wishlist" && (
 <div>
 <div className="mb-6">
 <h2 className="font-serif text-xl text-foreground">My Wishlist</h2>
 <p className="text-[10px] text-muted-foreground/70 mt-1 font-sans font-bold ">{wishlistItems.length} saved items</p>
 </div>
 {wishlistItems.length === 0 ? (
 <div className="border border-dashed border-white/10 rounded-xl py-16 flex flex-col items-center text-center">
 <HeartIcon className="w-8 h-8 text-muted-foreground/40 mb-4" />
 <h3 className="font-serif text-lg text-foreground">No favorites yet</h3>
 <p className="text-xs text-muted-foreground/60 mt-1 font-light mb-6">Tap the heart on any product to save it</p>
 <Link href="/shop" className="text-[10px] font-sans font-black px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 border border-primary/20">
 Browse Shop
 </Link>
 </div>
 ) : (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
 {wishlistItems.map((p) => (
 <Link key={p.id} href={`/shop/${p.id}`} className="group rounded-xl border border-white/5 bg-white/[0.02] hover:border-primary/30 transition-all overflow-hidden">
 <div className="aspect-square overflow-hidden">
 <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
 </div>
 <div className="p-3">
 <p className="text-xs text-foreground font-sans font-bold truncate">{p.name}</p>
 <p className="text-xs text-primary font-sans font-bold mt-1">₹{p.priceNum || p.price}</p>
 </div>
 </Link>
 ))}
 </div>
 )}
 </div>
 )}

 {active === "profile" && (
 <div>
 <div className="mb-6">
 <h2 className="font-serif text-xl text-foreground">Profile</h2>
 <p className="text-[10px] text-muted-foreground/70 mt-1 font-sans font-bold ">Manage your personal information</p>
 </div>
 <div className="max-w-xl space-y-5">
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">Full Name</label>
 <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={inputClass} placeholder={session?.user?.name || "Your name"} />
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">Email</label>
 <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={inputClass} placeholder={session?.user?.email || "your@email.com"} />
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1.5 block">Phone</label>
 <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} placeholder="10-digit mobile number" maxLength={10} />
 </div>
 <button
 onClick={saveProfile}
 className="text-[10px] font-sans font-black px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 border border-primary/20"
 >
 {profileSaved ? "Saved ✓" : "Save Changes"}
 </button>
 </div>
 </div>
 )}

 {active === "addresses" && (
 <div>
 <div className="flex items-center justify-between mb-6">
 <div>
 <h2 className="font-serif text-xl text-foreground">Saved Addresses</h2>
 <p className="text-[10px] text-muted-foreground/70 mt-1 font-sans font-bold ">Manage your shipping addresses</p>
 </div>
 <button
 onClick={() => { setShowAddressForm(true); setEditingAddress(null); resetAddressForm(); }}
 className="text-[10px] font-sans font-black px-5 py-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all"
 >
 + Add New
 </button>
 </div>

 {addresses.length === 0 && !showAddressForm ? (
 <div className="border border-dashed border-white/10 rounded-xl py-16 flex flex-col items-center text-center">
 <MapPinIcon className="w-8 h-8 text-muted-foreground/40 mb-4" />
 <h3 className="font-serif text-lg text-foreground">No addresses saved</h3>
 <p className="text-xs text-muted-foreground/60 mt-1 font-light">Add an address for faster checkout</p>
 </div>
 ) : (
 <div className="space-y-3 mb-6">
 {addresses.map((addr) => (
 <div key={addr.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <p className="text-xs text-foreground font-sans font-bold">{addr.name}</p>
 {addr.isDefault && (
 <span className="text-[8px] font-sans font-black px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Default</span>
 )}
 </div>
 <p className="text-[10px] text-muted-foreground/70 mt-0.5">{addr.address}</p>
 <p className="text-[10px] text-muted-foreground/70">{addr.city}, {addr.state} — {addr.pincode}</p>
 <p className="text-[10px] text-muted-foreground/70 mt-0.5">{addr.phone}</p>
 <p className="text-[9px] text-muted-foreground/50 mt-1">{addr.label}</p>
 </div>
 <div className="flex gap-1.5 flex-shrink-0">
 <button onClick={() => editAddress(addr)} className="px-3 py-1.5 rounded-lg text-[9px] font-sans font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/10 transition-all">Edit</button>
 <button onClick={() => deleteAddress(addr.id)} className="px-3 py-1.5 rounded-lg text-[9px] font-sans font-bold text-destructive/70 hover:text-destructive hover:bg-destructive/10 border border-white/10 transition-all">Delete</button>
 </div>
 </div>
 ))}
 </div>
 )}

 <AnimatePresence>
 {showAddressForm && (
 <motion.div
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: "auto" }}
 exit={{ opacity: 0, height: 0 }}
 className="overflow-hidden border border-white/5 rounded-2xl p-5 bg-white/[0.02]"
 >
 <h3 className="text-xs font-serif text-foreground mb-4">{editingAddress ? "Edit Address" : "New Address"}</h3>
 <div className="space-y-4">
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1 block">Label (e.g. Home, Office)</label>
 <input type="text" value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} className={inputClass} placeholder="Home" />
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1 block">Full Name</label>
 <input type="text" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} className={inputClass} placeholder="Recipient name" />
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1 block">Phone</label>
 <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className={inputClass} placeholder="10-digit number" maxLength={10} />
 </div>
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1 block">Address</label>
 <textarea rows={2} value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} className={inputClass +"resize-none"} placeholder="Street, area, landmark" />
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1 block">City</label>
 <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className={inputClass} />
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1 block">State</label>
 <input type="text" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className={inputClass} />
 </div>
 <div>
 <label className="text-[9px] font-sans font-black text-muted-foreground mb-1 block">Pincode</label>
 <input type="text" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} className={inputClass} maxLength={6} />
 </div>
 </div>
 <label className="flex items-center gap-2 cursor-pointer">
 <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="w-4 h-4 accent-primary" />
 <span className="text-[10px] font-sans font-bold text-muted-foreground">Set as default address</span>
 </label>
 <div className="flex gap-3 pt-2">
 <button onClick={saveAddress} className="text-[10px] font-sans font-black px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500/90 via-violet-400/90 to-violet-500/90 text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 border border-primary/20">
 {editingAddress ? "Update Address" : "Save Address"}
 </button>
 <button onClick={() => { setShowAddressForm(false); setEditingAddress(null); resetAddressForm(); }} className="text-[10px] font-sans font-black px-6 py-3 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
 Cancel
 </button>
 </div>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 )}
 </motion.div>
 </div>
 </div>
 </div>
 );
};

export default AccountPage;
