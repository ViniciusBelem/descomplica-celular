-- Segurança Máxima no nível de linha (RLS - Row Level Security)
-- Este script permite que usuários LOGADOS NO PAINEL ADMIN (Role = 'authenticated') 
-- possam manipular completamente a tabela `smartphones`.

-- Permitir INSERT para admins
CREATE POLICY "Allow admin full access insert" ON public.smartphones
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Permitir UPDATE para admins
CREATE POLICY "Allow admin full access update" ON public.smartphones
FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Permitir DELETE para admins
CREATE POLICY "Allow admin full access delete" ON public.smartphones
FOR DELETE
USING (auth.role() = 'authenticated');
