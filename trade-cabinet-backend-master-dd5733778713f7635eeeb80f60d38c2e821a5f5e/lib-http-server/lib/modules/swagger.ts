import { INestApplication } from '@nestjs/common/interfaces';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerDocs {
    TITLE: string;
    DESCRIPTION: string;
    VERSION: `${number}.${number}.${number}`;
}

const defaultDocs: SwaggerDocs = {
    TITLE: 'Project API',
    DESCRIPTION: 'Endpoints, interfaces, documentation',
    VERSION: '0.0.1',
};

export function attachSwagger(
    app: INestApplication,
    docs: SwaggerDocs = defaultDocs,
    path: string,
    isSecure = false
): void {
    // const schema = isSecure ? 'https' : 'http';
    const type = isSecure ? 'apiKey' : 'http';

    const options = new DocumentBuilder()
        .setTitle(docs.TITLE)
        .setDescription(docs.DESCRIPTION)
        .addBearerAuth({ type, in: 'header', name: 'Authorization' })
        .setVersion(docs.VERSION)
        // .addServer('/api-docs')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(path, app, document);
}
