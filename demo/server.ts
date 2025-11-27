import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import next from 'next';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

async function getAppModule() {
    if (dev) {
        const module = await import('./apps/api/src/app.module');
        return module.AppModule;
    } else {
        const module = require(path.join(__dirname, './apps/api/dist/app.module'));
        return module.AppModule;
    }
}

async function bootstrap() {
    const app = express();

    console.log('🚀 Starting WEXTS Unified Server...\n');

    // 1. Setup Next.js first
    console.log('📦 Loading Next.js...');
    const nextApp = next({
        dev,
        dir: path.join(__dirname, './apps/web'),
    });
    await nextApp.prepare();
    const nextHandler = nextApp.getRequestHandler();
    console.log('✅ Next.js ready\n');

    // 2. SMART ROUTER MIDDLEWARE
    // This intercepts ALL requests BEFORE they reach NestJS
    let nestAppInitialized = false;

    app.use(async (req: Request, res: Response, next: NextFunction) => {
        const path = req.path || req.url;

        // Check if this is an API request
        if (path.startsWith('/api')) {
            // API request - let it continue to NestJS
            if (nestAppInitialized) {
                return next();
            } else {
                // NestJS not ready yet, wait
                return res.status(503).json({ message: 'API initializing...' });
            }
        } else {
            // NOT an API request - immediately send to Next.js
            // This prevents NestJS from even seeing it
            return nextHandler(req, res);
        }
    });

    // 3. Setup NestJS (will only receive /api/* requests now)
    console.log('📦 Loading NestJS...');
    const AppModule = await getAppModule();
    const adapter = new ExpressAdapter(app);

    const nestApp = await NestFactory.create(AppModule, adapter, {
        cors: true,
        logger: dev ? ['log', 'error', 'warn'] : ['error'],
    });

    nestApp.setGlobalPrefix('api');
    await nestApp.init();
    nestAppInitialized = true;
    console.log('✅ NestJS ready\n');

    // 4. Start server
    app.listen(port, () => {
        console.log(`\n🎉 WEXTS Unified Server Running!`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`   🌐 Server: http://localhost:${port}`);
        console.log(`   📱 Frontend: All routes except /api/*`);
        console.log(`   🔌 Backend: /api/*`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        console.log(`✨ Routes are smartly separated!\n`);
    });
}

bootstrap().catch((err) => {
    console.error('❌ Failed to start:', err);
    process.exit(1);
});
