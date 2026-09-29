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
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Суроғаи пешфарз: `http://localhost:3000`

## API

| Method | Endpoint | Вазифа |
|---|---|---|
| GET | `/api/products` | Каталоги тасдиқшуда |
| GET | `/api/categories` | Категорияҳои фаъол |
| GET | `/api/settings/public` | Танзимоти оммавӣ |
| POST | `/api/orders` | Сохтани фармоиш |
| GET | `/api/orders/status?orderNumber=...&phone=...` | Ҳолати фармоиш |
| POST | `/api/orders/receipt` | Боркунии расид, JPG/PNG/PDF то 5MB |
| GET/POST | `/api/admin/payments` | Рӯйхат ва тасдиқ/рад кардани пардохт бо `x-admin-key` |

## Саҳифаҳо

- `/` — каталог, сабад ва checkout
- `/payment` — боркунии расиди пардохт
- `/admin` — панели санҷиши пардохтҳо

## Танзими администратор

Дар `.env` калиди воқеӣ гузоред:

```env
ADMIN_PANEL_KEY="a-long-random-secret"
```

Калидро ба GitHub ё ба браузер ҳамчун маълумоти доимӣ нагузоред. Барои production нигоҳдории расид дар Object Storage тавсия мешавад; ҳоло MVP расидро ҳамчун маълумоти дохили MySQL нигоҳ медорад.
