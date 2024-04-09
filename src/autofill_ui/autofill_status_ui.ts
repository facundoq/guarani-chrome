
import { BaseAutofill } from "../autofill/autofill";
import { Student } from "../guarani/Student";
import { StudentCursada } from "../guarani/StudentCursada";
import { fromHTML, appendChildren, UI, observe } from "../utils/dom_utils";

export class CounterUI extends UI {
  root = fromHTML(`<span class="counterUI">  </span>`);
  protected count: HTMLSpanElement;
  protected icon: HTMLSpanElement;
  constructor() {
    super();
    this.count = document.createElement("span");
    this.icon = document.createElement("span");
    this.icon.innerHTML = " ●";
    this.root.appendChild(this.count);
    this.root.appendChild(this.icon);
  }
  update(count: number, total: number) {
    this.count.innerHTML = `${count}/${total}`;
    const rate = count / total;
    const hue = (rate * 120).toString(10);
    this.icon.style.color = `hsl(${hue},70%,35%)`;
  }
}

export class ProgressUI extends UI {
  root = fromHTML(
    `<span id="statsUIComplete" class="progressUI" >  </span>`
  ) as HTMLSpanElement;
  protected count: CounterUI;
  constructor(id: string, label: string, title: string) {
    super();
    this.root.title = title;
    this.root.id = id;
    const labelElement = fromHTML(`<span> ${label} </span>`);
    this.count = new CounterUI();
    this.root.appendChild(labelElement);
    this.root.appendChild(this.count.root);
  }
  update(count: number, total: number) {
    this.count.update(count, total);
  }
}

export abstract class StudentChangeUI extends UI {
  constructor(protected rows_element: HTMLElement[], protected autofill: BaseAutofill) {
    super()
    rows_element.forEach((e) => {
      const inputs = e.querySelectorAll("input, select");
      inputs.forEach((i) => {
        i.addEventListener(
          "change",
          () => {
            this.onStudentChange();
          },
          true
        );
        i.addEventListener(
          "keyup",
          () => {
            this.onStudentChange();
          },
          true
        );
      });
    });
  }

  getStudents() {
    return this.autofill.getStudents(this.rows_element)
  }

  abstract onStudentChange()

}

export class AutofillStatsUI extends StudentChangeUI {
  root = document.createElement("span");
  protected countNonEmpty: ProgressUI;
  protected countComplete: ProgressUI;
  protected fieldCounters = new Map<string, CounterUI>();

  constructor(rows_element: HTMLElement[], autofill: BaseAutofill) {
    super(rows_element, autofill);
    this.root.id = "statsUI";
    this.countComplete = new ProgressUI(
      "statsUIComplete",
      "Completo",
      "Estudiantes con información completa (no considera el campo observaciones)"
    );
    this.countNonEmpty = new ProgressUI(
      "statsUINonEmpty",
      "Con datos",
      "Estudiantes con información algún dato completado, pero no todos (no considera el campo observaciones)"
    );
    this.root.appendChild(this.countNonEmpty.root);
    this.root.appendChild(this.countComplete.root);
    // force update the first time
    this.onStudentChange();
  }
  onStudentChange() {
    const students = this.autofill.getStudents(this.rows_element)
    const total = students.length;
    const nonEmpty = students.filter((s) => !(s.isEmpty)).length;
    const complete = students.filter((s) => s.isFull).length;

    this.countNonEmpty.update(nonEmpty, total);
    this.countComplete.update(complete, total);
  }
}

export class ColumnStatusUI extends StudentChangeUI {
  public root: HTMLElement;
  public counterUI: CounterUI
  constructor(rows_element: HTMLElement[], autofill: BaseAutofill, protected field: string, protected header: HTMLTableCellElement) {
    super(rows_element, autofill);
    // create CounterUI objects for each field/column
    // const headerElements = Array.from(
    //   document
    //     .getElementById("renglones")
    //     .querySelector("thead")
    //     .querySelectorAll("th")
    // );
    // const fieldToIndex = { fecha: 3, nota: 4, resultado: 5, condicion: 6 };
    // const header = headerElements[fieldToIndex[f]]
    // this.fieldCounters.set(f, counterUI);
    this.counterUI = new CounterUI();
    const container = document.createElement("div")
    header.appendChild(container)
    container.appendChild(this.counterUI.root);
    this.onStudentChange()
  }
  onStudentChange() {
    const students = this.getStudents()
    const count = students.map((s: Student) => {
      return s.getFillableField(this.field) !== "" ? 1 : 0
    }).reduce((a, b) => a + b, 0);
    console.log(students)
    this.counterUI.update(count, students.length);
  }
}