-- Tabelas para planos alimentares
-- Execute no SQL Editor do Supabase

create table if not exists diet_plans (
    id          uuid        primary key default gen_random_uuid(),
    nutritionist_id uuid    not null references profiles(id) on delete cascade,
    title       text        not null,
    description text,
    start_date  date,
    end_date    date,
    status      text        not null default 'draft'
                            check (status in ('draft', 'active', 'completed')),
    created_at  timestamptz not null default now()
);

create table if not exists diet_meals (
    id           uuid        primary key default gen_random_uuid(),
    diet_plan_id uuid        not null references diet_plans(id) on delete cascade,
    name         text        not null,
    time_suggestion text,
    notes        text,
    order_index  int         not null default 0
);

create table if not exists diet_meal_items (
    id           uuid        primary key default gen_random_uuid(),
    meal_id      uuid        not null references diet_meals(id) on delete cascade,
    food_name    text        not null,
    quantity     numeric     not null default 0,
    unit         text        not null default 'g',
    calories     numeric,
    substitution text,
    notes        text,
    order_index  int         not null default 0
);

-- Índices para performance
create index if not exists idx_diet_plans_nutritionist on diet_plans(nutritionist_id);
create index if not exists idx_diet_meals_plan        on diet_meals(diet_plan_id);
create index if not exists idx_diet_meal_items_meal   on diet_meal_items(meal_id);
