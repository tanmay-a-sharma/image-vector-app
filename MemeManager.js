class MemeManager {

    // this is going to remove all objects from the meme class

    constructor(client) {
        this.client = client;
    }

    async removeAllMemes() {
        const memes = await this.client.graphql.get()
            .withClassName('Meme')
            .withFields(['uuid'])
            .do();

        for (const meme of memes.data.Get.Meme) {
            await this.client.data.deleter().withClassName('Meme').withID(meme.uuid).do();
        }
    }
}

export default MemeManager;