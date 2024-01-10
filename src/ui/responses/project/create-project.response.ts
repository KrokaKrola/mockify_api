export class CreateProjectResponse {
    public name: string;

    public id: number;

    public publicId: string;

    constructor(id: number, name: string, publicId: string) {
        this.id = id;
        this.name = name;
        this.publicId = publicId;
    }
}
