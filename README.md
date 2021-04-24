# CLICKBAIT-FILTER-EXTENSION

[![ClickBaitSite](https://click-bait-filtering-plugin.com/assets/images/icon-128-122x122.png)](https://click-bait-filtering-plugin.com/index.html)

## Description

This application is a part of a group of services who plot to rid the web of clickbait by relying on user input and machine learnig. The completed application functions by storing it’s user clicked items and using them to disseminate what is clickbait and what is legitimate news, stories, etc. This is done in conjunction with a machine learning classificator. The full application functions on all sites and thus can allow you to be more productive while browsing the web. It functions by providing the user with a slider giving him possibility to filter content, deemed clickbait and at the same time highlight content that is deemed not. In addition it can show it’s user a topology of the most clickbaity content of each domain.
</br>
</br>
This service application is a chrome plugin using the chrome plugin api. For more info visit the application [CLICKBAIT-PORTAL] and download the build of this plugin from the [CHROME-STORE].

## Technologies

CLICKBAIT-FILTER-EXTENSION uses a number of open source projects:

  * [NO-UI-SLIDER] - OPTOMIZED JAVASCRIPT RANGE SLIDER
  * [CHROME-EXTENSION-RELOADER] - CHROME EXTENSION HMR
  * [WEBPACK] - WEB ASSETS MODULE BUNDLER
  * [WEBPACK-CLI] - WEBPACK COMMAND LINE INTERFACE
  * [ZIP-WEBPACK-PLUGIN] - ZIP MAKER FOR WEBPACK
  * [COPY-WEBPACK-PLUGIN] - FILE COPIER FOR WEBPACK
  * [TERSER-WEBPACK-PLUGIN] - JS MINIFIER FOR WEBPACK
  * [OPIMIZE-WEBPACK-PLUGIN] - CSS OPTIMIZER FOR WEBPACK
  * [MINI-CSS-WEBPACK-PLUGIN] - CSS MINIFIER FOR WEBPACK

## Installation

Install node dependancies for the project:
```sh
$ cd click_bait_filter_extension
$ npm install
```

## Applications Scopes

This service is a part of a multi application project that features the following git repositories:

| Service Name                                  | Description                         | Maintainer              |
| ----------------------------------------      |:------------------------------------|:------------------------|
| [click_bait_filter_extension]                 | Chrome Extensions Plugin            | [LeadShuriken]          |
| [click_bait_filter_be]                        | Node Application Test Server        | [LeadShuriken]          |
| [click_bait_filter_j]                         | Spring Production Server            | [LeadShuriken]          |
| [click_bait_filter_tflow]                     | Java Tensor Flow Server             | [LeadShuriken]          |
| [click_bait_filter_ml]                        | TensorFlow Model Generator/Updater  | [LeadShuriken]          |
| [click_bait_filter_portal]                    | Service and Information Portal      | [LeadShuriken]          |


For development the application should have the following structure:
```sh
 | .
 | +-- click_bait_filter_extension
 | +-- click_bait_filter_be
 | +-- click_bait_filter_j
 | +-- click_bait_filter_tflow
 | +-- click_bait_filter_ml
 | +-- click_bait_filter_portal
```
This is as the 'click_bait_filter_ml' currently uses the 'click_bait_filter_be'(TEST SERVE) api's for filtering links. 'click_bait_filter_portal' is just static html which can preside anywhere.

## Running and Building

### 1. Building the service for production
---
This application can be build for production by changing the <ADDRESS> in the package.json script and running:
```sh
$ npm run build
```
The result of the unpacked plugin as well as the zipped chrome store asset are deployed in ./dist. Alternatively you can run the raw command in CLI.


### 2. Runing the service for development
---

* **WITH MICROSOFT VISUAL STUDIO CODE**

  To run the application, open the project in Microsoft VS Code and navigate to the .vscode folder.
  
  There you will see the **launch.json** file. And create this run configuration:
  
  ```sh
  {
      "type": "node",
      "request": "launch",
      "name": "PLUGIN:DEV",
      "args": [
          "--config",
          "./webpack.plugin.js",
          "--mode=development",
          "--watch"
      ],
      "env": {
          "NODE_ENV": <development or production>,
          "ADDRESS": <IP:PORT or URL OF THE BACKEND>,
          "API": <backend api>
      },
      "program": '${workspaceFolder}/node_modules/webpack/bin/webpack.js",
      "console": "integratedTerminal"
  }
  ```

* **WITH CLI COMMANDS**

  Open the terminal and navigate to the root project folder.

  ```sh
  $ export NODE_ENV=development && export BE_ADDRESS=http://localhost:4000 && export API=api && node_modules/.bin/webpack --config webpack.plugin.js
  ```

  This builds the plugin minfied and expecting the [click_bait_filter_be] at: **http://localhost:4000/api** 

### Todos

 - Tests and Docs

  [NO-UI-SLIDER]: <https://github.com/leongersen/noUiSlider>
  [CHROME-EXTENSION-RELOADER]: <https://github.com/LeadShuriken/webpack-chrome-extension-reloader>
  [WEBPACK]:<https://github.com/webpack/webpack>
  [WEBPACK-CLI]:<https://github.com/webpack/webpack-cli>
  [ZIP-WEBPACK-PLUGIN]:<https://github.com/erikdesjardins/zip-webpack-plugin>
  [COPY-WEBPACK-PLUGIN]:<https://github.com/webpack-contrib/copy-webpack-plugin>
  [TERSER-WEBPACK-PLUGIN]:<https://github.com/webpack-contrib/terser-webpack-plugin>
  [OPIMIZE-WEBPACK-PLUGIN]:<https://github.com/NMFR/optimize-css-assets-webpack-plugin>
  [MINI-CSS-WEBPACK-PLUGIN]:<https://github.com/webpack-contrib/mini-css-extract-plugin>

  [click_bait_filter_extension]: <https://github.com/LeadShuriken/click_bait_filter_extension>
  [click_bait_filter_be]: <https://github.com/LeadShuriken/click_bait_filter_be>
  [click_bait_filter_ml]: <https://github.com/LeadShuriken/click_bait_filter_ml>
  [click_bait_filter_portal]: <https://github.com/LeadShuriken/click_bait_filter_portal>
  [click_bait_filter_j]: <https://github.com/LeadShuriken/click_bait_filter_j>
  [click_bait_filter_tflow]: <https://github.com/LeadShuriken/click_bait_filter_tflow>

  [LeadShuriken]: <https://github.com/LeadShuriken>

  [CHROME-STORE]: <https://chrome.google.com/webstore/detail/clickbait-filtering-plugi/mgebfihfmenffogbbjlcljgaedfciogm>
  [CLICKBAIT-PORTAL]: <https://click-bait-filtering-plugin.com>
