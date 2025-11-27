# Contributing to WEXTS

First off, thank you for considering contributing to WEXTS! 🎉

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the project

## 🚀 Development Setup

```bash
# Clone the repository
git clone https://github.com/ziadmustafa1/wexts.git
cd wexts

# Install dependencies
pnpm install

# Start demo project
cd demo
pnpm run dev
```

## 📋 Project Structure

```
wexts/
├── packages/           # Main WEXTS package
│   ├── src/           # Source code
│   └── templates/     # Project templates
├── demo/              # Example application
└── docs/              # Documentation
```

## 🔨 Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Test your changes**
   ```bash
   pnpm run test
   pnpm run build
   ```

5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

   Types:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `style:` - Code style
   - `refactor:` - Code refactoring
   - `test:` - Tests
   - `chore:` - Maintenance

6. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

## 📝 Code Guidelines

### TypeScript
- Use TypeScript for all code
- Enable strict mode
- Add JSDoc comments for public APIs

### Naming Conventions
- Use `camelCase` for variables and functions
- Use `PascalCase` for classes and types
- Use `kebab-case` for file names

### Code Style
- Use Prettier for formatting
- Follow ESLint rules
- Keep functions small and focused

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 📚 Documentation

- Update README.md if needed
- Add JSDoc comments
- Update CHANGELOG.md
- Add examples if applicable

## 🐛 Reporting Bugs

**Before submitting:**
1. Check existing issues
2. Use latest version
3. Provide minimal reproduction

**Include:**
- WEXTS version
- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Error messages/screenshots

## 💡 Feature Requests

- Explain the use case
- Describe desired behavior
- Provide examples if possible
- Consider implementation difficulty

## ✅ Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Added/updated tests
- [ ] Updated documentation
- [ ] No breaking changes (or documented)
- [ ] Commits follow conventional format

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on what's best for the community

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Open an issue or discussion!

Thank you for contributing! 🙏
