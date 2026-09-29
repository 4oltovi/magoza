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
| GET/POST | `/api/admin/payments` | Рӯйхат ва тасдиқ/рад кардани пардохт |
| GET/POST/PATCH | `/api/admin/products` | Идоракунии маҳсулот |
| GET/PATCH | `/api/admin/stores` | Идоракунии мағозаҳо |
| GET | `/api/admin/catalog` | Рӯйхати мағозаҳо ва категорияҳо |
| POST/DELETE | `/api/admin/auth` | Сохтан ва нест кардани session-и админ |

## Саҳифаҳо

- `/` — каталог, сабад ва checkout
- `/payment` — боркунии расиди пардохт
- `/admin/login` — воридшавии администратор
- `/admin` — панели санҷиши пардохтҳо
- `/admin/products` — идоракунии маҳсулот
- `/admin/stores` — идоракунии мағозаҳо

## Танзими администратор

Дар `.env` калиди воқеӣ гузоред:

```env
ADMIN_PANEL_KEY="a-long-random-secret"
```

Сессияи администратор бо cookie-и `httpOnly`, муҳлати 8 соат ва имзои HMAC сохта мешавад. Дар production калиди дарозу тасодуфӣ истифода баред ва онро ба GitHub нагузоред. Барои санҷиши дохилии MVP endpoint-ҳои идоракунӣ ҳоло `x-admin-key`-ро истифода мебаранд; пеш аз production бояд ба session пурра гузаранд.

Барои production нигоҳдории расид дар Object Storage тавсия мешавад; ҳоло MVP расидро ҳамчун маълумоти дохили MySQL нигоҳ медорад.
