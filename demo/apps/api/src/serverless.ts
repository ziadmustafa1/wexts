import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

// Create Express app for Vercel serverless
const expressApp = express();

// Create NestJS app
async function createNestApp() {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        { cors: true }
    );

    app.setGlobalPrefix('api');
    await app.init();

    return expressApp;
}

// Export for Vercel
let app: any;
export default async (req: any, res: any) => {
    if (!app) {
        app = await createNestApp();
    }
    return app(req, res);
};
