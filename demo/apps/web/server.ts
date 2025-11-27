import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import next from 'next';
import express from 'express';
import path from 'path';

// Import NestJS AppModule
const { AppModule } = require(path.join(__dirname, '../api/dist/app.module'));

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

async function bootstrap() {
    console.log('🚀 Starting WEXTS Unified Runtime...\n');

    // Create Express app
    const app = express();

    // 1. Bootstrap NestJS with Express adapter
    console.log('📦 Initializing NestJS backend...');
    const nestApp = await NestFactory.create(
        AppModule,
        new ExpressAdapter(app),
        {
            logger: dev ? ['log', 'error', 'warn'] : ['error', 'warn'],
            cors: {
                origin: true,
                credentials: true,
            }
        }
    );

    // Set API prefix - all NestJS routes start with /api
    nestApp.setGlobalPrefix('api');

    // Initialize NestJS
    await nestApp.init();
    console.log('✅ NestJS backend ready on /api/*\n');

    // 2. Setup Next.js
    console.log('📦 Initializing Next.js frontend...');
    const nextApp = next({
        dev,
        dir: path.join(__dirname),
    });
    const nextHandler = nextApp.getRequestHandler();
    await nextApp.prepare();
    console.log('✅ Next.js frontend ready\n');

    // 3. Route all non-API requests to Next.js
    // NestJS already handles /api/* through the Express adapter above
    app.all('*', (req, res) => {
        return nextHandler(req, res);
    });

    // 4. Start unified server
    app.listen(port, () => {
        console.log(`\n🎉 WEXTS Unified Runtime listening on http://localhost:${port}`);
        console.log(`   Frontend: http://localhost:${port}`);
        console.log(`   Backend:  http://localhost:${port}/api\n`);
    });
}

bootstrap().catch((err) => {
    console.error('❌ Failed to start WEXTS Unified Runtime:', err);
    process.exit(1);
});
