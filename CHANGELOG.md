# Changelog

All notable changes to Triage.AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-21

### Added

#### 🤖 Triage Agent (Coral Protocol)
- AI-powered GitHub issue analysis using OpenAI GPT-3.5-turbo
- Coral Protocol compliant agent with metadata endpoint
- Comprehensive issue triage with priority, severity, and suggestions
- Health check and metadata endpoints
- Input/output schema validation
- Agent registration system for Coral Protocol
- Support for dynamic port configuration
- Docker deployment configuration

#### 🔧 Backend API
- Express.js server with GitHub API integration
- Octokit-based GitHub repository and issue fetching
- Proxy endpoints for triage agent communication
- CORS and security middleware (Helmet, Morgan)
- Rate limiting and error handling
- Environment variable configuration
- Health check endpoints

#### 🎨 Frontend Dashboard
- React + Vite application with Tailwind CSS
- Real-time connection status monitoring
- Repository browser with issue listing
- Interactive issue selection and details view
- AI triage results visualization with confidence scoring
- Responsive design for desktop and mobile
- GitHub URL parsing for easy repository input
- Loading states and error handling

#### 📦 Project Infrastructure
- Workspace-based monorepo structure
- Comprehensive package.json scripts for development
- Environment variable management with .env templates
- ESLint configuration for code quality
- Testing setup for all components

#### 🚀 Deployment Support
- Railway.app deployment configuration
- Render.com deployment configuration
- Vercel serverless deployment setup
- Docker and Docker Compose support
- Public access setup scripts
- Cloud platform deployment guides

#### 📖 Documentation
- Comprehensive README with setup instructions
- API documentation with examples
- Coral Protocol integration guide
- Deployment guides for multiple platforms
- Contributing guidelines
- Public access and sharing instructions

#### 🔐 Security & Configuration
- Environment-based configuration
- API key management
- CORS configuration
- Input validation and sanitization
- Rate limiting for API endpoints
- Security headers with Helmet

### Technical Details

#### Dependencies
- **Frontend**: React 18, Vite 4, Tailwind CSS 3, Axios, Lucide React
- **Backend**: Express 4, Cors, Helmet, Morgan, Octokit, Rate Limiting
- **Agent**: Express 4, OpenAI API, Axios, CORS, Helmet
- **Development**: Nodemon, ESLint, PostCSS, Autoprefixer

#### API Endpoints
- `GET /health` - Service health check
- `GET /metadata` - Coral Protocol agent metadata
- `POST /analyze` - AI-powered issue triage analysis
- `GET /api/github/repos/:owner/:repo/issues` - GitHub issue fetching
- `POST /api/triage/analyze` - Backend triage proxy

#### Coral Protocol Compliance
- Complete agent.yaml metadata file
- Standardized input/output schemas
- Health and metadata endpoints
- Registration system integration
- Public discovery support

### Infrastructure

#### Development Environment
- Node.js 18+ support
- npm workspace configuration
- Multi-service development scripts
- Environment variable templates
- Hot reload and watch modes

#### Production Deployment
- Multi-platform deployment support
- Environment-specific configurations
- Health monitoring and logging
- Performance optimization
- Security hardening

## [Unreleased]

### Planned Features
- Additional LLM provider support (Claude, Gemini)
- Batch issue processing
- Repository analytics and insights
- Advanced filtering and search
- User authentication and preferences
- Issue template customization
- Mobile app development
- Performance monitoring dashboard

---

**Built for the Internet of Agents Hackathon @ Solana Skyline** 🏆

*This project demonstrates the power of AI-driven automation in software development workflows, built on the Coral Protocol for agent interoperability.*