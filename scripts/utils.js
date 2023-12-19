const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function dictFromLists(keys,vals){
    const dict = new Map()
    zip(keys,vals).forEach(kv=>{
      [k,v]= kv;
      dict.set(k,v);
    })
    log(dict)
    return dict
}

function listOfDictToDictOfDict(rows,key="dni"){   
  const keys = rows.map(row => {return row.get(key)})
  return dictFromLists(keys,rows)
}

function log(message){
  console.log("Guarangada: ",message)
}