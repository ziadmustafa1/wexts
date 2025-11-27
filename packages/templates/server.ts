import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import next from 'next';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

async function bootstrap() {
    console.log('🚀 Starting WEXTS Unified Server...\n');

    // 1. Initialize Next.js
    console.log('📦 Loading Next.js...');
    const nextApp = next({
        dev,
        dir: path.join(__dirname, 'apps/web'),
    });
    await nextApp.prepare();
    const nextHandler = nextApp.getRequestHandler();
    console.log('✅ Next.js ready\n');

    // 2. Initialize NestJS with Express
    console.log('📦 Loading NestJS...');
    const server = express();

    // Import AppModule dynamically
    const { AppModule } = dev
        ? await import('./apps/api/src/app.module')
        : await import('./apps/api/dist/app.module');

    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
        { cors: true }
    );

    app.setGlobalPrefix('api');

    // Smart routing middleware - MUST be before NestJS init
    server.use((req, res, next) => {
        if (req.url.startsWith('/api')) {
            return next(); // Let NestJS handle API routes
        }
        return nextHandler(req, res); // Next.js handles everything else
    });

    await app.init();
    console.log('✅ NestJS ready\n');

    // 3. Start server
    server.listen(port, () => {
        console.log('\n🎉 WEXTS Unified Server Running!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   🌐 Server: http://localhost:${port}`);
        console.log(`   📱 Frontend: All routes except /api/*`);
        console.log(`   🔌 Backend: /api/*`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('✨ Routes are smartly separated!\n');
    });
}

bootstrap().catch((err) => {
    console.error('❌ Failed to start:', err);
    process.exit(1);
});
