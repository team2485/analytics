export default function TextInput ({ visibleName, internalName }) {
    return (
        <div>
            <label htmlFor={internalName}>{visibleName}</label>
            <input type="text" id={internalName}></input>
        </div>
    )
}