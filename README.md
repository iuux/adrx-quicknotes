# AdRx Quick Notes

Quick Notes functionality for Indiana University AdRx (Advising Records) system.

## Installation

Clone and navigate to the repo. Then install [npm](https://www.npmjs.com/) and [Bower](http://bower.io/) packages.

```
npm install
bower install
```

## Developing

Run the development environment through the default [gulp](http://gulpjs.com/) task.

```
gulp
```

## Testing

### Retrieving data

Console displays an error if a note's category ID isn't in the supplied data feed. Example:

```
DATABASE ERROR: Category does not exist (id: 2)
```

In the edit view of a note, if the note ID in the URL isn't found (e.g. `#/note/edit/3`), the console displays an error. Example:

```
ERROR: Quick Note not found (id: 3)
```

In the edit view of a category, if the category ID in the URL isn't found (e.g. `#/category/edit/2`), the console displays an error. Example:

```
ERROR: Category not found (id: 2)
```

### Categorized notes

In the navigation list, categories are sorted alphabetically, ignoring letter case. The *Unspecified* category is placed last. Notes are sorted sorted alphabetically, ignoring letter case, within their respective category.
