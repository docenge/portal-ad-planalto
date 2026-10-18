# AD Planalto — Uberlândia

Site de apresentação da igreja e jornada bíblica em 12 capítulos, da criação à nova vida em Cristo.

## Desenvolvimento

```sh
npm ci
npm run dev
```

## Compilação e teste

```sh
npm run build
npm run start -- --port 3100
node scripts/check-site.mjs
```

`SITE_ORIGIN` permite executar a verificação de rotas contra outro endereço. A aplicação usa Next.js 15, React 19 e páginas geradas estaticamente. O progresso de leitura fica no armazenamento local do navegador.

## Conteúdo

Os capítulos estão em `app/jornada/content.js`, e o modelo das páginas em `app/jornada/[slug]/page.js`. Referências bíblicas são oferecidas para leitura contextual. O conteúdo local da igreja deve ser confirmado antes de divulgar horários, contatos e endereço.

## Publicação

O repositório está ligado à Vercel. Branches geram prévias; a branch `main` gera produção. O domínio próprio previsto é `www.octatopdicas.com.br`. As tabelas antigas do Supabase foram preservadas, mas não são utilizadas para exibir conteúdos de outra cidade.

Veja `docs/ENTREGA.md` para verificações, limites e origem da imagem. Nenhuma credencial deve ser adicionada ao repositório.
