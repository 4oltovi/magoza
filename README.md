# Сохтмон Бохтар

Веб-платформаи сабуки маркетплейс барои мағозаҳои масолеҳи сохтмонӣ дар Бохтар.

## Технология

- Next.js + TypeScript
- Prisma ORM
- PostgreSQL
- REST API

## Оғози маҳаллӣ

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run type-check
npm run build
npm run dev
```

Суроғаи пешфарз: `http://localhost:3000`

## PostgreSQL

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/sokhtmon_bokhtar?schema=public"
```

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
| GET | `/api/admin/overview` | Омори dashboard |
| GET/PATCH | `/api/admin/orders` | Рӯйхат ва status-и фармоишҳо |
| GET/PATCH | `/api/admin/settings` | Танзимоти платформа |
| POST/DELETE | `/api/admin/auth` | Session-и админ |

## Саҳифаҳо

- `/` — каталог, сабад ва checkout
- `/payment` — боркунии расиди пардохт
- `/admin/login` — воридшавии администратор
- `/admin/dashboard` — dashboard ва фармоишҳо
- `/admin` — санҷиши пардохтҳо
- `/admin/products` — идоракунии маҳсулот
- `/admin/stores` — идоракунии мағозаҳо
- `/admin/settings` — танзимоти платформа

## Танзими администратор

Дар `.env` калиди воқеӣ гузоред:

```env
ADMIN_PANEL_KEY="a-long-random-secret"
```

Сессияи администратор бо cookie-и `httpOnly`, муҳлати 8 соат ва имзои HMAC сохта мешавад. Калиди махфиро ба GitHub нагузоред.

## Пардохт ва расид

Пардохт тавассути интиқол ба корт ё рақами телефон анҷом мешавад. Расидҳои JPG, PNG ва PDF то 5MB қабул мешаванд. Барои production нигоҳдории расид дар Object Storage тавсия мешавад; ҳоло MVP онро дар PostgreSQL нигоҳ медорад.
