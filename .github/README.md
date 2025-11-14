# Frontend CI/CD & GitHub Projects Integration

This repository includes automated CI/CD pipelines and GitHub Projects integration for the React frontend.

## Workflows

### 1. PR to Project Integration (`pr-to-project.yml`)

Automatically creates a project ticket when a Pull Request is opened.

**Features:**
- ✅ Creates a project item when PR is opened
- ✅ Links PR information to the project ticket
- ✅ Adds labels (`frontend`, `project-management`, `pull-request`)
- ✅ Works with both GitHub Projects V2 (new) and Projects (legacy)

**How it works:**
1. When a PR is opened, the workflow triggers
2. It finds the first available GitHub Project (repository or organization level)
3. For Projects V2: Adds PR directly to the project
4. For Legacy Projects: Creates an issue linked to the PR and adds it to the project
5. Comments on the PR with the ticket reference

### 2. CI/CD Pipeline (`ci.yml`)

Runs automated tests and quality checks on every push and PR.

**Features:**
- ✅ Frontend React tests with coverage
- ✅ Build verification
- ✅ Code quality checks with ESLint
- ✅ Runs on Node.js 18

**Jobs:**
- **Frontend Tests**: Runs React tests with coverage
- **Lint**: Checks code quality with ESLint
- **Build**: Verifies the application builds successfully

## Setup Instructions

### 1. Enable GitHub Actions

1. Go to your repository on GitHub: `https://github.com/symplice-nunu/queue_frontend`
2. Navigate to **Settings** → **Actions** → **General**
3. Ensure "Allow all actions and reusable workflows" is enabled
4. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
5. Save changes

### 2. Create a GitHub Project

1. Go to your repository: `https://github.com/symplice-nunu/queue_frontend`
2. Click on the **Projects** tab
3. Click **New project** or **Create project**
4. Choose a template or start from scratch
5. The workflow will automatically detect and use this project

**Alternative:** You can also use an organization-level project.

### 3. Push the Workflows

```bash
cd /Users/sympliceintwari/Downloads/efishe_assessment/frontend
git add .github/
git commit -m "Add CI/CD and GitHub Projects integration"
git push origin main
```

### 4. Test the Integration

1. Create a new branch:
   ```bash
   git checkout -b feature/test-pr-integration
   ```

2. Make a small change (e.g., update a comment)

3. Commit and push:
   ```bash
   git add .
   git commit -m "Test PR to project integration"
   git push origin feature/test-pr-integration
   ```

4. Open a Pull Request on GitHub

5. The workflow will automatically:
   - ✅ Run frontend tests
   - ✅ Verify build succeeds
   - ✅ Create a project ticket with label `frontend`
   - ✅ Link the PR to the project
   - ✅ Add a comment to the PR

## Workflow Details

### PR to Project Workflow

**Triggers:**
- `pull_request.opened`
- `pull_request.reopened`

**Steps:**
1. Extract PR information (title, description, author, branch)
2. Find the first available GitHub Project (Projects V2 or legacy)
3. Add PR directly to project (V2) OR create issue and add to project (legacy)
4. Comment on PR with ticket reference

### CI/CD Workflow

**Triggers:**
- Push to `main`, `master`, or `develop`
- Pull requests to `main`, `master`, or `develop`

**Test Environment:**
- Node.js 18
- npm caching for faster builds
- All dependencies installed via `npm ci`

## Troubleshooting

### Project Ticket Not Created

**Issue:** Workflow runs but no ticket is created

**Solutions:**
1. Ensure a GitHub Project exists (repository or organization level)
2. Check workflow permissions in repository settings
3. Verify the project is not archived
4. Check workflow logs in the Actions tab

### Permission Errors

**Issue:** "Resource not accessible by integration"

**Solutions:**
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Save changes

### Tests Failing

**Issue:** CI/CD tests are failing

**Solutions:**
1. Check that all dependencies are in `package.json`
2. Verify `package-lock.json` is committed
3. Check the Actions tab for specific error messages
4. Run tests locally: `npm test`

### Build Failing

**Issue:** Build step is failing

**Solutions:**
1. Verify `package.json` has a valid `build` script
2. Check for TypeScript or linting errors
3. Ensure all dependencies are properly installed
4. Test build locally: `npm run build`

## Repository

- **GitHub:** https://github.com/symplice-nunu/queue_frontend
- **Tech Stack:** React, TailwindCSS, React Router

## Frontend Assessment Submission

### Final Submission

**Design Document:** https://maquiso.com/queue/login  

**API Documentation:** https://maquiso.com/queue/swagger-ui.html  

---

### Test Login Account

**URL:** https://maquiso.com/queue/login  

**Email:** admin@clinic.com  

**Password:** password123  

---


### Features Implemented
- User authentication
- Staff dashboard with queue management
- Public display
- Real-time updates
- Responsive design