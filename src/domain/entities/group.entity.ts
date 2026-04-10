export class Group {
  constructor(
    public id: string | undefined,
    public name: string,
    public courseYear: number,
    public facultyId?: string,
    public createdAt?: Date,
  ) {}
}

