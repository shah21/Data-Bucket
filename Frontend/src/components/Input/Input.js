

const Input = props =>(
    <div className="">
        {props.type !== "textarea" && (
            <input type={props.type} name={props.name} id={props.id} required={props.required}  placeholder={props.placeholder}/>
        )}
        {(props.type === "textarea" &&
            <textarea name={props.name} id={props.id} required={props.required}  placeholder={props.placeholder}></textarea>
        )}
    </div>
);

export default Input;