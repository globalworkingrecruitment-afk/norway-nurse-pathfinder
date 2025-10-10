-- Crear tabla de registros de usuarios
create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  name text not null,
  email text not null,
  plan_id text not null,
  plan_title text not null,
  total_price numeric not null,
  monthly_payment numeric not null,
  amortization_months integer not null
);

-- Habilitar RLS
alter table public.registrations enable row level security;

-- Policy: Permitir inserciones públicas (cualquiera puede registrarse)
create policy "Allow public insert" on public.registrations
  for insert with check (true);

-- Policy: Permitir lectura pública (para el panel admin)
create policy "Allow public select" on public.registrations
  for select using (true);

-- Crear tipo enum para roles
create type public.app_role as enum ('admin', 'user');

-- Crear tabla de roles de usuario
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- Habilitar RLS en user_roles
alter table public.user_roles enable row level security;

-- Función de seguridad para verificar roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Policy: Solo el propio usuario puede ver sus roles
create policy "Users can view own roles" on public.user_roles
  for select using (auth.uid() = user_id);