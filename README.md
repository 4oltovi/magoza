# Сохтмон Бохтар

Веб-платформаи сабуки маркетплейс барои мағозаҳои масолеҳи сохтмонӣ дар Бохтар.

## Технология

- Next.js + TypeScript
- Prisma ORM
- MySQL
- REST API (марҳилаҳои баъдӣ)

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

Намунаи пайвастшавӣ:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/sokhtmon_bokhtar"
```

Пеш аз `db:push` базаи `sokhtmon_bokhtar`-ро дар MySQL созед ё ба корбари дорои иҷозаи сохтани база пайваст шавед.

## Додаҳои намунавӣ

`npm run db:seed` администратор, фурӯшанда, як мағоза, категорияҳо, маҳсулот ва танзимоти ибтидоиро месозад. Рақами пардохтҳо placeholder мебошанд ва бояд дар муҳити воқеӣ иваз шаванд.

## Қайд

Branch-и корӣ: `feature/sokhtmon-bokhtar-mvp`.
