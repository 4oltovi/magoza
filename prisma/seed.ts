import { PrismaClient, Role, StoreStatus } from "@prisma/client";

const prisma = new PrismaClient();
const categories = [
  ["Масолеҳи сохтмонӣ", "masoleh"], ["Арматура ва металл", "metall"],
  ["Ранг ва ороиш", "rang"], ["Асбобҳои сохтмонӣ", "asbob"],
  ["Барқ ва равшанӣ", "barq"], ["Сантехника", "santehnika"],
  ["Дару тиреза", "dar-tireza"], ["Изолятсия", "izolyatsiya"],
  ["Қум, шағал ва хишт", "qum-shagal"],
] as const;

async function main() {
  const admin = await prisma.user.upsert({ where: { phone: "+992000000000" }, update: {}, create: { name: "Администратор", phone: "+992000000000", role: Role.ADMIN } });
  const seller = await prisma.user.upsert({ where: { phone: "+992000000001" }, update: {}, create: { name: "Мағозаи намунавӣ", phone: "+992000000001", role: Role.SELLER } });
  const store = await prisma.store.upsert({ where: { slug: "magozai-namunavi" }, update: {}, create: { ownerId: seller.id, name: "Мағозаи намунавии Бохтар", slug: "magozai-namunavi", phone: seller.phone, address: "Бохтар", status: StoreStatus.APPROVED } });
  const categoryMap = new Map<string, string>();
  for (const [name, slug] of categories) { const c = await prisma.category.upsert({ where: { slug }, update: { name }, create: { name, slug, isActive: true } }); categoryMap.set(slug, c.id); }
  const products = [
    ["Сементи сохтмонӣ", "masoleh", 58, "халта", 100], ["Арматура 12 мм", "metall", 12, "метр", 500],
    ["Ранги деворӣ сафед", "rang", 145, "дона", 40], ["Дрели барқӣ", "asbob", 420, "дона", 15],
    ["Қубури об 25 мм", "santehnika", 18, "метр", 300], ["Кабели барқӣ", "barq", 9, "метр", 1000],
  ] as const;
  for (const [name, slug, price, unit, stock] of products) await prisma.product.upsert({ where: { storeId_slug: { storeId: store.id, slug } }, update: { price, stock, isApproved: true }, create: { storeId: store.id, categoryId: categoryMap.get(slug)!, name, slug, price, unit, stock, isApproved: true } });
  for (const [settingKey, value, isPublic] of [["PLATFORM_NAME", "Сохтмон Бохтар", true], ["DELIVERY_FEE", "20", true], ["PLATFORM_COMMISSION", "5", false], ["PAYMENT_CARD_NUMBER", "PAYMENT_CARD_NUMBER", true], ["PAYMENT_PHONE_NUMBER", "PAYMENT_PHONE_NUMBER", true]] as const) await prisma.setting.upsert({ where: { settingKey }, update: { value, isPublic }, create: { settingKey, value, isPublic } });
  console.log(`Seed complete. Admin: ${admin.phone}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
