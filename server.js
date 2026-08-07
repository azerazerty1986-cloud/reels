class RegistrationServer {
    constructor() {
        this.users = [];
    }
    register(name, email) {
        this.users.push({ name, email, time: Date.now() });
        console.log(`📋 تسجيل: ${name}`);
    }
}
const server = new RegistrationServer();
server.register('أحمد', 'ahmed@example.com');
