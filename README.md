# Frontend code samples
This is a small sample of frontend code I have written.  I've included a few components, a hierarchical set of views, and a couple data processing utilities with associated tests.

## Components
These components were written as part of the Book & Ledger finance and accounting web app.  They are reusable, self-contained, and composable.

### Form
This is a "render props" component that handles basic form / input functionality for controlled inputs (handle change events, validation, submission, etc.).

### Input
This is a custom input that pretties up the standard `input` element and adds custom functionality such as tooltips, multi-lines, error messages, and focusing.

### AutoSuggestInput
This component wraps the aforementioned Input with autocomplete functionality.  It shows a dropdown list of potential options based on the user's input.  It accommodates both mouse and keyboard navigation.

### Button
This component pretties up the standard `button` element with several colors that indicate button type (e.g. primary, secondary, danger, disabled, etc.).

### Example
Again, each of these components can be used on their own or as part of a larger component or view.  Here is an example of them all working together:

    <Form
      validator={checkValues}
      onSubmit={this.handleSubmit}>

      {({ values, errors, handleChange }) => {
        <Input
          name="foo"
          value={values.foo}
          onChange={handleChange}
          errorMsg={errors.foo}
        />

        <AutoSuggestInput
          suggestions={listOfSuggestedValues}
          name="bar"
          value={values.bar}
          onChange={handleChange}
          errorMsg={errors.bar}
        />

        <Button
          type="submit">

          Submit
        </Button>
      }}
    </Form>

## Views
I've included the "Bank" view from the Book & Ledger application I built.  This view is a "tree": it contains child views which in turn contain child views.  This structure mimics the user's journey through the app: start on the main "Bank" page -> go to the bank feed -> view transactions in the bank feed's table.  I find this way of structuring views to be a helpful organizing mechanism, especially for larger applications.

The parent view fetches data and manages state that must be shared across the child views.  Each child view in turn manages local state and communicates to the parent where necessary with callbacks.

## Utils
There are two utility functions included.  The first, `parse-csv.js` parses a csv string into a specific JSON format.  The second, `replace-with-balance.js`, replaces particular string patterns/values with data from an array.  Both functions include accompanying tests.
