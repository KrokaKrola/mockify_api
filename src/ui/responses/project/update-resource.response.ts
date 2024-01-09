export class UpdateResourceResponse {
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public id: string;

    public name: string;
}
