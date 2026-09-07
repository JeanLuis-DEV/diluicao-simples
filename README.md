# Diluição Simples

Aplicação Web para calcular quantidades de produto concentrado e água em diluições `1:N`.

## Tecnologia

- Vite, React, TypeScript e CSS.
- AppLayout do App Base oficial.
- Design System `@apps-simples/ui@0.4.1`.
- Vitest para testes do domínio.
- Versão exibida diretamente de `package.json`.

## Execução

```sh
npm install
npm run dev
```

## Validação

```sh
npm test
npm run build
```

## Estrutura principal

```text
src/
  features/
    dilution/
    institutional/
  layouts/
    AppLayout.tsx
  styles/
  App.css
  App.tsx
  main.tsx
```

Esta etapa não inclui PWA, persistência, histórico, compartilhamento, backend ou aplicações móveis.
