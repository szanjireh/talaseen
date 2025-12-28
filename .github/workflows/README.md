# GitHub Actions Workflows

This directory contains the CI/CD pipeline configuration for the Talaseen project.

## Available Workflows

### 🧪 CI Pipeline (`ci.yml`)
Continuous Integration pipeline that runs on every push and pull request.

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- `backend-ci`: Build and test backend
- `frontend-ci`: Build and test frontend  
- `docker-build-test`: Test Docker image builds

### 🚀 CD Pipeline (`cd.yml`)
Continuous Deployment pipeline for building and pushing Docker images.

**Triggers:**
- Push to `main` branch
- Version tags (`v*.*.*`)

**Jobs:**
- Build Docker images for backend and frontend
- Push images to Docker Hub
- Auto-tag with version, branch, and SHA

**Required Secrets:**
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

### 🌐 Deploy Pipeline (`deploy.yml`)
Automated deployment to production/staging servers.

**Triggers:**
- Manual workflow dispatch
- Automatic on push to `main` (optional)

**Jobs:**
- SSH into server
- Pull latest code
- Deploy with Docker Compose
- Run database migrations
- Health check

**Required Secrets:**
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `SERVER_HOST`
- `SERVER_USER`
- `SERVER_PATH`
- `SSH_PRIVATE_KEY`

## Setup Instructions

See the comprehensive guides:
- [CICD_SETUP_GUIDE.md](../../CICD_SETUP_GUIDE.md) - Complete setup guide (Persian)
- [GITHUB_SECRETS.md](../../GITHUB_SECRETS.md) - GitHub Secrets reference

## Quick Start

1. **Setup Docker Hub:**
   ```bash
   # Login to Docker Hub
   docker login
   
   # Create repositories:
   # - username/talaseen-backend
   # - username/talaseen-frontend
   ```

2. **Add GitHub Secrets:**
   - Go to repository Settings → Secrets and variables → Actions
   - Add required secrets (see GITHUB_SECRETS.md)

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```

4. **Monitor:**
   - Go to Actions tab in GitHub
   - Watch workflows execute

## Workflow Status Badges

Add these to your README.md:

```markdown
![CI](https://github.com/username/talaseen/workflows/CI%20Pipeline/badge.svg)
![CD](https://github.com/username/talaseen/workflows/CD%20Pipeline/badge.svg)
![Deploy](https://github.com/username/talaseen/workflows/Deploy%20to%20Server/badge.svg)
```

## Troubleshooting

### Workflow fails with authentication error
- Check that secrets are properly set
- Verify Docker Hub credentials
- Ensure SSH key is correctly formatted

### Docker build fails
- Check Dockerfile syntax
- Verify dependencies in package.json
- Review build logs in Actions tab

### Deploy fails
- Verify server is accessible via SSH
- Check server has Docker and Docker Compose installed
- Ensure `.env` files exist on server

## Advanced Configuration

### Environment-specific deployments
Modify `deploy.yml` to use different environments:

```yaml
environment: production  # or staging
```

### Custom triggers
Add more trigger conditions in workflow files:

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:      # Manual trigger
```

### Notifications
Add notification steps (Slack, Discord, Email):

```yaml
- name: Notify Success
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Contributing

When modifying workflows:
1. Test changes in a feature branch
2. Use `workflow_dispatch` for manual testing
3. Review logs thoroughly
4. Document any new secrets required

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [Docker Login Action](https://github.com/docker/login-action)
