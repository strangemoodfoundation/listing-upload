# Commands

Commands are components. Want to make a new command? Just do this:

```tsx
<Command
  id="my-cmd"
  onExecute={() => {
    /* ... */
  }}
  search={["my command"]}
  className="p-base"
>
  Do Some Command
</Command>
```
