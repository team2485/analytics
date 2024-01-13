export default function Checkbox ({ visibleName, internalName }) {
    return (
        <div>
            <label htmlFor={internalName}>{visibleName}</label>
            <input type="checkbox" id={internalName}></input>
        </div>
    )
}