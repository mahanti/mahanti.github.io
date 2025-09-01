/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _assets_css_styles_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/css/styles.css */ \"./assets/css/styles.css\");\n/* harmony import */ var _assets_css_styles_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_css_styles_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nfunction App({ Component, pageProps }) {\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        // Theme switching logic\n        function applyThemeForNow(now) {\n            const hours = now.getHours();\n            const isNight = hours >= 19 || hours < 7;\n            document.body.classList.remove(\"day\", \"night\");\n            document.body.classList.add(isNight ? \"night\" : \"day\");\n        }\n        function msUntilNextSwitch(now) {\n            const next = new Date(now);\n            const hours = now.getHours();\n            if (hours < 7) {\n                next.setHours(7, 0, 0, 0);\n            } else if (hours < 19) {\n                next.setHours(19, 0, 0, 0);\n            } else {\n                next.setDate(next.getDate() + 1);\n                next.setHours(7, 0, 0, 0);\n            }\n            return Math.max(0, next.getTime() - now.getTime());\n        }\n        function schedule() {\n            const now = new Date();\n            applyThemeForNow(now);\n            const delay = msUntilNextSwitch(now);\n            setTimeout(schedule, delay === 0 ? 1000 : delay);\n        }\n        // Apply initial theme and start scheduling\n        applyThemeForNow(new Date());\n        schedule();\n        // Setup medium-zoom for images\n        if (false) {}\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"/Users/arjun/Desktop/arjun/Code/mahanti.github.io/pages/_app.js\",\n        lineNumber: 51,\n        columnNumber: 10\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQWlDO0FBQ0E7QUFFbEIsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNsREgsZ0RBQVNBLENBQUM7UUFDUix3QkFBd0I7UUFDeEIsU0FBU0ksaUJBQWlCQyxHQUFHO1lBQzNCLE1BQU1DLFFBQVFELElBQUlFLFFBQVE7WUFDMUIsTUFBTUMsVUFBV0YsU0FBUyxNQUFNQSxRQUFRO1lBQ3hDRyxTQUFTQyxJQUFJLENBQUNDLFNBQVMsQ0FBQ0MsTUFBTSxDQUFDLE9BQU87WUFDdENILFNBQVNDLElBQUksQ0FBQ0MsU0FBUyxDQUFDRSxHQUFHLENBQUNMLFVBQVUsVUFBVTtRQUNsRDtRQUVBLFNBQVNNLGtCQUFrQlQsR0FBRztZQUM1QixNQUFNVSxPQUFPLElBQUlDLEtBQUtYO1lBQ3RCLE1BQU1DLFFBQVFELElBQUlFLFFBQVE7WUFDMUIsSUFBSUQsUUFBUSxHQUFHO2dCQUNiUyxLQUFLRSxRQUFRLENBQUMsR0FBRSxHQUFFLEdBQUU7WUFDdEIsT0FBTyxJQUFJWCxRQUFRLElBQUk7Z0JBQ3JCUyxLQUFLRSxRQUFRLENBQUMsSUFBRyxHQUFFLEdBQUU7WUFDdkIsT0FBTztnQkFDTEYsS0FBS0csT0FBTyxDQUFDSCxLQUFLSSxPQUFPLEtBQUs7Z0JBQzlCSixLQUFLRSxRQUFRLENBQUMsR0FBRSxHQUFFLEdBQUU7WUFDdEI7WUFDQSxPQUFPRyxLQUFLQyxHQUFHLENBQUMsR0FBR04sS0FBS08sT0FBTyxLQUFLakIsSUFBSWlCLE9BQU87UUFDakQ7UUFFQSxTQUFTQztZQUNQLE1BQU1sQixNQUFNLElBQUlXO1lBQ2hCWixpQkFBaUJDO1lBQ2pCLE1BQU1tQixRQUFRVixrQkFBa0JUO1lBQ2hDb0IsV0FBV0YsVUFBVUMsVUFBVSxJQUFJLE9BQU9BO1FBQzVDO1FBRUEsMkNBQTJDO1FBQzNDcEIsaUJBQWlCLElBQUlZO1FBQ3JCTztRQUVBLCtCQUErQjtRQUMvQixJQUFJLEtBQWtCLEVBQWEsRUFRbEM7SUFDSCxHQUFHLEVBQUU7SUFFTCxxQkFBTyw4REFBQ3JCO1FBQVcsR0FBR0MsU0FBUzs7Ozs7O0FBQ2pDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vYXNzZXRzL2Nzcy9zdHlsZXMuY3NzJ1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBUaGVtZSBzd2l0Y2hpbmcgbG9naWNcbiAgICBmdW5jdGlvbiBhcHBseVRoZW1lRm9yTm93KG5vdykge1xuICAgICAgY29uc3QgaG91cnMgPSBub3cuZ2V0SG91cnMoKVxuICAgICAgY29uc3QgaXNOaWdodCA9IChob3VycyA+PSAxOSB8fCBob3VycyA8IDcpXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2RheScsICduaWdodCcpXG4gICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoaXNOaWdodCA/ICduaWdodCcgOiAnZGF5JylcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtc1VudGlsTmV4dFN3aXRjaChub3cpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBuZXcgRGF0ZShub3cpXG4gICAgICBjb25zdCBob3VycyA9IG5vdy5nZXRIb3VycygpXG4gICAgICBpZiAoaG91cnMgPCA3KSB7XG4gICAgICAgIG5leHQuc2V0SG91cnMoNywwLDAsMClcbiAgICAgIH0gZWxzZSBpZiAoaG91cnMgPCAxOSkge1xuICAgICAgICBuZXh0LnNldEhvdXJzKDE5LDAsMCwwKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dC5zZXREYXRlKG5leHQuZ2V0RGF0ZSgpICsgMSlcbiAgICAgICAgbmV4dC5zZXRIb3Vycyg3LDAsMCwwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIE1hdGgubWF4KDAsIG5leHQuZ2V0VGltZSgpIC0gbm93LmdldFRpbWUoKSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2hlZHVsZSgpIHtcbiAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKClcbiAgICAgIGFwcGx5VGhlbWVGb3JOb3cobm93KVxuICAgICAgY29uc3QgZGVsYXkgPSBtc1VudGlsTmV4dFN3aXRjaChub3cpXG4gICAgICBzZXRUaW1lb3V0KHNjaGVkdWxlLCBkZWxheSA9PT0gMCA/IDEwMDAgOiBkZWxheSlcbiAgICB9XG5cbiAgICAvLyBBcHBseSBpbml0aWFsIHRoZW1lIGFuZCBzdGFydCBzY2hlZHVsaW5nXG4gICAgYXBwbHlUaGVtZUZvck5vdyhuZXcgRGF0ZSgpKVxuICAgIHNjaGVkdWxlKClcblxuICAgIC8vIFNldHVwIG1lZGl1bS16b29tIGZvciBpbWFnZXNcbiAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGltcG9ydCgnbWVkaXVtLXpvb20nKS50aGVuKG1lZGl1bVpvb20gPT4ge1xuICAgICAgICBtZWRpdW1ab29tLmRlZmF1bHQoJ1tkYXRhLXpvb21hYmxlXScsIHtcbiAgICAgICAgICBtYXJnaW46IDQ4LFxuICAgICAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDAsIDAsIDAsIDAuOCknLFxuICAgICAgICAgIHNjcm9sbE9mZnNldDogMFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIHJldHVybiA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG59XG4iXSwibmFtZXMiOlsidXNlRWZmZWN0IiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwiYXBwbHlUaGVtZUZvck5vdyIsIm5vdyIsImhvdXJzIiwiZ2V0SG91cnMiLCJpc05pZ2h0IiwiZG9jdW1lbnQiLCJib2R5IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiYWRkIiwibXNVbnRpbE5leHRTd2l0Y2giLCJuZXh0IiwiRGF0ZSIsInNldEhvdXJzIiwic2V0RGF0ZSIsImdldERhdGUiLCJNYXRoIiwibWF4IiwiZ2V0VGltZSIsInNjaGVkdWxlIiwiZGVsYXkiLCJzZXRUaW1lb3V0IiwidGhlbiIsIm1lZGl1bVpvb20iLCJkZWZhdWx0IiwibWFyZ2luIiwiYmFja2dyb3VuZCIsInNjcm9sbE9mZnNldCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./assets/css/styles.css":
/*!*******************************!*\
  !*** ./assets/css/styles.css ***!
  \*******************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();