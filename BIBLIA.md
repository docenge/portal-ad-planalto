# Bíblia ADP no portal existente

Rotas: `/biblia` (leitura e inscrição), `/biblia/leitor/index.html` (leitor), `/api/biblia/download` (ZIP após autenticação e confirmação de e-mail).

Usa as variáveis Supabase já utilizadas pelo portal: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY. Em Supabase Authentication, habilitar Email e inscrições, manter confirmação de e-mail ativa, permitir o retorno https://portal-ad-planalto.vercel.app/biblia e configurar SMTP próprio para inscrições públicas. Testar confirmação, login, logout e download em homologação. Não requer chave service_role. Não foram enviados e-mails de teste nem feitas alterações na configuração externa.

O arquivo ZIP é um aplicativo HTML para navegador, não um APK. Contém os arquivos fonte, texto integral, instruções e dados embutidos para leitura local. Alguns celulares bloqueiam HTML local; nesses aparelhos, usar o leitor do portal. Sem narração, conforme solicitado. PWA em /biblia/leitor/ com manifesto, ícones e cache do texto integral; instalação pelo navegador em Android, iOS/iPadOS, Windows e Linux, conforme suporte do navegador. iOS usa Safari → Compartilhar → Adicionar à Tela de Início. Testar a instalação nos aparelhos; não é pacote nativo de loja.

Texto histórico Almeida 1911, fonte https://api.getbible.net/v2/almeida.json; metadados e licença GPL em https://api.getbible.net/v2/translations.json. Preservar avisos/licença ao redistribuir; conferir o módulo antes de lançamento amplo. Não anunciar como ARC moderna. Harpa completa, músicas atuais e comentários revisados não incluídos. O cadastro controla o download neste portal, sem restringir os direitos de redistribuição concedidos pela licença.

A identidade visual do cabeçalho e metadados foi atualizada para AD Planalto Uberlândia. Avisos, eventos e congregações existentes continuam sendo lidos do Supabase e precisam de revisão do responsável; não substituímos dados por informações inventadas.

O acervo histórico está versionado em blocos gzip em scripts/biblia-data. npm run build e npm run dev reconstroem o JSON público e o ZIP usando scripts/prepare-biblia.mjs. Os arquivos gerados não precisam ser enviados ao GitHub. A configuração de rastreamento do Next inclui o ZIP no endpoint de download. A integração preserva o frontend atual do portal, inclusive dados já confirmados e a navegação da jornada.


## Atualização ortográfica de 19/10/2026

O texto público e o ZIP passam a usar ortografia brasileira atualizada. A fonte histórica versionada continua preservada. scripts/biblia-data/ortografia-br.json contém as equivalências aprovadas e as correções por referência; scripts/prepare-biblia.mjs aplica a revisão de forma determinística, preservando todos os livros, capítulos e números de versículos. A revisão não substitui o texto por uma tradução moderna protegida.

Fontes: GetBible almeida (texto-base), Projeto Gutenberg 62383 (conferência independente) e a comparação entre original/atual de bibliaalmeida.com, que declara seus textos livres para distribuição. Não foi copiada a edição Concordância, que declara direitos reservados. Foram excluídas sugestões que trocavam vocabulário, sentido, flexões verbais ou acentos diferenciais válidos. Nomes próprios menos comuns podem manter grafias tradicionais.

A atualização automática abrange todo o acervo, mas não equivale a uma revisão humana linha a linha. O arquivo público revisao-ortografica.json registra contagens e fontes. O cache do aplicativo foi atualizado para v2 para que instalações antigas recebam os textos corrigidos.

## Harpa e publicação — 22/10/2026

Leitor PWA em https://www.octatopdicas.com.br/biblia/leitor/index.html com botão de instalação, instruções por plataforma, verificação de atualização e confirmação de cache sem número de versão fixo. Cache v11 inclui Harpa e ferramentas de leitura. Navegações com referências em `?q=` usam o HTML em cache sem perder a busca quando offline. Instalação em lojas Android/iOS não foi realizada; a publicação é pelo navegador.

Harpa: busca por número/título, favoritos locais, navegação, cifras fornecidas no acervo e importação JSON validada de até 640 hinos, limitada a 2 MB. Não foi copiado acervo de terceiros sem comprovação de permissão. Letras completas continuam pendentes do arquivo autorizado do responsável. Aceita lista ou `{hinos:[...]}`, com numero, titulo e estrofes (texto ou objetos com texto/cifras).

Backup JSON exporta/restaura anotações, versículos favoritos e acervo da Harpa. Restauração valida referências contra a Bíblia e mescla preservando dados existentes. Anotações podem conter dados pessoais: o arquivo é gerado apenas quando o usuário escolhe baixar. Não há sincronização com Supabase por estes recursos.

### Contas e senhas

Formulário em `/biblia#baixar-app`: criar conta com confirmação de senha, entrar, reenviar confirmação, recuperar senha e definir nova senha com sessão de recuperação válida. Callbacks usam o domínio atual + `/biblia`. Acesso Minha conta também está no leitor. Download exige token verificado pelo servidor e e-mail confirmado. Nenhuma senha é gravada pelo código da aplicação; autenticação e sessões são administradas pelo SDK Supabase.

Verificação pública em 22/10/2026: autenticação por e-mail habilitada, novos cadastros permitidos e confirmação de e-mail exigida. Configurações administrativas de SMTP e lista de retornos ainda precisam ser verificadas no Supabase. URLs a permitir: `https://www.octatopdicas.com.br/biblia` e `https://octatopdicas.com.br/biblia`. Não foram criados usuários de teste nem enviados e-mails. Teste completo de entrega/recuperação permanece pendente de uma conta de teste do responsável.
