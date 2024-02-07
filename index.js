import weaviate from 'weaviate-ts-client';
import fs from 'fs';


const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const schemaRes = await client.schema.getter().do();

console.log(schemaRes)

const schemaConfig = {
    'class': 'Meme',
    'vectorizer': 'img2vec-neural',
    'vectorIndexType': 'hnsw',
    'moduleConfig': {
        'img2vec-neural': {
            'imageFields': [
                'image'
            ]
        }
    },
    'properties': [
        {
            'name': 'image',
            'dataType': ['blob']
        },
        {
            'name': 'text',
            'dataType': ['string']
        }
    ]
}

const className = 'Meme';
const existingClasses = await client.schema.getter().do();

if (!existingClasses.classes.some(c => c.class === className)){
    await client.schema
        .classCreator()
        .withClass(schemaConfig)
        .do();
}

const img = fs.readFileSync('./img/tanmaypic.png');
const b64 = Buffer.from(img).toString('base64');

const res = await client.data.creator().withClassName('Meme').withProperties(
    {
        image:b64,
        text:'This is a meme',
    }).do();