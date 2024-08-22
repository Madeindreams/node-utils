import express, { Application, Request, Response } from 'express';
import jsonErrorHandler from './middleware/jsonErrorHandler';
import requestTimeLogger from "./middleware/requestTimeLogger";
class Server {
    private readonly app: Application;
    private readonly port: number;

    constructor(
        port: number,
        configureMiddlewares?: (app: Application) => void,
        configureRoutes?: (app: Application) => void
    ) {
        this.app = express();
        this.port = port;

        this.initializeDefaultMiddlewares();

        // Allow the user to configure custom middlewares
        if (configureMiddlewares) {
            configureMiddlewares(this.app);
        }

        this.initializeDefaultRoutes();

        // Allow the user to configure custom routes
        if (configureRoutes) {
            configureRoutes(this.app);
        }
    }

    private initializeDefaultMiddlewares() {
        this.app.use(express.json());
        this.app.use(jsonErrorHandler);
        this.app.use(requestTimeLogger);
    }

    private initializeDefaultRoutes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Welcome to the Express Server!');
        });

        this.app.get('/ping', (req: Request, res: Response) => {
            res.send('pong');
        });

        // Add other default routes here if necessary
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

export default Server;
