const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🏗️  Building WEXTS Unified Runtime...\n');

const demoRoot = path.join(__dirname, '..');
const webApp = path.join(demoRoot, 'apps', 'web');
const apiApp = path.join(demoRoot, 'apps', 'api');

// Step 1: Build Next.js
console.log('📦 Building Next.js (standalone mode)...');
try {
    execSync('pnpm build', { cwd: webApp, stdio: 'inherit' });
    console.log('✅ Next.js build complete\n');
} catch (err) {
    console.error('❌ Next.js build failed');
    process.exit(1);
}

// Step 2: Build NestJS
console.log('📦 Building NestJS API...');
try {
    execSync('pnpm build', { cwd: apiApp, stdio: 'inherit' });
    console.log('✅ NestJS build complete\n');
} catch (err) {
    console.error('❌ NestJS build failed');
    process.exit(1);
}

// Step 3: Build server.ts
console.log('📦 Building unified server...');
try {
    execSync('npx tsc -p tsconfig.server.json', {
        cwd: webApp,
        stdio: 'inherit'
    });
    console.log('✅ Server build complete\n');
} catch (err) {
    console.error('❌ Server build failed');
    process.exit(1);
}

// Step 4: Copy NestJS dist to standalone
console.log('📦 Copying NestJS to standalone output...');
const standaloneDir = path.join(webApp, '.next', 'standalone');
const apiDistSource = path.join(apiApp, 'dist');
const apiDistDest = path.join(standaloneDir, 'api-dist');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

if (fs.existsSync(apiDistSource)) {
    copyRecursiveSync(apiDistSource, apiDistDest);
    console.log('✅ NestJS copied to standalone\n');
} else {
    console.error('❌ NestJS dist not found');
    process.exit(1);
}

// Step 5: Copy Prisma artifacts
console.log('📦 Copying Prisma client...');
const prismaSource = path.join(apiApp, 'node_modules', '.prisma');
const prismaDest = path.join(standaloneDir, 'node_modules', '.prisma');

if (fs.existsSync(prismaSource)) {
    copyRecursiveSync(prismaSource, prismaDest);
    console.log('✅ Prisma client copied\n');
}

// Step 6: Update server.js import paths
console.log('📝 Updating server import paths...');
const serverJs = path.join(standaloneDir, 'server.js');
if (fs.existsSync(serverJs)) {
    let content = fs.readFileSync(serverJs, 'utf8');
    content = content.replace(/require\(['"]wexts-api['"]\)/g, "require('./api-dist/app.module')");
    fs.writeFileSync(serverJs, content);
    console.log('✅ Server paths updated\n');
}

console.log('🎉 Build complete! Output: apps/web/.next/standalone/');
console.log('To run: node apps/web/.next/standalone/server.js');
