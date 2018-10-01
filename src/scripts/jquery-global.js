import jquery from 'jquery'
window.jQuery = window.$ = jquery
// Using Rollup.js we have to import jQuery in standalone file and import it in entry point before other components depend on jQuery.
// This not means you have not to import jQuery in other own components.
// You have to import jQuery in other own components.
// This file is to set jQuery a global to use some components depend on jQuery
