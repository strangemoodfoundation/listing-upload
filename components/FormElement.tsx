export function FormElement(props: {
  children: any;
  label: string;
  required?: boolean;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={'flex flex-col  ' + props.className}>
      <div className="text-sm flex bg-gray-50 dark:bg-gray-800 justify-between font-mono ">
        <div className="pl-4 py-1">{props.label}</div>

        {props.required && (
          <div className="bg-gray-100 dark:bg-gray-700 border-b items-center border-l px-4 py-0.5 text-xs inline-flex">
            required
          </div>
        )}
      </div>

      {props.hint && (
        <div className="bg-gray-50 dark:bg-gray-800 text-muted text-sm px-4 pb-2">
          {props.hint}
        </div>
      )}
      <div className="">{props.children}</div>
    </label>
  );
}
