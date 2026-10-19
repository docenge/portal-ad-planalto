# Cadastros privados AD Planalto

Banco Supabase existente: projeto ltrtnkmmoforwbbxzhyt. Migração 20261019020000 aplicada em 19/10/2026. As cinco tabelas adp_* têm RLS habilitada e nenhum acesso para anon/authenticated. O servidor usa service_role; nunca fornecer essa chave ao navegador.

Administrador indicado pelo responsável: carlosatco66@gmail.com. Ainda não possui usuário no Supabase Auth; nenhum acesso foi concedido automaticamente. Após criação da conta pelo fluxo de autenticação, conferir seu UUID e cadastrar adp_admins com permissões específicas. Um e-mail igual sozinho não concede acesso. Não inserir senhas em código, conversa ou repositório.

Painel /admin exige senha e sessão validada no servidor, mais registro ativo em adp_admins. Permissões separadas para contatos, pedidos de oração e novidades. Consultas são auditadas sem copiar dados pessoais para logs. A sessão do painel fica em memória, sem persistir no navegador.

Para ativar: configurar SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (somente servidor), NEXT_PUBLIC_SUPABASE_ANON_KEY e COMMUNITY_REGISTRATION_ENABLED=true no projeto correto da Vercel. Testar envio, consulta autorizada e negação de acesso anônimo antes de habilitar a coleta pública. Configurar proteção contra abuso antes da abertura pública.

Novidades aguardam configuração de confirmação de e-mail. Nenhum disparo foi ativado. Não contratar planos pagos.

Datas expires_at são lembretes de revisão: 180 dias para contatos e 90 dias para pedidos de oração. Não há exclusão automática; definir procedimento de revisão, atendimento a correção/exclusão e retenção antes de coletar dados reais.

Pedidos de oração exigem consentimento próprio, são armazenados em tabela separada e nunca publicados nem enviados para newsletter. Não coletar dados reais para testes.
