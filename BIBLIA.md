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
