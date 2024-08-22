import express, { Application } from 'express';

class Server {
    private app: Application;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        // Add any other middlewares you need here
    }

    private initializeRoutes() {
        this.app.get('/', (req, res) => {
            res.send('Hello, world!');
        });

        // Add other routes here
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

export default Server;
