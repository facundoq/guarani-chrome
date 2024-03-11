const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function dictFromLists(keys,vals){
    const dict = new Map()
    zip(keys,vals).forEach(kv=>{
      const [k,v]= kv;
      dict.set(k,v);
    })
    return dict
}

function listOfDictToDictOfDict(rows,key="dni"){   
  const keys = rows.map(row => {return row.get(key)})
  return dictFromLists(keys,rows)
}


const Optional = x => (x === undefined || x === null) ? None : Some(x);

const Some = x => ({
  get: () => x,
  map: f => Some(f(x)),
  flatMap: f => f(x),
  fold: (ifEmpty, f) => f(x),
  doSome: (f) => {f(x)},
  doNone: (f) => {},
  isNone: () => false,
  isSome: () => true,
});

const None = {
  map: f => None,
  flatMap: f => None,
  fold: (ifEmpty, f) => ifEmpty(),
  doSome: (f) => {},
  doNone: (f) => {f()},
  isNone: () => true,
  isSome: () => false,
};


class Either<a,b>  {
  

  static Left(v){ return new Left(v)}
  static Right(v){ return new Right(v)}
  static if(condition,valueLeft,valueRight){ return (condition)? Either.Right(valueRight) : Either.Left(valueLeft)}
}



/**
*Left represents the sad path.
*/
class Left<a> extends Either<a,_> {
  protected _val:object;
  constructor(val:object) {
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
class Right extends Either {
  protected _val:object;

  constructor(val) {
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
