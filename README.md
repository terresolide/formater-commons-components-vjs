# formater-commons-components-vjs


Usual components for poleterresolide


## Development Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for preproduction with minification
npm run pre

# build for production with minification
npm run build

```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Use
### Install in your component
```
npm install terresolide/formater-commons-components-vjs
```
And import one or more components in your own component
```html
  <template>
    ...
    <formater-select name="test" options="['yes', 'no']"></formater-select>
    ...
  </template>
  <script>
  import {FormaterSelect} from 'formater-commons-components-vjs'
  export default {
     components: {
         FormaterSelect
     },
     ...
  }
  </script>
  ```
### Directly
You can use directly in your html page with calling the "compiled" file
```html
<formater-select name="test" options="['yes', 'no']"></formater-select>
<script  src="url_to/dist/formater-commons-components-vjs.js"/></script>
```


## Components
### [dragdrop-file](https://github.com/terresolide/formater-commons-components-vjs/wiki/dragdrop-file) @inprogress

### [formater-alert-message](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-alert-message)

### [formater-attribution](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-attribution)

### [formater-draggable-block](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-draggable-block)

### [formater-layout](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-layout)

### [formater-search-box](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-search-box)

### [formater-select](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-select)

### [formater-temporal-search](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-temporal-search)

### [language-switcher](https://github.com/terresolide/formater-commons-components-vjs/wiki/language-switcher)


