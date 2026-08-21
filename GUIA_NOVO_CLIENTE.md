# Guia Passo a Passo: Como Criar e Publicar um Novo Site de Mandato / Campanha em 5 Minutos

Este manual orienta como duplicar o template base para um novo cliente (Deputado, Senador ou Vereador), personalizar o visual e colocar no ar na **Vercel / Netlify** com domínio próprio.

---

## 📁 Visão Geral do Fluxo

```
[ Novo Político Fechado ]
          │
          ▼
1. Duplicar pasta do projeto ou criar novo branch/repositório
          │
          ▼
2. Ajustar `.env` com o novo `VITE_SITE_ID`
          │
          ▼
3. Personalizar o layout (Cores, Hero, Fotos e Tipografia)
          │
          ▼
4. Subir na Vercel e apontar o Domínio Oficial (ex: candidato.com.br)
          │
          ▼
5. Entregar o acesso ao Painel Admin para a assessoria
```

---

## 🛠️ Passo a Passo Prático

### Passo 1: Duplicar o Repositório Base
Crie uma nova pasta para o cliente a partir deste template:
```bash
git clone https://github.com/seu-usuario/template-mandato.git site-deputado-joao
cd site-deputado-joao
npm install
```

---

### Passo 2: Configurar o `.env`
Crie ou edite o arquivo `.env` com o identificador único do cliente:
```env
# ID único do cliente no banco de dados
VITE_SITE_ID=site-deputado-joao

# Conexão com o Supabase Central (ou projeto dedicado do cliente)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-anon
```

---

### Passo 3: Cadastrar o Novo Candidato no Supabase
Você pode inserir o novo site diretamente no Supabase ou via painel admin:

```sql
-- 1. Inserir o novo site/mandato
INSERT INTO sites (id, name, slug, domain, is_active)
VALUES ('site-deputado-joao', 'Deputado João da Silva', 'joao-silva', 'joaodasilva.com.br', true);

-- 2. Inserir configurações do candidato
INSERT INTO site_settings (site_id, candidate_name, candidate_number, position, party, coalition, state, phone, whatsapp, email)
VALUES (
  'site-deputado-joao',
  'João da Silva',
  '22000',
  'Deputado Federal',
  'PL',
  'Coligação Pelo Povo',
  'SP',
  '(11) 3333-4444',
  '(11) 99999-8888',
  'contato@joaodasilva.com.br'
);

-- 3. Inserir cores do partido/identidade visual
INSERT INTO theme_settings (site_id, primary_color, secondary_color, accent_color, button_style, font_family)
VALUES (
  'site-deputado-joao',
  '#002b7f',   -- Azul forte do partido
  '#0b1220',   -- Escuro moderno
  '#ffcc00',   -- Destaque amarelo
  'rounded-full',
  'Plus Jakarta Sans'
);
```

---

### Passo 4: Personalizar o Design (Se o cliente quiser um modelo exclusivo)
Você tem total liberdade no código do frontend:
1. **Foto do Hero & Slogan**: Modifique em [`src/components/public/PublicHero.tsx`](file:///c:/Users/Bruno/Desktop/Project-vendas/gov-camp/src/components/public/PublicHero.tsx) ou edite pelo painel admin em `/admin/hero`.
2. **Cores e Fontes**: Edite em `/admin/aparencia` ou no arquivo de tema.
3. **Seções da Home**: Alterne os blocos em [`src/pages/public/HomePage.tsx`](file:///c:/Users/Bruno/Desktop/Project-vendas/gov-camp/src/pages/public/HomePage.tsx) (ex: colocar Vídeos antes de Notícias ou criar uma seção de Projetos de Lei).

---

### Passo 5: Publicação na Vercel com Domínio Próprio

1. Crie um novo repositório no GitHub para o cliente (ex: `cliente-joao-silva`).
2. Acesse [vercel.com](https://vercel.com) e importe o repositório.
3. Em **Environment Variables**, adicione:
   - `VITE_SITE_ID` = `site-deputado-joao`
   - `VITE_SUPABASE_URL` = `https://seu-projeto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sua-chave-anon`
4. Clique em **Deploy**.
5. Em **Project Settings > Domains**, digite o domínio do cliente: `joaodasilva.com.br` e configure os registros DNS `CNAME` ou `A` no Registro.br.

---

### Passo 6: Entregar o Painel para a Assessoria
Envie para a equipe de comunicação do político:
- **URL do Painel**: `https://joaodasilva.com.br/admin`
- **Login Inicial**: E-mail cadastrado na tabela `site_members` ou login padrão.
- **Treinamento**: Mostre como publicar notícias, cadastrar eventos da agenda e atualizar fotos pelo celular!

---

## 💡 Dica de Negócio & Precificação
- **Setup Inicial (Criação + Customização do Modelo)**: R$ 3.500 a R$ 15.000 (pago uma única vez).
- **Mensalidade de Hospedagem, Suporte e Atualizações**: R$ 350 a R$ 1.500/mês (gerando receita recorrente previsível durante todo o mandato de 4 anos!).
