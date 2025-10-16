-- Permitir eliminar registros desde el panel de administración
create policy "Allow public delete" on public.registrations
  for delete using (true);
