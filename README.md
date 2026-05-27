# Treino Olímpico de Matemática

Aplicação web estática de preparação para olimpíadas de matemática, desenvolvida para alunos do 7º ano do Ensino Fundamental. Cobre os conteúdos cobrados na **Competição Jacob Palis Júnior**, **OBMEP (Nível 1)** e **Canguru de Matemática Brasil (Nível Benjamin)**.

🔗 **[Acesse o app](https://seu-usuario.github.io/treino-olimpico)** *(atualize com sua URL do GitHub Pages)*

---

## Funcionalidades

- 20 dias de exercícios curados — 3 exercícios por dia
- Dica de raciocínio e gabarito detalhado para cada exercício (revelados sob demanda)
- Progresso salvo automaticamente no navegador via `localStorage`
- Impressão em um clique — folha limpa com enunciados e espaço para rascunho, sem gabarito
- Navegação entre dias e visão geral do progresso

## Estrutura

```
treino-olimpico/
├── index.html        # Interface completa (HTML + CSS + JS)
└── exercicios.json   # Banco de dados dos exercícios
```

A separação entre apresentação (`index.html`) e conteúdo (`exercicios.json`) facilita a adição de novos dias sem mexer no código da interface.

## Plano de estudos

Os 20 dias seguem uma rotação semanal de temas:

| Dia da semana | Tema |
|---|---|
| Segunda | Aritmética e Teoria dos Números |
| Terça | Raciocínio Lógico e Contagem |
| Quarta | Álgebra |
| Quinta | Geometria Plana |
| Sexta | Prova Real (questão de competição) |

## Como adicionar mais dias

Abra `exercicios.json` e adicione um novo objeto ao array `dias`, seguindo a estrutura abaixo. Atualize também o campo `totalDias` em `meta`.

```json
{
  "dia": 21,
  "tema": "Aritmética e Teoria dos Números",
  "topico": "Nome do tópico",
  "exercicios": [
    {
      "enunciado": "Texto do enunciado.",
      "dica": "Texto da dica de raciocínio.",
      "gabarito": "Texto do gabarito detalhado."
    }
  ]
}
```

## Publicação no GitHub Pages

1. Faça o upload dos dois arquivos na raiz do repositório
2. Acesse **Settings → Pages**
3. Em *Source*, selecione a branch `main` e clique em **Save**
4. Aguarde alguns minutos — o app estará disponível em `https://seu-usuario.github.io/nome-do-repositorio`

O progresso do aluno é salvo no `localStorage` do navegador utilizado para imprimir. Não há backend nem conta necessária.

## Competições-alvo

| Competição | Nível do aluno (7º ano) | Formato da prova |
|---|---|---|
| Jacob Palis Júnior | Nível 1 (6º e 7º ano) | 10 múltipla escolha + 5 resposta numérica · 2h |
| OBMEP | Nível 1 (6º e 7º ano) | Fase 1: múltipla escolha · Fase 2: dissertativa |
| Canguru de Matemática | Nível B — Benjamin (7º e 8º ano) | Múltipla escolha · foco em raciocínio lógico |
