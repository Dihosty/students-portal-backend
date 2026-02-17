export class Subject {
  constructor(
    public id: string,
    public name: string,
    public teacherId: string,
    public createdAt?: Date,
  ) {}
}
