export default function Checkbox ({ visibleName, internalName }) {
    return (
        <div>
            <input type="checkbox" id={internalName}></input>
            <label htmlFor={internalName}>{visibleName}</label>
        </div>
    )
}