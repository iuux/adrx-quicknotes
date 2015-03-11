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

- Console displays an error if a note's category ID isn't in the supplied data feed, such as `DATABASE ERROR: Category does not exist (id: 2)`.

### Listing notes

- Notes are sorted sorted alphabetically, ignoring letter case, within their respective category.

### Creating a note

- Extraneous whitespace will be trimmed from the note title and body text.
- Note titles cannot match other note titles within the category it will be placed, ignoring letter case.
- Note titles and body text must contain non-whitespace characters.

### Editing a note

- Extraneous whitespace will be trimmed from the note title and body text.
- Note titles cannot match other note titles within the category it will be placed, ignoring letter case.
- Note titles and body text must contain non-whitespace characters.
- Note title, body text, or selected category must be different than the source content in order to save the note.
- If the note ID in the URL isn't found (e.g. `#/note/edit/3`), the console displays an error, such as `ERROR: Quick Note not found (id: 3)`.

### Deleting a note

- Attemping to delete a note will activate a dialog to confirm the action.

### Listing categories

- User-generated categories are sorted alphabetically, ignoring letter case.
- The *Unspecified* category is placed after any user-generated categories.

### Selecting a category

- Extraneous whitespace will be trimmed from new category name input.
- Select the *Unspecified* category if attemping to create a category with no new category name input.
- Select the *Unspecified* category if attempting to create a cateogry and the new category name input matches the *Unspecified* category name, ignoring letter casing.
- Select an exisiting category if attempting to create a category and the new category name input matches an exisiting category name, ignoring letter casing.
- Keying `Escape` or clicking away from the component will close the component and remove any user input in the *New Category Name* input field.
- Keying `Enter` when focused on a category will select that category.
- Keying `Enter` when focused on the *New Category Name* input field will attempt to create that category.

### Renaming a category

- A category can't be named *Unspecified*, ignoring letter case.
- A category can't be named the same as another category.
- A category name must contain non-whitespace characters.
- A category cannot be renamed to the same name as itself. Different letter casing is permitted.
- If the category ID in the URL isn't found (e.g. `#/category/edit/2`), the console displays an error, such as `ERROR: Category not found (id: 2)`.

### Deleting a category

- Attemping to delete a category will activate a dialog to confirm the action.
