# Frontend code samples
This is a small sample of frontend code I have written.  I've included a few components, a hierarchical set of views, and a couple data processing utilities with associated tests.

## Components
These components were written as part of the Book & Ledger finance and accounting web app.  They are reusable, self-contained, and composable.

### Form
This is a "render props" component that handles basic form / input functionality for controlled inputs (handle change events, validation, submission, etc.).

### Input
This is a custom input that pretties up the standard `input` element and adds custom functionality such as tooltips, multi-lines, error messages, and focusing.

### AutoSuggestInput
This component wraps a the aforementioned Input with autocomplete functionality.  It shows a dropdown list of potential options based on the user's input.  It accommodates both mouse and keyboard navigation.

### Button
This component pretties up the standard `button` element with several colors that indicate button type (e.g. primary, secondary, danger, disabled, etc.).

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
          value={values.displayName}
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
