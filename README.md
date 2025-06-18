# MarkLogic Admin with React and Spring Boot

A modern, full-stack MarkLogic administration interface built with React and Spring Boot. This project provides a clean, web-based UI for managing MarkLogic databases and forests through a secure proxy layer.

## 🚀 Features

- **React Frontend**: Modern UI built with React, TypeScript, and Vite
- **Spring Boot Proxy**: Secure backend proxy for MarkLogic Management API
- **Database Management**: View and manage MarkLogic databases
- **Forest Management**: View and manage MarkLogic forests with parameter validation
- **Docker Support**: Containerized MarkLogic for development and testing
- **Comprehensive Testing**: Unit tests, integration tests, and end-to-end testing
- **Parameter Validation**: Robust validation for all MarkLogic API parameters

## 📁 Project Structure

This is a Gradle multi-project build containing:

- **`MarkLogicAdminUI/`** — React/Vite frontend application
- **`MarkLogicAdminProxy/`** — Spring Boot backend proxy server
- **`docker/`** — Docker configuration for MarkLogic
- **`docker-compose.yml`** — Docker Compose setup for development

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Vitest** for testing
- **CSS** for styling

### Backend
- **Spring Boot 3.2** with Java 17
- **MarkLogic Java Client** for database connectivity
- **OkHttp** for HTTP client operations
- **JUnit 5** and **Mockito** for testing

### DevOps
- **Docker** and **Docker Compose** for containerization
- **Gradle** for build management
- **GitHub Actions** ready (`.github` directory)

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Docker and Docker Compose
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/BillFarber/marklogic-admin-react.git
cd marklogic-admin-react
```

### 2. Start MarkLogic Container
```bash
docker-compose up -d
```

### 3. Start the Backend Proxy
```bash
cd MarkLogicAdminProxy
./gradlew bootRun
```

### 4. Start the Frontend
```bash
cd MarkLogicAdminUI
npm install
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **MarkLogic Admin**: http://localhost:8000 (admin/admin)

## 🧪 Testing

### Run All Tests
```bash
# Backend tests
cd MarkLogicAdminProxy && ./gradlew test

# Frontend tests
cd MarkLogicAdminUI && npm test
```

### Test Coverage
- **Backend**: 17 tests (unit + integration)
- **Frontend**: 34 tests (unit + integration)
- **Integration**: Real API tests against Docker MarkLogic

## 📚 API Endpoints

### Databases
- `GET /manage/v2/databases` - List all databases
- Query parameters: `view`, `format`

### Forests
- `GET /manage/v2/forests` - List all forests
- Query parameters: `format`, `view`, `database-id`, `group-id`, `host-id`, `fullrefs`
- Parameter validation with 400 errors for invalid values

## 🐳 Docker Configuration

The included Docker Compose setup provides:
- **MarkLogic Server**: Latest rootless container
- **Automatic initialization** with admin/admin credentials
- **Port mappings**: 8000-8004 for all MarkLogic services
- **Log persistence**: Local volume for MarkLogic logs

## 🔧 Development

### Project Commands
```bash
# Build all projects
./gradlew build

# Clean all projects
./gradlew clean

# Run backend tests
./gradlew test

# Start backend in development mode
cd MarkLogicAdminProxy && ./gradlew bootRun

# Start frontend in development mode
cd MarkLogicAdminUI && npm run dev

# Run frontend tests
cd MarkLogicAdminUI && npm test
```

## 🏗️ Architecture

```
React UI (Port 5173)
    ↓ HTTP Requests
Spring Boot Proxy (Port 8080)
    ↓ MarkLogic Management API
Docker MarkLogic (Port 8002)
```

### Key Components
- **React Admin Component**: Main UI for databases and forests
- **Spring Boot Controllers**: Secure proxy for MarkLogic APIs
- **Parameter Validation**: Server-side validation for all API parameters
- **Error Handling**: Comprehensive error handling and user feedback

## 📋 Features Implemented

### ✅ Databases
- List all databases with metadata
- View raw JSON responses
- Error handling for failed requests

### ✅ Forests
- List all forests with JSON format parameter
- Complete parameter validation (`format`, `view`, `database-id`, etc.)
- Forest-specific UI styling and display
- Independent loading from databases

### ✅ Testing
- Unit tests with mocks for all components
- Integration tests against real MarkLogic
- Parameter validation testing
- Error scenario coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.
