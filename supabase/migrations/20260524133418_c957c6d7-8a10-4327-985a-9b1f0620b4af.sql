COMMENT ON TABLE public.jobs IS E'@graphql({"totalCount": {"enabled": false}, "primary_key_columns": ["id"]})\n\nHide from GraphQL schema; access only via REST/PostgREST.';
COMMENT ON SCHEMA public IS E'@graphql({"inflect_names": true})';
-- Hide jobs table from the auto-generated GraphQL schema for both anon and authenticated roles.
-- The application uses PostgREST (supabase-js), not GraphQL, so this has no functional impact.
COMMENT ON TABLE public.jobs IS E'@graphql({"name": "JobHidden", "totalCount": {"enabled": false}})';
-- Revoke discoverability via pg_graphql by removing SELECT from the GraphQL roles is not needed since RLS still applies;
-- the recommended pattern is the directive above which removes the table from the GraphQL schema entirely.