import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Express error handler:', err);
    
    // Special handling for database connection errors
    if (err.code === '57P01' || err.message?.includes('terminating connection')) {
      console.log('Database connection terminated, attempting to continue...');
    }
    
    return res.status(status).json({ message });
  });

  // 환경 변수 디버깅
  console.log("Environment:", {
    NODE_ENV: process.env.NODE_ENV,
    appEnv: app.get("env")
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    console.log("🟢 Setting up Vite for development");
    await setupVite(app, server);
  } else {
    console.log("🟢 Setting up static serving for production");
    // 서버리스에서는 정적 파일 제공 건너뛰기 (파일 시스템 접근 문제)
    if (!process.env.VERCEL) {
      serveStatic(app);
    } else {
      console.log("⏭️ 서버리스 환경: 정적 파일 제공 건너뛰기");
      // 서버리스에서는 간단한 fallback 라우트만 제공
      app.use("*", (_req, res) => {
        res.status(200).send('<!DOCTYPE html><html><head><title>MaruComSys</title></head><body><h1>MaruComSys - 서버리스 모드</h1><p>API가 준비되었습니다.</p></body></html>');
      });
    }
  }

  // 서버리스 환경에서는 server.listen() 호출하지 않음
  if (!process.env.VERCEL) {
    // Replit 환경: 일반적인 서버 시작
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0", // 외부 접근 허용
      reusePort: true,
    }, () => {
      log(`serving on port ${port} (host: 0.0.0.0)`);
    });
  } else {
    // Vercel 서버리스: 앱만 준비, listen 안 함
    console.log('🚀 Vercel 서버리스 환경: 앱 준비 완료');
  }
  } catch (error) {
    console.error('🚨 서버 시작 중 오류:', error);
    // 서버리스에서는 오류가 발생해도 앱은 export되어야 함
    if (process.env.VERCEL) {
      console.log('⚠️ 서버리스 환경에서 오류 발생, 기본 앱으로 fallback');
    } else {
      throw error; // Replit에서는 오류를 그대로 throw
    }
  }
})();

// Vercel 서버리스를 위한 export
export default app;
