import { Subject } from 'rxjs';

export class IdentifiedSubject<T> {
  private _key: string;
  private _source: string;
  private _subject: Subject<T>;

  constructor(key: string, source: string = "") {
    this._key = key;
    this._subject = new Subject<T>();
    this._source = source
  }

  public get key(): string {
    return this._key;
  }

  public get subject(): Subject<T> {
    return this._subject;
  }

  public get source(): string {
    return this._source;
  }
}

