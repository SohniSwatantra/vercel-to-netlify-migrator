# Docker Deployment - Isolated & Secure Migration

Run the Vercel to Netlify migration tool in a completely isolated Docker container for maximum security.

## 🔒 Security Features

- ✅ **Complete Isolation**: Runs in sandboxed container
- ✅ **No Network Access**: Container doesn't need external network
- ✅ **Client-Side Processing**: All migration logic in browser
- ✅ **Non-Root User**: Container runs as unprivileged user
- ✅ **Read-Only Filesystem**: Immutable container filesystem
- ✅ **No Capabilities**: All Linux capabilities dropped
- ✅ **No Environment Secrets**: No env vars stored in container

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and run
docker-compose up -d

# Access at http://localhost:3000
```

Stop and remove:
```bash
docker-compose down
```

### Option 2: Using Docker CLI

```bash
# Build the image
docker build -t vercel-netlify-migrator .

# Run the container
docker run -d \
  --name migrator \
  -p 3000:3000 \
  --read-only \
  --security-opt=no-new-privileges:true \
  --cap-drop=ALL \
  vercel-netlify-migrator

# Access at http://localhost:3000
```

Stop and remove:
```bash
docker stop migrator && docker rm migrator
```

### Option 3: Ultra-Secure Isolated Build

For maximum security with nginx serving static files:

```bash
# Build isolated image
docker build -f Dockerfile.isolated -t vercel-netlify-migrator:isolated .

# Run with maximum security
docker run -d \
  --name migrator-isolated \
  -p 8080:8080 \
  --read-only \
  --security-opt=no-new-privileges:true \
  --cap-drop=ALL \
  --network=none \
  vercel-netlify-migrator:isolated

# Access at http://localhost:8080
```

## 🎯 Use Cases

### 1. **Secure Developer Workstation**
Run the tool in isolation on your local machine without installing any dependencies:
```bash
docker-compose up
# Open http://localhost:3000
# All processing happens in browser
# No data leaves your machine
```

### 2. **CI/CD Pipeline (CLI Mode)**
Use the CLI container for automated migrations:
```bash
# Place your project in ./project directory
docker-compose --profile cli up

# Generated files appear in ./output directory
```

### 3. **Team Environment**
Deploy on internal network for team access:
```bash
docker run -d -p 80:3000 vercel-netlify-migrator
# Access from any machine: http://your-server-ip
```

## 🛡️ Security Architecture

### Container Security
```
┌─────────────────────────────────────┐
│   Host Machine (Your Computer)     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Docker Container (Isolated)  │ │
│  │                               │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │   Nginx/Node Server    │ │ │
│  │  │   (Static Files Only)  │ │ │
│  │  └─────────────────────────┘ │ │
│  │                               │ │
│  │  - Read-only filesystem       │ │
│  │  - No network access needed   │ │
│  │  - Non-root user              │ │
│  │  - All caps dropped           │ │
│  └───────────────────────────────┘ │
│             ▲                       │
│             │ Port Mapping          │
│             │ (3000:3000)           │
└─────────────┼───────────────────────┘
              │
        ┌─────▼──────┐
        │  Browser   │
        │ (You open  │
        │ localhost) │
        └────────────┘
```

### Data Flow
1. **You access** `http://localhost:3000` in browser
2. **Docker serves** static HTML/CSS/JS files
3. **Your browser** processes vercel.json and .env files
4. **All computation** happens in browser (JavaScript)
5. **No data** sent to container or any server
6. **You download** generated files directly from browser

## 🚀 Advanced Usage

### Build with Custom Port

```bash
docker run -d -p 8080:3000 vercel-netlify-migrator
# Access at http://localhost:8080
```

### Check Container Security

```bash
# Verify container is running as non-root
docker exec migrator whoami
# Output: migrator (not root!)

# Verify read-only filesystem
docker exec migrator touch /test-file
# Output: Permission denied (working as expected!)

# Check security options
docker inspect migrator --format='{{.HostConfig.SecurityOpt}}'
```

### View Container Logs

```bash
docker logs migrator
```

### Health Check

```bash
docker inspect migrator --format='{{.State.Health.Status}}'
```

## 🧹 Cleanup

### Remove Container and Image
```bash
# Stop and remove container
docker stop migrator && docker rm migrator

# Remove image
docker rmi vercel-netlify-migrator

# Or use docker-compose
docker-compose down --rmi all
```

### Clean Build Cache
```bash
docker builder prune
```

## 🔍 Verification

### Verify No Network Calls
1. Open browser DevTools (F12)
2. Go to Network tab
3. Use the migration tool
4. Verify: Only local file loads, no API calls with env data

### Verify Container Isolation
```bash
# Check container cannot access network
docker exec migrator ping google.com
# Should fail if using --network=none

# Check filesystem is read-only
docker exec migrator touch /test
# Should fail: Read-only file system
```

## 📊 Resource Usage

Typical resource usage:
- **CPU**: < 1%
- **Memory**: ~50MB
- **Disk**: ~200MB (image size)
- **Network**: 0 (after initial build)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
docker run -d -p 3001:3000 vercel-netlify-migrator
```

### Container Fails to Start
```bash
# Check logs
docker logs migrator

# Rebuild without cache
docker build --no-cache -t vercel-netlify-migrator .
```

### Permission Denied
```bash
# Ensure Docker daemon is running
docker ps

# Check Docker permissions
sudo usermod -aG docker $USER
# Logout and login again
```

## 🎓 Best Practices

1. **Always use read-only filesystem** for web containers
2. **Drop all capabilities** unless specifically needed
3. **Run as non-root user** inside containers
4. **Use --network=none** when external network not required
5. **Regularly update base images** for security patches
6. **Scan images** for vulnerabilities:
   ```bash
   docker scan vercel-netlify-migrator
   ```

## 📝 Environment Variables

No sensitive environment variables are needed! The container only serves static files.

Optional configuration:
```bash
docker run -d \
  -e NODE_ENV=production \
  -p 3000:3000 \
  vercel-netlify-migrator
```

## 🌐 Production Deployment

For production use:

```bash
# Build optimized image
docker build --target runtime -t vercel-netlify-migrator:prod .

# Run with resource limits
docker run -d \
  --name migrator-prod \
  -p 443:3000 \
  --read-only \
  --security-opt=no-new-privileges:true \
  --cap-drop=ALL \
  --memory="256m" \
  --cpus="0.5" \
  vercel-netlify-migrator:prod
```

## 🔐 Security Checklist

Before deploying:
- [ ] Container runs as non-root user
- [ ] Filesystem is read-only
- [ ] All capabilities dropped
- [ ] No sensitive data in image
- [ ] Network isolation configured (if possible)
- [ ] Health checks enabled
- [ ] Resource limits set
- [ ] Image scanned for vulnerabilities
- [ ] Using latest base image
- [ ] .dockerignore excludes sensitive files

## 📚 Additional Resources

- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker)
- [OWASP Docker Security](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html)
