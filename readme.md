![](fired.png)
# Fired
A module for keeping track of people that disappear from staff pages.

## Install
`npm i @dillonchr/fired`

## Usage
You need to configure a few things before you can use this module. It requires you to do some scrape research before you can jump in. You will also need a mongo db readied for add/updating employee records.

Take a look at [ephemeraldb](https://github.com/dillonchr/ephemeraldb) to see how to get the DB connected. Once you have the DB `env` variables all you need is to make sure you have a clean collection for this module to own.

Then you'll need to supply a few options for the module when you make the scrape.

### The `options` object
```js
{
    url: <string>,           // URL of the staff page that lists employees
    collection: <string>,    // mongo collection name to use for archive
    selectors: {             // all the selectors once you have the page parsed
        employees: <string>, // closest parent element for individual employees
        name: <string>,      // name of employee from their elem
        position: <string>,  // what role they had
        bio: <string>,       // what they said about themselves
        profilePic: <string>,// selects the `src` attribute of this selector
    }
}
```
