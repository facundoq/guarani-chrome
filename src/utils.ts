export const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export function intersection(a, b) { return a.filter(value => b.includes(value)); }

export function dictFromLists(keys,vals){
    const dict = new Map()
    zip(keys,vals).forEach(kv=>{
      const [k,v]= kv;
      dict.set(k,v);
    })
    return dict
}

export function listOfDictToDictOfDict(rows,key="dni"){   
  const keys = rows.map(row => {return row.get(key)})
  return dictFromLists(keys,rows)
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



export class Either<a=object,b=object>  {

  static Left(v){ return new Left(v)}
  static Right(v){ return new Right(v)}
  static if(condition,valueLeft,valueRight){ return (condition)? Either.Right(valueRight) : Either.Left(valueLeft)}
}



export class Left<a> extends Either<a,undefined> {
  protected _val:a;
  constructor(val:a) {
    super();
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
export class Right<b> extends Either<undefined,b> {
  protected _val:b;

  constructor(val:b) {
    super()
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
