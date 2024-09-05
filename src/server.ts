import app from "./app";
import { Config } from "./config";

const startServer = () => {
    const PORT = Config.PORT;
    try {
        // eslint-disable-next-line no-console
        app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        process.exit(1);
    }
};

startServer();
