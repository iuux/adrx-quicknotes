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

### Categorizing notes

In the navigation list, categories are sorted alphabetically, ignoring letter case. The *Unspecified* category is placed last. Notes are sorted sorted alphabetically, ignoring letter case, within their respective category.

### Renaming a category

- A category can't be named *Unspecified*, ignoring letter case.
- A category can't be named the same as another category.
- A category name must contain non-whitespace characters.
- A category cannot be renamed to the same name as itself. Different letter casing is permitted.

### Creating or editing a note

- Extraneous whitespace will be trimmed from the note title and body text.
- Note titles cannot match other note titles within the category it will be placed, ignoring letter case.

### Selecting a category

- Extraneous whitespace will be trimmed from new category name input.
- Select the *Unspecified* category if attemping to create a category with no new category name input.
- Select the *Unspecified* category if attempting to create a cateogry and the new category name input matches the *Unspecified* category name, ignoring letter casing.
- Select an exisiting category if attempting to create a category and the new category name input matches an exisiting category name, ignoring letter casing.
- Keying `Escape` or clicking away from the component will close the component and remove any user input in the *New Category Name* input field.
- Keying `Enter` when focused on a category will select that category.
- Keying `Enter` when focused on the *New Category Name* input field will attempt to create that category.

### Deleting a note or category

- Attemping to delete a note or category will activate a dialog to confirm the action.
