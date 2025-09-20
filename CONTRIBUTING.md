# Contributing to Triage.AI 🤝

Thank you for your interest in contributing to Triage.AI! This project was built for the Internet of Agents Hackathon @ Solana Skyline, but we welcome contributions from the community.

## 🚀 Quick Start for Contributors

### Prerequisites
- Node.js 18+ and npm 8+
- OpenAI API Key
- GitHub Personal Access Token

### Setup Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/fahamgeer177/Triage.AI.git
cd Triage.AI

# Install dependencies
npm run install-all

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development servers
npm run dev:agent    # Terminal 1
npm run dev:backend  # Terminal 2
npm run dev:frontend # Terminal 3
```

## 📋 How to Contribute

### 1. Bug Reports
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Provide environment details (OS, Node version, etc.)
- Include error logs if applicable

### 2. Feature Requests
- Open an issue describing the feature
- Explain the use case and benefits
- Consider Coral Protocol compliance

### 3. Code Contributions

#### Fork and Branch
```bash
# Fork the repository on GitHub
git clone https://github.com/YOUR-USERNAME/Triage.AI.git
cd Triage.AI

# Create feature branch
git checkout -b feature/your-feature-name
```

#### Make Changes
- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure Coral Protocol compliance

#### Test Your Changes
```bash
# Test agent
cd triage-agent && npm test

# Test backend
cd backend && npm test

# Test frontend
cd frontend && npm run build
```

#### Submit Pull Request
```bash
# Commit changes
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name

# Open PR on GitHub
```

## 🏗️ Project Structure

```
Triage.AI/
├── triage-agent/     # Coral Protocol Agent
├── backend/          # Express API Server
├── frontend/         # React Dashboard
├── docs/            # Documentation
└── scripts/         # Utility scripts
```

### Key Files to Know
- `triage-agent/agent.yaml` - Coral Protocol metadata
- `triage-agent/src/services/triageService.js` - AI analysis logic
- `backend/src/routes/` - API endpoints
- `frontend/src/components/` - React components

## 🔧 Development Guidelines

### Code Style
- Use ES6+ features
- Follow existing naming conventions
- Add JSDoc comments for functions
- Use meaningful variable names

### Coral Protocol Standards
- Maintain agent.yaml metadata
- Ensure endpoint compliance
- Follow input/output schemas
- Include proper error handling

### Testing
- Write unit tests for new features
- Test API endpoints manually
- Verify frontend components work
- Check Coral Protocol compliance

## 🎯 Areas for Contribution

### High Priority
1. **Additional LLM Providers** - Support for Claude, Gemini, etc.
2. **Enhanced UI/UX** - Better visualizations and interactions
3. **Performance Optimization** - Faster analysis and caching
4. **Error Handling** - More robust error recovery

### Medium Priority
1. **Issue Templates** - Better triage categorization
2. **Batch Processing** - Analyze multiple issues at once
3. **Repository Insights** - Analytics and trends
4. **Mobile Responsiveness** - Better mobile experience

### Low Priority
1. **Theming** - Dark mode and customization
2. **Internationalization** - Multi-language support
3. **Accessibility** - Screen reader support
4. **Documentation** - More examples and tutorials

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] Agent health endpoint responds
- [ ] Agent metadata is valid
- [ ] Frontend connects to backend
- [ ] GitHub integration works
- [ ] AI analysis completes successfully
- [ ] Error states display properly

### Automated Testing
```bash
# Run all tests
npm test

# Test specific component
cd triage-agent && npm test
cd backend && npm test
```

## 📝 Documentation Standards

### Code Documentation
- Use JSDoc for function documentation
- Include parameter types and descriptions
- Provide usage examples
- Document complex logic

### README Updates
- Update setup instructions if changed
- Add new environment variables
- Document new features
- Update API documentation

## 🐛 Debugging Tips

### Common Issues
1. **Port conflicts** - Check if services are running
2. **API key errors** - Verify environment variables
3. **CORS issues** - Check backend CORS configuration
4. **Build failures** - Clear node_modules and reinstall

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev:agent
```

## 🔒 Security Guidelines

### API Keys
- Never commit API keys
- Use .env files for sensitive data
- Rotate keys if accidentally exposed

### Dependencies
- Keep dependencies updated
- Audit for vulnerabilities: `npm audit`
- Use exact versions in package.json

## 🚀 Deployment Contributions

### Cloud Deployments
Help improve deployment configurations:
- Railway.app setup
- Render.com configuration
- Docker optimizations
- CI/CD pipelines

### Documentation
- Deployment guides
- Environment setup
- Troubleshooting docs

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and ideas
- **Email** - For private matters

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Happy coding! 🚀**

*Built for the Internet of Agents Hackathon @ Solana Skyline*