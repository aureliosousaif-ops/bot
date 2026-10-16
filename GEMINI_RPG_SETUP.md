# Sousinha Bot — Gemini e RPG

## Groq (opcional)

Para usar Groq como provedor principal, crie uma chave em [Groq Console](https://console.groq.com/keys) e adicione no Render:

```text
GROQ_API_KEY=sua-chave
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_AUTO_REPLY=true
GEMINI_GROUPS_ONLY=true
```

Quando `GROQ_API_KEY` estiver configurada, ela terá prioridade sobre a Gemini. O código usa o endpoint oficial de chat completions da Groq e não registra a chave. O modelo padrão acima é o exemplo de chat usado no quickstart oficial; a disponibilidade e os limites dependem da conta e podem mudar, portanto o identificador pode ser ajustado em `GROQ_MODEL`.

As respostas continuam limitadas por conversa e por janela local. A Groq informa limites por RPM, RPD, TPM e TPD; ao receber HTTP 429, o bot registra o limite e não entra em loop.

Para voltar à Gemini, remova `GROQ_API_KEY` do ambiente ou deixe-a vazia.

## Gemini

1. Crie uma chave no [Google AI Studio](https://aistudio.google.com/apikey).
2. No Render, abra **Environment** e adicione:

```text
GEMINI_API_KEY=sua-chave
GEMINI_MODEL=gemini-2.0-flash
GEMINI_AUTO_REPLY=true
GEMINI_GROUPS_ONLY=true
```

A chave é lida somente no servidor. Não coloque a chave no GitHub, em mensagens ou no código do frontend. A documentação do Google recomenda variáveis de ambiente e tratar a chave como uma senha.

Com `GEMINI_GROUPS_ONLY=true`, a Sousinha só responde em grupos quando o texto chama `Sousinha`, por exemplo:

```text
Sousinha, explica o que é inflação?
```

O módulo mantém memória curta separada por grupo e remetente, limita o tamanho do contexto e aplica limite local de requisições. As cotas reais dependem do projeto/modelo no AI Studio; respostas HTTP 429 são registradas sem expor a chave.

Para desativar sem remover código:

```text
GEMINI_AUTO_REPLY=false
```

## RPG

O RPG existente continua usando os modelos MongoDB e não teve dados migrados, apagados ou recriados. Para ativá-lo, configure uma URI MongoDB válida no Render:

```text
ENABLE_RPG=true
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/sousinha_rpg
```

A URI deve permitir conexão a partir do Render (rede/IP do Atlas configurada) e usar um banco dedicado ou o banco que já contém os jogadores. Sem `MONGO_URI` válido, mantenha `ENABLE_RPG=false` para evitar erros nos comandos.

## Testes

No diretório do bot:

```powershell
node --check index.js
node --check king/geminiChat.js
node -e "const g=require('./king/geminiChat'); console.log(g.wasCalled('oi Sousinha'))"
```

O teste da conversa real exige uma chave válida e uma mensagem enviada em um grupo do WhatsApp. O servidor pode iniciar sem a chave; nesse caso aparecerá no log que a resposta automática está desativada.
