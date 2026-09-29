"use client";
import { useMemo, useState } from "react";

type Product = { id:number; name:string; category:string; price:number; unit:string; store:string; emoji:string };
const products: Product[] = [
 {id:1,name:"Сементи сохтмонӣ",category:"Масолеҳи сохтмонӣ",price:58,unit:"халта",store:"Мағозаи Бохтар",emoji:"🧱"},
 {id:2,name:"Арматура 12 мм",category:"Арматура ва металл",price:12,unit:"метр",store:"Сохтмон Маркет",emoji:"🔩"},
 {id:3,name:"Ранги деворӣ сафед",category:"Ранг ва ороиш",price:145,unit:"дона",store:"Ороиши хона",emoji:"🎨"},
 {id:4,name:"Дрели барқӣ",category:"Асбобҳои сохтмонӣ",price:420,unit:"дона",store:"Асбобҳои Бохтар",emoji:"🛠️"},
 {id:5,name:"Қубури об 25 мм",category:"Сантехника",price:18,unit:"метр",store:"Сантехник",emoji:"🚰"},
 {id:6,name:"Кабели барқӣ",category:"Барқ ва равшанӣ",price:9,unit:"метр",store:"Электро Бохтар",emoji:"💡"}
];
export default function Home(){
 const [query,setQuery]=useState(""); const [category,setCategory]=useState("Ҳама"); const [cart,setCart]=useState<Product[]>([]); const [notice,setNotice]=useState("");
 const categories=["Ҳама",...Array.from(new Set(products.map(p=>p.category)))];
 const filtered=useMemo(()=>products.filter(p=>(category==="Ҳама"||p.category===category)&&`${p.name} ${p.store}`.toLowerCase().includes(query.toLowerCase())),[query,category]);
 function add(p:Product){setCart(items=>[...items,p]);setNotice(`${p.name} ба сабад илова шуд`);setTimeout(()=>setNotice(""),2200)}
 return <main><header className="header"><div className="brand"><span className="brandMark">С</span><div><b>Сохтмон Бохтар</b><small>Бозори масолеҳи сохтмонӣ</small></div></div><button className="cart" onClick={()=>setNotice(`Дар сабад ${cart.length} маҳсулот аст`)}>🛒 Сабад ({cart.length})</button></header>
 <section className="hero"><div><span className="eyebrow">БОХТАР · ТОҶИКИСТОН</span><h1>Ҳамаи чиз барои сохтмон, дар як ҷо.</h1><p>Маҳсулоти мағозаҳои Бохтарро пайдо кунед ва фармоиш диҳед.</p><div className="search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Маҳсулот ё мағозаро ҷустуҷӯ кунед"/></div></div><div className="heroArt">🏠<span>+</span>🧱</div></section>
 <section className="section"><div className="sectionHead"><div><span className="eyebrow">КАТАЛОГ</span><h2>Маҳсулоти пешниҳодшуда</h2></div><span className="count">{filtered.length} маҳсулот</span></div><div className="chips">{categories.map(item=><button key={item} className={category===item?"chip active":"chip"} onClick={()=>setCategory(item)}>{item}</button>)}</div><div className="grid">{filtered.map(p=><article className="card" key={p.id}><div className="productVisual">{p.emoji}</div><div className="cardBody"><span className="category">{p.category}</span><h3>{p.name}</h3><p className="store">● {p.store}</p><div className="priceRow"><strong>{p.price.toLocaleString("tg-TJ")} сомонӣ</strong><span>/ {p.unit}</span></div><button className="add" onClick={()=>add(p)}>Ба сабад илова кардан <span>+</span></button></div></article>)}</div>{!filtered.length&&<div className="empty">Маҳсулот ёфт нашуд.</div>}</section><footer><b>Сохтмон Бохтар</b><span>Платформаи маҳаллии масолеҳи сохтмонӣ · © 2026</span><span>Бохтар, Тоҷикистон</span></footer>{notice&&<div className="toast">✓ {notice}</div>}</main>;
}
