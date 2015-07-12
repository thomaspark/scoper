# Scoper

A polyfill for scoped style elements. Just add `scoper.js` to your page.

* [Demo](http://jsfiddle.net/thomaspark/rpe402LL/)

# How It Works

Each `<style scoped>` element's parent is wrapped with a `span` that is given a unique ID. Its rules are moved to `head` and all selectors prepended with their respective ID.

Scoper is only active when the page contains scoped styles and the browser doesn't support them.
