"use strict";
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
exports.id = "app/api/private/reservations/route";
exports.ids = ["app/api/private/reservations/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprivate%2Freservations%2Froute&page=%2Fapi%2Fprivate%2Freservations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprivate%2Freservations%2Froute.ts&appDir=C%3A%5CUsers%5CAdmin%5CDesktop%5CNextJS_branch1%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAdmin%5CDesktop%5CNextJS_branch1&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprivate%2Freservations%2Froute&page=%2Fapi%2Fprivate%2Freservations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprivate%2Freservations%2Froute.ts&appDir=C%3A%5CUsers%5CAdmin%5CDesktop%5CNextJS_branch1%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAdmin%5CDesktop%5CNextJS_branch1&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/.pnpm/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_Admin_Desktop_NextJS_branch1_src_app_api_private_reservations_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/private/reservations/route.ts */ \"(rsc)/./src/app/api/private/reservations/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/private/reservations/route\",\n        pathname: \"/api/private/reservations\",\n        filename: \"route\",\n        bundlePath: \"app/api/private/reservations/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\Admin\\\\Desktop\\\\NextJS_branch1\\\\src\\\\app\\\\api\\\\private\\\\reservations\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_Admin_Desktop_NextJS_branch1_src_app_api_private_reservations_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/private/reservations/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNC4yLjZfcmVhY3QtZG9tQDE4LjIuMF9yZWFjdEAxOC4yLjBfX3JlYWN0QDE4LjIuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZwcml2YXRlJTJGcmVzZXJ2YXRpb25zJTJGcm91dGUmcGFnZT0lMkZhcGklMkZwcml2YXRlJTJGcmVzZXJ2YXRpb25zJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcHJpdmF0ZSUyRnJlc2VydmF0aW9ucyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBZG1pbiU1Q0Rlc2t0b3AlNUNOZXh0SlNfYnJhbmNoMSU1Q3NyYyU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9QyUzQSU1Q1VzZXJzJTVDQWRtaW4lNUNEZXNrdG9wJTVDTmV4dEpTX2JyYW5jaDEmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ3lDO0FBQ3RIO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsaUVBQWlFO0FBQ3pFO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDdUg7O0FBRXZIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaG1zLWNvcmUyLz9lMDg5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXEFkbWluXFxcXERlc2t0b3BcXFxcTmV4dEpTX2JyYW5jaDFcXFxcc3JjXFxcXGFwcFxcXFxhcGlcXFxccHJpdmF0ZVxcXFxyZXNlcnZhdGlvbnNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3ByaXZhdGUvcmVzZXJ2YXRpb25zL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcHJpdmF0ZS9yZXNlcnZhdGlvbnNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3ByaXZhdGUvcmVzZXJ2YXRpb25zL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcQWRtaW5cXFxcRGVza3RvcFxcXFxOZXh0SlNfYnJhbmNoMVxcXFxzcmNcXFxcYXBwXFxcXGFwaVxcXFxwcml2YXRlXFxcXHJlc2VydmF0aW9uc1xcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvcHJpdmF0ZS9yZXNlcnZhdGlvbnMvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprivate%2Freservations%2Froute&page=%2Fapi%2Fprivate%2Freservations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprivate%2Freservations%2Froute.ts&appDir=C%3A%5CUsers%5CAdmin%5CDesktop%5CNextJS_branch1%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAdmin%5CDesktop%5CNextJS_branch1&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/private/reservations/route.ts":
/*!***************************************************!*\
  !*** ./src/app/api/private/reservations/route.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var _lib_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/errors */ \"(rsc)/./src/lib/errors.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var _lib_rbac__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/rbac */ \"(rsc)/./src/lib/rbac.ts\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/.pnpm/zod@3.23.8/node_modules/zod/lib/index.mjs\");\n\n\n\n\nconst CreateReservation = zod__WEBPACK_IMPORTED_MODULE_3__.z.object({\n    guest: zod__WEBPACK_IMPORTED_MODULE_3__.z.object({\n        firstName: zod__WEBPACK_IMPORTED_MODULE_3__.z.string(),\n        lastName: zod__WEBPACK_IMPORTED_MODULE_3__.z.string(),\n        email: zod__WEBPACK_IMPORTED_MODULE_3__.z.string().email().optional(),\n        phone: zod__WEBPACK_IMPORTED_MODULE_3__.z.string().optional()\n    }),\n    roomId: zod__WEBPACK_IMPORTED_MODULE_3__.z.string().optional(),\n    checkIn: zod__WEBPACK_IMPORTED_MODULE_3__.z.string(),\n    checkOut: zod__WEBPACK_IMPORTED_MODULE_3__.z.string(),\n    adults: zod__WEBPACK_IMPORTED_MODULE_3__.z.number().int().min(1).max(6).default(1),\n    children: zod__WEBPACK_IMPORTED_MODULE_3__.z.number().int().min(0).max(6).default(0),\n    notes: zod__WEBPACK_IMPORTED_MODULE_3__.z.string().optional()\n});\nconst GET = (0,_lib_errors__WEBPACK_IMPORTED_MODULE_0__.api)(async (req)=>{\n    await (0,_lib_rbac__WEBPACK_IMPORTED_MODULE_2__.requirePermission)(\"reservations.read\");\n    const url = new URL(req.url);\n    const q = url.searchParams.get(\"q\") ?? undefined;\n    const data = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.reservation.findMany({\n        where: q ? {\n            OR: [\n                {\n                    code: {\n                        contains: q\n                    }\n                },\n                {\n                    guest: {\n                        OR: [\n                            {\n                                firstName: {\n                                    contains: q\n                                }\n                            },\n                            {\n                                lastName: {\n                                    contains: q\n                                }\n                            }\n                        ]\n                    }\n                }\n            ]\n        } : undefined,\n        include: {\n            guest: true,\n            room: true\n        },\n        orderBy: {\n            createdAt: \"desc\"\n        },\n        take: 50\n    });\n    return (0,_lib_errors__WEBPACK_IMPORTED_MODULE_0__.json)({\n        data\n    });\n});\nconst POST = (0,_lib_errors__WEBPACK_IMPORTED_MODULE_0__.api)(async (req)=>{\n    await (0,_lib_rbac__WEBPACK_IMPORTED_MODULE_2__.requirePermission)(\"reservations.write\");\n    const body = await req.json().catch(()=>{\n        const e = new Error(\"Invalid JSON\");\n        e.status = 400;\n        throw e;\n    });\n    const parsed = CreateReservation.safeParse(body);\n    if (!parsed.success) {\n        const e = new Error(\"Validation failed\");\n        e.status = 400;\n        e.hint = parsed.error.flatten();\n        throw e;\n    }\n    const { guest, roomId, checkIn, checkOut, adults, children, notes } = parsed.data;\n    const start = new Date(checkIn);\n    const end = new Date(checkOut);\n    if (!(end > start)) {\n        const e = new Error(\"checkOut must be after checkIn\");\n        e.status = 400;\n        throw e;\n    }\n    const room = roomId ? await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.room.findUnique({\n        where: {\n            id: roomId\n        }\n    }) : null;\n    if (roomId && !room) {\n        const e = new Error(\"Room not found\");\n        e.status = 404;\n        throw e;\n    }\n    const createdGuest = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.guest.create({\n        data: {\n            ...guest\n        }\n    });\n    const code = `R${Date.now().toString().slice(-6)}`;\n    const reservation = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.reservation.create({\n        data: {\n            code,\n            guestId: createdGuest.id,\n            roomId: room?.id,\n            checkIn: start,\n            checkOut: end,\n            adults,\n            children,\n            rate: room ? (await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.roomType.findUnique({\n                where: {\n                    id: room.roomTypeId\n                }\n            })).baseRate : 0,\n            notes: notes ?? undefined\n        },\n        include: {\n            guest: true,\n            room: true\n        }\n    });\n    // create folio\n    await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.folio.create({\n        data: {\n            guestId: createdGuest.id,\n            reservationId: reservation.id\n        }\n    });\n    return (0,_lib_errors__WEBPACK_IMPORTED_MODULE_0__.json)({\n        data: reservation\n    }, 201);\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9wcml2YXRlL3Jlc2VydmF0aW9ucy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDd0M7QUFDSDtBQUNTO0FBQ3ZCO0FBRXZCLE1BQU1LLG9CQUFvQkQsa0NBQUNBLENBQUNFLE1BQU0sQ0FBQztJQUNqQ0MsT0FBT0gsa0NBQUNBLENBQUNFLE1BQU0sQ0FBQztRQUFFRSxXQUFXSixrQ0FBQ0EsQ0FBQ0ssTUFBTTtRQUFJQyxVQUFVTixrQ0FBQ0EsQ0FBQ0ssTUFBTTtRQUFJRSxPQUFPUCxrQ0FBQ0EsQ0FBQ0ssTUFBTSxHQUFHRSxLQUFLLEdBQUdDLFFBQVE7UUFBSUMsT0FBT1Qsa0NBQUNBLENBQUNLLE1BQU0sR0FBR0csUUFBUTtJQUFHO0lBQ2xJRSxRQUFRVixrQ0FBQ0EsQ0FBQ0ssTUFBTSxHQUFHRyxRQUFRO0lBQzNCRyxTQUFTWCxrQ0FBQ0EsQ0FBQ0ssTUFBTTtJQUNqQk8sVUFBVVosa0NBQUNBLENBQUNLLE1BQU07SUFDbEJRLFFBQVFiLGtDQUFDQSxDQUFDYyxNQUFNLEdBQUdDLEdBQUcsR0FBR0MsR0FBRyxDQUFDLEdBQUdDLEdBQUcsQ0FBQyxHQUFHQyxPQUFPLENBQUM7SUFDL0NDLFVBQVVuQixrQ0FBQ0EsQ0FBQ2MsTUFBTSxHQUFHQyxHQUFHLEdBQUdDLEdBQUcsQ0FBQyxHQUFHQyxHQUFHLENBQUMsR0FBR0MsT0FBTyxDQUFDO0lBQ2pERSxPQUFPcEIsa0NBQUNBLENBQUNLLE1BQU0sR0FBR0csUUFBUTtBQUM1QjtBQUVPLE1BQU1hLE1BQU16QixnREFBR0EsQ0FBQyxPQUFPMEI7SUFDNUIsTUFBTXZCLDREQUFpQkEsQ0FBQztJQUN4QixNQUFNd0IsTUFBTSxJQUFJQyxJQUFJRixJQUFJQyxHQUFHO0lBQzNCLE1BQU1FLElBQUlGLElBQUlHLFlBQVksQ0FBQ0MsR0FBRyxDQUFDLFFBQVFDO0lBQ3ZDLE1BQU1DLE9BQU8sTUFBTS9CLCtDQUFNQSxDQUFDZ0MsV0FBVyxDQUFDQyxRQUFRLENBQUM7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QSxDQUFDc0UsS0FBSyxDQUFDVCxNQUFNLENBQUM7UUFBRTlCLE1BQU07WUFBRWtDLFNBQVNMLGFBQWFELEVBQUU7WUFBRVksZUFBZXZDLFlBQVkyQixFQUFFO1FBQUM7SUFBRTtJQUU5RixPQUFPNUQsaURBQUlBLENBQUM7UUFBRWdDLE1BQU1DO0lBQVksR0FBRztBQUNyQyxHQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaG1zLWNvcmUyLy4vc3JjL2FwcC9hcGkvcHJpdmF0ZS9yZXNlcnZhdGlvbnMvcm91dGUudHM/Y2VhNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCB9IGZyb20gJ25leHQvc2VydmVyJ1xuaW1wb3J0IHsgYXBpLCBqc29uIH0gZnJvbSAnQC9saWIvZXJyb3JzJ1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IHsgcmVxdWlyZVBlcm1pc3Npb24gfSBmcm9tICdAL2xpYi9yYmFjJ1xuaW1wb3J0IHsgeiB9IGZyb20gJ3pvZCdcblxuY29uc3QgQ3JlYXRlUmVzZXJ2YXRpb24gPSB6Lm9iamVjdCh7XG4gIGd1ZXN0OiB6Lm9iamVjdCh7IGZpcnN0TmFtZTogei5zdHJpbmcoKSwgbGFzdE5hbWU6IHouc3RyaW5nKCksIGVtYWlsOiB6LnN0cmluZygpLmVtYWlsKCkub3B0aW9uYWwoKSwgcGhvbmU6IHouc3RyaW5nKCkub3B0aW9uYWwoKSB9KSxcbiAgcm9vbUlkOiB6LnN0cmluZygpLm9wdGlvbmFsKCksXG4gIGNoZWNrSW46IHouc3RyaW5nKCksXG4gIGNoZWNrT3V0OiB6LnN0cmluZygpLFxuICBhZHVsdHM6IHoubnVtYmVyKCkuaW50KCkubWluKDEpLm1heCg2KS5kZWZhdWx0KDEpLFxuICBjaGlsZHJlbjogei5udW1iZXIoKS5pbnQoKS5taW4oMCkubWF4KDYpLmRlZmF1bHQoMCksXG4gIG5vdGVzOiB6LnN0cmluZygpLm9wdGlvbmFsKClcbn0pXG5cbmV4cG9ydCBjb25zdCBHRVQgPSBhcGkoYXN5bmMgKHJlcTogTmV4dFJlcXVlc3QpID0+IHtcbiAgYXdhaXQgcmVxdWlyZVBlcm1pc3Npb24oJ3Jlc2VydmF0aW9ucy5yZWFkJylcbiAgY29uc3QgdXJsID0gbmV3IFVSTChyZXEudXJsKVxuICBjb25zdCBxID0gdXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3EnKSA/PyB1bmRlZmluZWRcbiAgY29uc3QgZGF0YSA9IGF3YWl0IHByaXNtYS5yZXNlcnZhdGlvbi5maW5kTWFueSh7XG4gICAgd2hlcmU6IHEgPyB7IE9SOiBbXG4gICAgICB7IGNvZGU6IHsgY29udGFpbnM6IHEgfSB9LFxuICAgICAgeyBndWVzdDogeyBPUjogW3sgZmlyc3ROYW1lOiB7IGNvbnRhaW5zOiBxIH0gfSwgeyBsYXN0TmFtZTogeyBjb250YWluczogcSB9IH1dIH0gfVxuICAgIF0gfSA6IHVuZGVmaW5lZCxcbiAgICBpbmNsdWRlOiB7IGd1ZXN0OiB0cnVlLCByb29tOiB0cnVlIH0sXG4gICAgb3JkZXJCeTogeyBjcmVhdGVkQXQ6ICdkZXNjJyB9LFxuICAgIHRha2U6IDUwXG4gIH0pXG4gIHJldHVybiBqc29uKHsgZGF0YSB9KVxufSlcblxuZXhwb3J0IGNvbnN0IFBPU1QgPSBhcGkoYXN5bmMgKHJlcTogTmV4dFJlcXVlc3QpID0+IHtcbiAgYXdhaXQgcmVxdWlyZVBlcm1pc3Npb24oJ3Jlc2VydmF0aW9ucy53cml0ZScpXG4gIGNvbnN0IGJvZHkgPSBhd2FpdCByZXEuanNvbigpLmNhdGNoKCgpID0+IHsgY29uc3QgZTphbnk9bmV3IEVycm9yKCdJbnZhbGlkIEpTT04nKTsgZS5zdGF0dXM9NDAwOyB0aHJvdyBlIH0pXG4gIGNvbnN0IHBhcnNlZCA9IENyZWF0ZVJlc2VydmF0aW9uLnNhZmVQYXJzZShib2R5KVxuICBpZiAoIXBhcnNlZC5zdWNjZXNzKSB7IGNvbnN0IGU6YW55PW5ldyBFcnJvcignVmFsaWRhdGlvbiBmYWlsZWQnKTsgZS5zdGF0dXM9NDAwOyBlLmhpbnQ9cGFyc2VkLmVycm9yLmZsYXR0ZW4oKTsgdGhyb3cgZSB9XG4gIGNvbnN0IHsgZ3Vlc3QsIHJvb21JZCwgY2hlY2tJbiwgY2hlY2tPdXQsIGFkdWx0cywgY2hpbGRyZW4sIG5vdGVzIH0gPSBwYXJzZWQuZGF0YVxuXG4gIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoY2hlY2tJbik7IGNvbnN0IGVuZCA9IG5ldyBEYXRlKGNoZWNrT3V0KVxuICBpZiAoIShlbmQgPiBzdGFydCkpIHsgY29uc3QgZTphbnk9bmV3IEVycm9yKCdjaGVja091dCBtdXN0IGJlIGFmdGVyIGNoZWNrSW4nKTsgZS5zdGF0dXM9NDAwOyB0aHJvdyBlIH1cblxuICBjb25zdCByb29tID0gcm9vbUlkID8gYXdhaXQgcHJpc21hLnJvb20uZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGlkOiByb29tSWQgfSB9KSA6IG51bGxcbiAgaWYgKHJvb21JZCAmJiAhcm9vbSkgeyBjb25zdCBlOmFueT1uZXcgRXJyb3IoJ1Jvb20gbm90IGZvdW5kJyk7IGUuc3RhdHVzPTQwNDsgdGhyb3cgZSB9XG5cbiAgY29uc3QgY3JlYXRlZEd1ZXN0ID0gYXdhaXQgcHJpc21hLmd1ZXN0LmNyZWF0ZSh7IGRhdGE6IHsgLi4uZ3Vlc3QgfSB9KVxuICBjb25zdCBjb2RlID0gYFIke0RhdGUubm93KCkudG9TdHJpbmcoKS5zbGljZSgtNil9YFxuICBjb25zdCByZXNlcnZhdGlvbiA9IGF3YWl0IHByaXNtYS5yZXNlcnZhdGlvbi5jcmVhdGUoe1xuICAgIGRhdGE6IHtcbiAgICAgIGNvZGUsXG4gICAgICBndWVzdElkOiBjcmVhdGVkR3Vlc3QuaWQsXG4gICAgICByb29tSWQ6IHJvb20/LmlkLFxuICAgICAgY2hlY2tJbjogc3RhcnQsXG4gICAgICBjaGVja091dDogZW5kLFxuICAgICAgYWR1bHRzLCBjaGlsZHJlbixcbiAgICAgIHJhdGU6IHJvb20gPyAoYXdhaXQgcHJpc21hLnJvb21UeXBlLmZpbmRVbmlxdWUoeyB3aGVyZTogeyBpZDogcm9vbS5yb29tVHlwZUlkIH0gfSkpIS5iYXNlUmF0ZSA6IDAsXG4gICAgICBub3Rlczogbm90ZXMgPz8gdW5kZWZpbmVkXG4gICAgfSxcbiAgICBpbmNsdWRlOiB7IGd1ZXN0OiB0cnVlLCByb29tOiB0cnVlIH1cbiAgfSlcblxuICAvLyBjcmVhdGUgZm9saW9cbiAgYXdhaXQgcHJpc21hLmZvbGlvLmNyZWF0ZSh7IGRhdGE6IHsgZ3Vlc3RJZDogY3JlYXRlZEd1ZXN0LmlkLCByZXNlcnZhdGlvbklkOiByZXNlcnZhdGlvbi5pZCB9IH0pXG5cbiAgcmV0dXJuIGpzb24oeyBkYXRhOiByZXNlcnZhdGlvbiB9LCAyMDEpXG59KVxuIl0sIm5hbWVzIjpbImFwaSIsImpzb24iLCJwcmlzbWEiLCJyZXF1aXJlUGVybWlzc2lvbiIsInoiLCJDcmVhdGVSZXNlcnZhdGlvbiIsIm9iamVjdCIsImd1ZXN0IiwiZmlyc3ROYW1lIiwic3RyaW5nIiwibGFzdE5hbWUiLCJlbWFpbCIsIm9wdGlvbmFsIiwicGhvbmUiLCJyb29tSWQiLCJjaGVja0luIiwiY2hlY2tPdXQiLCJhZHVsdHMiLCJudW1iZXIiLCJpbnQiLCJtaW4iLCJtYXgiLCJkZWZhdWx0IiwiY2hpbGRyZW4iLCJub3RlcyIsIkdFVCIsInJlcSIsInVybCIsIlVSTCIsInEiLCJzZWFyY2hQYXJhbXMiLCJnZXQiLCJ1bmRlZmluZWQiLCJkYXRhIiwicmVzZXJ2YXRpb24iLCJmaW5kTWFueSIsIndoZXJlIiwiT1IiLCJjb2RlIiwiY29udGFpbnMiLCJpbmNsdWRlIiwicm9vbSIsIm9yZGVyQnkiLCJjcmVhdGVkQXQiLCJ0YWtlIiwiUE9TVCIsImJvZHkiLCJjYXRjaCIsImUiLCJFcnJvciIsInN0YXR1cyIsInBhcnNlZCIsInNhZmVQYXJzZSIsInN1Y2Nlc3MiLCJoaW50IiwiZXJyb3IiLCJmbGF0dGVuIiwic3RhcnQiLCJEYXRlIiwiZW5kIiwiZmluZFVuaXF1ZSIsImlkIiwiY3JlYXRlZEd1ZXN0IiwiY3JlYXRlIiwibm93IiwidG9TdHJpbmciLCJzbGljZSIsImd1ZXN0SWQiLCJyYXRlIiwicm9vbVR5cGUiLCJyb29tVHlwZUlkIiwiYmFzZVJhdGUiLCJmb2xpbyIsInJlc2VydmF0aW9uSWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/private/reservations/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/.pnpm/next-auth@4.24.7_next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0__react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst authOptions = {\n    session: {\n        strategy: \"jwt\",\n        maxAge: 60 * 60 * 8,\n        updateAge: 60 * 30\n    },\n    jwt: {\n        maxAge: 60 * 60 * 8\n    },\n    pages: {\n        signIn: \"/login\"\n    },\n    cookies: {\n        sessionToken: {\n            name:  false ? 0 : \"next-auth.session-token\",\n            options: {\n                httpOnly: true,\n                sameSite: \"lax\",\n                path: \"/\",\n                secure: \"development\" === \"production\"\n            }\n        }\n    },\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) return null;\n                const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    },\n                    include: {\n                        role: {\n                            include: {\n                                permissions: true\n                            }\n                        }\n                    }\n                });\n                if (!user) return null;\n                const ok = await bcrypt__WEBPACK_IMPORTED_MODULE_2___default().compare(credentials.password, user.passwordHash);\n                if (!ok) return null;\n                return {\n                    id: user.id,\n                    name: user.name,\n                    email: user.email,\n                    role: user.role.name,\n                    perms: user.role.permissions.map((p)=>p.name)\n                };\n            }\n        })\n    ],\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.role = user.role;\n                token.perms = user.perms;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            session.role = token.role;\n            session.perms = token.perms;\n            return session;\n        }\n    },\n    debug: false\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDeUQ7QUFDcEI7QUFDVjtBQUVwQixNQUFNRyxjQUErQjtJQUMxQ0MsU0FBUztRQUFFQyxVQUFVO1FBQU9DLFFBQVEsS0FBSyxLQUFLO1FBQUdDLFdBQVcsS0FBSztJQUFHO0lBQ3BFQyxLQUFLO1FBQUVGLFFBQVEsS0FBSyxLQUFLO0lBQUU7SUFDM0JHLE9BQU87UUFBRUMsUUFBUTtJQUFTO0lBQzFCQyxTQUFTO1FBQ1BDLGNBQWM7WUFDWkMsTUFBTUMsTUFBeUIsR0FBZSxJQUFxQztZQUNuRkMsU0FBUztnQkFDUEMsVUFBVTtnQkFDVkMsVUFBVTtnQkFDVkMsTUFBTTtnQkFDTkMsUUFBUUwsa0JBQXlCO1lBQ25DO1FBQ0Y7SUFDRjtJQUNBTSxXQUFXO1FBQ1RwQiwyRUFBV0EsQ0FBQztZQUNWYSxNQUFNO1lBQ05RLGFBQWE7Z0JBQUVDLE9BQU87b0JBQUVDLE9BQU87b0JBQVNDLE1BQU07Z0JBQVE7Z0JBQUdDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVlDLE1BQU07Z0JBQVc7WUFBRTtZQUMzRyxNQUFNRSxXQUFVTCxXQUFXO2dCQUN6QixJQUFJLENBQUNBLGFBQWFDLFNBQVMsQ0FBQ0QsYUFBYUksVUFBVSxPQUFPO2dCQUMxRCxNQUFNRSxPQUFPLE1BQU0xQiwrQ0FBTUEsQ0FBQzBCLElBQUksQ0FBQ0MsVUFBVSxDQUFDO29CQUFFQyxPQUFPO3dCQUFFUCxPQUFPRCxZQUFZQyxLQUFLO29CQUFDO29CQUFHUSxTQUFTO3dCQUFFQyxNQUFNOzRCQUFFRCxTQUFTO2dDQUFFRSxhQUFhOzRCQUFLO3dCQUFFO29CQUFFO2dCQUFFO2dCQUN2SSxJQUFJLENBQUNMLE1BQU0sT0FBTztnQkFDbEIsTUFBTU0sS0FBSyxNQUFNL0IscURBQWMsQ0FBQ21CLFlBQVlJLFFBQVEsRUFBRUUsS0FBS1EsWUFBWTtnQkFDdkUsSUFBSSxDQUFDRixJQUFJLE9BQU87Z0JBQ2hCLE9BQU87b0JBQUVHLElBQUlULEtBQUtTLEVBQUU7b0JBQUV2QixNQUFNYyxLQUFLZCxJQUFJO29CQUFFUyxPQUFPSyxLQUFLTCxLQUFLO29CQUFFUyxNQUFNSixLQUFLSSxJQUFJLENBQUNsQixJQUFJO29CQUFFd0IsT0FBTyxLQUFNTixJQUFJLENBQUNDLFdBQVcsQ0FBd0JNLEdBQUcsQ0FBQyxDQUFDQyxJQUFNQSxFQUFFMUIsSUFBSTtnQkFBRTtZQUMxSjtRQUNGO0tBQ0Q7SUFDRDJCLFdBQVc7UUFDVCxNQUFNaEMsS0FBSSxFQUFFaUMsS0FBSyxFQUFFZCxJQUFJLEVBQUU7WUFDdkIsSUFBSUEsTUFBTTtnQkFDUmMsTUFBTVYsSUFBSSxHQUFHLEtBQWNBLElBQUk7Z0JBQy9CVSxNQUFNSixLQUFLLEdBQUcsS0FBY0EsS0FBSztZQUNuQztZQUNBLE9BQU9JO1FBQ1Q7UUFDQSxNQUFNckMsU0FBUSxFQUFFQSxPQUFPLEVBQUVxQyxLQUFLLEVBQUU7WUFDN0JyQyxRQUFnQjJCLElBQUksR0FBR1UsTUFBTVYsSUFBSTtZQUNoQzNCLFFBQWdCaUMsS0FBSyxHQUFHSSxNQUFNSixLQUFLO1lBQ3JDLE9BQU9qQztRQUNUO0lBQ0Y7SUFDQXNDLE9BQU87QUFDVCxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaG1zLWNvcmUyLy4vc3JjL2xpYi9hdXRoLnRzPzY2OTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE5leHRBdXRoLCB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gJ25leHQtYXV0aCdcbmltcG9ydCBDcmVkZW50aWFscyBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzJ1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHQnXG5cbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xuICBzZXNzaW9uOiB7IHN0cmF0ZWd5OiAnand0JywgbWF4QWdlOiA2MCAqIDYwICogOCwgdXBkYXRlQWdlOiA2MCAqIDMwIH0sXG4gIGp3dDogeyBtYXhBZ2U6IDYwICogNjAgKiA4IH0sXG4gIHBhZ2VzOiB7IHNpZ25JbjogJy9sb2dpbicgfSxcbiAgY29va2llczoge1xuICAgIHNlc3Npb25Ub2tlbjoge1xuICAgICAgbmFtZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/ICdfX1NlY3VyZS1uZXh0LWF1dGguc2Vzc2lvbi10b2tlbicgOiAnbmV4dC1hdXRoLnNlc3Npb24tdG9rZW4nLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBodHRwT25seTogdHJ1ZSxcbiAgICAgICAgc2FtZVNpdGU6ICdsYXgnLFxuICAgICAgICBwYXRoOiAnLycsXG4gICAgICAgIHNlY3VyZTogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgQ3JlZGVudGlhbHMoe1xuICAgICAgbmFtZTogJ0NyZWRlbnRpYWxzJyxcbiAgICAgIGNyZWRlbnRpYWxzOiB7IGVtYWlsOiB7IGxhYmVsOiAnRW1haWwnLCB0eXBlOiAnZW1haWwnIH0sIHBhc3N3b3JkOiB7IGxhYmVsOiAnUGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnIH0gfSxcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICBpZiAoIWNyZWRlbnRpYWxzPy5lbWFpbCB8fCAhY3JlZGVudGlhbHM/LnBhc3N3b3JkKSByZXR1cm4gbnVsbFxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7IHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9LCBpbmNsdWRlOiB7IHJvbGU6IHsgaW5jbHVkZTogeyBwZXJtaXNzaW9uczogdHJ1ZSB9IH0gfSB9KVxuICAgICAgICBpZiAoIXVzZXIpIHJldHVybiBudWxsXG4gICAgICAgIGNvbnN0IG9rID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmRIYXNoKVxuICAgICAgICBpZiAoIW9rKSByZXR1cm4gbnVsbFxuICAgICAgICByZXR1cm4geyBpZDogdXNlci5pZCwgbmFtZTogdXNlci5uYW1lLCBlbWFpbDogdXNlci5lbWFpbCwgcm9sZTogdXNlci5yb2xlLm5hbWUsIHBlcm1zOiAodXNlci5yb2xlLnBlcm1pc3Npb25zIGFzIHsgbmFtZTogc3RyaW5nIH1bXSkubWFwKChwKSA9PiBwLm5hbWUpIH1cbiAgICAgIH1cbiAgICB9KVxuICBdLFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB0b2tlbi5yb2xlID0gKHVzZXIgYXMgYW55KS5yb2xlXG4gICAgICAgIHRva2VuLnBlcm1zID0gKHVzZXIgYXMgYW55KS5wZXJtc1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuXG4gICAgfSxcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xuICAgICAgKHNlc3Npb24gYXMgYW55KS5yb2xlID0gdG9rZW4ucm9sZVxuICAgICAgOyhzZXNzaW9uIGFzIGFueSkucGVybXMgPSB0b2tlbi5wZXJtc1xuICAgICAgcmV0dXJuIHNlc3Npb25cbiAgICB9XG4gIH0sXG4gIGRlYnVnOiBmYWxzZVxufVxuIl0sIm5hbWVzIjpbIkNyZWRlbnRpYWxzIiwicHJpc21hIiwiYmNyeXB0IiwiYXV0aE9wdGlvbnMiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJtYXhBZ2UiLCJ1cGRhdGVBZ2UiLCJqd3QiLCJwYWdlcyIsInNpZ25JbiIsImNvb2tpZXMiLCJzZXNzaW9uVG9rZW4iLCJuYW1lIiwicHJvY2VzcyIsIm9wdGlvbnMiLCJodHRwT25seSIsInNhbWVTaXRlIiwicGF0aCIsInNlY3VyZSIsInByb3ZpZGVycyIsImNyZWRlbnRpYWxzIiwiZW1haWwiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJpbmNsdWRlIiwicm9sZSIsInBlcm1pc3Npb25zIiwib2siLCJjb21wYXJlIiwicGFzc3dvcmRIYXNoIiwiaWQiLCJwZXJtcyIsIm1hcCIsInAiLCJjYWxsYmFja3MiLCJ0b2tlbiIsImRlYnVnIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/errors.ts":
/*!***************************!*\
  !*** ./src/lib/errors.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   api: () => (/* binding */ api),\n/* harmony export */   json: () => (/* binding */ json)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/api/server.js\");\n\nfunction json(data, init = 200) {\n    const status = typeof init === \"number\" ? init : init.status ?? 200;\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(data, typeof init === \"number\" ? {\n        status\n    } : init);\n}\nfunction api(handler) {\n    return async (req)=>{\n        try {\n            return await handler(req);\n        } catch (e) {\n            const status = e?.status ?? 500;\n            const message = e?.message ?? \"Internal Server Error\";\n            const hint = e?.hint;\n            return json({\n                error: message,\n                hint\n            }, status);\n        }\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2Vycm9ycy50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBdUQ7QUFJaEQsU0FBU0MsS0FBS0MsSUFBUyxFQUFFQyxPQUE4QixHQUFHO0lBQy9ELE1BQU1DLFNBQVMsT0FBT0QsU0FBUyxXQUFXQSxPQUFPLEtBQWNDLE1BQU0sSUFBSTtJQUN6RSxPQUFPSixxREFBWUEsQ0FBQ0MsSUFBSSxDQUFDQyxNQUFNLE9BQU9DLFNBQVMsV0FBVztRQUFFQztJQUFPLElBQUlEO0FBQ3pFO0FBRU8sU0FBU0UsSUFBSUMsT0FBbUI7SUFDckMsT0FBTyxPQUFPQztRQUNaLElBQUk7WUFDRixPQUFPLE1BQU1ELFFBQVFDO1FBQ3ZCLEVBQUUsT0FBT0MsR0FBUTtZQUNmLE1BQU1KLFNBQVNJLEdBQUdKLFVBQVU7WUFDNUIsTUFBTUssVUFBVUQsR0FBR0MsV0FBVztZQUM5QixNQUFNQyxPQUFPRixHQUFHRTtZQUNoQixPQUFPVCxLQUFLO2dCQUFFVSxPQUFPRjtnQkFBU0M7WUFBSyxHQUFHTjtRQUN4QztJQUNGO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9obXMtY29yZTIvLi9zcmMvbGliL2Vycm9ycy50cz80NTFhIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcidcblxuZXhwb3J0IHR5cGUgQXBpSGFuZGxlcjxUID0gYW55PiA9IChyZXE6IE5leHRSZXF1ZXN0KSA9PiBQcm9taXNlPE5leHRSZXNwb25zZTxUPj5cblxuZXhwb3J0IGZ1bmN0aW9uIGpzb24oZGF0YTogYW55LCBpbml0OiBudW1iZXIgfCBSZXNwb25zZUluaXQgPSAyMDApIHtcbiAgY29uc3Qgc3RhdHVzID0gdHlwZW9mIGluaXQgPT09ICdudW1iZXInID8gaW5pdCA6IChpbml0IGFzIGFueSkuc3RhdHVzID8/IDIwMFxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oZGF0YSwgdHlwZW9mIGluaXQgPT09ICdudW1iZXInID8geyBzdGF0dXMgfSA6IGluaXQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcGkoaGFuZGxlcjogQXBpSGFuZGxlcik6IEFwaUhhbmRsZXIge1xuICByZXR1cm4gYXN5bmMgKHJlcTogTmV4dFJlcXVlc3QpID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGhhbmRsZXIocmVxKVxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgY29uc3Qgc3RhdHVzID0gZT8uc3RhdHVzID8/IDUwMFxuICAgICAgY29uc3QgbWVzc2FnZSA9IGU/Lm1lc3NhZ2UgPz8gJ0ludGVybmFsIFNlcnZlciBFcnJvcidcbiAgICAgIGNvbnN0IGhpbnQgPSBlPy5oaW50XG4gICAgICByZXR1cm4ganNvbih7IGVycm9yOiBtZXNzYWdlLCBoaW50IH0sIHN0YXR1cylcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJqc29uIiwiZGF0YSIsImluaXQiLCJzdGF0dXMiLCJhcGkiLCJoYW5kbGVyIiwicmVxIiwiZSIsIm1lc3NhZ2UiLCJoaW50IiwiZXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/errors.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = global;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n    log: [\n        \"error\",\n        \"warn\"\n    ]\n});\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkM7QUFFN0MsTUFBTUMsa0JBQWtCQztBQUVqQixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUEsQ0FBQztJQUMvREksS0FBSztRQUFDO1FBQVM7S0FBTztBQUN4QixHQUFFO0FBRUYsSUFBSUMsSUFBeUIsRUFBY0osZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaG1zLWNvcmUyLy4vc3JjL2xpYi9wcmlzbWEudHM/MDFkNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsIGFzIHVua25vd24gYXMgeyBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZCB9XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoe1xuICBsb2c6IFsnZXJyb3InLCAnd2FybiddXG59KVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbCIsInByaXNtYSIsImxvZyIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/rbac.ts":
/*!*************************!*\
  !*** ./src/lib/rbac.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   hasPermission: () => (/* binding */ hasPermission),\n/* harmony export */   requirePermission: () => (/* binding */ requirePermission)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/.pnpm/next-auth@4.24.7_next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0__react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n\n\nasync function requirePermission(perm) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n    if (!session) {\n        const error = new Error(\"Unauthorized\");\n        error.status = 401;\n        error.hint = \"Login required.\";\n        throw error;\n    }\n    const perms = session.perms;\n    if (!perms?.includes(perm) && !perms?.includes(\"admin\")) {\n        const error = new Error(\"Forbidden\");\n        error.status = 403;\n        error.hint = `Missing permission: ${perm}`;\n        throw error;\n    }\n    return session;\n}\nfunction hasPermission(session, perm) {\n    const perms = session?.perms;\n    return !!perms?.includes(perm) || !!perms?.includes(\"admin\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3JiYWMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBNEM7QUFDSjtBQUVqQyxlQUFlRSxrQkFBa0JDLElBQVk7SUFDbEQsTUFBTUMsVUFBVSxNQUFNSiwyREFBZ0JBLENBQUNDLGtEQUFXQTtJQUNsRCxJQUFJLENBQUNHLFNBQVM7UUFDWixNQUFNQyxRQUFRLElBQUlDLE1BQU07UUFDeEJELE1BQU1FLE1BQU0sR0FBRztRQUNmRixNQUFNRyxJQUFJLEdBQUc7UUFDYixNQUFNSDtJQUNSO0lBQ0EsTUFBTUksUUFBUSxRQUFpQkEsS0FBSztJQUNwQyxJQUFJLENBQUNBLE9BQU9DLFNBQVNQLFNBQVMsQ0FBRU0sT0FBT0MsU0FBUyxVQUFXO1FBQ3pELE1BQU1MLFFBQVEsSUFBSUMsTUFBTTtRQUN4QkQsTUFBTUUsTUFBTSxHQUFHO1FBQ2ZGLE1BQU1HLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFTCxLQUFLLENBQUM7UUFDMUMsTUFBTUU7SUFDUjtJQUNBLE9BQU9EO0FBQ1Q7QUFFTyxTQUFTTyxjQUFjUCxPQUFZLEVBQUVELElBQVk7SUFDdEQsTUFBTU0sUUFBUUwsU0FBU0s7SUFDdkIsT0FBTyxDQUFDLENBQUNBLE9BQU9DLFNBQVNQLFNBQVMsQ0FBQyxDQUFDTSxPQUFPQyxTQUFTO0FBQ3REIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaG1zLWNvcmUyLy4vc3JjL2xpYi9yYmFjLnRzPzM2MzEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCdcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aCdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlcXVpcmVQZXJtaXNzaW9uKHBlcm06IHN0cmluZykge1xuICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucylcbiAgaWYgKCFzZXNzaW9uKSB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1VuYXV0aG9yaXplZCcpIGFzIEVycm9yICYgeyBzdGF0dXM/OiBudW1iZXI7IGhpbnQ/OiBzdHJpbmcgfVxuICAgIGVycm9yLnN0YXR1cyA9IDQwMVxuICAgIGVycm9yLmhpbnQgPSAnTG9naW4gcmVxdWlyZWQuJ1xuICAgIHRocm93IGVycm9yXG4gIH1cbiAgY29uc3QgcGVybXMgPSAoc2Vzc2lvbiBhcyBhbnkpLnBlcm1zIGFzIHN0cmluZ1tdIHwgdW5kZWZpbmVkXG4gIGlmICghcGVybXM/LmluY2x1ZGVzKHBlcm0pICYmICEocGVybXM/LmluY2x1ZGVzKCdhZG1pbicpKSkge1xuICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCdGb3JiaWRkZW4nKSBhcyBFcnJvciAmIHsgc3RhdHVzPzogbnVtYmVyOyBoaW50Pzogc3RyaW5nIH1cbiAgICBlcnJvci5zdGF0dXMgPSA0MDNcbiAgICBlcnJvci5oaW50ID0gYE1pc3NpbmcgcGVybWlzc2lvbjogJHtwZXJtfWBcbiAgICB0aHJvdyBlcnJvclxuICB9XG4gIHJldHVybiBzZXNzaW9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQZXJtaXNzaW9uKHNlc3Npb246IGFueSwgcGVybTogc3RyaW5nKSB7XG4gIGNvbnN0IHBlcm1zID0gc2Vzc2lvbj8ucGVybXMgYXMgc3RyaW5nW10gfCB1bmRlZmluZWRcbiAgcmV0dXJuICEhcGVybXM/LmluY2x1ZGVzKHBlcm0pIHx8ICEhcGVybXM/LmluY2x1ZGVzKCdhZG1pbicpXG59XG4iXSwibmFtZXMiOlsiZ2V0U2VydmVyU2Vzc2lvbiIsImF1dGhPcHRpb25zIiwicmVxdWlyZVBlcm1pc3Npb24iLCJwZXJtIiwic2Vzc2lvbiIsImVycm9yIiwiRXJyb3IiLCJzdGF0dXMiLCJoaW50IiwicGVybXMiLCJpbmNsdWRlcyIsImhhc1Blcm1pc3Npb24iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/rbac.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0","vendor-chunks/next-auth@4.24.7_next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0__react-dom@18.2.0_react@18.2.0__react@18.2.0","vendor-chunks/@babel+runtime@7.28.4","vendor-chunks/jose@4.15.9","vendor-chunks/openid-client@5.7.1","vendor-chunks/oauth@0.9.15","vendor-chunks/object-hash@2.2.0","vendor-chunks/preact@10.27.2","vendor-chunks/uuid@8.3.2","vendor-chunks/yallist@4.0.0","vendor-chunks/preact-render-to-string@5.2.6_preact@10.27.2","vendor-chunks/lru-cache@6.0.0","vendor-chunks/cookie@0.5.0","vendor-chunks/@panva+hkdf@1.2.1","vendor-chunks/oidc-token-hash@5.1.1","vendor-chunks/zod@3.23.8"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@14.2.6_react-dom@18.2.0_react@18.2.0__react@18.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fprivate%2Freservations%2Froute&page=%2Fapi%2Fprivate%2Freservations%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fprivate%2Freservations%2Froute.ts&appDir=C%3A%5CUsers%5CAdmin%5CDesktop%5CNextJS_branch1%5Csrc%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CAdmin%5CDesktop%5CNextJS_branch1&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();