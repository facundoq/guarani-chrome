import { getSettings, setSettings, Settings } from "../settings";
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
export class AutofillStatsUI extends UI {
  root = document.createElement("span");
  protected countNonEmpty: ProgressUI;
  protected countComplete: ProgressUI;
  protected fieldCounters = new Map<string, CounterUI>();

  constructor(protected rows_element: HTMLElement[]) {
    super();
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

    // create CounterUI objects for each field/column
    const headerElements = Array.from(
      document
        .getElementById("renglones")
        .querySelector("thead")
        .querySelectorAll("th")
    );
    const fieldToIndex = { fecha: 3, nota: 4, resultado: 5, condicion: 6 };
    StudentCursada.fillableFields.forEach((f) => {
      const counterUI = new CounterUI();
      this.fieldCounters.set(f, counterUI);
      const header = headerElements[fieldToIndex[f]]
      const container = document.createElement("div")
      header.appendChild(container)
      container.appendChild(counterUI.root);
    });

    // update status whenever fields change
    rows_element.forEach((e) => {
      const inputs = e.querySelectorAll("input, select");
      inputs.forEach((i) => {
        i.addEventListener(
          "change",
          () => {
            this.update();
          },
          true
        );
        i.addEventListener(
          "keyup",
          () => {
            this.update();
          },
          true
        );
      });
    });

    // force update the first time
    this.update();
  }
  update() {
    const students = this.rows_element.map((s) => new StudentCursada(s));
    const total = students.length;
    const nonEmpty = students.filter((s) => !(s.isEmpty)).length;
    const complete = students.filter((s) => s.isFull).length;
    
    this.countNonEmpty.update(nonEmpty, total);
    this.countComplete.update(complete, total);

    StudentCursada.fillableFields.forEach((field) => {
      const count = students
        .map((s) => {
          return s.asDict()[field] !== "" ? 1 : 0;
        })
        .reduce((a, b) => a + b, 0);
      const counter = this.fieldCounters.get(field);
      counter.update(count, total);
    });
  }
}
