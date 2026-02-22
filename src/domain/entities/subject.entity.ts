export class Subject {
  constructor(
    public id: string | undefined,
    public name: string,
    public teacherId: string,
    public createdAt?: Date,
  ) {}
}
