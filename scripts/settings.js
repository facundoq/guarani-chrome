
Settings = {MissingStudents:"missingStudents",
            Theme:"theme",
            Date:"date",
            OverwriteOnAutofill:"overwriteOnAutofill",
            AutofillData:"autofillData",
            AutofillDataCSV:"autofillDataCSV"
            
            }

_settings = { date: '01/01/2024',
              theme:"dark",
              overwriteOnAutofill:false,
            [Settings.AutofillDataCSV]:"",
            [Settings.AutofillData]:{},
            unmatched:[],
          }


function getSettings(key){
  return _settings[key]
}

function setSettings(key,value){
  _settings[key] = value
  chrome.storage.local.set({[key]: value}, () => {});
};

function initializeSettings(callback){
  console.log(`Initializing settings...`)
    chrome.storage.local.get(_settings, (v)=>{
      
      _settings=v;
      // console.log(`Initialized with settings: ${Object.entries(v)}`)
      callback()
    })
}

