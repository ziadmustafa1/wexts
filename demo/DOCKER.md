# Docker Deployment للـ WEXTS

## 🐳 Quick Start

```bash
# 1. Build and run with Docker Compose
docker-compose up -d

# 2. التطبيق هيشتغل على
http://localhost:3000
```

**بس كده! 🎉**

---

## 📋 خطوات مفصلة

### 1. Build Docker Image

```bash
# Build image
docker build -t wexts-app .

# أو استخدم docker-compose
docker-compose build
```

### 2. Run Container

**Option A: مع Docker Compose (مع PostgreSQL):**
```bash
# Start everything
docker-compose up -d

# Check logs
docker-compose logs -f app

# Stop
docker-compose down
```

**Option B: Docker فقط (بدون database):**
```bash
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e JWT_SECRET="your-secret" \
  -e NODE_ENV=production \
  --name wexts-app \
  wexts-app
```

### 3. Database Migration

```bash
# Run migrations
docker-compose exec app sh -c "cd apps/api && npx prisma migrate deploy"

# Or if using Prisma push
docker-compose exec app sh -c "cd apps/api && npx prisma db push"
```

---

## 🔧 Environment Variables

أنشئ ملف `.env` في الـ root:

```env
# Database
DATABASE_URL=postgresql://wexts:wexts_password@postgres:5432/wexts_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server
NODE_ENV=production
PORT=3000
```

---

## 🚀 Deploy على Server/VPS

### 1. على Server (Ubuntu/Debian):

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin

# Clone repo
git clone https://github.com/your-username/wexts.git
cd wexts/demo

# Create .env file
cp .env.example .env
nano .env  # Edit variables

# Start
docker-compose up -d

# تطبيقك شغال على http://your-server-ip:3000
```

### 2. مع Nginx (Production):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 مراقبة التطبيق

```bash
# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart
docker-compose restart app

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🔄 Update التطبيق

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### Container مش بيشتغل:
```bash
# Check logs
docker-compose logs app

# Check if port is available
netstat -tulpn | grep 3000
```

### Database connection error:
```bash
# Check database is running
docker-compose ps postgres

# Check connection
docker-compose exec postgres psql -U wexts -d wexts_db
```

### Rebuild from scratch:
```bash
# Stop everything
docker-compose down -v

# Remove images
docker rmi wexts-app

# Rebuild
docker-compose up -d --build
```

---

## 📦 الملفات المطلوبة

```
wexts/demo/
├── Dockerfile          ← Build configuration
├── .dockerignore       ← Files to ignore
├── docker-compose.yml  ← Multi-container setup
└── .env               ← Environment variables (create from .env.example)
```

---

## ✅ Checklist

- [ ] Docker و Docker Compose مثبتين
- [ ] `.env` file موجود ومعدل
- [ ] PostgreSQL settings صحيحة
- [ ] Port 3000 متاح
- [ ] `docker-compose up -d` بيشتغل
- [ ] Application accessible على http://localhost:3000

---

## 🎯 Production Tips

1. **استخدم production database:** مش الـ Docker PostgreSQL للـ production الحقيقي
2. **SSL/HTTPS:** استخدم Nginx مع Let's Encrypt
3. **Backups:** Backup database بشكل دوري
4. **Monitoring:** استخدم tools زي Portainer للـ monitoring
5. **Security:** غير الـ default passwords في `.env`

---

## 🚀 مثالي لـ:

✅ Development environment  
✅ Testing  
✅ VPS deployment  
✅ Self-hosted solutions  
✅ Full control over infrastructure  

**Docker = أفضل حل للـ unified servers! 🐳**
