import { CSV } from "./input/csv";

type AutofillDataMap = { [key: string]: string }
export class Settings{
  
  static Keys = {
    // MissingStudents:"missingStudents",
    Theme:"theme",
    OverwriteOnAutofill:"overwriteOnAutofill",
    AutofillDataCSV: "autofillDataCSV",
    // Unmatched:"unmatched"
  }

  static defaultSettings = { 
              [Settings.Keys.Theme]:"dark",
              [Settings.Keys.OverwriteOnAutofill]:false,
            [Settings.Keys.AutofillDataCSV]:{},
            // [Settings2.Keys.Unmatched]:[],
          }

  

  static RestoreFromStorage(callback:CallableFunction){
    console.log(`Initializing settings...`)
    
      // console.log(`Initialized with settings: ${Object.entries(v)}`)
      chrome.storage.local.get(Settings.defaultSettings,values =>{
        const s = new Settings(
          values[Settings.Keys.Theme],
          values[Settings.Keys.OverwriteOnAutofill],
          values[Settings.Keys.AutofillDataCSV])
          callback(s)
      
    })
  }
  
  constructor(
    public theme:string="dark",
    public overwriteOnAutofill:boolean=true,
    public autofillData:AutofillDataMap,
    // public  unmatched:Map<string,string>,
    ){

    }

    save(callback:CallableFunction= () => {}){
      const s = {
        [Settings.Keys.Theme]:this.theme,
        [Settings.Keys.OverwriteOnAutofill]:this.overwriteOnAutofill,
        [Settings.Keys.AutofillDataCSV]:this.autofillData
      }

      chrome.storage.local.set(s).then(() => callback())
      
    }
    getDataID(operation:string,subject:string){
      return `${operation}_${subject}`
    }
    getAutofillData(operation:string,subject=""){
      return this.autofillData[this.getDataID(operation,subject)]  ?? ""
    }
    setAutofillData(operation,subject,data:string){
      this.autofillData[this.getDataID(operation,subject)]= data
    }
}
