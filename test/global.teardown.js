export default async () => {
    console.log('stop container...');
    await global.testContext.container.stop({});
    console.log('container stopped successfully');
};
