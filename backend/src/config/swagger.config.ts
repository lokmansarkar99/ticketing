import path from "path";

import yamljs from "yamljs";

const swaggerPath = path.join(process.cwd(), "swagger.yaml");

const swaggerConfig = yamljs.load(swaggerPath);

export default swaggerConfig;
