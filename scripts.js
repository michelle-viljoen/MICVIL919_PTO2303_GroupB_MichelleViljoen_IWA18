import { html, createOrderHtml, updateDraggingHtml, moveToColumn } from "./view.js";
import { TABLES, COLUMNS, state, createOrderData, updateDragging, createUniqueId} from './data.js'
/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */


 const handleDragStart = (event) => {
     event.preventDefault()
 }

const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}



const handleDragEnd = (event) => {
    event.preventDefault()
}

const handleHelpToggle = (event) => {
    if (html.other.help) {
        html.help.overlay.show()
    } 
    html.help.cancel.addEventListener('click', () => 
            html.help.overlay.close(),
             )       
    }

const handleAddToggle = (event) => {
     html.other.add.addEventListener('click', () =>
     html.add.overlay.show()
     )
     html.add.cancel.addEventListener('click', () => 
     html.add.overlay.close(),
     html.add.form.reset(),
     )  
 }
 
const handleAddSubmit = (event) => {
    event.preventDefault()
    html.add.form.addEventListener('click', () =>
    html.add.form.overlay === open
    )
    const currentOrder = {
        title: html.add.title.value,
        table : html.add.table.value,
        column: 'ordered', 
        id: createUniqueId(),
        created: new Date(), 
    }
    state.orders[currentOrder.id] = currentOrder
     const orderData = createOrderData(currentOrder)
     const orderHTML = createOrderHtml(currentOrder)
     const orderedArea = document.querySelector('[data-area="ordered"]')
     const orderedColumn = orderedArea.querySelector('[data-column="ordered"]')
     orderedColumn.appendChild(orderHTML)
     html.add.overlay.close()      
}

const handleEditToggle = (event) => {
 event.preventDefault()
  html.edit.overlay.addEventListener('click', () =>
  html.edit.overlay.open === true)
    const {id} = event.target.dataset
    const {title, table, column} = state.orders[id]
    html.edit.id.value =  id
    html.edit.title.value = title
    html.edit.table.value =  table
    html.edit.column.value = column
    html.edit.overlay.open = true  
} 
    html.edit.cancel.addEventListener('click', () =>
    html.edit.overlay.close(),
    html.edit.form.reset()
  )


 
const handleEditSubmit = (event) => {
    event.preventDefault();
const formData = new FormData(event.target)
const newOrder = Object.fromEntries(formData)

const htmlOrder = document.querySelector(`[data-id="${newOrder.id}"]`)
const titleHtml = htmlOrder.querySelector('[data-order-title]')
const tableHtml = htmlOrder.querySelector('[data-order-table]')
const columnHtml = htmlOrder.querySelector('[data-order-column]')
titleHtml.innerText = newOrder.title
tableHtml.innerText = newOrder.table
if (columnHtml !== newOrder.column) {
    moveToColumn(newOrder.id, newOrder.column)
} 
html.edit.overlay.close()
html.edit.form.reset()

}
 
const handleDelete = (event) => {
  event.preventDefault()
  const toRemove = document.querySelector(`[data-id="${html.edit.id.value}"]`)
  toRemove.remove()
  html.edit.overlay.close()
  html.edit.form.reset()
}    


html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}
