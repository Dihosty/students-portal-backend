export class Group {
  constructor(
    public id: string | undefined,
    public name: string, //ІПЗ-4 і тд
    public courseYear: number,
    public createdAt?: Date,
  ) {}
}
