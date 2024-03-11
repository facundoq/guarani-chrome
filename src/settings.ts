

export const Settings = {MissingStudents:"missingStudents",
            Theme:"theme",
            Date:"date",
            OverwriteOnAutofill:"overwriteOnAutofill",
            AutofillData:"autofillData",
            AutofillDataCSV:"autofillDataCSV"
            
            }

var _settings = { date: '01/01/2024',
              theme:"dark",
              overwriteOnAutofill:false,
            [Settings.AutofillDataCSV]:"",
            [Settings.AutofillData]:{},
            unmatched:[],
          }


export function getSettings(key:string){
  return _settings[key]
}

export function setSettings(key:string,value:any){
  _settings[key] = value
  chrome.storage.local.set({[key]: value}, () => {});
};

export function initializeSettings(callback:CallableFunction){
  console.log(`Initializing settings...`)
    chrome.storage.local.get(_settings, (v)=>{
      // copy existing values from local storage
      for (const k in v){
        _settings[k] = v[k];
      }
      // console.log(`Initialized with settings: ${Object.entries(v)}`)
      callback()
    })
}

