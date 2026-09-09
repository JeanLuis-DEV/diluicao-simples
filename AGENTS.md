Este projeto é o template oficial da plataforma Apps Simples.

Todos os novos aplicativos gratuitos devem ser criados a partir desta base.

Regras:

- Não alterar a identidade visual sem autorização.
- Reutilizar componentes existentes antes de criar novos.
- Não duplicar componentes.
- Manter a estrutura de pastas definida.
- Manter suporte mobile e desktop.
- Manter a aplicação exclusivamente Web, sem PWA, manifest, service worker, APK, Android ou Capacitor.
- Dados locais devem usar a camada de armazenamento padrão.
- Backup deve seguir o formato padrão definido pelo App Base.
- Não adicionar dependências sem necessidade.
- Não implementar login, assinatura ou recursos premium nesta versão da plataforma.
- Criar funcionalidades específicas do aplicativo em `src/features/`.
- Usar `package.json` como fonte única da versão exibida pelo aplicativo.
