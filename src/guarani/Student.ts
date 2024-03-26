import { fromHTML } from "../utils/dom_utils";



export class Student {
    static EmojiClass = "result-emoji"
    static EmojiSelector = `.${Student.EmojiClass}`

    static elementSelectors = {
        dni: ".identificacion",
        nombre: ".nombre",
        fecha: ".fecha",
        nota: ".nota_cursada",
        resultado: ".resultado",
        condicion: ".condicion",
        observacion: ".observacion",        
      };

    constructor(public row: HTMLElement) {
        this.addResultEmojiElement()
    }

    addResultEmojiElement() {
        if (this.emojiElement) {
            // don't create element if it already exists
            return
        }
        const  alumnoDiv = this.row.querySelector(".ficha-alumno").children[1];
        const emojiElement = fromHTML(`<span class="${Student.EmojiClass}"> <span>`);
        alumnoDiv.appendChild(emojiElement);
    }
    get emojiElement(): HTMLSpanElement {
        return this.row.querySelector(Student.EmojiSelector) as HTMLSpanElement
    }
    
    get dniElement():HTMLSpanElement{
        return this.row.querySelector(Student.elementSelectors.dni) as HTMLSpanElement
      }
    
      get dni():string {return this.dniElement.innerText.split(" ")[1]}
    
      get nombreElement():HTMLSpanElement{
        return this.row.querySelector(Student.elementSelectors.nombre) as HTMLSpanElement
      }
    
      get nombre(): string {
        return this.nombreElement.innerText;
      }

    addToStudentTitle(message: string) {
        function appendToTitle(element: HTMLElement, s: string) {
            element.title = `${element.title}${s}`
        }
        appendToTitle(this.nombreElement, `\n Autofill: ${message}`)
        appendToTitle(this.dniElement, `\n Autofill: ${message}`)
        appendToTitle(this.emojiElement, `\n Autofill: ${message}`)
    }

    setStudentClass(klass) {
        this.row.classList.remove(...this.row.classList);
        this.row.classList.add(klass);
    }
    markFilledStudent() {
        this.setStudentClass("autofilledStudent");
        this.addEmojiStudent("✅");
        this.addToStudentTitle("ha sido completado automaticamente");
    }

    markOverwrittenStudent() {
        this.setStudentClass("modifiedStudent");
        this.addEmojiStudent("✏️");
        this.addToStudentTitle("ha sido editado automáticamente");
    }
    markUnmatchedStudent(matches) {
        this.setStudentClass("unmatchedStudent");
        this.addEmojiStudent("❌");
        this.addToStudentTitle("no se pudo encontrar en el csv");
    }
    addEmojiStudent(emoji) {
        this.emojiElement.innerText = `${this.emojiElement.innerText}${emoji}`
    }
    markAlreadyFilledStudent() {
        this.setStudentClass("alreadyFilledStudent");
        this.addEmojiStudent("⚠️");
        this.addToStudentTitle("No se modificó porque ya tenía valores cargados");
    }
}