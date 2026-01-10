// JSON-file DAL has been deprecated in this repository. Use Mongo DAL instead.
export default class JsonBase<T extends { id: string }> {
  constructor(..._args: any[]) {
    throw new Error('JsonBase has been removed. Use Mongo DAL implementations instead.');
  }
}
