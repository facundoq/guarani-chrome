
// function AutofillMissingUI() {
//     const root = document.createElement("div")
//     root.id = "autofillMissingUI"
//     const deleteButton = fromHTML(`<button  type="button" id="autofillDeleteMissingButton"> Borrar faltantes </button>`)

//     const textarea = fromHTML(`<textarea id="autofillMissingViewer" disabled="true">
    
//     </textarea>`)

//     root.update = () => {
//         const missingStudents = getSettings("missingStudents")
//         if (missingStudents) {
//             textarea.value = missingStudents;
//             deleteButton.disabled = false;
//         } else {
//             textarea.value = "No hay datos guardados."
//             deleteButton.disabled = true;
//         }
//     }
//     deleteButton.onclick = (e) => {
//         setSettings("missingStudents", [])
//         root.update()
//     }

//     root.appendChild(textarea)
//     root.appendChild(deleteButton)
//     return root
// }
