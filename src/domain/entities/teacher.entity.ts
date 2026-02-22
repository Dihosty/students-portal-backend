export class Teacher {
  constructor(
    public id: string | undefined,
    public userId: string,
    public faculty: string,
    public createdAt?: Date,
  ) {}
}
