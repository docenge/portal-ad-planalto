# AD Planalto — Uberlândia

## Escopo implementado

- Nova identidade visual em verde profundo, papel claro e terracota.
- Página inicial editorial com paisagem simbólica exclusiva, navegação e introdução à fé.
- Doze capítulos independentes do plano de salvação, cada um com três seções, reflexão, oração sugerida, referências e navegação anterior/próxima.
- Índice completo em cada capítulo, posição na jornada, progresso local e compartilhamento por cópia de link.
- Menu móvel com fechamento ao selecionar uma opção; suporte a teclado, foco visível, redução de movimento e link para pular ao conteúdo.
- Títulos por página, Open Graph, sitemap, robots e ícone próprio.
- Página de informações e privacidade, resposta 404 com navegação de retorno.

## Conteúdo e limites

As explicações são sínteses originais segundo a fé cristã evangélica, com referências para leitura na Bíblia. A liderança da igreja pode revisar a redação pastoral e doutrinária. Não foram inventados endereço, telefone, agenda, nomes de pastores ou fotografias locais.

Os dados antigos do Supabase não foram apagados. Eles se referem a outra cidade e não são consultados pela nova apresentação estática. Nenhum segredo é necessário para renderizar esta versão. Não foram criados formulários sem destino ou fluxos fictícios de envio.

## Verificação realizada

- `npm run build`: aprovado; os 12 capítulos são gerados estaticamente.
- `node scripts/check-site.mjs`: aprovado em servidor local de produção; 14 páginas de conteúdo, 4 recursos públicos e resposta 404 para capítulo inexistente.
- Revisão no navegador em largura padrão e 390 px: página inicial e leitura verificadas, sem transbordamento horizontal observado.
- Marcação de leitura, persistência após recarregar, retomada na página inicial e abertura/fechamento do menu móvel verificados.
- A publicação e o estado do domínio devem ser confirmados no relatório final da conversa.

## Pendências de informações reais

Endereço, horários de culto, contatos oficiais, nomes da liderança, história local e fotos autorizadas da AD Planalto. O domínio octatopdicas.com.br foi adicionado à Vercel, mas os registros DNS ainda dependem do acesso ao Registro.br: a sessão de login expirou durante a espera pela transição.

## Imagem exclusiva

Arquivo: `public/images/jornada-hero.jpg` (1536 × 1024, JPEG otimizado). Gerado com a ferramenta integrada ImageGen e copiado para o projeto. Não é uma fotografia da igreja.

Prompt: paisagem simbólica cinematográfica ao amanhecer, colinas antigas de arenito, oliveiras, caminho sinuoso e uma pequena cruz de madeira vazia no horizonte à direita; luz dourada, sombras verdes, atmosfera serena e esperançosa; espaço à esquerda para o título; sem pessoas, sem templo identificável, sem texto ou marcas.
