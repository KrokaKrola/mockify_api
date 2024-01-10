export class UpdateProjectResponse {
    public name: string;

    public id: number;

    public publicId: string;

    constructor(id: number, name: string, publicId: string) {
        this.name = name;
        this.id = id;
        this.publicId = publicId;
    }
}
