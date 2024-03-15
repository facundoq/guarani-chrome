export const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export function intersection(a, b) { return a.filter(value => b.includes(value)); }

export function dictFromLists(keys:Array<string>,vals:Array<Map<string,string>>){
    const dict = new Map<string,string>()
    zip(keys,vals).forEach(kv=>{
      const [k,v]= kv;
      dict.set(k,v);
    })
    return dict
}

export abstract class Optional{
  abstract map(f:CallableFunction):Optional
  abstract isSome():boolean
  abstract isNone():boolean
  abstract doSome(f:CallableFunction)
  abstract doNone(f:CallableFunction)
}

export class Some<a> extends Optional{
  private x:a
  constructor(x:a){
    super();
    this.x = x;
  }

  get(){ return this.x}
  map(f:CallableFunction){return new Some(f(this.x))}
  flatMap(f:CallableFunction){return f(this.x)}
  doSome(f:CallableFunction){f(this.x)}
  doNone(f:CallableFunction){}
  isNone(){return false}
  isSome(){return true}
}

export class None extends Optional{
  map(f:CallableFunction){return f(this)}
  flatMap(f:CallableFunction){this}
  doSome(f:CallableFunction){}
  doNone(f:CallableFunction){f()}
  isNone(){return true}
  isSome(){return false}
}


export type Either<a,b> = Left<a> | Right<b>


export class Left<a>{
  protected _val:a;
  constructor(val:a) {
    this._val = val;
  }
  isLeft(){
    return true
  }
  isRight(){
    return false
  }
  doLeft(f){
    f(this._val)
  }
  doRight(f){
  }
  map() {
      // Left is the sad path
      // so we do nothing
      return this;
  }
  join() {
      // On the sad path, we don't
      // do anything with join
      return this;
  }
  chain() {
      // Boring sad path,
      // do nothing.
      return this;
  }
  get() {
      return this._val;
  }
  toString() {
      const str = this._val.toString();
      return `Left(${str})`;
  }
}


/**
*Right represents the happy path
*/
export class Right<b>{
  protected _val:b;

  constructor(val:b) {
    this._val = val
  }
  isLeft(){
    return false
  }
  isRight(){
    return true
  }
  doLeft(f){
  }
  doRight(f){
    f(this._val)
  }
  map(fn) {
      return new Right(
          fn(this._val)
      );
  }
  join() {
      if ((this._val instanceof Left)
          || (this._val instanceof Right)) {
          return this._val;
      }
      return this;
  }
  chain(fn) {
      return fn(this._val);
  }
  get() {
      return this._val;
  }
  toString() {
      const str = this._val.toString();
      return `Right(${str})`;
  }
}

export function mapValues<a,b,c>(map:Map<a,b>, fn:(t: b) => c) {
  return new Map<a,c>(Array.from(map, ([key, value]) => [key, fn(value)]))
}

export function mapKeys<a,b,c>(map:Map<a,b>, fn:(t: a) => c) {
  return new Map<c,b>(Array.from(map, ([key, value]) => [fn(key), value]))
}

export function mapMap<a,b,c,d>(map:Map<a,b>, fn:(t:a,x:b) => [c,d]) {
  return new Map<c,d>(Array.from(map, ([key, value]) => fn(key,value)))
}