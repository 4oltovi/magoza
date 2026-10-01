"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; category: string; price: number; unit: string; store: string; storeId: string; emoji: string };
type CartLine = Product & { quantity: number };

const fallbackProducts: Product[] = [
  { id: "demo-1", name: "Сементи сохтмонӣ", category: "Масолеҳи сохтмонӣ", price: 58, unit: "халта", store: "Мағозаи Бохтар", storeId: "demo-store", emoji: "🧱" },
  { id: "demo-2", name: "Арматура 12 мм", category: "Арматура ва металл", price: 12, unit: "метр", store: "Сохтмон Маркет", storeId: "demo-store", emoji: "🔩" },
  { id: "demo-3", name: "Ранги деворӣ сафед", category: "Ранг ва ороиш", price: 145, unit: "дона", store: "Ороиши хона", storeId: "demo-store", emoji: "🎨" },
  { id: "demo-4", name: "Дрели барқӣ", category: "Асбобҳои сохтмонӣ", price: 420, unit: "дона", store: "Асбобҳои Бохтар", storeId: "demo-store", emoji: "🛠️" },
  { id: "demo-5", name: "Қубури об 25 мм", category: "Сантехника", price: 18, unit: "метр", store: "Сантехник", storeId: "demo-store", emoji: "🚰" },
  { id: "demo-6", name: "Кабели барқӣ", category: "Барқ ва равшанӣ", price: 9, unit: "метр", store: "Электро Бохтар", storeId: "demo-store", emoji: "💡" },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Ҳама");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [checkout, setCheckout] = useState(false);
  const [form, setForm] = useState({ buyerName: "", buyerPhone: "+992", deliveryAddress: "", deliveryNote: "" });
  const [orderNumber, setOrderNumber] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(20);
  const [platformName, setPlatformName] = useState("Сохтмон Бохтар");

  useEffect(() => {
    Promise.all([
      fetch("/api/products?limit=100").then((response) => response.ok ? response.json() : Promise.reject(new Error("Products unavailable"))),
      fetch("/api/settings/public").then((response) => response.ok ? response.json() : { settings: {} }),
    ])
      .then(([productData, settingsData]) => {
        const mapped = (productData.items ?? []).map((item: { id: string; name: string; price: string | number; unit: string; storeId: string; store?: { name?: string }; category?: { name?: string } }) => ({ id: item.id, name: item.name, category: item.category?.name ?? "Бе категория", price: Number(item.price), unit: item.unit, store: item.store?.name ?? "Мағоза", storeId: item.storeId, emoji: "🧱" }));
        if (mapped.length) setProducts(mapped);
        const publicSettings = settingsData.settings ?? {};
        const configuredFee = Number(publicSettings.DELIVERY_FEE);
        if (Number.isFinite(configuredFee) && configuredFee >= 0) setDeliveryFee(configuredFee);
        if (typeof publicSettings.PLATFORM_NAME === "string" && publicSettings.PLATFORM_NAME.trim()) setPlatformName(publicSettings.PLATFORM_NAME.trim());
      })
      .catch(() => setNotice("Ҳоло маълумоти намунавӣ нишон дода мешавад."))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Ҳама", ...Array.from(new Set(products.map((product) => product.category)))];
  const filtered = useMemo(() => products.filter((product) => (category === "Ҳама" || product.category === category) && `${product.name} ${product.store}`.toLowerCase().includes(query.toLowerCase())), [products, query, category]);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;

  function add(product: Product) { setCart((items) => { const existing = items.find((item) => item.id === product.id); return existing ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1 }]; }); setNotice(`${product.name} ба сабад илова шуд`); }
  function changeQuantity(id: string, delta: number) { setCart((items) => items.flatMap((item) => item.id === id ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item])); }
  async function submitOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!cart.length) return;
    if (cart.some((item) => item.id.startsWith("demo-"))) { setNotice("Барои фармоиши воқеӣ аввал MySQL ва seed-ро иҷро кунед."); return; }
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, storeId: cart[0].storeId, paymentMethod: "CARD_TRANSFER", items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })) }) });
    const data = await response.json();
    if (!response.ok) { setNotice(data.error ?? "Фармоиш сохта нашуд."); return; }
    setOrderNumber(data.order.orderNumber); setCart([]); setCheckout(false); setNotice("Фармоиш қабул шуд. Акнун маблағро интиқол диҳед.");
  }

  return <main><header className="header"><div className="brand"><span className="brandMark">С</span><div><b>{platformName}</b><small>Бозори масолеҳи сохтмонӣ</small></div></div><button className="cart" onClick={() => setCheckout(true)}>🛒 Сабад ({cart.reduce((sum, item) => sum + item.quantity, 0)})</button></header>
    <section className="hero"><div><span className="eyebrow">БОХТАР · ТОҶИКИСТОН</span><h1>Ҳамаи чиз барои сохтмон, дар як ҷо.</h1><p>Маҳсулоти мағозаҳои Бохтарро пайдо кунед ва фармоиш диҳед.</p><div className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Маҳсулот ё мағозаро ҷустуҷӯ кунед" /></div></div><div className="heroArt">🏠<span>+</span>🧱</div></section>
    <section className="section"><div className="sectionHead"><div><span className="eyebrow">КАТАЛОГ</span><h2>Маҳсулоти пешниҳодшуда</h2></div><span className="count">{loading ? "..." : `${filtered.length} маҳсулот`}</span></div><div className="chips">{categories.map((item) => <button key={item} className={category === item ? "chip active" : "chip"} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="grid">{filtered.map((product) => <article className="card" key={product.id}><div className="productVisual">{product.emoji}</div><div className="cardBody"><span className="category">{product.category}</span><h3>{product.name}</h3><p className="store">● {product.store}</p><div className="priceRow"><strong>{product.price.toLocaleString("tg-TJ")} сомонӣ</strong><span>/ {product.unit}</span></div><button className="add" onClick={() => add(product)}>Ба сабад илова кардан <span>+</span></button></div></article>)}</div>{!filtered.length && <div className="empty">Маҳсулот ёфт нашуд.</div>}</section>
    {orderNumber && <section className="orderNotice"><b>Фармоиши шумо: {orderNumber}</b><span>Маблағи фармоишро ба рақами пардохти маъмур интиқол дода, расидро нигоҳ доред.</span></section>}
    <footer><b>{platformName}</b><span>Платформаи маҳаллии масолеҳи сохтмонӣ · © 2026</span><span>Бохтар, Тоҷикистон</span></footer>
    {checkout && <div className="modalBackdrop" onClick={() => setCheckout(false)}><section className="checkout" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setCheckout(false)}>×</button><h2>Сабад ва фармоиш</h2>{cart.length ? <><div className="cartLines">{cart.map((item) => <div className="cartLine" key={item.id}><span>{item.name}<small>{item.price} сомонӣ / {item.unit}</small></span><div><button type="button" onClick={() => changeQuantity(item.id, -1)}>−</button><b>{item.quantity}</b><button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button></div></div>)}</div><div className="summary"><span>Маҳсулот: {subtotal.toLocaleString("tg-TJ")} сомонӣ</span><span>Расондан: {deliveryFee} сомонӣ</span><b>Ҳамагӣ: {total.toLocaleString("tg-TJ")} сомонӣ</b></div><form onSubmit={submitOrder}><input required placeholder="Номи пурра" value={form.buyerName} onChange={(event) => setForm({ ...form, buyerName: event.target.value })} /><input required placeholder="Телефон: +992..." value={form.buyerPhone} onChange={(event) => setForm({ ...form, buyerPhone: event.target.value })} /><input required placeholder="Суроғаи расондан дар Бохтар" value={form.deliveryAddress} onChange={(event) => setForm({ ...form, deliveryAddress: event.target.value })} /><textarea placeholder="Шарҳ ба фармоиш" value={form.deliveryNote} onChange={(event) => setForm({ ...form, deliveryNote: event.target.value })} /><button className="submit" type="submit">Тасдиқи фармоиш</button></form></> : <div className="empty">Сабад холӣ аст.</div>}</section></div>}
    {notice && <div className="toast" onClick={() => setNotice("")}>✓ {notice}</div>}
  </main>;
}
