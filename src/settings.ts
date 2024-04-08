import { CSV } from "./input/csv";

type AutofillDataMap = { [key: string]: string }
export class Settings {

  static Keys = {
    // MissingStudents:"missingStudents",
    Theme: "theme",
    OverwriteOnAutofill: "overwriteOnAutofill",
    AutofillDataCSV: "autofillDataCSV",
    Version: "version"
    // Unmatched:"unmatched"
  }

  static defaultSettings = {
    [Settings.Keys.Theme]: "dark",
    [Settings.Keys.OverwriteOnAutofill]: false,
    [Settings.Keys.AutofillDataCSV]: {},
    [Settings.Keys.Version]: "2"
    // [Settings2.Keys.Unmatched]:[],
  }


  static CheckVersion(callback: CallableFunction) {
    chrome.storage.local.get(Settings.Keys.Version, settings => {
      const currentVersion = this.defaultSettings[Settings.Keys.Version] 
      const settingsVersion = settings[Settings.Keys.Version] 
      if (settingsVersion != currentVersion) {
        // if versions don`t match, clear local storage and restart settings to prevent errors
        console.log(`New version ${currentVersion} found, deleting settings from ${settingsVersion} `)
        chrome.storage.local.clear()
        chrome.storage.sync.clear()
        chrome.storage.local.set({[Settings.Keys.Version]:currentVersion})
      }
      callback()
    })
  }
  static RestoreFromStorage(callback: CallableFunction) {
    console.log(`Initializing settings...`)
    this.CheckVersion(() => {
      // console.log(`Initialized with settings: ${Object.entries(v)}`)
      chrome.storage.local.get(Settings.defaultSettings, values => {
        const s = new Settings(
          values[Settings.Keys.Theme],
          values[Settings.Keys.OverwriteOnAutofill],
          values[Settings.Keys.AutofillDataCSV],
          values[Settings.Keys.Version])
        callback(s)
      })
    })
  }

  constructor(
    public theme: string = "dark",
    public overwriteOnAutofill: boolean = true,
    public autofillData: AutofillDataMap,
    public version: string,
    // public  unmatched:Map<string,string>,
  ) {

  }

  save(callback: CallableFunction = () => { }) {
    const s = {
      [Settings.Keys.Theme]: this.theme,
      [Settings.Keys.OverwriteOnAutofill]: this.overwriteOnAutofill,
      [Settings.Keys.AutofillDataCSV]: this.autofillData,
      [Settings.Keys.Version]: this.version
    }

    chrome.storage.local.set(s).then(() => callback())

  }
  getDataID(operation: string, subject: string) {
    return `${operation}_${subject}`
  }
  getAutofillData(operation: string, subject = "") {
    return this.autofillData[this.getDataID(operation, subject)] ?? ""
  }
  setAutofillData(operation, subject, data: string) {
    this.autofillData[this.getDataID(operation, subject)] = data
  }
}
