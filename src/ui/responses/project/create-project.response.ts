export class CreateProjectResponse {
    public name: string;

    public id: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
