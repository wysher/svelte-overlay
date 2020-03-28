# Svelte overlay

> Fully customizable Svelte overlay which fits to available space

> Great for creating dropdowns, tooltips and popovers

Svelte overlay is wrapper copmponent which makes all difficult stuff for you, but you decide when to open/close 
it and how it looks.

## Features
- it's portaled (always visible, even if inside e.g modal with overflow: hidden)
- if content has not enough space on one side it will try to render on other side. For instance if position is set to `top-left` and there's no room on top position will be set to `bottom-left`. This feature listens to window resize event
- may be open/closed on every trigger and content event or from outside
- you decide how trigger and content looks
- may be closed on click outside
- may be closed on keydown
- dispatches toggle event when open state changed

[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)

## Example

```javascript
<script>
  import Overlay from 'svelte-overlay';
</script>

<Overlay>

  <!-- TRIGGER -->
  <button slot="parent" let:toggle on:click={toggle}>
    Click Me!
  </button>

  <!-- CONTENT -->
  <div slot="content">
    Lorem ipsum dolor sit.
  </div>

</Overlay>
```
---

![Positions](https://j.gifs.com/p8P3v6.gif)

---

![It fits](https://j.gifs.com/JyRogo.gif)

## Installation

```npm install --save svelte-overlay```

or

```yarn add svelte-overlay```

---
## Props

**Important**
To get it work component requires two slots:
- `parent`
- `content`

**Overlay props**

| Prop name | Type | Description | Default |
| --- |  --- | --- | --- |
| isOpen | Boolean | isOpen state | false |
| position | String | `top-left`<br />`top-center`<br />`top-right`<br />`bottom-left`<br />`bottom-center`<br />`bottom-right`<br />`left-top`<br />`left-center`<br />`left-bottom`<br />`right-top`<br />`right-center`<br />`right-bottom`<br /><br />Uses default position when wrong position was passed | `bottom-right` |
| closeOnClickOutside | Boolean | if true click outside will close overlay | false |
| onWindowKeyDown | Function | triggers when overlay is opened and user hit any button.<br/>Gets Event as first argument and object of { open, close, toggle, isOpen } | false |
| on:toggle | Event | Event dispatched on overlay toggle.<br/>Gets Event as first argument and object of { open, close, toggle, isOpen } | false |

**slot props**

Each slot gets theese props, available through let:propName

| Prop name | Type | Description |
| --- |  --- | --- |
| isOpen | Boolean | isOpen state |
| toggle | Function | allows to toggle open state. Gets current isOpen value as argument |
| open | Function | allows to open overlay |
| close | Function | allows to close overlay |

---

## Usage

### Close on escape keydown and click outside

```javascript
<script>
  import Overlay from 'svelte-overlay';

  function handleKeyDown(event, { close }) {
    if (event.key === 'Escape') {
      close();
    }
  }
</script>

<Overlay closeOnClickOutside onWindowKeyDown={handleKeyDown}>
  <button slot="parent" let:toggle on:click={toggle}>
    Click Me!
  </button>

  <div slot="content">
    Lorem ipsum dolor sit.
  </div>

</Overlay>
```

### Close from content

```javascript
<script>
  import Overlay from 'svelte-overlay';
</script>

<Overlay>
  <button slot="parent" let:toggle on:click={toggle}>
    Click Me!
  </button>

  <div slot="content" let:close>
    <p>Lorem ipsum dolor sit.</p>
    <button on:click={close}>Close</button>
  </div>

</Overlay>
```

### Open/close on mouseenter/mouseleave

```javascript
<script>
  import Overlay from 'svelte-overlay';
</script>

<Overlay>
  <button slot="parent" let:open let:close on:mouseenter={open} on:mouseleave={close}>
    Click Me!
  </button>

  <div slot="content">
    Lorem ipsum dolor sit.
  </div>

</Overlay>
```

### Open from outside

```javascript
<script>
  import Overlay from 'svelte-overlay';
  let isOpen = false;

  function handleToggle(event) {
    if (event.detail !== isOpen) {
      isOpen = event.detail;
    }
  }

  function toggleFromOutside() {
    isOpen = !isOpen;
  }
</script>

<button on:click={toggleFromOutside}>Toggle from outside</button>

<Overlay {isOpen} >
  <div slot="parent" on:toggle={handleToggle}>
    I'm a parent
  </div>

  <div slot="content">
    Lorem ipsum dolor sit.
  </div>

</Overlay>
```

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
