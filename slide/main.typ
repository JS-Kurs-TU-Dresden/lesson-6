#import "./theme.typ": *

// --- Colors ---
#let jsYellow = rgb("f7df1e")
#let jsBlack = rgb("#222")
#let jsWhite = rgb("#ffffff")
#let subdued = jsWhite.darken(40%)


#set page(
    fill: jsBlack,
)

#set text(
    font: "Montserrat",
    fill: jsWhite,
)

#show: slides.with(
    author: "Nils Twelker",
    title: "Introcution to JavaScript",
    short-title: "JavaScript Lesson 6",
    date: "March 2023",
    color: jsYellow,
)

#show raw: it => [
    #box(it, fill: jsBlack.lighten(10%), outset: (x: 4pt, y:6pt), radius: 5pt)
]

#let colored = (it, color) => [
    #box(text(raw(it), fill: color), fill: jsBlack.lighten(10%), outset: (x: 4pt, y:6pt), radius: 5pt)
]

#let hint = (it, full: false) => [
    #if full [
        #block([#text("tipp", fill: jsBlack)], fill: jsYellow.lighten(10%), outset: (x: 8pt, y:8pt), radius: (top:5pt))
        #v(-14pt)
        #block(it, fill: jsBlack.lighten(10%), outset: (x: 8pt, y:8pt), radius: (bottom: 5pt, top-right: 5pt))
    ] else [
        #text([Tipp: ], fill: jsYellow.lighten(10%))
        #it
    ]
]

== What learned we last Week?

- HTML Basics #raw("<h1>My Title</h1>", lang: "html")
- CSS Basics #raw("h1 { color: red; }", lang: "css")
- Developer Tools (Pressing F12 in Browser)
- DOM (Document Object Model) #raw("document.body", lang: "js")
- Searching the DOM #raw("document.getElementById(\"title\")", lang: "js")
- Manipulating the DOM #raw("myElement.style.color = \"red\"", lang: "js")
- Adding / Removing Elements #raw("document.createElement(\"h1\")", lang: "js")+ 
- Events #raw("myElement.onclick = () => { ... }", lang: "js")

== Goals of this week

- More about Events
    - More Events
    - Bubbling
    - Dispatching Events
- Displaying and Interacting with Data
    - Lists
    - Tables
    - Forms

== More Events

- `click` (left mouse button)
- `contextmenu` (right mouse button)
- `dblclick` (double click)
- `mouseover` `mouseout` (hovering)
- `mousemove` (moving mouse)
- `keydown` `keyup` (keyboard)
- `focus` `blur` (focus)
- `submit` (submitting a form)

== `on<event>` Attribute

```html
<button onclick="console.log('clicked')">Click me</button>
<input type="text" onkeydown="console.log('key pressed')">

<script>
function enterDiv() {
    console.log("Mouse entered div")
}
</script>

<div onmouseover="enterDiv()"></div>
```

== Event Bubbling


#par([
    ```html
<div id="root" onclick="console.log('Root')">
    <div id="c1" onclick="console.log('Child 1')">
        <div id="c1-1" onclick="console.log('Child 1-1')"></div>
    </div>
    <div id="c2" onclick="console.log('Child 2')"></div>
</div>
```
], leading: 1.6em)

== Event Bubbling

#text(size: 18pt)[
    ```html
    <div id="root" onclick="console.log('Root')">
        <div id="c1" onclick="console.log('Child 1')">
            <div id="c1-1" onclick="console.log('Child 1-1')">
            </div>
        </div>
        <div id="c2" onclick="console.log('Child 2')">
        </div>
    </div>
    ```
]

#columns(3, [

Clicking `#c1-1`:
```
Child 1-1
Child 1
Root
```

Clicking `#c2`:
```
Child 2
Root
```

Clicking `#c1`:
```
Child 1
Root
```
])

== event.target

```html
<div id="root">
    <div id="child"></div>
</div>
```

```js
const root = document.getElementById("root")
// When clickin on #child
root.onclick = function(event) {
    console.log(this.id) // "root"
    console.log(event.target.id) // "child"
}
```

== Stopping bubbling

```html
<div id="root">
    <div id="child"></div>
</div>
```

```js
const root = document.getElementById("root")
const child = document.getElementById("child")

child.onclick = (event) => {
    event.stopPropagation()
} // #root will not recive event when clicking on #child
root.onclick = () => console.log("root") 
```

== Dispatching Events

```html
<div id="root">
    <div id="child"></div>
</div>
```

```js
const root = document.getElementById("root")
const child = document.getElementById("child")

root.onclick = () => console.log("root")

const event = new Event("click")
child.dispatchEvent(event)
```

== Dispatching Custom Events

```html
<div id="myElement"></div>
```

#text(size: 20pt)[
```js
const myElement = document.getElementById("myElement")

document.addEventListener("myEvent", (event) => {
    console.log("myEvent:" + event.detail.message)
}) // myEvent: Hello World

let event = new CustomEvent("myEvent", { detail: { message: "Hello World" } })
myElement.dispatchEvent(event)
```]

== Displaying Data (Lists)

#columns(2, [
    ```html
<ul>
    <li>Item A</li>
    <li>Item B</li>
    <li>Item C</li>
</ul>
```

- Item A
- Item B
- Item C

#colbreak()

```html
<ol>
    <li>Item A</li>
    <li>Item B</li>
    <li>Item C</li>
</ol>
```

1. Item A
2. Item B
3. Item C
])

== Displaying Data (Tables)

#columns(2, [
    ```html
 <table>
    <tr>
        <th>Name</th>
        <th>Age</th>
    </tr>
    <tr>
        <td>John Doe</td>
        <td>54</td>
    </tr>
</table> 
```

#colbreak()

#table(
    columns: 2,
    inset: 10pt,
    stroke: jsWhite,
    [*Name*], [*Age*],
    "John Doe", "54"
)
])

== Interacting with Data (Forms)

#grid(columns: (1fr, 36%), [
    ```html
<form id="myForm">
    <label for="name">Name</label>
    <input type="text" id="name">
    <br/><br/>
    <label for="age">Age</label>
    <input type="number" id="age">
    <br/><br/>
    <button type="submit">Submit</button>
</form>
```
],
image("./form.png")
)

== Interacting with Data (Forms)

```js
const form = document.getElementById("myForm")

form.onsubmit = (event) => {
    event.preventDefault()
    const name = document.getElementById("name").value
    const age = document.getElementById("age").value
    console.log(name, age)
}
```

== Tasks and Points
Goal is to get 100 Points.
#columns(2, [
- `custom-events` (20 Points)
- `lists` (30 Points)
- `form` (30 Points)
- `tables` (40 Points)
- `more-events` (40 Points)
- `event-bubbling` (40 Points)
- `friend-list` (80 Points)
])