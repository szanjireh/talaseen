# GitHub Secrets Quick Reference

## Required Secrets for CI/CD Pipeline

### Docker Hub Secrets (Required)

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DOCKER_USERNAME` | Your Docker Hub username | `myusername` |
| `DOCKER_PASSWORD` | Docker Hub password or access token (recommended) | `dckr_pat_xxxxx` |

**How to create Docker Hub Access Token:**
1. Go to [Docker Hub](https://hub.docker.com)
2. Settings → Security → New Access Token
3. Create token with Read & Write permissions
4. Copy and save as `DOCKER_PASSWORD` secret

---

### Deployment Secrets (Optional - for auto-deploy)

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SERVER_HOST` | Server IP or domain | `192.168.1.100` |
| `SERVER_USER` | SSH username | `ubuntu` |
| `SERVER_PATH` | Project path on server | `/home/ubuntu/talaseen` |
| `SSH_PRIVATE_KEY` | SSH private key for server access | Full private key content |

**How to create SSH Key:**
```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_actions.pub user@server

# Display private key (copy entire content)
cat ~/.ssh/github_actions
```

---

## Adding Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:
   - **Name**: Enter the secret name exactly as shown above
   - **Value**: Paste the secret value
   - Click **Add secret**

---

## Workflows Overview

### 1. CI Pipeline (`.github/workflows/ci.yml`)
- **Triggers**: Push or PR to `main` or `develop`
- **Required Secrets**: None (runs without secrets)
- **Actions**:
  - Install dependencies
  - Run linting
  - Build backend and frontend
  - Run tests
  - Test Docker builds

### 2. CD Pipeline (`.github/workflows/cd.yml`)
- **Triggers**: Push to `main` or version tags (`v*.*.*`)
- **Required Secrets**: 
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`
- **Actions**:
  - Build Docker images
  - Push to Docker Hub
  - Auto-tag images (latest, version, sha)

### 3. Deploy Pipeline (`.github/workflows/deploy.yml`)
- **Triggers**: Manual or automatic (push to `main`)
- **Required Secrets**:
  - `DOCKER_USERNAME`
  - `DOCKER_PASSWORD`
  - `SERVER_HOST`
  - `SERVER_USER`
  - `SERVER_PATH`
  - `SSH_PRIVATE_KEY`
- **Actions**:
  - Pull latest code on server
  - Pull new Docker images
  - Run database migrations
  - Restart containers
  - Health check

---

## Testing Your Setup

### Minimal Setup (CI only):
1. Add workflows to repository
2. Push to GitHub
3. Check Actions tab

### With Docker Hub (CI + CD):
1. Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
2. Create Docker Hub repositories:
   - `username/talaseen-backend`
   - `username/talaseen-frontend`
3. Push to `main` branch
4. Check Docker Hub for images

### Full Setup (CI + CD + Deploy):
1. Complete minimal and Docker Hub setup
2. Add server secrets (`SERVER_*` and `SSH_PRIVATE_KEY`)
3. Ensure server has Docker and Docker Compose installed
4. Push to `main` or manually trigger deploy workflow

---

## Common Issues

### Authentication Failed (Docker Hub)
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` are correct
- Use access token instead of password
- Check token has Read & Write permissions

### SSH Connection Failed
- Verify SSH private key format (must include BEGIN/END lines)
- Ensure public key is added to server's `~/.ssh/authorized_keys`
- Check server firewall allows SSH (port 22)

### Build Failed
- Check logs in Actions tab
- Verify all dependencies are in package.json
- Ensure Dockerfiles are correct

---

## Security Best Practices

✅ **DO:**
- Use Docker Hub access tokens (not password)
- Use SSH keys for server access
- Keep secrets up to date
- Use separate tokens for different purposes
- Rotate secrets regularly

❌ **DON'T:**
- Commit secrets to code
- Share secrets publicly
- Use weak passwords
- Reuse secrets across projects
- Log secret values

---

## Quick Commands

### Create version tag:
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Manual deploy:
1. Go to Actions tab
2. Select "Deploy to Server"
3. Click "Run workflow"
4. Choose environment
5. Click "Run workflow"

### Rollback:
```bash
git revert HEAD
git push origin main
```

---

## Support

For detailed setup instructions in Persian, see [CICD_SETUP_GUIDE.md](CICD_SETUP_GUIDE.md)

For issues:
1. Check Actions logs
2. Verify all secrets are set
3. Check server connectivity
4. Review Dockerfile syntax
