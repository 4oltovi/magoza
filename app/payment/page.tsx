"use client";

import { FormEvent, useState } from "react";

export default function PaymentPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("+992");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!receipt) return setMessage("Файли расидро интихоб кунед.");
    setBusy(true); setMessage("");
    const form = new FormData();
    form.append("orderNumber", orderNumber.trim()); form.append("phone", phone.trim()); form.append("receipt", receipt);
    const response = await fetch("/api/orders/receipt", { method: "POST", body: form });
    const data = await response.json();
    setMessage(data.message ?? data.error ?? "Амалиёт анҷом нашуд."); setBusy(false);
  }

  return <main className="simplePage"><section className="simpleCard"><a href="/">← Ба каталог</a><h1>Фиристодани расиди пардохт</h1><p>Рақами фармоиш ва телефони дар checkout истифодашударо ворид кунед.</p><form onSubmit={submit} className="simpleForm"><input required placeholder="Рақами фармоиш: BK-..." value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} /><input required placeholder="Телефон: +992..." value={phone} onChange={(e) => setPhone(e.target.value)} /><label className="fileLabel">Расидро интихоб кунед<input required type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} /></label><small>JPG, PNG ё PDF — ҳадди аксар 5MB</small><button className="submit" disabled={busy}>{busy ? "Фиристода мешавад..." : "Фиристодани расид"}</button></form>{message && <div className="message">{message}</div>}</section></main>;
}
