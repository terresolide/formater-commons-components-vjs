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
### Import in your component
```
npm install terresolide/formater-commons-components-vjs
```
And import component in your component
```
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
```
<formater-select name="test" options="['yes', 'no']"></formater-select>
<script src="https://rawgit.com/terresolide/formater-commons-components-vjs/master/dist0/formater-commons-components-vjs_0.0.1.js"></script> 
```

Or the last taged file:
```
<formater-select name="test" options="['yes', 'no']"></formater-select>
<script  src="https://cdn.rawgit.com/terresolide/formater-commons-component-vjs/[last-tag]/dist/formater-commons-components-vjs_[last-tag].js"/></script>
```


## Components

### [formater-select](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-select)

### [formater-search-box](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-search-box)

### [formater-temporal-search](https://github.com/terresolide/formater-commons-components-vjs/wiki/formater-temporal-search)
