# Сохтмон Бохтар

Веб-платформаи сабуки маркетплейс барои мағозаҳои масолеҳи сохтмонӣ дар Бохтар.

## Технология

- Next.js + TypeScript
- Prisma ORM
- MySQL
- REST API

## Оғози маҳаллӣ

```bash
npm install
cp .env.example .env
# DATABASE_URL-ро бо маълумоти воқеии MySQL пур кунед
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Суроғаи пешфарз: `http://localhost:3000`

## MySQL

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/sokhtmon_bokhtar"
```

## API

| Method | Endpoint | Вазифа |
|---|---|---|
| GET | `/api/products` | Каталоги тасдиқшуда; `search`, `category`, `page`, `limit` дастгирӣ мешавад |
| GET | `/api/categories` | Категорияҳои фаъол |
| GET | `/api/settings/public` | Танзимоти оммавӣ ва маълумоти пардохт |
| POST | `/api/orders` | Сохтани фармоиш ва пардохти дастӣ |
| GET | `/api/orders/status?orderNumber=...&phone=...` | Санҷиши ҳолати фармоиш |

Намунаи сохтани фармоиш:

```json
{
  "buyerName": "Номи харидор",
  "buyerPhone": "+992900000000",
  "deliveryAddress": "Бохтар, кӯчаи намунавӣ",
  "storeId": "STORE_ID",
  "paymentMethod": "CARD_TRANSFER",
  "items": [{ "productId": "PRODUCT_ID", "quantity": 2 }]
}
```

## Додаҳои намунавӣ

`npm run db:seed` администратор, фурӯшанда, як мағоза, категорияҳо, маҳсулот ва танзимоти ибтидоиро месозад. Рақамҳои пардохт placeholder мебошанд ва бояд дар муҳити воқеӣ иваз шаванд.

## Қайд

Branch-и корӣ: `feature/sokhtmon-bokhtar-mvp`.
