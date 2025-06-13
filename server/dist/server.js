import app from './app.js';
import appConfig from './app/config/app.config.js';
async function main() {
    const PORT = appConfig.port;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
;
main();
// will impelement some global error handling and logging
//# sourceMappingURL=server.js.map