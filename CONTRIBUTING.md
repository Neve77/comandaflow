# 🤝 Contribuindo ao ComandaFlow

Obrigado por considerar contribuir ao ComandaFlow! Este documento fornece diretrizes e instruções para ajudar a tornar o processo mais fácil e eficiente.

## 📋 Código de Conduta

Por favor, note que este projeto é lançado com um [Código de Conduta do Contribuidor](CODE_OF_CONDUCT.md). Ao participar neste projeto, você concorda em cumprir seus termos.

## 🐛 Reportando Bugs

Antes de criar relatórios de bugs, por favor verifique a [lista de issues](https://github.com/seu-usuario/comandaflow/issues) pois você pode descobrir que não precisa criar um novo.

Ao criar um relatório de bug, inclua o máximo de detalhes possível:

- **Use um título descritivo** para o issue
- **Descreva os passos exatos** que reproduzem o problema
- **Forneça exemplos específicos** para demonstrar os passos
- **Descreva o comportamento observado** e aponte o que exatamente é o problema
- **Explique qual comportamento você esperava** e por quê
- **Inclua screenshots ou GIFs** se possível
- **Mencione sua configuração** (OS, Node.js version, etc)

## ✨ Sugerindo Melhorias

Sugestões de melhoria são sempre bem-vindas! Para sugerir uma melhoria:

1. **Use um título descritivo** para a sugestão
2. **Forneça uma descrição detalhada** da melhoria sugerida
3. **Liste alguns exemplos** de como a melhoria seria usada
4. **Mencione outros projetos** que implementam essa funcionalidade bem, se houver

## 🎯 Seu Primeiro Commit

Nunca contribuiu para um projeto open source antes? Eis como começar:

1. **Fork o repositório**
   ```bash
   git clone https://github.com/seu-usuario/comandaflow.git
   cd comandaflow
   ```

2. **Crie uma branch feature**
   ```bash
   git checkout -b feature/sua-feature-incrivel
   ```

3. **Instale dependências**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. **Faça suas mudanças**
   - Escreva código limpo e bem comentado
   - Siga o [style guide](#style-guide)
   - Teste suas mudanças

5. **Commit suas mudanças**
   ```bash
   git add .
   git commit -m "Descrição clara do que foi feito"
   ```

6. **Push para sua branch**
   ```bash
   git push origin feature/sua-feature-incrivel
   ```

7. **Abra um Pull Request**
   - Descreva suas mudanças
   - Referencie qualquer issue relacionado

## 📐 Style Guide

### JavaScript/React

- Indentação: 2 espaços
- Quotes: Single quotes (`'`)
- Semicolons: Obrigatório
- Trailing commas: Use em ES5+

```javascript
// ✅ BOM
const usuario = {
  nome: 'João',
  email: 'joao@example.com',
};

// ❌ RUIM
const usuario = {
  nome: "João",
  email: "joao@example.com"
}
```

### Componentes React

- Use functional components
- Nomeie componentes com PascalCase
- Exporte na parte inferior do arquivo

```javascript
// ✅ BOM
export const MyComponent = ({ props }) => {
  return <div>Conteúdo</div>;
};

// ❌ RUIM
export default function myComponent(props) {
  return <div>Conteúdo</div>;
}
```

### Commits

Use mensagens convencionais:

```
feat: adicionar novo recurso
fix: corrigir bug
docs: atualizar documentação
style: mudanças de formatação
refactor: refatoração sem mudanças funcionais
test: adicionar testes
chore: tarefas de manutenção
```

Exemplo:
```bash
git commit -m "feat: adicionar autenticação com 2FA"
git commit -m "fix: corrigir problema de CORS"
```

## 🧪 Testando

Antes de submeter um PR:

1. **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Testes manuais:**
   - Testar em múltiplos navegadores
   - Testar em dispositivos móveis
   - Verificar responsividade

## 📝 Documentação

Para mudanças significativas, por favor:

- Atualize o README.md com com novos passos, variáveis de ambiente alteradas, ou portas expostas
- Atualize a documentação da API se necessário
- Adicione comentários em código complexo

## 🔒 Segurança

Se você descobrir uma vulnerabilidade de segurança, por favor **não** abra um issue público. Em vez disso, envie um email para `seu.email@example.com` descrevendo a vulnerabilidade.

## 📞 Questões?

Sinta-se à vontade para abrir uma discussão ou entrar em contato:

- 💬 [GitHub Discussions](https://github.com/seu-usuario/comandaflow/discussions)
- 📧 Email: seu.email@example.com
- 🐦 Twitter: [@seu_twitter](https://twitter.com/seu_twitter)

## 🎉 Agradecimentos

Obrigado por contribuir ao ComandaFlow! Sua ajuda é essencial para tornar este projeto melhor.

---

**Happy coding! 🚀**
