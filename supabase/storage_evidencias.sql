-- Bucket privado para las fotos de evidencia: JPEG, PNG o WebP de hasta 5 MB.
-- Cada archivo va en una carpeta con el uid del usuario (<auth.uid()>/<archivo>)
-- y reportes.evidencia_url guarda esa ruta.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidencias', 'evidencias', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

create policy evidencias_subir_propias on storage.objects for insert to authenticated
    with check (
        bucket_id = 'evidencias'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

create policy evidencias_ver on storage.objects for select to authenticated
    using (
        bucket_id = 'evidencias'
        and ((storage.foldername(name))[1] = (select auth.uid())::text or (select private.es_admin()))
    );

create policy evidencias_borrar_propias on storage.objects for delete to authenticated
    using (
        bucket_id = 'evidencias'
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );
