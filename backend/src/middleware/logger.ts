import winston from 'winston';

<<<<<<< HEAD
// Create optimized logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

export default logger;
=======
/**
 * บันทึกรายละเอียดของ request ที่เข้ามา
 */
export const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // บันทึกข้อมูลเมื่อส่ง response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`
    );
  });
  
  next();
};
>>>>>>> demo
